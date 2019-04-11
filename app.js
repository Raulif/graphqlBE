const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');
const graphqlHttp = require('express-graphql');

const {buildSchema} = require('graphql');

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

app.use(
    '/graphql',
    graphqlHttp({
      schema: buildSchema(`
         type User {
            _id: ID!
            email: String
            password: String
            name: String
         }
        
         input UserInput {
            email: String
            password: String
            name: String
         }
      
         type RootQuery {
            users: [User!]!
            user(name: String): User
         }
         
         type RootMutation {
            createUser(userInput: UserInput): User
         }
         
         schema {
            query: RootQuery
            mutation: RootMutation
         }
      `),
   rootValue: {
      users: () => {
         return User.find({}).then(users => {
            return users.map(user => {
               return {...user._doc}
            })
         }).catch(throwError);
      },
      user: args => {
         return User.findOne({name: args.name})
             .then(user => {
                return {...user._doc}
             })
             .catch(throwError);
      },
      createUser: args => {
         console.log(args);
         const user = new User({
            email: args.userInput.email,
            password: args.userInput.password,
            name: args.userInput.name
         });
         return user
             .save()
             .then(result => {
                return {...result._doc}
             }).catch(throwError);
      }
   },
   graphiql: true
}));


function throwError(err) {
   console.log(err);
   throw err;
}

const PORT = 8000;

mongoose.connect(`mongodb://adming@localhost:27017/graphqlDB`).then(() => {
   app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}).catch(console.log);

