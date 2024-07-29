enum ProductGender {
    MEN = "MEN",
    WOMEN = "WOMEN",
    UNISEX = "UNISEX"
}
  
enum ProductTypes {
    TOPS = "TOPS",
    BOTTOMS = "BOTTOMS",
    ACCESSORIES = "ACCESSORIES"
}
  

export async function listProduct() {
    return [
        {
            id: '2d349eaa-5eef-4cde-8054-5236f418349f',
            name: 'Oversize Heavy T-Shirt',
            slug: 'oversize-heavy-t-shirt',
            description: 'The Oversize Heavy T-Shirt offers a perfect blend of comfort and durability. Made from thick, high-quality fabric, it provides a cozy fit while ensuring long-lasting wear. The oversized design gives it a modern, relaxed look, making it ideal for casual outings or lounging at home. Available in various colors, this t-shirt is a versatile staple for any wardrobe, easily paired with jeans or shorts.',
            price: 220000,
            oneSize: false,
            categoryID: '9be5f6c9-5583-4304-b2d1-cda66c24841a',
            thumbnailURL: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/thumbnail%2F6fc06f1b-02ec-4ba1-bc2d-6abd01b7ed08?alt=media&token=93d966f9-b94e-4548-b62d-ac58a9375963',
            createdAt: new Date('2024-07-05T11:07:11.574Z'),
        },
        {
            id: '3971bfe5-c2e8-4376-84dc-c36da75b8ceb',
            name: 'Regular Fit Stripes Sweater',
            slug: 'regular-fit-stripes-sweater',
            description: 'Our Regular Fit Stripes Sweater is a timeless piece that combines classic style with modern comfort. Made from soft, durable fabric, this sweater features a regular fit that’s perfect for layering. The stylish stripe pattern adds a touch of sophistication to any outfit. Whether you’re dressing up for a day at the office or keeping it casual on the weekend, this sweater is a versatile addition to your wardrobe.',
            price: 250000,
            oneSize: false,
            categoryID: 'ad979506-cefb-4190-90fa-a1ce53f50d38',
            thumbnailURL: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/thumbnail%2F1369f3ab-fa79-45b7-a1ef-9da93c0be95b?alt=media&token=f5f585c0-2a56-438f-b266-f265d50cb7b0',
            createdAt: new Date('2024-07-05T11:01:26.380Z'),
        },
        {
            id: '3d9e080b-888c-472e-934b-6b0d21d724eb',
            name: 'Air-Light Long Sleeves Shirt',
            slug: 'air-light-long-sleeves-shirt',
            description: 'Stay cool and comfortable with our Air-Light Long Sleeves Shirt. Made from an ultra-lightweight, breathable fabric, this shirt is perfect for warmer weather. Its sleek design and versatile style make it ideal for both casual and semi-formal occasions. Pair it with your favorite jeans or slacks for a polished, sophisticated look that keeps you comfortable all day long.',
            price: 180000,
            oneSize: false,
            categoryID: 'ff452fb3-c4ee-4e44-a7ac-b45633b111fa',
            thumbnailURL: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/thumbnail%2F2e9632d8-f624-40af-a2c1-2b81c8a32a22?alt=media&token=89fd78c7-d335-405b-8390-7a898d23e645',
            createdAt: new Date('2024-07-05T10:54:53.374Z'),
        },
        {
            id: '41005490-ca3e-40ab-b4fb-e84eedf3fbd7',
            name: 'Warm Breathable Sweater',
            slug: 'warm-breathable-sweater',
            description: 'Experience the perfect blend of warmth and breathability with our Warm Breathable Sweater. Crafted from high-quality materials, this sweater keeps you cozy without causing overheating. Its stylish design features a classic cut that’s perfect for any occasion. Pair it with jeans or a skirt for a chic, comfortable look that’s ideal for chilly days and nights.',
            price: 250000,
            oneSize: false,
            categoryID: 'ad979506-cefb-4190-90fa-a1ce53f50d38',
            thumbnailURL: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/thumbnail%2Fcfb93f94-48de-446c-83dd-97c946cebdf1?alt=media&token=4bac0ba3-18eb-46b8-ba2c-04fb2f037583',
            createdAt: new Date('2024-07-05T11:00:20.155Z'),
        },
        {
            id: '411a62cb-41f0-438c-bd11-05dd0948f316',
            name: 'Body Fit Long Sleeves Shirts',
            slug: 'body-fit-long-sleeves-shirts',
            description: 'Our Body Fit Long Sleeves Shirts are designed to accentuate your figure while providing unmatched comfort. Made from a stretchy, breathable fabric, these shirts offer a snug fit that moves with you. Perfect for layering or wearing on their own, they come in a variety of colors to match any outfit. Whether you’re at work, the gym, or out with friends, these shirts provide a sleek and stylish look.',
            price: 220000,
            oneSize: false,
            categoryID: 'ff452fb3-c4ee-4e44-a7ac-b45633b111fa',
            thumbnailURL: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/thumbnail%2F2fbc5f1f-3d55-4cc7-b950-603219bbd924?alt=media&token=ab828f6f-688d-455a-8e38-b063c953564d',
            createdAt: new Date('2024-07-05T11:03:39.213Z'),
        },
        {
            id: '5300ec3c-0f5c-40d7-9451-ae256d8f0b31',
            name: 'Oversize Sweater',
            slug: 'oversize-sweater',
            description: 'Stay cozy and stylish with our Oversize Sweater. Made from a plush, warm fabric, this sweater provides the perfect blend of comfort and fashion. Its oversized fit ensures a relaxed and laid-back look, making it ideal for layering over shirts or under jackets. Available in a range of colors, it’s a versatile piece that pairs well with jeans, leggings, or skirts for a chic, comfortable outfit.',
            price: 200000,
            oneSize: false,
            categoryID: 'ad979506-cefb-4190-90fa-a1ce53f50d38',
            thumbnailURL: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/thumbnail%2F01e40480-a6bc-4600-8c4f-0c5bfb28d4d0?alt=media&token=744fbb64-3819-4558-90f5-a198899c7e64',
            createdAt: new Date('2024-07-05T10:57:20.502Z'),
        },
        {
            id: '798d80b1-8697-4d5a-93d1-f280374d79ed',
            name: 'Air-Light Crop Tee',
            slug: 'air-light-crop-tee',
            description: 'The Air-Light Crop Tee is your go-to for a breezy, fashionable ensemble. Made from ultra-lightweight fabric, it offers excellent breathability and comfort. This crop tee is designed to keep you cool and stylish during warm weather. Perfect for pairing with high-waisted shorts, skirts, or jeans, its minimalistic yet chic design ensures you look effortlessly trendy. Ideal for casual outings, workouts, or a day at the beach.',
            price: 180000,
            oneSize: false,
            categoryID: '4777d5ad-f3de-44c2-8683-e197d5b57154',
            thumbnailURL: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/thumbnail%2Fe8189607-75c0-452e-b0b4-8700f3bdee6a?alt=media&token=cbb89696-5ce4-4d89-8229-27ab40d394ba',
            createdAt: new Date('2024-07-05T11:02:29.009Z'),
        },
        {
            id: '83c1efa2-d543-4492-bddd-b52fb700cb30',
            name: 'Knit Relax Collar Blouses',
            slug: 'knit-relax-collar-blouses',
            description: 'Our Knit Relax Collar Blouses combine elegance with ease. Made from a soft knit material, these blouses feature a relaxed collar and a flattering drape that suits any body type. The lightweight fabric ensures comfort throughout the day, while the stylish design makes it ideal for both professional and casual settings. Dress it up with slacks for the office or pair with your favorite jeans for a laid-back, sophisticated look.',
            price: 250000,
            oneSize: false,
            categoryID: 'd354f3eb-d72a-40ba-842e-fc824e0e776b',
            thumbnailURL: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/thumbnail%2F5b9415f5-6fe4-4d4a-bfb0-1662614024ea?alt=media&token=a83983a8-b27f-4861-b5cf-1cd5f27509c6',
            createdAt: new Date('2024-07-04T04:46:36.364Z'),
        },
        {
            id: 'b4751717-10e2-4f46-a833-fc0bc6f638f9',
            name: 'Knit-Cute Shirt',
            slug: 'knit-cute-shirt',
            description: 'These Knit-Cute Shirts are the epitome of comfort and style. Crafted with a soft, breathable knit fabric, they offer a snug yet flexible fit, making them perfect for casual outings or layering in cooler weather. Available in a variety of colors and patterns, they pair effortlessly with jeans, skirts, or shorts. Whether you\'re lounging at home or out for a coffee date, these shirts provide a cozy, chic look that’s both versatile and timeless.',
            price: 235000,
            oneSize: false,
            categoryID: 'ff452fb3-c4ee-4e44-a7ac-b45633b111fa',
            thumbnailURL: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/thumbnail%2Fdf8accda-9ec4-4efc-b528-e314eacabca2?alt=media&token=9472d0a9-a86c-43c8-9628-a83f1c85fb76',
            createdAt: new Date('2024-07-05T11:04:57.445Z'),
        },
        {
            id: 'e7003a8d-9fde-4070-a355-539226c4e2a4',
            name: 'Air-Light T-Shirt',
            slug: 'air-light-t-shirt',
            description: 'Stay cool and stylish with our Air-Light T-Shirt. Crafted from ultra-lightweight, breathable fabric, this t-shirt ensures maximum comfort even on the hottest days. Its sleek, minimalist design makes it a versatile piece that can be worn on its own or layered under a jacket. Perfect for casual outings, workouts, or a day at the beach, this t-shirt is a must-have for any wardrobe.',
            price: 180000,
            oneSize: false,
            categoryID: '9be5f6c9-5583-4304-b2d1-cda66c24841a',
            thumbnailURL: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/thumbnail%2Fd34218fd-8dc9-4c67-ac2a-52387988ea4a?alt=media&token=d085885c-2863-4431-898f-5724ce8febe4',
            createdAt: new Date('2024-07-04T09:15:14.522Z'),
        }
    ];
}

export async function listProductCategory() {
    return [
        { id: '01f5a819-4e7e-4bf3-9997-199f4c97bc4e', slug: 'sunglasses', gender: ProductGender.UNISEX, type: ProductTypes.ACCESSORIES, category: 'Sunglasses' },
        { id: '058ef1a4-7c7e-40fb-90e8-4bbed7e3df18', slug: 'jeans', gender: ProductGender.WOMEN, type: ProductTypes.BOTTOMS, category: 'Jeans' },
        { id: '09e3fac9-7d79-44ad-82ac-a502fc94eb35', slug: 'sunglasses', gender: ProductGender.WOMEN, type: ProductTypes.ACCESSORIES, category: 'Sunglasses' },
        { id: '19c40075-9adb-46be-8e02-e27b062e7955', slug: 'casual-pants', gender: ProductGender.WOMEN, type: ProductTypes.BOTTOMS, category: 'Casual Pants' },
        { id: '28d0a0f2-7663-4b51-958c-0fbcffda298a', slug: 'shorts', gender: ProductGender.MEN, type: ProductTypes.BOTTOMS, category: 'Shorts' },
        { id: '2ad43c7a-450e-43d6-900d-6544d5a71010', slug: 'coats', gender: ProductGender.WOMEN, type: ProductTypes.TOPS, category: 'Coats' },
        { id: '4777d5ad-f3de-44c2-8683-e197d5b57154', slug: 't-shirts', gender: ProductGender.WOMEN, type: ProductTypes.TOPS, category: 'T-Shirts' },
        { id: '4bc7b121-73d5-4743-b1b2-7f77992c0c4e', slug: 'coats', gender: ProductGender.MEN, type: ProductTypes.TOPS, category: 'Coats' },
        { id: '595842bd-69c1-45e0-8f59-02fb060c077b', slug: 'bags', gender: ProductGender.WOMEN, type: ProductTypes.ACCESSORIES, category: 'Bags' },
        { id: '5ab58c18-bc32-4d4c-a948-1f050b35799f', slug: 'bags', gender: ProductGender.MEN, type: ProductTypes.ACCESSORIES, category: 'Bags' },
        { id: '6026774b-10c9-4e93-ba89-eb9628a189cc', slug: 'trousers', gender: ProductGender.WOMEN, type: ProductTypes.BOTTOMS, category: 'Trousers' },
        { id: '65e34a4f-af03-44e8-aa91-ca53eeec7765', slug: 'dresses', gender: ProductGender.WOMEN, type: ProductTypes.TOPS, category: 'Dresses' },
        { id: '7175afc8-0d54-486e-86ac-20118eff8ccc', slug: 'jackets', gender: ProductGender.MEN, type: ProductTypes.TOPS, category: 'Jackets' },
        { id: '71c2825a-62c2-4b5a-9c8a-8b21f0e42b4c', slug: 'trousers', gender: ProductGender.MEN, type: ProductTypes.BOTTOMS, category: 'Trousers' },
        { id: '74b30259-d53d-443f-ac3a-25100988c188', slug: 'blazers', gender: ProductGender.WOMEN, type: ProductTypes.TOPS, category: 'Blazers' },
        { id: '76e5acf6-6f29-457a-a96d-a6733db2eaeb', slug: 'skirts', gender: ProductGender.WOMEN, type: ProductTypes.BOTTOMS, category: 'Skirts' },
        { id: '77d3b913-233b-4f1f-842c-fb89abb676fb', slug: 'formal-shirts', gender: ProductGender.MEN, type: ProductTypes.TOPS, category: 'Formal Shirts' },
        { id: '926dd8c4-ea89-43dd-8898-f6bcae201816', slug: 'hats', gender: ProductGender.WOMEN, type: ProductTypes.ACCESSORIES, category: 'Hats' },
        { id: '955c46fc-11c2-4839-aa26-d71d23ce570a', slug: 'casual-pants', gender: ProductGender.MEN, type: ProductTypes.BOTTOMS, category: 'Casual Pants' },
        { id: '9be5f6c9-5583-4304-b2d1-cda66c24841a', slug: 't-shirts', gender: ProductGender.MEN, type: ProductTypes.TOPS, category: 'T-Shirts' },
        { id: '9e93bfed-1490-4564-bdc5-dc1caa118809', slug: 'belts', gender: ProductGender.WOMEN, type: ProductTypes.ACCESSORIES, category: 'Belts' },
        { id: 'a012418f-1cfd-4043-b792-6256c1dc830f', slug: 'belts', gender: ProductGender.MEN, type: ProductTypes.ACCESSORIES, category: 'Belts' },
        { id: 'a8eda2b1-cabf-4584-875a-e8486cee0f91', slug: 'casual-shirts', gender: ProductGender.MEN, type: ProductTypes.TOPS, category: 'Casual Shirts' },
        { id: 'a9f07f97-ffe0-4b6e-8342-99305fcc1f3b', slug: 'sweat-pants', gender: ProductGender.MEN, type: ProductTypes.BOTTOMS, category: 'Sweat Pants' },
        { id: 'ac2ad9ad-fcb4-4cab-8c82-f7324f67c24d', slug: 'polo-shirts', gender: ProductGender.MEN, type: ProductTypes.TOPS, category: 'Polo Shirts' },
        { id: 'ad926dfe-dec7-443f-934a-5ed322905140', slug: 'sweat-pants', gender: ProductGender.WOMEN, type: ProductTypes.BOTTOMS, category: 'Sweat Pants' },
        { id: 'ad979506-cefb-4190-90fa-a1ce53f50d38', slug: 'sweaters', gender: ProductGender.WOMEN, type: ProductTypes.TOPS, category: 'Sweaters' },
        { id: 'b0a517da-9398-49ec-a41f-bfb7d1c919d0', slug: 'hats', gender: ProductGender.MEN, type: ProductTypes.ACCESSORIES, category: 'Hats' },
        { id: 'b627820b-6249-4d34-b34b-80e2f3e14354', slug: 'shorts', gender: ProductGender.WOMEN, type: ProductTypes.BOTTOMS, category: 'Shorts' },
        { id: 'bc2d9ab4-88db-4c56-afd1-7ec3d6d6eeaa', slug: 'hats', gender: ProductGender.UNISEX, type: ProductTypes.ACCESSORIES, category: 'Hats' },
        { id: 'c002a3f8-a52e-4dec-a712-e8b83813f99c', slug: 'suits-and-blazers', gender: ProductGender.MEN, type: ProductTypes.TOPS, category: 'Suits and Blazers' },
        { id: 'c128a4ef-a3d5-421b-acc0-59d73a608905', slug: 'bags', gender: ProductGender.UNISEX, type: ProductTypes.ACCESSORIES, category: 'Bags' },
        { id: 'cf53ed7e-24bb-41ab-ac5f-047f44bfb618', slug: 'chinos', gender: ProductGender.MEN, type: ProductTypes.BOTTOMS, category: 'Chinos' },
        { id: 'd354f3eb-d72a-40ba-842e-fc824e0e776b', slug: 'blouses', gender: ProductGender.WOMEN, type: ProductTypes.TOPS, category: 'Blouses' },
        { id: 'e3376331-d33e-4116-bb1e-7418a037520d', slug: 'sunglasses', gender: ProductGender.MEN, type: ProductTypes.ACCESSORIES, category: 'Sunglasses' },
        { id: 'e9261565-6ee5-41c2-922b-9046f962b66e', slug: 'jeans', gender: ProductGender.MEN, type: ProductTypes.BOTTOMS, category: 'Jeans' },
        { id: 'f4ad0030-68f2-44c9-a4f7-0278575e444c', slug: 'collaborations', gender: ProductGender.UNISEX, type: ProductTypes.TOPS, category: 'Collaborations' },
        { id: 'f98d9cf2-074c-4a60-8576-32967e6ef03f', slug: 'sweaters', gender: ProductGender.MEN, type: ProductTypes.TOPS, category: 'Sweaters' },
        { id: 'fc6a1c82-d278-4d86-8294-e4b3ec5721aa', slug: 'leggings-pants', gender: ProductGender.WOMEN, type: ProductTypes.BOTTOMS, category: 'Leggings Pants' },
        { id: 'ff452fb3-c4ee-4e44-a7ac-b45633b111fa', slug: 'casual-shirts', gender: ProductGender.WOMEN, type: ProductTypes.TOPS, category: 'Casual Shirts' },
    ];
}

export async function listProductVariant() {
    return [
        { id: '0788e21d-f57a-42e0-aa98-752a7eee9cf5', productID: 'b4751717-10e2-4f46-a833-fc0bc6f638f9', color: 'White', HEX: '#f1e6dc', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/variant%2F55490f81-a6d9-488c-aaab-dfdfe5feb4d6?alt=media&token=f537c2f1-3b7e-48ad-9e06-0c3832338951' },
        { id: '0db928c0-4a70-44f6-823f-01c00c6bd5f4', productID: '3d9e080b-888c-472e-934b-6b0d21d724eb', color: 'Lavender', HEX: '#dfbfd6', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/variant%2F8c50c49d-7d42-447c-a4d4-a3e97f51c839?alt=media&token=3ca56a22-07ea-4e8d-8456-e138e3900ef7' },
        { id: '3950a630-19d7-4c7e-a754-73f45b147cb8', productID: '3971bfe5-c2e8-4376-84dc-c36da75b8ceb', color: 'Navy', HEX: '#111417', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/variant%2Fa865792e-6e89-4891-a219-308d8c09c8e2?alt=media&token=95a186bb-ef89-416e-9954-71e694043fa6' },
        { id: '3b580eff-563b-4d62-a251-389ba12fccf8', productID: '41005490-ca3e-40ab-b4fb-e84eedf3fbd7', color: 'Sand', HEX: '#c8b9a8', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/variant%2Fa007d1e3-cf31-4a33-ae66-c914ea462b58?alt=media&token=60350634-07ad-4550-9897-51fa012c08f8' },
        { id: '3c6e531b-aec5-4746-a4d7-aedeba677091', productID: '83c1efa2-d543-4492-bddd-b52fb700cb30', color: 'White', HEX: '#ebeae6', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/variant%2Ffaf67ef6-2d7b-461f-81c8-8829f2839aea?alt=media&token=407edf87-7921-4f86-8e2f-add67124c801' },
        { id: '49fd895a-64ae-4d0b-b061-355396b3ec93', productID: 'e7003a8d-9fde-4070-a355-539226c4e2a4', color: 'Black', HEX: '#000000', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/variant%2Fd4cfd489-92f8-4e6b-aab6-85522ffb9894?alt=media&token=ba33a61e-31ec-4511-ae21-cfbfb049061e' },
        { id: '4c40c5c1-2e3b-416e-be07-dd903b9f979d', productID: '411a62cb-41f0-438c-bd11-05dd0948f316', color: 'Blue', HEX: '#2a2e3f', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/variant%2Fa5354852-c104-4e6f-bd0b-7fb91f4c89a6?alt=media&token=c6053cee-178f-4fda-9f61-7c3fc353c986' },
        { id: '54b66510-a0a2-49dd-bf05-902a784974f2', productID: '5300ec3c-0f5c-40d7-9451-ae256d8f0b31', color: 'Sand', HEX: '#beb0a5', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/variant%2F0ec35354-8102-4eca-896a-267fdabe0f64?alt=media&token=63927f30-3362-472d-aad2-b717789eb47a' },
        { id: '56bdb1a9-045e-470a-8dc2-356cc18076a3', productID: '3971bfe5-c2e8-4376-84dc-c36da75b8ceb', color: 'White', HEX: '#f0efe9', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/variant%2F94f32953-1e11-45e2-af11-45e29d0f166c?alt=media&token=41bb1084-d290-4302-84b2-0011a489b1d3' },
        { id: '6f9d942c-a4bc-44d7-ba7e-361a01ae5cee', productID: 'e7003a8d-9fde-4070-a355-539226c4e2a4', color: 'Red', HEX: '#ba0808', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/variant%2Fa235d2ba-f0a1-41e5-9536-aaaa3bf5ddec?alt=media&token=128ee2e8-cc9a-494d-987b-8a95708e6fe4' },
        { id: '78af84c9-b201-48c2-a054-0290d101fa7c', productID: '2d349eaa-5eef-4cde-8054-5236f418349f', color: 'Red', HEX: '#de2a36', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/variant%2F869dab68-52d6-4ece-a10d-10a18d6cde57?alt=media&token=4b10787f-ae29-42ef-918b-57d704ec1797' },
        { id: '9714e389-e706-41a1-8eb2-e4381ef116f3', productID: '41005490-ca3e-40ab-b4fb-e84eedf3fbd7', color: 'White', HEX: '#e1dad0', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/variant%2Fc87882ea-4375-4530-953d-8ecffe4b0fb4?alt=media&token=a01b5fd0-8b48-4782-876d-be43042f59f6' },
        { id: '999342e8-881f-4c27-b314-490eb9cafd17', productID: 'e7003a8d-9fde-4070-a355-539226c4e2a4', color: 'Yellow', HEX: '#ebc902', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/variant%2F7b3ce995-c886-4652-8f1d-7f6ce5065252?alt=media&token=e7ba66c3-2238-468b-b57e-34f10c61082d' },
        { id: '9f652ea4-6230-4dd3-a566-8c8dee81076d', productID: '3d9e080b-888c-472e-934b-6b0d21d724eb', color: 'Pink', HEX: '#f7dbd4', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/variant%2F8bca2762-0eec-44cf-b0df-3ff8524bf9b9?alt=media&token=936ff1e2-01e9-4259-b5a6-b4c316f70978' },
        { id: 'cc8ef51d-be76-4587-b9ce-e0b4bfea84de', productID: '1f012253-f5a5-40bc-9f43-cc0c7a4ceb14', color: 'Black', HEX: '#000000', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/variant%2F95605a14-6b9f-49f1-aad7-259bcf8b88ee?alt=media&token=3c35f04e-ebaf-4deb-8f3f-3da6398f1ae3' },
        { id: 'df9e1c57-34d8-4f07-8e7f-746e4fb03ebd', productID: '83c1efa2-d543-4492-bddd-b52fb700cb30', color: 'Pink', HEX: '#edcac6', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/variant%2Fada52dbe-efcb-4ec9-8dee-5d4d31ab8456?alt=media&token=84b99c3b-9c8d-4256-9fb5-780c7db86d70' },
        { id: 'e4c35b97-14f7-4d73-bb77-2135883345d3', productID: '83c1efa2-d543-4492-bddd-b52fb700cb30', color: 'Green', HEX: '#616451', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/variant%2Fa8637266-9d45-4afa-9da5-2c2bc2ef29ee?alt=media&token=5c7d6301-04b6-4cfe-ab6a-45acbdea4391' },
        { id: 'edc299b0-c80d-4aa9-a56d-28c3666b8c1c', productID: '798d80b1-8697-4d5a-93d1-f280374d79ed', color: 'Burgundy', HEX: '#4b3639', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/variant%2Fd80b33b8-822b-4d60-bad1-b5af224d5e8c?alt=media&token=99d5028b-e7f9-4cad-8db7-b56fbad05ec3' },
        { id: 'f9bbcbfe-209b-4d43-8930-732cff765804', productID: '1f012253-f5a5-40bc-9f43-cc0c7a4ceb14', color: 'Graphite', HEX: '#585b5c', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/variant%2F5f001083-1a59-405f-99c9-2344fd1c6aa2?alt=media&token=36d229c1-10f4-4638-a717-e0a18c624ac0' }
    ];
}

export async function listProductImage() {
    return [
        { id: '03402c40-27b8-4940-bf0f-f51903dcf704', productID: '83c1efa2-d543-4492-bddd-b52fb700cb30', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/additional%2F32b31cb2-a253-45e8-a396-36bbe2cefb79?alt=media&token=9edf0ecb-499c-4504-be05-30aeb377d19b' },
        { id: '09045e9b-f663-42ed-a7a1-5a4acf77b90f', productID: '1f012253-f5a5-40bc-9f43-cc0c7a4ceb14', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/additional%2Ffec43985-ceeb-4652-ae6a-cc160a126ad4?alt=media&token=1e5ac30c-d26f-4fa4-899a-5494571b6b2c' },
        { id: '11a12138-758e-4236-93bc-53658928373b', productID: '1f012253-f5a5-40bc-9f43-cc0c7a4ceb14', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/additional%2Feaf2f44b-f0e7-4985-b137-d08047d31d33?alt=media&token=0888e666-311b-4752-9251-4004c05fe7d6' },
        { id: '3fefe3df-d009-4cb4-9d90-e9bf4e943871', productID: '1f012253-f5a5-40bc-9f43-cc0c7a4ceb14', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/additional%2Fce54129e-3324-49e1-8759-667d327e4d10?alt=media&token=b210693a-5ced-473b-be7a-e99625bd45cb' },
        { id: '84409dd8-d8e6-47b1-b5ce-790b9785bda1', productID: '3d9e080b-888c-472e-934b-6b0d21d724eb', image: 'https://firebasestorage.googleapis.com/v0/b/weardrobe-f8147.appspot.com/o/additional%2F43c176a5-a50d-415c-a392-9ea8ddeba83d?alt=media&token=81a83209-1194-427c-adc3-129d5cb4c701' }
    ];
}