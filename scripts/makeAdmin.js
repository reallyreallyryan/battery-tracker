#!/usr/bin/env node

/**
 * Script to promote a user to admin status
 * Usage: node scripts/makeAdmin.js user-email@domain.com
 */

import mongoose from 'mongoose';
import User from '../models/User.js';

// Check command line arguments
const email = process.argv[2];

if (!email) {
  console.error('❌ Error: Please provide a user email');
  console.log('Usage: node scripts/makeAdmin.js user-email@domain.com');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error('❌ Error: Please provide a valid email address');
  process.exit(1);
}

async function makeAdmin(userEmail) {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    console.log('🔌 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to database');
    
    // Find user by email
    console.log(`🔍 Looking for user: ${userEmail}`);
    const user = await User.findOne({ email: userEmail.toLowerCase() });
    
    if (!user) {
      console.error(`❌ User not found: ${userEmail}`);
      console.log('\nMake sure the user has signed up for your app first.');
      process.exit(1);
    }
    
    // Check if already admin
    if (user.isAdmin) {
      console.log(`ℹ️  User ${userEmail} is already an admin`);
      process.exit(0);
    }
    
    // Update user to admin
    console.log(`🔧 Promoting ${userEmail} to admin...`);
    await User.findByIdAndUpdate(user._id, { isAdmin: true });
    
    console.log('✅ Success!');
    console.log(`🎉 ${userEmail} is now an admin`);
    console.log('\nThe user will now be able to:');
    console.log('  - Access the analytics dashboard');
    console.log('  - View aggregate detection data');
    console.log('  - See the Analytics button in the dashboard');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the script
makeAdmin(email);