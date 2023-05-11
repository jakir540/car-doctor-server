const express = require('express');

const cors = require('cors');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

//middleware here

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wkiarbk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const serviceCollection = client.db('carDoctor').collection('services')
    const BookingCollection = client.db('carDoctor').collection('bookings')



//get All services data from db
app.get('/services',async(req,res)=>{
    const cursor = serviceCollection.find();
    const result = await cursor.toArray();
    res.send(result)
})


// get spcific service from db
app.get('/services/:id',async(req,res)=>{
    const id = req.params.id;
    const quiry = {_id: new ObjectId(id)};
    const options = {     
      projection: {  title: 1, price: 1,service_id:1,img:1 },
    };
    const result = await serviceCollection.findOne(quiry,options);
    res.send(result)
})




// insert data to db
app.post('/booking',async(req,res)=>{
  const booking = req.body;
  console.log(booking);
  const result = await BookingCollection.insertOne(booking)
  res.send(result);
})



//get specific booking data by email query
app.get('/booking',async(req,res)=>{
  console.log(req.query);
  let query ={};

  if (req.query?.email) {
    query ={email:req.query.email}
  }
  const result = await BookingCollection.find(query).toArray();
  res.send(result)
})

//specific data delete 
app.delete('/booking/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await BookingCollection.deleteOne(query);
  res.send(result);
})

//specific data update 
app.patch('/booking/:id',async(req,res)=>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)};
   const bookingData = req.body;
   console.log(bookingData);
   const updateDoc = {
    $set: {
      status: bookingData.status
    },
  };

  const result = await BookingCollection.updateOne(filter,updateDoc)
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


app.get('/',(req,res)=>{
    res.send("car doctor server is running")
})

app.listen(port,()=>{
    console.log(`the car doctor server port Number is ${port}`);
})