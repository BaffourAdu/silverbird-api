const graphql = require("graphql");
const scrapeCinemaWebsite  = require("./resolvers/scrapeCinemaWebstie");
const { buildSchema } = graphql;

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Movie {
    title: String!
    duration: String
    showtime: String
    coverImage: String
    genre: String
    releaseDate: String
    language: String
    rating: String
  }

  type Query {
    moviesShowing(city: String!): [Movie]
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  moviesShowing: async ({ city }) => await scrapeCinemaWebsite(city)
};

module.exports = { schema, root };
