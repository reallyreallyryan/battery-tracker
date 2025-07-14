// Replace your /app/api/notifications/route.js with this debug version temporarily

import { NextResponse } from "next/server";
import { Resend } from "resend";
import clientPromise from "@/libs/mongo";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    console.log("🔔 Starting battery notification check...");

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const itemsCollection = db.collection("batteryItems");
    const usersCollection = db.collection("users");

    // DEBUG: Check what collections exist
    const collections = await db.listCollections().toArray();
    console.log("📁 Available collections:", collections.map(c => c.name));

    // DEBUG: Get all users and items
    const allUsers = await usersCollection.find({}).toArray();
    const allItems = await itemsCollection.find({}).toArray();
    
    console.log("👥 Total users found:", allUsers.length);
    console.log("🔋 Total items found:", allItems.length);
    
    // DEBUG: Show user details
    allUsers.forEach(user => {
      console.log(`User ID: ${user._id}, Email: ${user.email || 'NO EMAIL'}`);
    });

    // DEBUG: Show item details with calculated status
    const itemsWithStatus = [];
    
    for (const item of allItems) {
      // Calculate current status (same logic as dashboard)
      const today = new Date();
      const changeDate = new Date(item.dateLastChanged);
      today.setHours(0, 0, 0, 0);
      changeDate.setHours(0, 0, 0, 0);
      
      const daysSinceChange = Math.floor((today - changeDate) / (1000 * 60 * 60 * 24));
      const expectedDuration = item.expectedDuration || 180;
      const percentUsed = (daysSinceChange / expectedDuration) * 100;
      
      let status = "good";
      if (percentUsed >= 80) {
        status = "replace";
      } else if (percentUsed >= 50) {
        status = "warning";
      }

      console.log(`📱 Item: ${item.name}`);
      console.log(`   User ID: ${item.userId}`);
      console.log(`   Days since change: ${daysSinceChange}`);
      console.log(`   Percent used: ${Math.round(percentUsed)}%`);
      console.log(`   Status: ${status}`);
      console.log(`   ---`);

      itemsWithStatus.push({
        ...item,
        status,
        daysSinceChange,
        percentUsed: Math.round(percentUsed)
      });
    }

    // DEBUG: Check for items needing notifications
    const itemsNeedingNotification = itemsWithStatus.filter(item => 
      item.status === "warning" || item.status === "replace"
    );
    
    console.log("🚨 Items needing notification:", itemsNeedingNotification.length);
    itemsNeedingNotification.forEach(item => {
      console.log(`   - ${item.name} (${item.status}) for user ${item.userId}`);
    });

    // DEBUG: Check if users have emails
    const userEmailMap = new Map();
    allUsers.forEach(user => {
      userEmailMap.set(user._id.toString(), user.email);
      userEmailMap.set(user._id, user.email); // Try both string and ObjectId
    });

    console.log("📧 User email mapping:");
    userEmailMap.forEach((email, userId) => {
      console.log(`   ${userId} -> ${email || 'NO EMAIL'}`);
    });

    // DEBUG: Match items to user emails
    for (const item of itemsNeedingNotification) {
      const userEmail = userEmailMap.get(item.userId) || userEmailMap.get(item.userId.toString());
      console.log(`🔗 Item "${item.name}" (user: ${item.userId}) -> Email: ${userEmail || 'NOT FOUND'}`);
    }

    return NextResponse.json({ 
      success: true, 
      debug: {
        totalUsers: allUsers.length,
        totalItems: allItems.length,
        itemsNeedingNotification: itemsNeedingNotification.length,
        collections: collections.map(c => c.name),
        userEmails: Array.from(userEmailMap.entries())
      },
      message: "Debug run complete - check console logs"
    });

  } catch (error) {
    console.error("Error in debug notification system:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}