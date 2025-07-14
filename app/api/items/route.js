import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import clientPromise from "@/libs/mongo";
import { ObjectId } from "mongodb";

// GET - Fetch all battery items for the current user
export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();    
    const collection = db.collection("batteryItems");

    // Fetch items for this user only
    const items = await collection
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 }) // Most recent first
      .toArray();

// Replace this section in your /app/api/items/route.js

  // Calculate status for each item
  const itemsWithStatus = items.map(item => {
    // Calendar day calculation (instead of exact 24-hour periods)
    const today = new Date();
    const changeDate = new Date(item.dateLastChanged);
    
    // Set both dates to midnight to compare calendar days only
    today.setHours(0, 0, 0, 0);
    changeDate.setHours(0, 0, 0, 0);
    
    const daysSinceChange = Math.floor(
      (today - changeDate) / (1000 * 60 * 60 * 24)
    );
    
    const expectedDuration = item.expectedDuration || 180;
    const percentUsed = (daysSinceChange / expectedDuration) * 100;
    
    let status = "good";
    let statusColor = "green";
    
    if (percentUsed >= 80) {
      status = "replace";
      statusColor = "red";
    } else if (percentUsed >= 50) {
      status = "warning";
      statusColor = "yellow";
    }

    return {
      ...item,
      _id: item._id.toString(),
      daysSinceChange,
      percentUsed: Math.round(percentUsed),
      status,
      statusColor,
    };
  });

    return NextResponse.json({ items: itemsWithStatus });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

// POST - Create a new item (updated to handle categories)
export async function POST(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    const { 
      name, 
      category = 'battery', // Default to battery for backwards compatibility
      batteryType, 
      maintenanceType,
      dateLastChanged, 
      expectedDuration, 
      image 
    } = body;

    // Validate required fields
    if (!name || !dateLastChanged || !image) {
      return NextResponse.json(
        { error: "Missing required fields: name, dateLastChanged, image" },
        { status: 400 }
      );
    }

    // Determine the maintenance type based on category
    let itemType;
    if (category === 'battery') {
      itemType = batteryType || 'Other';
    } else {
      itemType = maintenanceType || 'Other';
    }

    if (!itemType) {
      return NextResponse.json(
        { error: "Missing maintenance/battery type" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("batteryItems"); // Keep same collection name for now

    // Create the item document with new category structure
    const newItem = {
      userId: session.user.id,
      name: name.trim(),
      category: category,
      
      // Store both old and new fields for backwards compatibility
      batteryType: category === 'battery' ? itemType : undefined,
      maintenanceType: category !== 'battery' ? itemType : undefined,
      itemType: itemType, // Unified field for easier querying
      
      dateLastChanged: new Date(dateLastChanged),
      expectedDuration: parseInt(expectedDuration) || 180,
      image, // Base64 image data
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Clean up undefined fields
    Object.keys(newItem).forEach(key => {
      if (newItem[key] === undefined) {
        delete newItem[key];
      }
    });

    // Insert into database
    const result = await collection.insertOne(newItem);

    // Return the created item
    return NextResponse.json({
      success: true,
      item: {
        _id: result.insertedId.toString(),
        ...newItem,
        dateLastChanged: newItem.dateLastChanged.toISOString(),
        createdAt: newItem.createdAt.toISOString(),
        updatedAt: newItem.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}

// PATCH - Update an existing battery item (like "battery changed")
export async function PATCH(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    const { itemId, action, ...updateData } = body;

    if (!itemId) {
      return NextResponse.json(
        { error: "Missing item ID" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("batteryItems");

    let updateFields = { updatedAt: new Date() };

    if (action === "batteryChanged") {
      // Update the date last changed to today
      updateFields.dateLastChanged = new Date();
    } else {
      // General update (name, battery type, etc.)
      Object.assign(updateFields, updateData);
    }

    // Update the item (only if it belongs to this user)
    const result = await collection.updateOne(
      { 
        _id: new ObjectId(itemId),
        userId: session.user.id 
      },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Item not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: action === "batteryChanged" ? "Battery change date updated!" : "Item updated!" 
    });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

// Add this DELETE function to your existing /app/api/items/route.js file
// Place it after your PATCH function

// DELETE - Remove a battery item
export async function DELETE(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body to get itemId
    const body = await request.json();
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json(
        { error: "Missing item ID" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("batteryItems");

    // Delete the item (only if it belongs to this user)
    const result = await collection.deleteOne({
      _id: new ObjectId(itemId),
      userId: session.user.id 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Item not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Device deleted successfully!" 
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}