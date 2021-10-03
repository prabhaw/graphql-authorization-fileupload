const express = require("express");
const expressJwt = require("express-jwt");
const donenv = require("dotenv");
const { graphqlUploadExpress } = require("graphql-upload");
const { ApolloServer } = require("apollo-server-express");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { applyMiddleware } = require("graphql-middleware");
const path = require("path");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const permission = require("./midlewarr/checkUserPermissiongs");

async function startServer() {
  const app = express();
  donenv.config();
  await require("./db");

  app.use(
    expressJwt({
      secret: process.env.JWT_SECRET,
      algorithms: ["HS256"],
      credentialsRequired: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: applyMiddleware(
      makeExecutableSchema({ typeDefs, resolvers }),
      permission
    ),

    context: ({ req }) => {
      const user = req.user || null;
      return { user };
    },
  });

  await apolloServer.start();
  app.use(graphqlUploadExpress());
  apolloServer.applyMiddleware({ app: app });

  app.use(express.static("files"));
  app.use("/images", express.static(path.join(__dirname, "public")));
  app.use((req, res) => {
    res.send("Hello From Express Apollow Server");
  });

  app.listen(4000, () =>
    console.log("Server is running on http://localhost:4000")
  );
}

startServer();
