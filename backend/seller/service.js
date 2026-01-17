const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getAnalyticsFromDB(sellerId) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Fetch sales for products owned by this seller
    const sales = await prisma.orderItem.findMany({
        where: {
            product: {
                sellerId: sellerId
            },
            order: {
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth
                },
                status: {
                    notIn: ['Cancelled', 'Pending'] // Only count confirmed sales
                }
            }
        },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    sku: true
                }
            }
        }
    });

    // Aggregate results by product
    const productStats = {};
    let totalRevenue = 0;
    let totalUnits = 0;

    for (const item of sales) {
        const pId = item.product.id;
        if (!productStats[pId]) {
            productStats[pId] = {
                id: pId,
                name: item.product.name,
                sku: item.product.sku,
                unitsSold: 0,
                revenue: 0
            };
        }

        // Use price from order item (historical price) not current product price
        const itemRevenue = item.price * item.quantity;

        productStats[pId].unitsSold += item.quantity;
        productStats[pId].revenue += itemRevenue;

        totalRevenue += itemRevenue;
        totalUnits += item.quantity;
    }

    return {
        period: {
            month: now.toLocaleString('default', { month: 'long' }),
            year: now.getFullYear()
        },
        summary: {
            totalRevenue: parseFloat(totalRevenue.toFixed(2)),
            totalUnits
        },
        products: Object.values(productStats).sort((a, b) => b.revenue - a.revenue)
    };
}

module.exports = { getAnalyticsFromDB };
