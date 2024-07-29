import { PrismaClient, ProductSize } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient()

export async function getCart(cartId: string) {
    let cart = await prisma.order.findFirst({
        where: {id: cartId}
    })
    return cart
}
export async function getOrCreateCart(userId: string) {
    let cart = await prisma.order.findFirst({
        where: {
            userId,
            paymentStatus: 'PENDING',
            status: 'CART'
        }
    });

    if (!cart) {
        const cartId = uuidv4();
        cart = await prisma.order.create({
            data: {
                id: cartId,
                userId,
                paymentStatus: 'PENDING',
            }
        });
        return cart
    }
    return cart
}


export async function addOrUpdateCartItem(orderId: string, variantId: string, color: string, size: string, quantity: number) {
    let existingCartItem = await prisma.orderItem.findFirst({
        where: {
            orderId,
            productVariantId: variantId,
            color, size
        }
    });
    const variantItem = await prisma.productVariant.findFirst({
        where: { id: variantId },
        select: { product: true }
    })

    if (existingCartItem) {
        existingCartItem = await prisma.orderItem.update({
            where: { id: existingCartItem.id },
            data: {
                quantity: existingCartItem.quantity + quantity,
                price: existingCartItem.price + (quantity * variantItem?.product.price!)
            }
        });
    } else {
        const orderItemId = uuidv4();
        existingCartItem = await prisma.orderItem.create({
            data: {
                id: orderItemId,
                orderId,
                productVariantId: variantId,
                quantity,
                price: variantItem?.product.price! * quantity,
                createdAt: new Date(),
                updatedAt: new Date(),
                color: color,
                size: size
            }
        });
    }
    return existingCartItem;
}

export async function getCartItemsWithTotal(cartId: string) {
    const cartItems = await prisma.orderItem.findMany({
        where: {
            orderId: cartId
        },
        select: {
            quantity: true,
            price: true
        }
    });

    const totalAmount = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

    const updateAmount = await prisma.order.update({
        where: { id: cartId },
        data: {
            totalAmount: totalAmount
        }
    })
    return { items: cartItems, updateAmount };
}

export async function getCartItemsByOrderId(orderId: string) {
    const orderItems = await prisma.orderItem.findMany({
        where: { orderId },
        select: {
            productVariantId: true,
            color: true,
            size: true,
            quantity: true
        }
    })
    return orderItems
}

export async function getStock(orderId: string) {
    const orderItems = await getCartItemsByOrderId(orderId)

    const stockPromises = orderItems.map(async (item) => {
        const totalStock = await prisma.warehouseProduct.aggregate({
            _sum: {
                stock: true
            },
            where: {
                productVariantID: item.productVariantId,
                size: item.size as ProductSize,
                isDelete: false,
            },
        })
        return {
            productVariantId: item.productVariantId,
            color: item.color,
            size: item.size,
            totalStock: totalStock._sum.stock || 0,
            orderedQuantity: item.quantity
        };
    })
    const stockResults = await Promise.all(stockPromises)

    return stockResults
}

export async function getStockByWarehouse(orderId: string, warehouseID: string) {
    const orderItems = await getCartItemsByOrderId(orderId)

    const stockPromises = orderItems.map(async (item) => {
        const totalStock = await prisma.warehouseProduct.aggregate({
            _sum: {
                stock: true
            },
            where: {
                warehouseID,
                productVariantID: item.productVariantId,
                size: item.size as ProductSize,
                isDelete: false,
            },
        })
        return {
            productVariantId: item.productVariantId,
            color: item.color,
            size: item.size,
            totalStock: totalStock._sum.stock || 0,
            orderedQuantity: item.quantity
        };
    })
    const stockResults = await Promise.all(stockPromises)

    return stockResults
}

export async function getCartItem(userId: string) {
    const cart = await prisma.order.findFirst({
        where: {
            userId: `${userId}`,
            status: 'CART',
        },
        include: {
            items: {
                select: {
                    id: true,
                    orderId: true,
                    productVariantId: true,
                    size: true,
                    quantity: true,
                    price: true,
                    createdAt: true,
                    updatedAt: true,
                    productVariant: {
                        select: {
                            color: true,
                            image: true,
                            product: {
                                select: {
                                    name: true
                                }
                            }
                        },
                    },
                },
            },
        },
    });
    return cart
}

export async function updateCartItem(itemId: string, newQuantity: number) {
    const orderItem = await prisma.orderItem.findFirst({
        where: {
            id: itemId
        }
    })
    if (!orderItem) throw 'no item'
    const variantItem = await prisma.productVariant.findFirst({
        where: { id: orderItem?.productVariantId },
        select: { product: true }
    })
    const updateItem = await prisma.orderItem.update({
        where: { id: itemId },
        data: { price: newQuantity * variantItem?.product.price!, quantity: newQuantity }
    })
    return updateItem
}

export async function deleteCartItem(itemId: string) {
    await prisma.orderItem.delete({
        where: { id: itemId }
    })
    return
}

export async function deleteCart(cartId: string) {
    await prisma.order.delete({
        where: {
            id: cartId
        }
    })
    return
}

export async function updateToOrder(orderId: string, shippingCost: number, subTotal: number, warehouseId: string, userAddress: string, shipping: string, service: string, description: string, estimation: string) {
    const order = await prisma.order.update({
        where: { id: orderId },
        data: {
            id: uuidv4(),
            paymentStatus: "PENDING",
            status: "PENDING_PAYMENT",
            warehouseId,
            createdAt: new Date(),
            totalAmount: shippingCost + subTotal,
            addressID: userAddress,
            shippingMethod: `${shipping}, ${service}, ${description}, ${estimation}`
        }
    })
    return order
}