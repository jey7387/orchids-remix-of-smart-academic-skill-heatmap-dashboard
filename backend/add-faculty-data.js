const pool = require('./config/db');

async function addFacultyData() {
  try {
    console.log('👨‍🏫 Adding dummy data for faculty user...');
    
    // Get faculty user ID
    const facultyResult = await pool.query("SELECT id, name FROM users WHERE email = 'swea@gmail.com'");
    
    if (facultyResult.rows.length === 0) {
      console.log('❌ Faculty user not found. Creating faculty user first...');
      
      // Create faculty user
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('123456', 10);
      
      const newFaculty = await pool.query(
        'INSERT INTO users (name, email, password, role, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, name, email, role',
        ['Test Faculty', 'swea@gmail.com', hashedPassword, 'faculty']
      );
      
      console.log('✅ Faculty user created:', newFaculty.rows[0]);
      const facultyId = newFaculty.rows[0].id;
      
      // Add skill scores for faculty
      await addSkillScores(facultyId, 'Test Faculty');
    } else {
      const facultyId = facultyResult.rows[0].id;
      const facultyName = facultyResult.rows[0].name;
      console.log('✅ Found faculty user:', facultyName, '(ID:', facultyId, ')');
      
      // Add skill scores for existing faculty
      await addSkillScores(facultyId, facultyName);
    }
    
    console.log('\n🎉 Faculty data addition complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding faculty data:', error);
    process.exit(1);
  }
}

async function addSkillScores(userId, userName) {
  try {
    // Get all skills
    const skills = await pool.query('SELECT name, category FROM skills ORDER BY id');
    
    console.log(`\n📊 Adding ${skills.rows.length} skill scores for ${userName}...`);
    
    // Clear existing scores for this user
    await pool.query('DELETE FROM skill_scores WHERE user_id = $1', [userId]);
    
    // Add new scores for each skill
    for (const skill of skills.rows) {
      // Generate realistic scores for faculty (generally higher than students)
      const score = Math.floor(Math.random() * 20) + 75; // 75-95 range
      
      await pool.query(
        'INSERT INTO skill_scores (user_id, skill_name, category, score, created_at) VALUES ($1, $2, $3, $4, NOW())',
        [userId, skill.name, skill.category, score]
      );
      
      console.log(`  - ${skill.name}: ${score}%`);
    }
    
    console.log(`✅ Added ${skills.rows.length} skill scores for ${userName}`);
  } catch (error) {
    console.error('❌ Error adding skill scores:', error);
    throw error;
  }
}

addFacultyData();
