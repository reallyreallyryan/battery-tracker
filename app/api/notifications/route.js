// Create new file: /app/api/notifications/route.js

import { NextResponse } from "next/server";
import { Resend } from "resend";
import clientPromise from "@/libs/mongo";

const resend = new Resend(process.env.RESEND_API_KEY);

// GET - Check all users and send battery notifications
export async function GET() {
  try {
    console.log("🔔 Starting battery notification check...");

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const itemsCollection = db.collection("batteryItems");
    const usersCollection = db.collection("users");
    const notificationsCollection = db.collection("notifications");

    // Get all battery items that need attention (warning or replace status)
    const allItems = await itemsCollection.find({}).toArray();
    
    // Group items by user and calculate status
    const userNotifications = new Map();

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

      // Only notify for warning or replace status
      if (status === "warning" || status === "replace") {
        // Check if we've already sent this notification recently
        const recentNotification = await notificationsCollection.findOne({
          userId: item.userId,
          itemId: item._id.toString(),
          status: status,
          sentAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
        });

        if (!recentNotification) {
          // Add to notifications map
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
    }

    let emailsSent = 0;

    // Send notifications to each user
    for (const [userId, items] of userNotifications) {
      try {
        // Get user email
        const user = await usersCollection.findOne({ _id: userId });
        if (!user?.email) continue;

        // Separate red and yellow items
        const redItems = items.filter(item => item.status === "replace");
        const yellowItems = items.filter(item => item.status === "warning");

        // Create email content
        const emailHtml = createNotificationEmail(user.email, redItems, yellowItems);
        const emailSubject = redItems.length > 0 
          ? `🔴 VoltaHome Alert: ${redItems.length} device(s) need immediate battery replacement`
          : `⚠️ VoltaHome: ${yellowItems.length} device(s) may need battery replacement soon`;

        // Send email via Resend
        const { data, error } = await resend.emails.send({
          from: 'VoltaHome <notifications@voltahome.app>',
          to: user.email,
          subject: emailSubject,
          html: emailHtml,
        });

        if (error) {
          console.error(`Failed to send email to ${user.email}:`, error);
          continue;
        }

        console.log(`✅ Email sent to ${user.email}`);
        emailsSent++;

        // Record notifications to prevent spam
        for (const item of items) {
          await notificationsCollection.insertOne({
            userId: item.userId,
            itemId: item._id.toString(),
            status: item.status,
            sentAt: new Date(),
            emailId: data?.id
          });
        }

      } catch (error) {
        console.error(`Error sending notification to user ${userId}:`, error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Notification check complete. ${emailsSent} emails sent.`,
      emailsSent,
      usersChecked: userNotifications.size
    });

  } catch (error) {
    console.error("Error in notification system:", error);
    return NextResponse.json(
      { error: "Failed to process notifications" },
      { status: 500 }
    );
  }
}

// Helper function to create notification email HTML
function createNotificationEmail(userEmail, redItems, yellowItems) {
  const hasRed = redItems.length > 0;
  const hasYellow = yellowItems.length > 0;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>VoltaHome Battery Alert</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #4F46E5; }
        .alert-red { background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 8px; padding: 15px; margin: 15px 0; }
        .alert-yellow { background: #FFFBEB; border: 1px solid #FCD34D; border-radius: 8px; padding: 15px; margin: 15px 0; }
        .device { margin: 10px 0; padding: 10px; background: white; border-radius: 6px; }
        .device-name { font-weight: bold; }
        .device-info { font-size: 14px; color: #666; }
        .cta { text-align: center; margin: 30px 0; }
        .button { background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">⚡ VoltaHome</div>
          <h2>Battery Status Alert</h2>
        </div>

        ${hasRed ? `
        <div class="alert-red">
          <h3>🔴 Immediate Attention Required</h3>
          <p>These devices need battery replacement now:</p>
          ${redItems.map(item => `
            <div class="device">
              <div class="device-name">${item.name}</div>
              <div class="device-info">
                ${item.batteryType} batteries • ${item.daysSinceChange} days since last change • ${item.percentUsed}% used
              </div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${hasYellow ? `
        <div class="alert-yellow">
          <h3>⚠️ Check Soon</h3>
          <p>These devices may need battery replacement in the near future:</p>
          ${yellowItems.map(item => `
            <div class="device">
              <div class="device-name">${item.name}</div>
              <div class="device-info">
                ${item.batteryType} batteries • ${item.daysSinceChange} days since last change • ${item.percentUsed}% used
              </div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <div class="cta">
          <a href="https://voltahome.app/dashboard" class="button">
            Open VoltaHome Dashboard
          </a>
        </div>

        <div class="footer">
          <p>Stay powered and safe with VoltaHome</p>
          <p>You're receiving this because you have devices tracked in VoltaHome.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// POST - Manual trigger for testing notifications
export async function POST() {
  try {
    // Just call the GET method for manual testing
    return await GET();
  } catch (error) {
    console.error("Error in manual notification trigger:", error);
    return NextResponse.json(
      { error: "Failed to trigger notifications" },
      { status: 500 }
    );
  }
}