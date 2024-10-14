import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Movie: a
    .model({
      id: a.id().required(),
      title: a.string().required(),
      overview: a.string().required(),
      poster_path: a.string(),
      vote_average: a.string(),
      genres: a.json(),
      runtime: a.integer(),
      release_date: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  User: a
    .model({
      userId: a.id().required(),
      email: a.email().required(),
      movies: a.string().array(),
      username: a.string(),
      watched: a.string().array(),
    })
    .identifier(["userId"])
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
