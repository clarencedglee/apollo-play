const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");

const schema = fs.readFileSync(__dirname + "/../src/schema.gql", "utf8");
const typeDefs = gql(schema);
const server = new ApolloServer({
  typeDefs,
  mockEntireSchema: false,
  mocks: {
    Query: () => ({}),
    Mutation: () => ({})
  }
});

server.listen({ port: 7788 }).then(({ url }) => {
  console.log(`🚀 Bit portal api mock server ready at ${url}`);
});
