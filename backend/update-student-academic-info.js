const pool = require('./config/db');

async function updateStudentAcademicInfo() {
  try {
    console.log('Updating student academic information...');
    
    // Update existing students with academic information
    const updateQuery = `
      UPDATE users 
      SET 
        year = COALESCE(year, 3),
        semester = COALESCE(semester, 1),
        department = COALESCE(department, 'Computer Science'),
        roll_number = COALESCE(roll_number, 'CS' || EXTRACT(YEAR FROM NOW())::text || '001'),
        batch = COALESCE(batch, '2022-2026')
      WHERE role = 'student' AND (year IS NULL OR semester IS NULL OR department IS NULL)
    `;
    
    const result = await pool.query(updateQuery);
    console.log(`Updated ${result.rowCount} students with academic information`);
    
    // Check updated students
    const checkQuery = `
      SELECT id, name, email, year, semester, department, roll_number, batch 
      FROM users 
      WHERE role = 'student'
    `;
    
    const students = await pool.query(checkQuery);
    console.log('Current student academic information:');
    students.rows.forEach(student => {
      console.log(`- ${student.name}: Year ${student.year}, Semester ${student.semester}, Dept: ${student.department}, Roll: ${student.roll_number}, Batch: ${student.batch}`);
    });
    
    console.log('Student academic information update completed!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error updating student academic info:', error);
    process.exit(1);
  }
}

updateStudentAcademicInfo();
