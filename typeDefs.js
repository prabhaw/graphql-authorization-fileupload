const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Upload
  type Post {
    id: ID
    title: String
    description: String
  }
  type Token {
    token: String!
  }
  type User {
    id: ID
    email: String
    password: String
    role: String
    permission: [String]
  }
  type Query {
    hello: String
    getAllPosts(id: ID): [Post]
    getAllUser: [User]
    currentUser: User
  }
  type File {
    url: String!
  }

  type Message {
    message: String!
  }

  input PostInput {
    title: String
    description: String
  }
  input UserInput {
    email: String!
    password: String!
    permission: [String]!
  }
  input LogInUser {
    email: String!
    password: String!
  }

  input FileInput {
    name: String!
    description: String!
    file: Upload!
  }
  type FileUpload {
    name: String!
    description: String!
    url: String!
  }
  type Mutation {
    createPost(post: PostInput): Post
    userLogIn(crediential: LogInUser): File!
    createUser(details: UserInput): Message
    singleUpload(filedetails: FileInput): FileUpload!
  }
`;

module.exports = typeDefs;
