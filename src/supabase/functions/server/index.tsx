import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to verify user authentication
async function verifyAuth(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    throw new Error('No access token provided');
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user?.id) {
    throw new Error('Invalid or expired token');
  }
  
  return user;
}

// Health check endpoint
app.get("/make-server-7b6c4629/health", (c) => {
  return c.json({ status: "ok" });
});

// User signup endpoint
app.post("/make-server-7b6c4629/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, mobile, gender } = body;

    if (!email || !password || !name || !mobile || !gender) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, mobile, gender },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true
    });

    if (authError) {
      console.log(`Authorization error during user signup: ${authError.message}`);
      return c.json({ error: authError.message }, 400);
    }

    // Store additional user profile data in KV store
    const userId = authData.user.id;
    const userProfile = {
      id: userId,
      email,
      name,
      mobile,
      gender,
      createdAt: new Date().toISOString()
    };

    await kv.set(`user_profile:${userId}`, userProfile);
    await kv.set(`user_email:${email}`, userId);
    await kv.set(`user_mobile:${mobile}`, userId);

    return c.json({ 
      success: true, 
      user: { 
        id: userId, 
        email, 
        name, 
        mobile, 
        gender 
      } 
    });

  } catch (error) {
    console.log(`Error during user signup: ${error.message}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// User profile update endpoint
app.post("/make-server-7b6c4629/profile", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    const body = await c.req.json();

    // Get existing profile
    const existingProfile = await kv.get(`user_profile:${user.id}`) || {};
    
    // Update profile with new data
    const updatedProfile = {
      ...existingProfile,
      ...body,
      id: user.id,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user_profile:${user.id}`, updatedProfile);

    return c.json({ success: true, profile: updatedProfile });

  } catch (error) {
    console.log(`Authorization error while updating user profile: ${error.message}`);
    return c.json({ error: error.message }, 401);
  }
});

// Get user profile endpoint
app.get("/make-server-7b6c4629/profile", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    const profile = await kv.get(`user_profile:${user.id}`);
    
    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    return c.json({ profile });

  } catch (error) {
    console.log(`Authorization error while fetching user profile: ${error.message}`);
    return c.json({ error: error.message }, 401);
  }
});

// Find matches endpoint
app.post("/make-server-7b6c4629/find-matches", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    const userProfile = await kv.get(`user_profile:${user.id}`);
    
    if (!userProfile) {
      return c.json({ error: "User profile not found" }, 404);
    }

    // Get all user profiles for matching
    const allProfiles = await kv.getByPrefix('user_profile:');
    
    // Filter potential matches (opposite gender, exclude self)
    const oppositeGender = userProfile.gender === 'male' ? 'female' : 'male';
    const potentialMatches = allProfiles.filter(profile => 
      profile.id !== user.id && 
      profile.gender === oppositeGender &&
      profile.age && 
      profile.city
    );

    // Simple matching algorithm based on preferences
    const matches = potentialMatches.filter(match => {
      // Age range matching
      if (userProfile.partnerAgeRange) {
        const [minAge, maxAge] = userProfile.partnerAgeRange;
        const matchAge = parseInt(match.age);
        if (matchAge < minAge || matchAge > maxAge) return false;
      }

      // City matching (optional preference)
      if (userProfile.lookingFor === 'same_city' && match.city !== userProfile.city) {
        return false;
      }

      // Interest matching (basic implementation)
      if (userProfile.partnerInterests && match.interests) {
        const userInterests = userProfile.partnerInterests.toLowerCase();
        const matchInterests = match.interests.map(i => i.toLowerCase()).join(' ');
        const hasCommonInterest = userInterests.split(' ').some(interest => 
          matchInterests.includes(interest)
        );
        if (!hasCommonInterest) return false;
      }

      return true;
    });

    // Shuffle and limit results
    const shuffledMatches = matches.sort(() => Math.random() - 0.5).slice(0, 3);
    
    // Store match results for user
    await kv.set(`user_matches:${user.id}`, {
      matches: shuffledMatches,
      generatedAt: new Date().toISOString()
    });

    return c.json({ 
      success: true, 
      matchCount: shuffledMatches.length,
      matches: shuffledMatches 
    });

  } catch (error) {
    console.log(`Error during match finding: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Get matches endpoint
app.get("/make-server-7b6c4629/matches", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    const matchData = await kv.get(`user_matches:${user.id}`);
    
    if (!matchData) {
      return c.json({ matches: [] });
    }

    return c.json(matchData);

  } catch (error) {
    console.log(`Authorization error while fetching matches: ${error.message}`);
    return c.json({ error: error.message }, 401);
  }
});

// OTP verification simulation endpoint
app.post("/make-server-7b6c4629/verify-otp", async (c) => {
  try {
    const body = await c.req.json();
    const { mobile, otp } = body;

    // For demo purposes, accept any 6-digit OTP
    if (!otp || otp.length !== 6) {
      return c.json({ error: "Invalid OTP format" }, 400);
    }

    // In production, you would verify the actual OTP here
    return c.json({ success: true, verified: true });

  } catch (error) {
    console.log(`Error during OTP verification: ${error.message}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Payment simulation endpoint
app.post("/make-server-7b6c4629/process-payment", async (c) => {
  try {
    const user = await verifyAuth(c.req.raw);
    const body = await c.req.json();
    const { amount, method } = body;

    // Simulate payment processing
    if (amount !== 49) {
      return c.json({ error: "Invalid payment amount" }, 400);
    }

    // Update user profile with payment status
    const profile = await kv.get(`user_profile:${user.id}`) || {};
    profile.hasPaid = true;
    profile.paymentDate = new Date().toISOString();
    profile.paymentAmount = amount;
    profile.paymentMethod = method;

    await kv.set(`user_profile:${user.id}`, profile);

    return c.json({ 
      success: true, 
      paymentId: `pay_${Date.now()}`,
      status: 'completed' 
    });

  } catch (error) {
    console.log(`Error during payment processing: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);