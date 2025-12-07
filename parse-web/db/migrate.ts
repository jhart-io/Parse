import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, migrationClient } from './index';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
  console.log('Running migrations...');

  try {
    await migrate(db, { migrationsFolder: './db/migrations' });
    console.log('✅ Migrations complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  await migrationClient.end();
  process.exit(0);
}

main();
