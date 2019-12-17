const express = require("express");
const graphqlHTTP = require("express-graphql");
const { schema, root } = require("./graphql/schema");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(port, () =>
  console.log(
    `Running a GraphQL API server at http://localhost:${port}/graphql`
  )
);
