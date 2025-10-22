const express = require('express')
const { userRoutes } = require('./user/route')
const app = express()
const port = 3000

app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use("/api/auth")
app.use("/api/user", userRoutes)


app.listen(port, () => {
    console.log(`Example app started: http://localhost:${port}`)
})