import { serverResponse } from "../helpers/apiResponse";
import prisma from "../prisma";
import { createAddress, editAddress, findClosestWarehouse, getAddressCoordinates, getAddressUserById, getAllWarehouseAddress, getShippingCost, getUserAddressList, getWarehouseByName } from "../services/address/address.action";
import { Request, Response } from "express";

export class AddressController {
    async getProvinces(req: Request, res: Response) {
        try {
            const result = await fetch('https://api.rajaongkir.com/starter/province', {
                method: 'GET',
                headers: { key: `${process.env.NEXT_PUBLIC_RAJA_ONGKIR_API_KEY}` }
            });
            const data = await result.json()
            res.json(data)
        } catch (error) {
            res.json(error)
        }
    }

    async getCitites(req: Request, res: Response) {
        try {
            const { provinceId } = req.body
            const result = await fetch(`https://api.rajaongkir.com/starter/city?province=${provinceId}`, {
                method: 'GET',
                headers: { key: `${process.env.NEXT_PUBLIC_RAJA_ONGKIR_API_KEY}` }
            });
            const data = await result.json()
            res.json(data)
        } catch (error) {
            res.json(error)
        }
    }

    async addAddress(req: Request, res: Response) {
        try {
            const { selectedCity, address, userId, labelAddress } = req.body
            const city = await fetch(`https://api.rajaongkir.com/starter/city?id=${selectedCity}`, {
                method: 'GET',
                headers: { key: `${process.env.NEXT_PUBLIC_RAJA_ONGKIR_API_KEY}` }
            });
            const data = await city.json()
            const result = data.rajaongkir.results
            const addressUser = await createAddress(result, address, userId, labelAddress)
            res.json({ message: 'add address successfull', addressUser })
        } catch (err) {
            res.json(err)
        }
    }

    async getAddressList(req: Request, res: Response) {
        try {
            const { userId } = req.body
            const addressList = await getUserAddressList(userId)
            const sortedAddressList = addressList.sort((a:any, b:any) => {
                if (a.mainAddress && !b.mainAddress) {
                    return -1;
                }
                if (!a.mainAddress && b.mainAddress) {
                    return 1;
                }
                return 0;
            })
            res.json(sortedAddressList)
        } catch (err) {
            res.json(err)
        }
    }

    async getClossestWarehouse(req: Request, res: Response) {
        try {
            const { address } = req.body

            const addressUser = await getAddressUserById(address)
            const addressCoordinates = await getAddressCoordinates(`${addressUser?.address}, ${addressUser?.city_name}, ${addressUser?.province} `)
            const allWarehouseAddress = await getAllWarehouseAddress()
            const closestWarehouse = await findClosestWarehouse(addressCoordinates, allWarehouseAddress)
            if (closestWarehouse) {
                const warehouse = await getWarehouseByName(closestWarehouse[0].warehouseKey!)
                res.json(warehouse)
            }

        } catch (err) {
            res.json(err)
        }
    }

    async getShippingCost(req: Request, res: Response) {
        try {
            const { warehouseId, userAddress, shipping } = req.body
            const data = await getShippingCost(warehouseId, userAddress, shipping)
            res.json(data.rajaongkir.results)
        } catch (err) {
            res.json(err)

        }
    }

    async updateMainAddress(req: Request, res: Response) {
        try {
            const address = await prisma.addressList.findFirst({ where: { id: req.body.id }})
            if (!address) return serverResponse(res, 400, 'error', 'address not found!')
            await prisma.addressList.updateMany({ where: { userID: req.body.userId }, data: { mainAddress: false } })
            await prisma.addressList.update({ where: { id: address.id }, data: { mainAddress: true } })
            serverResponse(res, 200, 'ok', `${address.labelAddress} has been set to main!`)
        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

    async deleteAddress(req: Request, res: Response) {
        try {
            const address = await prisma.addressList.findFirst({ where: { id: req.params.id }})
            if (!address) return serverResponse(res, 400, 'error', 'address not found!')
            await prisma.addressList.delete({ where: { id: req.params.id } })
            serverResponse(res, 200, 'ok', `${address.labelAddress} has been deleted!`)
        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

    async getAddressById(req: Request, res: Response) {
        try {
            const address = await prisma.addressList.findFirst({ where: { id: req.params.id }});
            if (!address) return serverResponse(res, 400, 'error', 'Address not found!')
            serverResponse(res, 200, 'ok', `Address found!`, address)
        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }

    async editAddress(req: Request, res: Response) {
        try {
            const { id, selectedCity, address, labelAddress } = req.body
            const city = await fetch(`https://api.rajaongkir.com/starter/city?id=${selectedCity}`, {
                method: 'GET',
                headers: { key: `${process.env.NEXT_PUBLIC_RAJA_ONGKIR_API_KEY}` }
            });
            const data = await city.json()
            const result = data.rajaongkir.results
            const addressUser = await editAddress(id, result, address, labelAddress)
            serverResponse(res, 200, 'ok', `Address has been updated!`, addressUser)
        } catch (error: any) {
            serverResponse(res, 400, 'error', error)
        }
    }
    
}