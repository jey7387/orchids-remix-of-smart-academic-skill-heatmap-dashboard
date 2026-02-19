const pool = require('./config/db');

async function addAllStudentAcademicInfo() {
  try {
    console.log('🔧 Adding academic info for all students...\n');
    
    // Get all students
    const studentsRes = await pool.query('SELECT id, name, email FROM users WHERE role = \'student\'');
    
    for (const student of studentsRes.rows) {
      console.log(`\n📝 Processing student: ${student.name} (${student.email})`);
      
      // Update with academic information if not already set
      await pool.query(`
        UPDATE users 
        SET 
          year = CASE WHEN year IS NULL THEN $1 ELSE year END,
          semester = CASE WHEN semester IS NULL THEN $2 ELSE semester END,
          department = CASE WHEN department IS NULL THEN $3 ELSE department END,
          roll_number = CASE WHEN roll_number IS NULL THEN $4 ELSE roll_number END,
          batch = CASE WHEN batch IS NULL THEN $5 ELSE batch END
        WHERE id = $6
      `, [
        Math.floor(Math.random() * 3) + 1, // Random year 1-3
        Math.floor(Math.random() * 6) + 1, // Random semester 1-6
        ['Computer Science', 'Information Technology', 'Electrical Engineering'][Math.floor(Math.random() * 3)], // Random department
        `${student.name.replace(/\s+/g, '').substring(0, 4).toUpperCase()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`, // Generate roll number
        `${2020 + Math.floor(Math.random() * 5)}-${2024 + Math.floor(Math.random() * 5)}`, // Random batch
        student.id
      ]);
      
      console.log(`  ✅ Year: ${Math.floor(Math.random() * 3) + 1}`);
      console.log(`  ✅ Semester: ${Math.floor(Math.random() * 6) + 1}`);
      console.log(`  ✅ Department: Computer Science`);
      console.log(`  ✅ Roll Number: Generated`);
      console.log(`  ✅ Batch: ${2020 + Math.floor(Math.random() * 5)}-${2024 + Math.floor(Math.random() * 5)}`);
    }
    
    console.log('\n📊 Adding sample semester marks for all students...');
    
    // Add semester marks for all students (semesters 1-6)
    const subjects = [
      'Data Structures', 'Algorithms', 'Database Systems', 'Web Development',
      'Operating Systems', 'Programming Fundamentals', 'Mathematics',
      'Computer Networks', 'Software Engineering', 'AI/ML', 'Cloud Computing'
    ];
    
    for (const student of studentsRes.rows) {
      for (let semester = 1; semester <= 6; semester++) {
        // Random 3-5 subjects per semester
        const numSubjects = Math.floor(Math.random() * 3) + 3;
        const selectedSubjects = subjects.sort(() => 0.5 - Math.random()).slice(0, numSubjects);
        
        for (const subject of selectedSubjects) {
          const marks = Math.floor(Math.random() * 40) + 60; // Random marks 60-100
          const grade = marks >= 90 ? 'A+' : marks >= 85 ? 'A' : marks >= 75 ? 'B+' : marks >= 65 ? 'B' : marks >= 50 ? 'C+' : 'C';
          
          await pool.query(`
            INSERT INTO semester_marks (student_id, semester, subject_name, marks, max_marks, grade)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT DO NOTHING
          `, [student.id, semester, subject, marks, 100, grade]);
        }
      }
      
      console.log(`  ✅ Added marks for ${student.name} (Semesters 1-6)`);
    }
    
    console.log('\n🎉 Academic info and semester marks added for all students!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addAllStudentAcademicInfo();
