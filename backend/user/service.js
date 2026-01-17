const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
});


const createUser = async ({ userName, email, password, role, isApproved, phoneNumber, profilePicture }) => {
    console.log('createUser input:', { userName, email, password, role, isApproved, phoneNumber, profilePicture });
    return await prisma.user.create({
        data: {
            userName,
            email,
            password,
            role,
            isApproved: isApproved !== undefined ? isApproved : true,
            phoneNumber,
            profilePicture
        }
    })
};

const getUsers = async () => {
    return await prisma.user.findMany()
};

const findUserByEmail = async (email) => {
    return prisma.user.findUnique({
        where: { email }
    });
};

const getUserById = async (id) => {
    return prisma.user.findUnique({
        where: { id },
    });
}

const updateUser = async (id, userName) => {
    return await prisma.user.update({
        where: { id },
        data: { userName }
    });
};


const deleteUser = async (id) => {
    return await prisma.user.delete({
        where: { id }

    })

};

const addAddress = async (userId, addressData) => {
    // If setting as default, unset others first
    if (addressData.isDefault) {
        await prisma.address.updateMany({
            where: { userId },
            data: { isDefault: false }
        });
    }

    // If this is the first address, make it default automatically
    const count = await prisma.address.count({ where: { userId } });
    if (count === 0) addressData.isDefault = true;

    return await prisma.address.create({
        data: {
            ...addressData,
            userId
        }
    });
};

const getAddresses = async (userId) => {
    return await prisma.address.findMany({
        where: { userId },
        orderBy: { isDefault: 'desc' } // Default address first
    });
};

const deleteAddress = async (userId, addressId) => {
    // Verify ownership
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.userId !== userId) {
        throw new Error("Address not found or unauthorized");
    }

    return await prisma.address.delete({
        where: { id: addressId }
    });
};

module.exports = { createUser, getUsers, updateUser, deleteUser, findUserByEmail, getUserById, addAddress, getAddresses, deleteAddress };


