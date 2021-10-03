const Post = require("./models/post.model");
const jwt = require("jsonwebtoken");
const User = require("./models/user.model");
const { GraphQLUpload } = require("graphql-upload");
const { createWriteStream } = require("fs");
const { join, parse } = require("path");
const { ApolloError } = require("apollo-server-express");
const resolver = {
  Upload: GraphQLUpload,
  Query: {
    hello: () => {
      return "Hello World.";
    },
    getAllUser: async (parent, args, context, info) => {
      try {
        const response = await User.find();
        return response;
      } catch (err) {}
    },
    getAllPosts: async (parent, args, context, info) => {
      let condition = {};

      if (args.id) {
        condition._id = args.id;
      }

      return await Post.find(condition);
    },
    currentUser: async (parent, args, { user }) => {
      let condition = { _id: user.sub };
      return await User.findOne(condition);
    },
  },
  Mutation: {
    createPost: async (prent, args, context, info) => {
      const { title, description } = args.post;
      const post = new Post({ title, description });
      const response = await post.save();
      return response;
    },
    createUser: async (prent, args, context, info) => {
      try {
        const { email, password, promission } = await args.filedetails;
        let mapUser = new User({ email, password, promission });
        await mapUser.save();
        return { message: "User Created Success." };
      } catch (error) {
        console.log(error);
      }
    },
    userLogIn: async (prent, args, context, info) => {
      try {
        console.log(args.crediential);
        const { email, password } = args.crediential;

        const { id, role, permission } = await User.findOne({
          email,
          password,
        });

        const option = {
          expiresIn: "1h",
          issuer: "prabhaw.com.np",
          audience: `${id}`,
        };
        const token = jwt.sign(
          { "prabhaw.com.np": { id, role, permission } },
          process.env.JWT_SECRET,
          { algorithm: "HS256", subject: id },
          option
        );

        return { url: token };
      } catch (err) {
        console.log(err);
      }
    },
    singleUpload: async (parent, args, context, info) => {
      try {
        const { filename, mimetype, createReadStream } = await args.filedetails
          .file;
        const stream = createReadStream();
        let { ext, name } = parse(filename);
        name = name.replace(/([^a-z0-9]+)/gi, "-").replace(" ", "_");
        const fullname = `${name}-${Date.now()}${ext}`;
        let serverFile = join(process.cwd(), `public/${fullname}`);

        let writeStream = await createWriteStream(serverFile);
        await stream.pipe(writeStream);

        return {
          name: filename,
          description: "This is file input",
          url: `http://localhost:4000/images/${fullname}`,
        };
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },
  },
};

module.exports = resolver;
