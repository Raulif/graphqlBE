const {buildSchema} = require('graphql');

module.exports = buildSchema(`
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
   
      type Query {
         users: [User!]!
      }
      
      type Mutation {
         createUser(userInput: UserInput): User
      }
   `);