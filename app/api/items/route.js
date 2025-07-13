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

    // Calculate status for each item
    const itemsWithStatus = items.map(item => {
      const daysSinceChange = Math.floor(
        (new Date() - new Date(item.dateLastChanged)) / (1000 * 60 * 60 * 24)
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

// POST - Create a new battery item
export async function POST(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    const { name, batteryType, dateLastChanged, expectedDuration, image } = body;

    // Validate required fields
    if (!name || !batteryType || !dateLastChanged || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("batteryItems");

    // Create the item document
    const newItem = {
      userId: session.user.id,
      name: name.trim(),
      batteryType,
      dateLastChanged: new Date(dateLastChanged),
      expectedDuration: parseInt(expectedDuration) || 180,
      image, // Base64 image data
      createdAt: new Date(),
      updatedAt: new Date(),
    };

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