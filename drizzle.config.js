import { cwd } from 'node:process';
import { loadEnvConfig } from '@next/env';
loadEnvConfig(cwd());

export default {
    dialect: "postgresql",
    schema: "./utils/schema.jsx",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.NEXT_PUBLIC_DATABASE_URL,
        connectionString: process.env.NEXT_PUBLIC_DATABASE_URL,
    },
};