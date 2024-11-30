import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { neon } from '@neondatabase/serverless';

const runMigration = async () => {
  const sql = neon(process.env.POSTGRES_URL!);
  const db = drizzle(sql);

  console.log('Running migrations...');

  await migrate(db, { migrationsFolder: 'drizzle' });

  console.log('Migrations completed!');
  process.exit(0);
};

runMigration().catch((err) => {
  console.error('Migration failed!', err);
  process.exit(1);
}); 