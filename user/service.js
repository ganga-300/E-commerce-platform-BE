//db interactions

const { application } = require('express');
const prisma = require('../db/config');

const createUser = async (name, email) => {
    return await prisma.contact.create({data:{name,email}})

};

const getUser = async () => {
    return await prisma.contact.findMany()


};
    
const updateUser = async (name, email) => {
     return await prisma.contact.update({
           where :  {email},
           data : {name}
     })

};

const deleteUser = async (email) => {
     return await prisma.contact.delete({
           where : {email}

     })

};

module.exports = { createUser, getUser, updateUser, deleteUser };
