// Replace your /app/api/notifications/route.js with this simplified version for testing

import { NextResponse } from "next/server";
import { Resend } from "resend";
import clientPromise from "@/libs/mongo";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    console.log("🔔 Starting simplified notification test...");

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const itemsCollection = db.collection("batteryItems");
    const usersCollection = db.collection("users");

    // Get all items and calculate status
    const allItems = await itemsCollection.find({}).toArray();
    const userNotifications = new Map();

    for (const item of allItems) {
      // Calculate status
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

      console.log(`📱 ${item.name}: ${status} (${Math.round(percentUsed)}% used)`);

      // Add items that need notification (SKIP anti-spam check for testing)
      if (status === "warning" || status === "replace") {
        if (!userNotifications.has(item.userId)) {
          userNotifications.set(item.userId, []);
        }
        
        userNotifications.get(item.userId).push({
          ...item,
          status,
          daysSinceChange,
          percentUsed: Math.round(percentUsed)
        });
      }
    }

    console.log(`🚨 Found ${userNotifications.size} users with items needing notifications`);

    let emailsSent = 0;
    const emailResults = [];

    // Send notifications
    for (const [userId, items] of userNotifications) {
      try {
        // Get user email
        const user = await usersCollection.findOne({ 
          $or: [
            { _id: userId },
            { _id: userId.toString() }
          ]
        });
        
        console.log(`👤 Looking for user: ${userId}`);
        console.log(`📧 Found user email: ${user?.email || 'NOT FOUND'}`);

        if (!user?.email) {
          console.log(`❌ No email found for user ${userId}`);
          continue;
        }

        // Create simple email content
        const redItems = items.filter(item => item.status === "replace");
        const yellowItems = items.filter(item => item.status === "warning");

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>⚡ VoltaHome Battery Alert</h2>
            
            ${redItems.length > 0 ? `
              <div style="background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 8px; padding: 15px; margin: 15px 0;">
                <h3>🔴 Immediate Attention Required</h3>
                ${redItems.map(item => `
                  <p><strong>${item.name}</strong><br>
                  ${item.batteryType} batteries • ${item.daysSinceChange} days • ${item.percentUsed}% used</p>
                `).join('')}
              </div>
            ` : ''}

            ${yellowItems.length > 0 ? `
              <div style="background: #FFFBEB; border: 1px solid #FCD34D; border-radius: 8px; padding: 15px; margin: 15px 0;">
                <h3>⚠️ Check Soon</h3>
                ${yellowItems.map(item => `
                  <p><strong>${item.name}</strong><br>
                  ${item.batteryType} batteries • ${item.daysSinceChange} days • ${item.percentUsed}% used</p>
                `).join('')}
              </div>
            ` : ''}

            <p style="text-align: center; margin: 30px 0;">
              <a href="https://voltahome.app/dashboard" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Open VoltaHome Dashboard
              </a>
            </p>
          </div>
        `;

        const emailSubject = redItems.length > 0 
          ? `🔴 VoltaHome Alert: ${redItems.length} device(s) need immediate battery replacement`
          : `⚠️ VoltaHome: ${yellowItems.length} device(s) may need battery replacement soon`;

        console.log(`📤 Attempting to send email to: ${user.email}`);
        console.log(`📋 Subject: ${emailSubject}`);

        // Send email via Resend
        const { data, error } = await resend.emails.send({
          from: 'VoltaHome <onboarding@resend.dev>', // Using Resend's default domain for testing
          to: user.email,
          subject: emailSubject,
          html: emailHtml,
        });

        if (error) {
          console.error(`❌ Resend error:`, error);
          emailResults.push({ email: user.email, success: false, error: error.message });
        } else {
          console.log(`✅ Email sent successfully to ${user.email}`);
          console.log(`📬 Resend email ID: ${data?.id}`);
          emailsSent++;
          emailResults.push({ email: user.email, success: true, emailId: data?.id });
        }

      } catch (error) {
        console.error(`💥 Error processing user ${userId}:`, error);
        emailResults.push({ userId, success: false, error: error.message });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Simplified test complete. ${emailsSent} emails sent.`,
      emailsSent,
      usersChecked: userNotifications.size,
      results: emailResults,
      debug: {
        totalItems: allItems.length,
        itemsNeedingNotification: Array.from(userNotifications.values()).flat().length
      }
    });

  } catch (error) {
    console.error("Error in simplified notification system:", error);
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}