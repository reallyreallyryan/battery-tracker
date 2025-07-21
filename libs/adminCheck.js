import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

/**
 * Server-side utility to check if the current user is an admin
 * @param {Request} req - Next.js request object (optional)
 * @param {Response} res - Next.js response object (optional)
 * @returns {Promise<{session: Object|null, isAdmin: boolean, user: Object|null}>}
 */
export async function checkAdmin(req = null, res = null) {
  try {
    // Get session
    const session = await getServerSession(req, res, authOptions);
    
    // Not logged in
    if (!session?.user?.id) {
      return {
        session: null,
        isAdmin: false,
        user: null
      };
    }
    
    // Debug session info
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
      return {
        session,
        isAdmin: isHardcodedAdmin,
        user: null
      };
    }
    
    const finalIsAdmin = user.isAdmin === true || isHardcodedAdmin;
    console.log('📊 Final admin result:', {
      dbIsAdmin: user.isAdmin,
      isHardcodedAdmin,
      finalIsAdmin
    });
    
    return {
      session,
      isAdmin: finalIsAdmin,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        isAdmin: finalIsAdmin,
        hasAccess: user.hasAccess
      }
    };
    
  } catch (error) {
    console.error('Admin check error:', error);
    return {
      session: null,
      isAdmin: false,
      user: null
    };
  }
}

/**
 * Middleware-style admin check that returns Next.js response for unauthorized access
 * @param {Request} req - Next.js request object
 * @param {Response} res - Next.js response object
 * @returns {Promise<{isAdmin: boolean, user: Object|null, unauthorizedResponse: Response|null}>}
 */
export async function requireAdmin(req, res) {
  const { session, isAdmin, user } = await checkAdmin(req, res);
  
  if (!session) {
    return {
      isAdmin: false,
      user: null,
      unauthorizedResponse: Response.json(
        { error: "Authentication required" }, 
        { status: 401 }
      )
    };
  }
  
  if (!isAdmin) {
    return {
      isAdmin: false,
      user,
      unauthorizedResponse: Response.json(
        { error: "Admin access required" }, 
        { status: 403 }
      )
    };
  }
  
  return {
    isAdmin: true,
    user,
    unauthorizedResponse: null
  };
}