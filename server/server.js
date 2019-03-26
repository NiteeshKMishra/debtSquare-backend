const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  // Set CORS headers so that the Angular SPA is able to communicate with this server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/user', (req, res) => {
  res.send({ username: "Niteesh" });
})

app.post('/login', (req, res) => {
  console.log(req.body);
  res.send('This is working');
})

app.listen(3000, () => {
  console.log('Server started on port 3000');
})