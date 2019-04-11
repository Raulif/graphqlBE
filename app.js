const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
   if (req.method === 'OPTIONS') {
      res.sendStatus(200);
   }
   next();
});

// Schemas and resolvers


function throwError(err) {
   console.log(err);
   throw err;
}

const PORT = 8000;

mongoose.connect(`mongodb://adming@localhost:27017/graphqlDB`).then(() => {
   app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}).catch(console.log);

