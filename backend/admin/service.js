const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get platform statistics
async function getPlatformStats() {
    const [totalUsers, totalProducts, totalOrders, totalRevenue] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.aggregate({
            _sum: {
                totalAmount: true
            }
        })
    ]);

    // Get orders today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ordersToday = await prisma.order.count({
        where: {
            createdAt: {
                gte: today
            }
        }
    });

    // Get revenue this month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const revenueThisMonth = await prisma.order.aggregate({
        where: {
            createdAt: {
                gte: startOfMonth
            }
        },
        _sum: {
            totalAmount: true
        }
    });

    // Get user counts by role
    const buyers = await prisma.user.count({ where: { role: 'BUYER' } });
    const sellers = await prisma.user.count({ where: { role: 'SELLER' } });
    const admins = await prisma.user.count({ where: { role: 'ADMIN' } });
    const pendingSellers = await prisma.user.count({ where: { role: 'SELLER', isApproved: false } });

    return {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        ordersToday,
        revenueThisMonth: revenueThisMonth._sum.totalAmount || 0,
        usersByRole: { buyers, sellers, admins },
        pendingSellers
    };
}

// Get sales data for last 7 days
async function getSalesData() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const orders = await prisma.order.findMany({
        where: {
            createdAt: {
                gte: sevenDaysAgo
            }
        },
        select: {
            createdAt: true,
            totalAmount: true
        }
    });

    // Group by date
    const salesByDate = {};
    orders.forEach(order => {
        const date = order.createdAt.toISOString().split('T')[0];
        if (!salesByDate[date]) {
            salesByDate[date] = { date, revenue: 0, orders: 0 };
        }
        salesByDate[date].revenue += order.totalAmount;
        salesByDate[date].orders += 1;
    });

    return Object.values(salesByDate).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Get recent orders
async function getRecentOrders(limit = 10) {
    const orders = await prisma.order.findMany({
        take: limit,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            user: {
                select: {
                    userName: true,
                    email: true
                }
            },
            orderItems: {
                include: {
                    product: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });

    return orders;
}

// Get top selling products
async function getTopProducts(limit = 5) {
    const products = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
            quantity: true
        },
        orderBy: {
            _sum: {
                quantity: 'desc'
            }
        },
        take: limit
    });

    const productDetails = await Promise.all(
        products.map(async (item) => {
            const product = await prisma.product.findUnique({
                where: { id: item.productId }
            });
            return {
                ...product,
                totalSold: item._sum.quantity
            };
        })
    );

    return productDetails;
}

// Get all users with pagination
async function getAllUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                userName: true,
                email: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        orders: true
                    }
                }
            }
        }),
        prisma.user.count()
    ]);

    return {
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
}

// Get all orders with pagination
async function getAllOrders(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        userName: true,
                        email: true
                    }
                },
                orderItems: {
                    include: {
                        product: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        }),
        prisma.order.count()
    ]);

    return {
        orders,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
}

// Get all products for moderation
async function getAllProductsForAdmin(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                _count: {
                    select: {
                        orderItems: true,
                        reviews: true
                    }
                }
            }
        }),
        prisma.product.count()
    ]);

    return {
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
}

// Delete product (admin)
async function deleteProductAdmin(productId) {
    const product = await prisma.product.delete({
        where: { id: productId }
    });
    return product;
}

// Get users with role: SELLER and isApproved: false
async function getPendingSellers() {
    return await prisma.user.findMany({
        where: {
            role: 'SELLER',
            isApproved: false
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

// Approve or reject a seller
async function updateSellerStatus(userId, isApproved) {
    return await prisma.user.update({
        where: { id: userId },
        data: { isApproved }
    });
}

module.exports = {
    getPlatformStats,
    getSalesData,
    getRecentOrders,
    getTopProducts,
    getAllUsers,
    getAllOrders,
    getAllProductsForAdmin,
    deleteProductAdmin,
    getPendingSellers,
    updateSellerStatus
};
