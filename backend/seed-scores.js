const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function seedSkillScores() {
  try {
    console.log('🌱 Seeding skill scores...');
    
    // Get all students and skills
    const students = await pool.query("SELECT id, name FROM users WHERE role = 'student'");
    const skills = await pool.query('SELECT name, category FROM skills ORDER BY id');
    
    console.log(`Found ${students.rows.length} students and ${skills.rows.length} skills`);
    
    // Clear existing scores
    await pool.query('DELETE FROM skill_scores');
    console.log('Cleared existing skill scores');
    
    // Insert sample scores for each student
    for (const student of students.rows) {
      for (const skill of skills.rows) {
        // Generate random score between 40-95
        const score = Math.floor(Math.random() * 56) + 40;
        
        await pool.query(
          'INSERT INTO skill_scores (user_id, skill_name, category, score, created_at) VALUES ($1, $2, $3, $4, NOW())',
          [student.id, skill.name, skill.category, score]
        );
      }
    }
    
    console.log(`✅ Successfully seeded ${students.rows.length * skills.rows.length} skill scores`);
    
    // Show sample data
    const sampleScores = await pool.query(
      `SELECT u.name as student, ss.skill_name, ss.score, ss.category
       FROM skill_scores ss
       JOIN users u ON ss.user_id = u.id
       WHERE u.role = 'student'
       ORDER BY u.name, ss.skill_name
       LIMIT 10`
    );
    
    console.log('\n📊 Sample skill scores:');
    sampleScores.rows.forEach(row => {
      console.log(`- ${row.student}: ${row.skill_name} (${row.category}) - ${row.score}%`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding skill scores:', error);
    process.exit(1);
  }
}

seedSkillScores();
