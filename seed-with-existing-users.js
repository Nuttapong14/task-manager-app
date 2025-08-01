// Seed database with sample data using existing users
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// If you've created users manually, replace these UUIDs with the actual ones from your Supabase Dashboard
// Or leave empty to create sample data with placeholder structure
const USER_UUIDS = {
  john: null,      // Replace with John Doe's UUID
  alice: null,     // Replace with Alice Johnson's UUID  
  bob: null,       // Replace with Bob Smith's UUID
  carol: null,     // Replace with Carol Davis's UUID
  david: null      // Replace with David Wilson's UUID
};

async function getExistingUsers() {
  console.log('👥 Checking for existing users...\n');
  
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at');
    
    if (error) {
      console.error('❌ Error fetching profiles:', error.message);
      return [];
    }
    
    console.log(`Found ${profiles.length} existing users:`);
    profiles.forEach(profile => {
      console.log(`  - ${profile.name} (${profile.email})`);
    });
    
    return profiles;
  } catch (err) {
    console.error('❌ Error:', err.message);
    return [];
  }
}

async function createSampleProject(ownerId, name, description, color, dueDate) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        color,
        owner_id: ownerId,
        due_date: dueDate
      })
      .select()
      .single();
    
    if (error) {
      console.error(`❌ Failed to create project ${name}:`, error.message);
      return null;
    }
    
    console.log(`✅ Created project: ${name}`);
    return data;
  } catch (err) {
    console.error(`❌ Error creating project ${name}:`, err.message);
    return null;
  }
}

async function createSampleTask(projectId, title, description, status, priority, assigneeId, createdBy, dueDate) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title,
        description,
        status,
        priority,
        project_id: projectId,
        assignee_id: assigneeId,
        created_by: createdBy,
        due_date: dueDate
      })
      .select()
      .single();
    
    if (error) {
      console.error(`❌ Failed to create task ${title}:`, error.message);
      return null;
    }
    
    console.log(`✅ Created task: ${title}`);
    return data;
  } catch (err) {
    console.error(`❌ Error creating task ${title}:`, err.message);
    return null;
  }
}

async function seedWithExistingUsers(users) {
  if (users.length === 0) {
    console.log('⚠️  No users found. Please create users first via:');
    console.log('   1. Supabase Dashboard > Authentication > Users, OR');
    console.log('   2. Your app\'s signup functionality');
    return;
  }
  
  console.log('\n🏢 Creating sample projects...\n');
  
  // Use first user as primary owner, or distribute across available users
  const owner1 = users[0].id;
  const owner2 = users.length > 1 ? users[1].id : users[0].id;
  
  // Create projects
  const project1 = await createSampleProject(
    owner1,
    'Website Redesign',
    'Complete overhaul of company website with modern design',
    'from-purple-500 to-pink-500',
    '2024-02-15'
  );
  
  const project2 = await createSampleProject(
    owner1,
    'Mobile App Development',
    'Native iOS and Android application development',
    'from-blue-500 to-cyan-500',
    '2024-03-01'
  );
  
  const project3 = await createSampleProject(
    owner2,
    'Marketing Campaign',
    'Q1 digital marketing strategy and execution',
    'from-green-500 to-emerald-500',
    '2024-01-30'
  );
  
  const projects = [project1, project2, project3].filter(p => p !== null);
  
  if (projects.length === 0) {
    console.log('❌ No projects created, skipping tasks');
    return;
  }
  
  console.log('\n📋 Creating sample tasks...\n');
  
  // Create tasks for the first project
  if (project1) {
    await createSampleTask(
      project1.id,
      'Design Homepage Layout',
      'Create wireframes and mockups for the new homepage design',
      'in-progress',
      'high',
      users.length > 1 ? users[1].id : users[0].id,
      owner1,
      '2024-01-25'
    );
    
    await createSampleTask(
      project1.id,
      'Set up Authentication',
      'Implement user login and registration system',
      'todo',
      'medium',
      users.length > 2 ? users[2].id : users[0].id,
      owner1,
      '2024-01-28'
    );
    
    await createSampleTask(
      project1.id,
      'Database Schema',
      'Design and implement the database structure',
      'done',
      'high',
      users.length > 3 ? users[3].id : users[0].id,
      owner1,
      '2024-01-20'
    );
  }
  
  // Create tasks for the mobile app project
  if (project2) {
    await createSampleTask(
      project2.id,
      'iOS App Development',
      'Build native iOS application',
      'in-progress',
      'high',
      users.length > 2 ? users[2].id : users[0].id,
      owner1,
      '2024-02-20'
    );
    
    await createSampleTask(
      project2.id,
      'Android App Development',
      'Build native Android application',
      'todo',
      'high',
      users.length > 3 ? users[3].id : users[0].id,
      owner1,
      '2024-02-25'
    );
  }
  
  // Create tasks for marketing project
  if (project3) {
    await createSampleTask(
      project3.id,
      'Social Media Strategy',
      'Develop comprehensive social media marketing plan',
      'done',
      'medium',
      users.length > 2 ? users[2].id : users[0].id,
      owner2,
      '2024-01-15'
    );
  }
  
  console.log('\n🎉 Sample data created successfully!');
  console.log(`   🏢 Projects: ${projects.length}`);
  console.log(`   👥 Users: ${users.length}`);
}

async function main() {
  try {
    console.log('🌱 Starting database seeding with existing users...\n');
    
    const users = await getExistingUsers();
    await seedWithExistingUsers(users);
    
    if (users.length > 0) {
      console.log('\n✨ Your TaskFlow database is now populated with sample data!');
      console.log('🚀 Start the app with: npm run dev');
    }
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

main();