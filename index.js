const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;




app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.pphnrsn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const GalleryCollection = client.db("Game_mart").collection("gellaryImg")
        const toysCollection = client.db("Game_mart").collection("Toys")
        const iconsInfoCollection = client.db("Game_mart").collection("infoCollection")


        app.get("/galleryImg", async (req, res) => {
            const result = await GalleryCollection.find().toArray();
            res.send(result)
        });

        app.post("/toys", async (req, res) => {
            const newGme = req.body;
            const result = await toysCollection.insertOne(newGme);
            res.send(result);
        });

        app.get("/toys", async (req, res) => {
            const result = await toysCollection.find().toArray();
            res.send(result)
        });

        app.get("/useInfo", async (req, res) => {
            const result = await iconsInfoCollection.find().toArray();
            res.send(result);
        });


        app.get("/toys/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.findOne(query);
            res.send(result)
        })

        app.get("/toys-mydata", async (req, res) => {
            console.log(req.query.email);
            let query = {}
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await toysCollection.find(query).toArray();
            res.send(result)
        });

        app.put("/toys/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const game = req.body;
            const updateGame = {
                $set: {
                    category: game.category,
                    price: game.price,
                    rating: game.rating,
                    quantity: game.quantity,
                    description: game.description
                },
            };
            const result = await toysCollection.updateOne(query, updateGame);
            res.send(result)
        });

        app.delete('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.deleteOne(query);
            res.send(result)
        });

        const indexKey = { toysName: 1 }
        const indexOption = { name: "toysName" }

        const result = await toysCollection.createIndex(indexKey, indexOption);
        app.get("/toysSearch/:text", async (req, res) => {
            const searchText = req.params.text;
            const result = await toysCollection.find({
                $or: [
                    { toysName: { $regex: searchText, $options: "i" } }
                ]
            }).toArray();
            res.send(result);
        });




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('assignment 11 server is running')
});


app.listen(port, () => {
    console.log(`server running port of ${port}`)
});
