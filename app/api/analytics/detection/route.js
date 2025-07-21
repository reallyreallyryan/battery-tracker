import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import DetectionLog from "@/models/DetectionLog";
import User from "@/models/User";

// POST - Log detection analytics (fire-and-forget)
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Get session but don't require it - we want all data
    const session = await getServerSession(authOptions);
    
    // Connect to MongoDB
    await connectMongo();
    
    // Create log entry with user info if available
    const logEntry = {
      ...body,
      userId: session?.user?.id || null,
      timestamp: new Date(),
      deviceInfo: {
        userAgent: request.headers.get('user-agent') || '',
        isMobile: /mobile/i.test(request.headers.get('user-agent') || '')
      }
    };
    
    // Insert without waiting for result (fire-and-forget)
    DetectionLog.create(logEntry).catch(err => {
      console.error('Analytics logging error:', err);
    });
    
    // Always return success immediately
    return NextResponse.json({ success: true });
    
  } catch (error) {
    // Silently fail - analytics should never impact UX
    console.error('Analytics error:', error);
    return NextResponse.json({ success: false });
  }
}

// GET - Fetch analytics summary (for dashboard) - ADMIN ONLY
export async function GET(request) {
  try {
    // Get session directly (App Router way)
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    // Connect to database and check admin status
    await connectMongo();
    const user = await User.findById(session.user.id);
    
    // Hardcoded admin check + database check
    const isHardcodedAdmin = session.user.email === 'nectarstack@gmail.com';
    const isAdmin = (user?.isAdmin === true) || isHardcodedAdmin;
    
    console.log('📊 Analytics API - Admin check:', {
      userEmail: session.user.email,
      dbIsAdmin: user?.isAdmin,
      isHardcodedAdmin,
      finalIsAdmin: isAdmin
    });
    
    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    
    // Get date range from query params
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Fetch summary statistics
    const [
      totalDetections,
      detectionsByDevice,
      aiAccuracy,
      commonCocoClasses,
      avgInferenceTime
    ] = await Promise.all([
      // Total detections
      DetectionLog.countDocuments({
        timestamp: { $gte: startDate }
      }),
      
      // Detections by device type
      DetectionLog.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $group: {
          _id: '$userSelection.deviceType',
          count: { $sum: 1 },
          label: { $first: '$userSelection.deviceLabel' }
        }},
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      
      // AI accuracy rate
      DetectionLog.aggregate([
        { $match: { 
          timestamp: { $gte: startDate },
          'userSelection.manualEntry': false 
        }},
        { $group: {
          _id: null,
          total: { $sum: 1 },
          matched: { 
            $sum: { $cond: ['$userSelection.aiSuggestionMatched', 1, 0] }
          }
        }}
      ]),
      
      // Most common COCO detections
      DetectionLog.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $unwind: '$cocoDetections' },
        { $group: {
          _id: '$cocoDetections.class',
          count: { $sum: 1 },
          avgScore: { $avg: '$cocoDetections.score' }
        }},
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      
      // Average inference time
      DetectionLog.aggregate([
        { $match: { 
          timestamp: { $gte: startDate },
          'performance.inferenceTime': { $exists: true }
        }},
        { $group: {
          _id: null,
          avgTime: { $avg: '$performance.inferenceTime' }
        }}
      ])
    ]);
    
    // Calculate AI success rate
    const aiSuccessRate = aiAccuracy[0] 
      ? Math.round((aiAccuracy[0].matched / aiAccuracy[0].total) * 100)
      : 0;
    
    return NextResponse.json({
      summary: {
        totalDetections,
        aiSuccessRate,
        avgInferenceTime: Math.round(avgInferenceTime[0]?.avgTime || 0),
        dateRange: `Last ${days} days`
      },
      deviceTypes: detectionsByDevice.map(d => ({
        type: d._id,
        label: d.label || d._id,
        count: d.count
      })),
      cocoClasses: commonCocoClasses.map(c => ({
        class: c._id,
        count: c.count,
        avgConfidence: Math.round(c.avgScore * 100)
      }))
    });
    
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}