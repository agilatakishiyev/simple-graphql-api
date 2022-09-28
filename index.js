import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { getWebPageTitles } from "./helper.js";

// GraphQL Schema
const schema = buildSchema(`
      type Query {
        records(message: String!): Record
      }

      type Record {
        mentions: [String]
        emoticons: [String]
        links: [Link]
      }

      type Link {
        url: String
        title: String
      }
`);

async function getRecords(args, ctx) {
  const message = String(args.message);

  const mentionsRegex = /@([A-z]+)\b\s/gi;
  const mentionsMatches = message.match(mentionsRegex);

  const emoticonsRegex = /(^|\()([A-z]+)\b\)/gi;
  const emoticonsMatches = message.match(emoticonsRegex);

  const linksRegex =
    /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;
  const linkMatches = message.match(linksRegex);

  return {
    mentions: mentionsMatches.map((mention) => mention.substring(1).trimEnd()),
    emoticons: emoticonsMatches.map((emoticon) =>
      emoticon.substring(1, emoticon.length - 1)
    ),
    links: getWebPageTitles(linkMatches),
  };
}

const root = {
  records: getRecords,
};

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(5454, () => {
  console.log("GraphQL server with Express running on localhost:5454/graphql");
});
