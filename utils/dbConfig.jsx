import {neon} from "@neondatabase/serverless"
import {drizzle} from "drizzle-orm/neon-http"
import * as schema from "./schema"
import { cwd } from 'node:process';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(cwd());


const sql = neon(
    process.env.NEXT_PUBLIC_DATABASE_URL 
)

export const db = drizzle(sql, {schema});