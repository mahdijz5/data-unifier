import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  app: z.object({
    port: z.preprocess((val) => Number(val), z.number().positive()),
    bullBoardPort: z.preprocess((val) => Number(val), z.number().positive()),
    docPath: z.string(),
  }),
  database: z.object({
    host: z.string(),
    port: z.preprocess((val) => Number(val), z.number().positive()),
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
  redis: z.object({
    host: z.string(),
    port: z.preprocess((val) => Number(val), z.number().positive()),
  }),
  job: z.object({
    interval: z.preprocess((val) => Number(val), z.number().positive()),
  }),
});

export const config = configSchema.parse({
  app: {
    port: process.env.PORT,
    bullBoardPort: process.env.BULL_BOARD_PORT,
    docPath: process.env.DOC_PATH,
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
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  job: {
    interval: process.env.CRON_JOB_INTERVAL,
  },
});

export const { app, database, api } = config;
