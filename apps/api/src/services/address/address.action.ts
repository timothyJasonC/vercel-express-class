import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient()

export async function createAddress(city: any, address: string, userId: string,labelAddress: string) {
    const newAddress = await prisma.addressList.create({
        data: {
            id: uuidv4(),
            address: address,
            labelAddress: labelAddress,
            city_id: city.city_id,
            province_id: city.province_id,
            province: city.province,
            type: city.type,
            city_name: city.city_name,
            postal_code: city.postal_code,
            coordinate: `${address}, ${city.type} ${city.city_name}, ${city.province}, Indonesia`,
            mainAddress: false,
            userID: userId
        }
    })
    return newAddress
}

export async function editAddress(id: string, city: any, address: string, labelAddress: string) {
    const updatedAddress = await prisma.addressList.update({
        where: { id: id },
        data: {
            address: address,
            labelAddress: labelAddress,
            city_id: city.city_id,
            province_id: city.province_id,
            province: city.province,
            type: city.type,
            city_name: city.city_name,
            postal_code: city.postal_code,
            coordinate: `${address}, ${city.city_name}, ${city.province}, Indonesia`,
        }
    })
    return updatedAddress
}

export async function getAddressById(id: string) {
    const address = await prisma.addressList.findUnique({
        where: { id },
        select: { coordinate: true }
    })
    return address
}

export async function getUserAddressList(userId: string) {
    const addressList = await prisma.addressList.findMany({
        where: {
            userID: userId
        },
        select: {
            id: true,
            coordinate: true,
            mainAddress: true,
            labelAddress: true,
            province: true,
            type: true,
            city_name: true,
            postal_code: true,
        }
    })
    return addressList
}

export async function getAddressUserById(addressId: string) {
    const address = await prisma.addressList.findUnique({
        where: { id: addressId }
    })
    return address
}
export async function getAddressCoordinates(addresLoc: string) {
    try {
        const encodedAddress = encodeURIComponent(addresLoc).replace(/%20/g, '+');
        const apiKey = 'PsYxZBSXcseSSIr6soAI'
        const response = await fetch(`https://api.maptiler.com/geocoding/${encodedAddress}.json?key=${apiKey}`);
        const data = await response.json();
        if (data.features.length > 0) {
            const location = data.features[0].geometry.coordinates;
            return {
                lat: location[1],
                lon: location[0],
                display_name: data.features[0].place_name
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching address coordinates:', error);
        throw new Error('Error fetching address coordinates');
    }
}

export async function getAllWarehouseAddress() {
    const warehouseAddress: { [key: string]: { lat: string; lon: string; display_name: string } | null } = {}

    try {
        const warehouses = await prisma.warehouse.findMany({
            where: {
                isActive: true
            }
        })
        for (const warehouse of warehouses) {
            const coordinates = await getAddressCoordinates(`${warehouse.address}, ${warehouse.city_name}, ${warehouse.province}`)
            warehouseAddress[warehouse.warehouseName] = coordinates
        }
        return warehouseAddress
    } catch (error) {
        throw new Error('Error fetching address coordinates');
    }
}

export async function getWarehouseById(warehouseId: string) {
    const warehouse = await prisma.warehouse.findUnique({
        where: { id: warehouseId }
    })
    return warehouse
}

async function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function toRadians(degrees: number) {
    return degrees * (Math.PI / 180);
}

export async function findClosestWarehouse(userLocation: { lat: string; lon: string; display_name: string } | null, warehouses: { [key: string]: { lat: string; lon: string; display_name: string } | null }) {
    if (!userLocation || !warehouses) return null;
    const { lat: userLat, lon: userLon } = userLocation;
    const distances = [];

    for (const warehouseKey in warehouses) {
        const warehouse = warehouses[warehouseKey];
        if (!warehouse) continue;

        const { lat, lon } = warehouse;
        const distance = await haversineDistance(Number(userLat), Number(userLon), Number(lat), Number(lon));
        distances.push({ warehouseKey, warehouse, distance });
    }

    distances.sort((a, b) => a.distance - b.distance);

    return distances.map(item => ({
        warehouseKey: item.warehouseKey,
        warehouse: item.warehouse,
        distance: item.distance
    }));
}



export async function getWarehouseByName(warehouseName: string) {
    const warehouse = await prisma.warehouse.findFirst({
        where: { warehouseName: warehouseName }
    })
    return warehouse
}

export async function getShippingCost(warehouseId: string, userAddress: string, shipping: string) {
    const warehouse = await prisma.warehouse.findUnique({
        where: { id: warehouseId }
    })
    const address = await prisma.addressList.findFirst({
        where: { id: userAddress }
    })
    const formBody = new URLSearchParams();
    formBody.append('origin', `${warehouse?.city_id}`);
    formBody.append('destination', `${address?.city_id}`);
    formBody.append('weight', '1700');
    formBody.append('courier', `${shipping}`);

    const cost = await fetch('https://api.rajaongkir.com/starter/cost', {
        method: 'POST',
        headers: {
            'key': `${process.env.NEXT_PUBLIC_RAJA_ONGKIR_API_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody.toString()
    });

    return cost.json();
}
