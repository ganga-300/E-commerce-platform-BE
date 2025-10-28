//db interactions

const { application } = require('express');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createUser = async (userName, email,password,role) => {
    return await prisma.user.create({data:{userName,email,password,role}})

};

const getUser = async () => {
    return await prisma.user.findMany()


};
    
const updateUser = async (name, email) => {
     return await prisma.user.update({
           where :  {email},
           data : {name}
     })

};

const deleteUser = async (email) => {
     return await prisma.user.delete({
           where : {email}

     })

};

module.exports = { createUser, getUser, updateUser, deleteUser };
