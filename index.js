import express from 'express'
import { Client } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
const port = 5000;
const psqlConnectionString = process.env.PSQL_CONNECTION_STRING;
const mongoDbConnectionString = process.env.MONGO_CONNECTION_STRING;

app.use(cors());
app.use(express.json());
const mongoClient = new MongoClient(mongoDbConnectionString);

app.post('/api', async (req, res) => {
  const pgClient = new Client({ connectionString: psqlConnectionString });
  try {
    await mongoClient.connect();
    pgClient.connect();

    

    const mongoDatabase = mongoClient.db('logs');
    console.log('connected to mongodb server');
    const collection = mongoDatabase.collection('logs');
    const result = await collection.insertOne({
      type: 'post',
      time: Date.now()
    })
    console.log(`mongodb response: ${JSON.stringify(result)}`);
    
    const newCount = req.body.count;
    const db_response = await pgClient.query('UPDATE counts SET count=$1', [newCount]);
    console.log('query sent to psql db');
    if (db_response.rowCount > 0) {
      res.status(201).json({count: newCount})
    } else {
      res.status(400).send('Bad Request');
    }
  } catch(err) {
    console.error(err);
  } finally {
    pgClient.end();
  };
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const cleanup = event => {
  mongoClient.close();
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTEM', cleanup);