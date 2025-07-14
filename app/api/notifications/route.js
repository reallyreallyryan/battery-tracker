// Replace your /app/api/notifications/route.js with this universal version

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { ObjectId } from "mongodb";
import clientPromise from "@/libs/mongo";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    console.log("🔔 Starting home maintenance notification check...");

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const itemsCollection = db.collection("batteryItems");
    const usersCollection = db.collection("users");
    const notificationsCollection = db.collection("notifications");

    // Get all maintenance items and calculate status
    const allItems = await itemsCollection.find({}).toArray();
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
        // Check if we've already sent this notification recently (7-day cooldown)
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
        } else {
          console.log(`⏰ Skipping ${item.name} - already notified within 7 days`);
        }
      }
    }

    let emailsSent = 0;
    const emailResults = [];

    // Send notifications to each user
    for (const [userId, items] of userNotifications) {
      try {
        // Get user email - fixed ObjectId lookup
        let user;
        try {
          user = await usersCollection.findOne({ 
            $or: [
              { _id: new ObjectId(userId) },  // Convert string to ObjectId
              { _id: userId },                // Try as-is 
              { _id: userId.toString() }      // Try as string
            ]
          });
        } catch (error) {
          // If ObjectId conversion fails, try string only
          user = await usersCollection.findOne({ _id: userId });
        }

        if (!user?.email) {
          console.log(`❌ No email found for user ${userId}`);
          continue;
        }

        // Separate red and yellow items
        const redItems = items.filter(item => item.status === "replace");
        const yellowItems = items.filter(item => item.status === "warning");

        // Create email content
        const emailHtml = createMaintenanceNotificationEmail(user.email, redItems, yellowItems);
        const emailSubject = createEmailSubject(redItems, yellowItems);

        // Send email via Resend
        const { data, error } = await resend.emails.send({
          from: 'VoltaHome <notifications@voltahome.app>',
          to: user.email,
          subject: emailSubject,
          html: emailHtml,
        });

        if (error) {
          console.error(`Failed to send email to ${user.email}:`, error);
          emailResults.push({ email: user.email, success: false, error: error.message });
          continue;
        }

        console.log(`✅ Email sent to ${user.email}`);
        emailsSent++;
        emailResults.push({ email: user.email, success: true, emailId: data?.id });

        // Record notifications to prevent spam (7-day cooldown)
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
        emailResults.push({ userId, success: false, error: error.message });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Home maintenance check complete. ${emailsSent} emails sent.`,
      emailsSent,
      usersChecked: userNotifications.size,
      results: emailResults
    });

  } catch (error) {
    console.error("Error in maintenance notification system:", error);
    return NextResponse.json(
      { error: "Failed to process notifications" },
      { status: 500 }
    );
  }
}

// Helper function to create smart email subject
function createEmailSubject(redItems, yellowItems) {
  const totalItems = redItems.length + yellowItems.length;
  
  if (redItems.length > 0 && yellowItems.length > 0) {
    return `🏠 VoltaHome Alert: ${redItems.length} urgent + ${yellowItems.length} upcoming maintenance items`;
  } else if (redItems.length > 0) {
    return `🔴 VoltaHome Alert: ${redItems.length} home maintenance item${redItems.length > 1 ? 's' : ''} need immediate attention`;
  } else {
    return `⚠️ VoltaHome: ${yellowItems.length} home maintenance item${yellowItems.length > 1 ? 's' : ''} need attention soon`;
  }
}

// Helper function to get maintenance type display
function getMaintenanceType(item) {
  if (item.category === 'battery' || !item.category) {
    return item.batteryType || item.itemType || 'Unknown';
  }
  return item.maintenanceType || item.itemType || 'Unknown';
}

// Helper function to get category display
function getCategoryDisplay(item) {
  const categories = {
    battery: "🔋 Power & Batteries",
    hvac: "🌬️ HVAC & Air Quality", 
    appliance: "🏠 Appliance Maintenance"
  };
  
  return categories[item.category] || categories.battery;
}

// Helper function to get action verb based on category
function getActionVerb(item) {
  const verbs = {
    battery: "replace batteries",
    hvac: "replace/clean filter", 
    appliance: "service/clean"
  };
  
  return verbs[item.category] || "service";
}

// Helper function to create notification email HTML
function createMaintenanceNotificationEmail(userEmail, redItems, yellowItems) {
  const hasRed = redItems.length > 0;
  const hasYellow = yellowItems.length > 0;
  const totalItems = redItems.length + yellowItems.length;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>VoltaHome Maintenance Alert</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #4F46E5; margin-bottom: 10px; }
        .alert-red { background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 8px; padding: 15px; margin: 15px 0; }
        .alert-yellow { background: #FFFBEB; border: 1px solid #FCD34D; border-radius: 8px; padding: 15px; margin: 15px 0; }
        .device { margin: 10px 0; padding: 12px; background: white; border-radius: 6px; border: 1px solid #E5E5E5; }
        .device-name { font-weight: bold; color: #1F2937; font-size: 16px; }
        .device-category { font-size: 12px; color: #6B7280; text-transform: uppercase; font-weight: 500; margin-bottom: 4px; }
        .device-info { font-size: 14px; color: #6B7280; margin-top: 4px; }
        .device-action { font-size: 13px; color: #059669; font-weight: 500; margin-top: 4px; }
        .cta { text-align: center; margin: 30px 0; }
        .button { 
          background: #4F46E5; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 6px; 
          display: inline-block;
          font-weight: 500;
        }
        .summary { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; color: #9CA3AF; font-size: 12px; margin-top: 30px; border-top: 1px solid #E5E5E5; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">⚡ VoltaHome</div>
        <h2 style="color: #1F2937; margin: 0;">Home Maintenance Alert</h2>
        ${totalItems === 1 ? 
          `<p style="color: #6B7280; margin: 5px 0 0 0;">1 item needs your attention</p>` :
          `<p style="color: #6B7280; margin: 5px 0 0 0;">${totalItems} items need your attention</p>`
        }
      </div>

      ${hasRed ? `
      <div class="alert-red">
        <h3 style="margin-top: 0; color: #DC2626;">🔴 Immediate Attention Required</h3>
        <p style="margin-bottom: 15px;">These items need service right away:</p>
        ${redItems.map(item => `
          <div class="device">
            <div class="device-category">${getCategoryDisplay(item)}</div>
            <div class="device-name">${item.name}</div>
            <div class="device-info">
              ${getMaintenanceType(item)} • ${item.daysSinceChange} days since last service • ${item.percentUsed}% of expected life used
            </div>
            <div class="device-action">→ Recommended: ${getActionVerb(item)}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${hasYellow ? `
      <div class="alert-yellow">
        <h3 style="margin-top: 0; color: #D97706;">⚠️ Service Recommended Soon</h3>
        <p style="margin-bottom: 15px;">These items should be serviced in the near future:</p>
        ${yellowItems.map(item => `
          <div class="device">
            <div class="device-category">${getCategoryDisplay(item)}</div>
            <div class="device-name">${item.name}</div>
            <div class="device-info">
              ${getMaintenanceType(item)} • ${item.daysSinceChange} days since last service • ${item.percentUsed}% of expected life used
            </div>
            <div class="device-action">→ Plan to: ${getActionVerb(item)}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <div class="summary">
        <strong>💡 Why This Matters:</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Safety:</strong> Keep smoke detectors and safety devices functional</li>
          <li><strong>Efficiency:</strong> Clean filters improve air quality and reduce energy costs</li>
          <li><strong>Prevention:</strong> Regular maintenance prevents expensive repairs</li>
          <li><strong>Peace of Mind:</strong> Stay ahead of problems before they happen</li>
        </ul>
      </div>

      <div class="cta">
        <a href="https://voltahome.app/dashboard" class="button">
          Open VoltaHome Dashboard
        </a>
      </div>

      <div class="footer">
        <p><strong>VoltaHome</strong> - Keep your home powered, clean, and safe</p>
        <p>You're receiving this because you have home maintenance items that need attention.</p>
        <p style="margin-top: 10px;">
          <a href="https://voltahome.app" style="color: #6B7280; text-decoration: none;">Visit VoltaHome</a>
        </p>
      </div>
    </body>
    </html>
  `;
}

// POST - Manual trigger for testing notifications
export async function POST() {
  try {
    return await GET();
  } catch (error) {
    console.error("Error in manual notification trigger:", error);
    return NextResponse.json(
      { error: "Failed to trigger notifications" },
      { status: 500 }
    );
  }
}