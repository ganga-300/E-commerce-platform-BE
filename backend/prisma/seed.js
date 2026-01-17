const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

const bcrypt = require('bcryptjs');

const products = [
    {
        name: "Classmate Notebook",
        description: "High quality 200 pages notebook for students",
        price: 65,
        stock: 100,
        sku: "NB-200-001",
        family: "Stationery",
        imageUrl: "https://m.media-amazon.com/images/I/71z78-4Fm+L._AC_UF1000,1000_QL80_.jpg"
    },
    {
        name: "Camlin Geometry Box",
        description: "Complete geometry set for mathematics",
        price: 70,
        stock: 50,
        sku: "GEO-001",
        family: "Stationery",
        imageUrl: "https://m.media-amazon.com/images/I/61lXdkB1oGL.jpg"
    },
    {
        name: "Apsara Platinum Pencils",
        description: "Dark and smooth pencils, pack of 10",
        price: 30,
        stock: 200,
        sku: "PENCIL-001",
        family: "Stationery",
        imageUrl: "https://m.media-amazon.com/images/I/71m6n2WfLmL._AC_UF1000,1000_QL80_.jpg"
    },
    {
        name: "Camel Poster Colours",
        description: "12 vibrant shades for artists",
        price: 120,
        stock: 30,
        sku: "COLOR-001",
        family: "Art Supplies",
        imageUrl: "https://m.media-amazon.com/images/I/61K-qFzFwEL._AC_UF1000,1000_QL80_.jpg"
    },
    {
        name: "Fevicol MR",
        description: "General purpose adhesive, 200g",
        price: 35,
        stock: 150,
        sku: "GLUE-001",
        family: "Craft",
        imageUrl: "https://m.media-amazon.com/images/I/61F0Y-w0c1L._AC_UF1000,1000_QL80_.jpg"
    }
];

async function main() {
    console.log('Start seeding ...');

    // Seed Admin if provided in .env
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await prisma.user.upsert({
            where: { email: adminEmail },
            update: {},
            create: {
                userName: "SuperAdmin",
                email: adminEmail,
                password: hashedPassword,
                role: "ADMIN",
                isApproved: true
            },
        });
        console.log(`Admin user ${adminEmail} seeded successfully.`);
    }

    // Seed Products
    for (const p of products) {
        const product = await prisma.product.upsert({
            where: { sku: p.sku },
            update: {},
            create: p,
        });
        console.log(`Created product with id: ${product.id}`);
    }
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
