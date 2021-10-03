const { and, or, rule, shield, not } = require("graphql-shield");

function checkPermission(user, permission) {
  if (user && user["prabhaw.com.np"]) {
    return user["prabhaw.com.np"].permission.includes(permission);
  }
  return false;
}

const isAuthenticated = rule()(async (parent, args, { user }, info) => {
  return user !== null;
});

const canReadAnyUser = rule()((parent, args, { user }) => {
  return checkPermission(user, "read:any_user");
});

const canReadOwnUser = rule()((parent, args, contxt, info) => {
  const { user } = contxt;
  return checkPermission(user, "read:own_user");
});

const isReadOwnUser = rule()((parent, args, context, info) => {
  const { id } = args;
  const { user } = context;
  return user && user.sub === id;
});

module.exports = shield(
  {
    Query: {
      //getAllPosts: or(and(canReadOwnUser, isReadOwnUser), canReadAnyUser),
      // viewer: isAuthenticated,
    },
    Mutation: {
      createPost: isAuthenticated,
    },
  },
  { debug: true }
);
