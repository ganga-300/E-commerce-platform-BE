const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

const bcrypt = require('bcryptjs');

const products = [
    {
        name: "Premium Classmate Notebook",
        description: "Designer 200-page notebook with ultra-smooth ivory paper and a spill-resistant matte cover. Perfect for professional sketches and high-stakes note-taking.",
        price: 85,
        stock: 120,
        sku: "NB-200-PREM",
        family: "Stationery",
        imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=2000&auto=format&fit=crop"
    },
    {
        name: "Professional Drafting Set",
        description: "A precision-engineered geometry set featuring stainless steel compasses, a technical protractor, and high-clarity rulers for architectural accuracy.",
        price: 350,
        stock: 45,
        sku: "GEO-PRO-001",
        family: "Stationery",
        imageUrl: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2000&auto=format&fit=crop"
    },
    {
        name: "Platinum Artist Pencils",
        description: "A curated set of 12 dark-core graphite pencils, ranging from 2H to 6B, designed for deep shadows and silky smooth gradients.",
        price: 150,
        stock: 85,
        sku: "PENCIL-PLAT-12",
        family: "Art Supplies",
        imageUrl: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=2000&auto=format&fit=crop"
    },
    {
        name: "Studio Gouache Set",
        description: "12 vibrant, high-pigment shades with exceptional opacity and a velvety matte finish. The choice of professional illustrators.",
        price: 850,
        stock: 25,
        sku: "COLOR-STUDIO-12",
        family: "Art Supplies",
        imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2000&auto=format&fit=crop"
    },
    {
        name: "Performance Craft Adhesive",
        description: "High-bond multi-surface adhesive that dries clear and flexible. Essential for heavy-duty papercraft and wood bonding.",
        price: 95,
        stock: 200,
        sku: "GLUE-PERF-200G",
        family: "Craft",
        imageUrl: "https://images.unsplash.com/photo-1589149098258-3e9102ca93d3?q=80&w=2000&auto=format&fit=crop"
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
