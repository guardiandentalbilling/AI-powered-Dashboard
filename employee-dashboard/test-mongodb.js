const mongoose = require('mongoose');
require('dotenv').config();

console.log('=== MongoDB Connection Troubleshooter ===');
console.log('');

const connectionString = process.env.MONGO_URI;
console.log('Testing connection string:', connectionString.replace(/:([^@]+)@/, ':****@'));

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(connectionString, {
            serverSelectionTimeoutMS: 10000, // 10 second timeout
        });
        
        console.log('✅ SUCCESS: Connected to MongoDB successfully!');
        console.log('Database name:', mongoose.connection.name);
        console.log('Connection state:', mongoose.connection.readyState);
        
        // Test if we can perform basic operations
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
    } catch (error) {
        console.log('❌ FAILED: Connection failed');
        console.log('Error type:', error.name);
        console.log('Error message:', error.message);
        console.log('');
        
        if (error.message.includes('bad auth')) {
            console.log('🔍 Authentication failed. Possible causes:');
            console.log('  1. Incorrect username or password');
            console.log('  2. User doesn\'t exist in the database');
            console.log('  3. User doesn\'t have access to the specified database');
            console.log('  4. Password contains special characters that need URL encoding');
        } else if (error.message.includes('timeout') || error.message.includes('ENOTFOUND')) {
            console.log('🔍 Network connection failed. Possible causes:');
            console.log('  1. Internet connection issues');
            console.log('  2. MongoDB Atlas firewall/IP whitelist restrictions');
            console.log('  3. Incorrect cluster URL');
        }
        
        console.log('');
        console.log('💡 Suggestions:');
        console.log('  1. Check your MongoDB Atlas dashboard');
        console.log('  2. Verify your username and password');
        console.log('  3. Check IP whitelist (add 0.0.0.0/0 for testing)');
        console.log('  4. Ensure the cluster is running');
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('Connection closed.');
        }
        process.exit(0);
    }
}

testConnection();