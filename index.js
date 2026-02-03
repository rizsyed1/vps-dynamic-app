import express from 'express';
import { Client } from 'pg';
import cors from 'cors'; 
import bodyParser from 'body-parser';
import 'dotenv/config';
import { MongoClient } from 'mongodb';

const app = express();
const port = 4000;
const mongoClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
console.log('connecting to mongodb...');
await mongoClient.connect();
console.log('connected to mongodb');

app.use(cors());
app.use(bodyParser.json());

app.post('/api', async (req, res) => {
  console.log('post request received');
  const client = new Client({connectionString: process.env.PSQL_CONNECTION_STRING});  
  const mongoDatabase = mongoClient.db('logs');
  const mongoCollection = mongoDatabase.collection('logs');
  try {
    await client.connect();
    console.log('connected to postgresql');
    const count = req.body.count;
    console.log('count received: ', count);
    const psqlRes = await client.query('UPDATE Counts SET count = $1', [count]);
    console.log('psql db table updated');
    const mongoRes = await mongoCollection.insertOne({
      time: Date.now()
    });
    console.log('new mongodb collection id: ', mongoRes.insertedId);
    res.status(201).json({rowCount: psqlRes.rowCount});
  } catch (err) {
    console.error(err);
  } finally {
    client.end();
  }
});

app.get('/health', (res, req) => {
  res.sendStatus(200);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
