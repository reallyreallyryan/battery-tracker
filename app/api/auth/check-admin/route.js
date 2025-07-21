import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

// GET - Check if current user is admin
export async function GET(request) {
  try {
    // Get session directly in the API route (App Router way)
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({
        isAuthenticated: false,
        isAdmin: false,
        user: null
      });
    }
    
    console.log('🔍 Admin check - Session user:', {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name
    });
    
    // Hardcoded admin check for initial setup
    const isHardcodedAdmin = session.user.email === 'nectarstack@gmail.com';
    console.log('🔑 Hardcoded admin check:', {
      userEmail: session.user.email,
      isHardcodedAdmin
    });
    
    // Connect to database and fetch user
    await connectMongo();
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json({
        isAuthenticated: true,
        isAdmin: isHardcodedAdmin,
        user: null
      });
    }
    
    const finalIsAdmin = user.isAdmin === true || isHardcodedAdmin;
    console.log('📊 Final admin result:', {
      dbIsAdmin: user.isAdmin,
      isHardcodedAdmin,
      finalIsAdmin
    });
    
    return NextResponse.json({
      isAuthenticated: true,
      isAdmin: finalIsAdmin,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        isAdmin: finalIsAdmin
      }
    });
    
  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json({
      isAuthenticated: false,
      isAdmin: false,
      user: null
    });
  }
}