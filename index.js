const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express()

require('dotenv').config()
const port = 3000 || process.env.PORT;

app.use(express.json())
app.use(cors())

// mongodb code

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hjmc0vt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const db = client.db("innoMartDB")
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = db.collection("products");

    app.get("/productsCount", async (req, res) => {
      const count = await productCollection.countDocuments();
      res.send({ count });
    });

    // get all product
    app.get('/products', async (req, res) => {
        const{productName, price, category,brandName} = req.query;
        const newProduct = req.query.newProduct === "true";
        let query = {};
        let options= {}
        const size = parseInt(req.query.size);
        const page = parseInt(req.query.page) - 1;

        if(productName){
            query.productName = { $regex: productName, $options: "i"}
        }
        if(price){
            options = { sort: {price: price === "Low to High" ? 1 : -1}}
        }
        if(newProduct){
            options = {sort: {creationDate: -1}}
        }
        if(category){
            query.category = { $regex: category, $options: "i"}
        }
        if(brandName){
            query.brandName = { $regex: brandName, $options: "i"}
        }
        const result = await productCollection.find(query, options).skip(page * size).limit(size).toArray()
        res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// express setup working
app.get("/", (req, res) => {
    res.send("InnoMart server is running Perfectly...")
})

app.listen(port, () => {
    console.log(`the server port is running on ${port}`);
})