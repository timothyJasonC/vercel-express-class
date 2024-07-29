-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `accountActive` BOOLEAN NOT NULL DEFAULT false,
    `username` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `gender` ENUM('MALE', 'FEMALE') NULL,
    `dob` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `imgUrl` LONGTEXT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WishList` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AddressList` (
    `id` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `labelAddress` VARCHAR(191) NOT NULL,
    `coordinate` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `city_id` VARCHAR(191) NOT NULL,
    `province_id` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `city_name` VARCHAR(191) NOT NULL,
    `postal_code` VARCHAR(191) NOT NULL,
    `mainAddress` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `role` ENUM('warAdm', 'superAdm') NOT NULL DEFAULT 'warAdm',
    `accountActive` BOOLEAN NOT NULL DEFAULT false,
    `fullName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `gender` ENUM('MALE', 'FEMALE') NULL,
    `dob` DATETIME(3) NULL,
    `imgUrl` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordRequest` (
    `id` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `currentToken` LONGTEXT NULL,
    `requestCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `PasswordRequest_accountId_key`(`accountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Warehouse` (
    `id` VARCHAR(191) NOT NULL,
    `warehouseName` VARCHAR(191) NOT NULL,
    `coordinate` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city_id` VARCHAR(191) NOT NULL,
    `province_id` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `city_name` VARCHAR(191) NOT NULL,
    `postal_code` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `adminID` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Warehouse_warehouseName_key`(`warehouseName`),
    UNIQUE INDEX `Warehouse_adminID_key`(`adminID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarehouseProduct` (
    `id` VARCHAR(191) NOT NULL,
    `warehouseID` VARCHAR(191) NOT NULL,
    `productVariantID` VARCHAR(191) NOT NULL,
    `size` ENUM('S', 'M', 'L', 'XL', 'ONESIZE') NOT NULL,
    `stock` INTEGER NOT NULL,
    `isDelete` BOOLEAN NULL DEFAULT false,
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` VARCHAR(500) NOT NULL,
    `price` INTEGER NOT NULL,
    `oneSize` BOOLEAN NOT NULL DEFAULT false,
    `categoryID` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NULL DEFAULT true,
    `thumbnailURL` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `stockUpdatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Product_name_key`(`name`),
    UNIQUE INDEX `Product_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductCategory` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `gender` ENUM('MEN', 'WOMEN', 'UNISEX') NOT NULL,
    `type` ENUM('TOPS', 'BOTTOMS', 'ACCESSORIES') NOT NULL,
    `category` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductImage` (
    `id` VARCHAR(191) NOT NULL,
    `productID` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ProductImage_image_key`(`image`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductVariant` (
    `id` VARCHAR(191) NOT NULL,
    `productID` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `HEX` VARCHAR(191) NOT NULL,
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `image` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ProductVariant_image_key`(`image`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockMutation` (
    `id` VARCHAR(191) NOT NULL,
    `warehouseID` VARCHAR(191) NOT NULL,
    `associatedWarehouseID` VARCHAR(191) NULL,
    `type` ENUM('TRANSFER', 'INBOUND', 'RESTOCK', 'REMOVE', 'TRANSACTION', 'DELETE') NOT NULL,
    `status` ENUM('WAITING', 'ACCEPTED', 'REJECTED') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockMutationItem` (
    `id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `warehouseProductID` VARCHAR(191) NOT NULL,
    `stockMutationID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` ENUM('CART', 'PENDING_PAYMENT', 'PROCESSED', 'SHIPPED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'CART',
    `warehouseId` VARCHAR(191) NULL,
    `totalAmount` INTEGER NOT NULL DEFAULT 0,
    `addressID` VARCHAR(191) NULL,
    `shippingMethod` VARCHAR(191) NULL,
    `shippedAt` DATETIME(3) NULL,
    `paymentStatus` ENUM('PENDING', 'COMPLETED', 'FAILED') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `productVariantId` VARCHAR(191) NOT NULL,
    `warehouseId` VARCHAR(191) NULL,
    `color` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AddressList` ADD CONSTRAINT `AddressList_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Warehouse` ADD CONSTRAINT `Warehouse_adminID_fkey` FOREIGN KEY (`adminID`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarehouseProduct` ADD CONSTRAINT `WarehouseProduct_warehouseID_fkey` FOREIGN KEY (`warehouseID`) REFERENCES `Warehouse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarehouseProduct` ADD CONSTRAINT `WarehouseProduct_productVariantID_fkey` FOREIGN KEY (`productVariantID`) REFERENCES `ProductVariant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryID_fkey` FOREIGN KEY (`categoryID`) REFERENCES `ProductCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductVariant` ADD CONSTRAINT `ProductVariant_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockMutation` ADD CONSTRAINT `StockMutation_warehouseID_fkey` FOREIGN KEY (`warehouseID`) REFERENCES `Warehouse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockMutationItem` ADD CONSTRAINT `StockMutationItem_stockMutationID_fkey` FOREIGN KEY (`stockMutationID`) REFERENCES `StockMutation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockMutationItem` ADD CONSTRAINT `StockMutationItem_warehouseProductID_fkey` FOREIGN KEY (`warehouseProductID`) REFERENCES `WarehouseProduct`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productVariantId_fkey` FOREIGN KEY (`productVariantId`) REFERENCES `ProductVariant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
