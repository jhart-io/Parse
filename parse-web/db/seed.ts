import { db, migrationClient } from './index';
import { accounts, persons, posts } from './schema';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.local' });

async function seed() {
  console.log('🌱 Seeding database...\n');

  try {
    // Hash password for test account
    const passwordHash = await bcrypt.hash('password123', 10);

    // Create a test account
    const [account] = await db.insert(accounts).values({
      passwordHash,
      loginMethod: 'password',
    }).returning();

    console.log('✅ Created test account:');
    console.log(`   ID: ${account.id}\n`);

    // Create a test person
    const [person] = await db.insert(persons).values({
      accountId: account.id,
      username: 'testuser',
      displayName: 'Test User',
      bio: 'Just testing Parse!',
    }).returning();

    console.log('✅ Created test person:');
    console.log(`   Username: ${person.username}`);
    console.log(`   Display Name: ${person.displayName}`);
    console.log(`   ID: ${person.id}\n`);

    // Create some test posts
    const samplePosts = await db.insert(posts).values([
      {
        authorId: person.id,
        title: 'Welcome to Parse',
        content: 'This is my first post on Parse. I\'m excited to share short stories and thoughts with everyone. Parse is a place where anyone can share intentional moments.',
        isDraft: false,
        visibility: 'public',
      },
      {
        authorId: person.id,
        title: 'On Minimalism',
        content: 'Sometimes less is more. Minimalism isn\'t about having nothing—it\'s about making room for what matters. In a world of constant noise, finding clarity becomes an act of rebellion.',
        isDraft: false,
        visibility: 'public',
        topic: 'philosophy',
      },
      {
        authorId: person.id,
        title: 'A Draft Post',
        content: 'This is a draft I\'m still working on. Not ready to share yet, but I\'m getting there. Just collecting my thoughts and ideas.',
        isDraft: true,
        visibility: 'private',
      },
      {
        authorId: person.id,
        title: 'Morning Coffee',
        content: 'There\'s something special about the first sip of coffee in the morning. It\'s not just caffeine—it\'s a ritual, a moment of peace before the day begins.',
        isDraft: false,
        visibility: 'public',
        topic: 'life',
      },
    ]).returning();

    console.log(`✅ Created ${samplePosts.length} sample posts\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Seed complete!\n');
    console.log('🔐 Test credentials:');
    console.log(`   Username: ${person.username}`);
    console.log(`   Password: password123\n`);
    console.log('📝 Person ID:');
    console.log(`   ${person.id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }

  await migrationClient.end();
  process.exit(0);
}

seed();
