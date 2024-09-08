const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); 

const app = express();
const port = 3005;

const connectionString = 'postgres://udhf7vu2d6drn7:pb9df6fc17540a768595eaf0bfcc1d18f8fb9416d07e565d3e9d1b36731f27ebf@c9mq4861d16jlm.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/dep78clmaphk9v';
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const data103Routes = require('./routes/data103Routes');
const data1033Routes = require('./routes/data1033Routes');
const eventRoutes = require('./routes/eventRoutes');


pool.connect((err, client, done) => {
    if (err) {
        console.error('Unable to connect to PostgreSQL:', err.stack);
    } else {
        console.log('Connected to PostgreSQL database');
        client.release(); // Release the client to the pool
    }
  });
  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD, TRACE, CONNECT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});

app.use('/data103', data103Routes);
app.use('/data1033', data1033Routes);
app.use('/dataevent', eventRoutes);

const PORT = process.env.PORT || 3005;
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
