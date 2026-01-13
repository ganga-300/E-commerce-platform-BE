const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});


const createUser = async ({ userName, email, password, role }) => {
    console.log('createUser input:', { userName, email, password, role });
    return await prisma.user.create({ data: { userName, email, password, role } })

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

module.exports = { createUser, getUsers, updateUser, deleteUser, findUserByEmail, getUserById };

