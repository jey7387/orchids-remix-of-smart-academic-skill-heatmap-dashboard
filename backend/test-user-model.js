const User = require('./models/User');

async function testUserModel() {
  try {
    console.log('🔍 Testing User model...');
    
    const user = await User.findById(3);
    console.log('✅ User found:', user);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ User model error:', error);
    process.exit(1);
  }
}

testUserModel();
