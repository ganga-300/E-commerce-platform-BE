

const express = require('express');
const userRoutes = require('./user/route');
const productRoutes = require('./products/route')
const app = express();
const port = 3000;

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/api/user", userRoutes);
app.use('/api/products',productRoutes)

app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
