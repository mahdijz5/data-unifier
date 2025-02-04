import { z } from 'zod';
import * as dotenv from 'dotenv';


dotenv.config();

 const configSchema = z.object({
  app: z.object({
    port: z.preprocess((val) => Number(val), z.number().positive()),
   }),
  database: z.object({
    host: z.string() ,
    port: z.preprocess((val) => Number(val), z.number().positive() ),
    username: z.string(),
    password: z.string(),
    name: z.string(),
  }),
  api: z.object({
    provider1: z.object({
      url: z.string().url(),
    }),
    provider2: z.object({
      url: z.string().url(),
    }),
  }),
});

 export const config = configSchema.parse({
  app: {
    port: process.env.PORT,
   },
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    name: process.env.DB_NAME,
  },
  api: {
    provider1: { url: process.env.PROVIDER1_URL },
    provider2: { url: process.env.PROVIDER2_URL },
  },
});

 export const { app, database, api } = config;
