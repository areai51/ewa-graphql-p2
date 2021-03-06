import express from "express";
import graphQLHTTP from "express-graphql";
import DataLoader from "dataloader";
import fetch from "node-fetch";

import schema from "./schema.js";

import APP from "./config";

const app = express();

// function getFollowers(url) {
//   const my = `${url}?client_id=${APP.CLIENT_ID}&client_secret=${APP.CLIENT_SECRET}`;
//   console.log(my);
//   return fetch(my).then(res => res.json());
// }

const userLoader = new DataLoader(urls => Promise.all(urls.map(getFollowers)));

const loaders = {
  user: userLoader
};

app.use(
  graphQLHTTP({
    schema,
    graphiql: true,
    context: { loaders }
  })
);

app.listen(3000);
console.log(`running on`);
