import {
  GraphQLInt,
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from "graphql";

import fetch from "node-fetch";

import APP from "./config";
console.info("schema is loaded");

let hitCount = 0;
let urlStore = [];
function getFollowers(url) {
  let x = substr(ur);
  urlStore.push(x);

  const my = `${url}?client_id=${APP.CLIENT_ID}&client_secret=${APP.CLIENT_SECRET}`;
  console.log(++hitCount + ":" + url);
  return fetch(my).then(res => res.json());
}

const UserType = new GraphQLObjectType({
  name: "UserType",
  description: "...",
  fields: () => ({
    login: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    asd: { type: GraphQLString },
    about: {
      type: GraphQLString,
      resolve: user => {
        return user.bio;
      }
    },
    following: { type: GraphQLInt },
    followers: { type: GraphQLInt },
    followersList: {
      type: new GraphQLList(UserType),
      resolve: (user, args) => {
        const my = `https://api.github.com/users/${user.login}/followers?client_id=${APP.CLIENT_ID}&client_secret=${APP.CLIENT_SECRET}`;
        console.log(my);
        return fetch(my)
          .then(res => res.json())
          .then(followers => followers.map(follower => follower.url))
          .then(urls => Promise.all(urls.map(getFollowers)));
      }
    }
  })
});

const QueryType = new GraphQLObjectType({
  name: "Query",
  description: "...",
  fields: {
    user: {
      type: UserType,
      args: {
        login: { type: GraphQLString }
      },
      resolve: (root, args) =>
        fetch(
          `https://api.github.com/users/${args.login}?client_id=${APP.CLIENT_ID}&client_secret=${APP.CLIENT_SECRET}`
        ).then(res => res.json())
    }
  }
});

export default new GraphQLSchema({
  query: QueryType
});
