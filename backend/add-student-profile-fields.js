const pool = require('./config/db');

async function addStudentProfileFields() {
  try {
    console.log('🔧 Adding student profile fields...\n');
    
    // Add new columns to users table for student profile
    const alterUsersTable = `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS year integer,
      ADD COLUMN IF NOT EXISTS department varchar(100),
      ADD COLUMN IF NOT EXISTS semester integer,
      ADD COLUMN IF NOT EXISTS roll_number varchar(20),
      ADD COLUMN IF NOT EXISTS batch varchar(20)
    `;
    
    await pool.query(alterUsersTable);
    console.log('✅ Added student profile fields to users table');
    
    // Create semester_marks table
    const createSemesterMarksTable = `
      CREATE TABLE IF NOT EXISTS semester_marks (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        semester INTEGER NOT NULL,
        subject_name VARCHAR(100) NOT NULL,
        marks INTEGER NOT NULL,
        max_marks INTEGER NOT NULL DEFAULT 100,
        grade VARCHAR(2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await pool.query(createSemesterMarksTable);
    console.log('✅ Created semester_marks table');
    
    // Create index for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_semester_marks_student_semester 
      ON semester_marks(student_id, semester)
    `);
    console.log('✅ Created index on semester_marks table');
    
    // Update sample student data
    const updateSampleData = `
      UPDATE users 
      SET 
        year = CASE 
          WHEN email = 'student@academic.com' THEN 3
          WHEN email = 'john@student.com' THEN 2
          WHEN email = 'jane@student.com' THEN 3
          ELSE 1
        END,
        department = CASE 
          WHEN email = 'student@academic.com' THEN 'Computer Science'
          WHEN email = 'john@student.com' THEN 'Information Technology'
          WHEN email = 'jane@student.com' THEN 'Computer Science'
          ELSE 'General'
        END,
        semester = CASE 
          WHEN email = 'student@academic.com' THEN 6
          WHEN email = 'john@student.com' THEN 4
          WHEN email = 'jane@student.com' THEN 5
          ELSE 1
        END,
        roll_number = CASE 
          WHEN email = 'student@academic.com' THEN 'CS2021001'
          WHEN email = 'john@student.com' THEN 'IT2021002'
          WHEN email = 'jane@student.com' THEN 'CS2021003'
          ELSE 'ROLL001'
        END,
        batch = CASE 
          WHEN email = 'student@academic.com' THEN '2021-2025'
          WHEN email = 'john@student.com' THEN '2022-2026'
          WHEN email = 'jane@student.com' THEN '2021-2025'
          ELSE '2020-2024'
        END
      WHERE role = 'student' AND email IN ('student@academic.com', 'john@student.com', 'jane@student.com')
    `;
    
    await pool.query(updateSampleData);
    console.log('✅ Updated sample student profile data');
    
    // Add sample semester marks for student@academic.com
    const studentId = await pool.query(`SELECT id FROM users WHERE email = 'student@academic.com'`);
    if (studentId.rows.length > 0) {
      const insertSemesterMarks = `
        INSERT INTO semester_marks (student_id, semester, subject_name, marks, max_marks, grade) 
        VALUES 
          ($1, 6, 'Data Structures', 85, 100, 'A'),
          ($1, 6, 'Algorithms', 78, 100, 'B+'),
          ($1, 6, 'Database Systems', 92, 100, 'A+'),
          ($1, 6, 'Web Development', 88, 100, 'A'),
          ($1, 6, 'Operating Systems', 76, 100, 'B+'),
          ($1, 5, 'Programming Fundamentals', 82, 100, 'A'),
          ($1, 5, 'Mathematics', 74, 100, 'B'),
          ($1, 5, 'Computer Networks', 79, 100, 'B+')
        ON CONFLICT DO NOTHING
      `;
      
      await pool.query(insertSemesterMarks, [studentId.rows[0].id]);
      console.log('✅ Added sample semester marks for student');
    }
    
    console.log('\n🎉 Student profile enhancement complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addStudentProfileFields();
