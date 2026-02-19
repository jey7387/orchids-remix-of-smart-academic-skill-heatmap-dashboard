const bcrypt = require('bcryptjs');

async function testPasswordVerification() {
  try {
    console.log('🔍 Testing password verification...\n');
    
    // Test the exact hashes from database
    const testHashes = [
      '$2b$12$K5L9v2M1Q9vK5l9MT8zI6v1Q', // Old incorrect hash
      '$2a$10$ee8Q3KrfvgLEIyQq.KE0uuvzGT74VEDrnrfA1SyQ.6NZDjteDRPBi', // Correct hash
    ];
    
    const password = 'student123';
    
    for (const hash of testHashes) {
      const isValid = await bcrypt.compare(password, hash);
      console.log(`Hash: ${hash.substring(0, 30)}... Valid: ${isValid}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testPasswordVerification();
