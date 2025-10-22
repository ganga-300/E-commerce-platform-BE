//internal orchestrations
const userRoutes = require("express").Router();

userRoutes.post("/", validateUser, () => {
    console.log("/post api made")
})

userRoutes.get("/", () => {
    console.log("/get api made")
})

module.exports = { userRoutes }