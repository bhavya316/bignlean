  // const User = require("../model/user");
  // const Refer = require("../model/refer");
  // const { createUniqueReferCode } = require("../../utils/functions");
  // const Transaction = require("../model/transaction");
  // const Subscription = require("../model/subscription");
  // const admin = require("../../config/firebaseAdmin");
  // const sequelize = require("../../config/database"); // Add this line
  // const Sequelize = require("sequelize");
  // const axios = require('axios');
  // // Helper to generate a 6-digit OTP
  // const generateOtp = () => {
  //   return Math.floor(1000 + Math.random() * 9000).toString();
  // };
  // const sendSmsOtp = async (phone, otp) => {
  //   // Always log for debugging
  //   console.log(`[OTP DEBUG] Phone: ${phone}, OTP: ${otp}`);
    
  //   // Skip SMS sending in development mode
  //   if (process.env.NODE_ENV === 'development') {
  //     console.log(`[DEV MODE] SMS sending bypassed. Use OTP: ${otp}`);
  //     return true;
  //   }

  //   // Format phone number (ensure it doesn't have +91 prefix for consistency)
  //   const formattedPhone = phone.toString().replace(/^\+91/, '');
    
  //   try {
  //     // Use 2Factor directly
  //     const result = await send2FactorOtp(formattedPhone, otp);
  //     if (result) {
  //       console.log(`SMS sent via 2Factor to ${formattedPhone}`);
  //       return true;
  //     }
      
  //     console.error("Failed to send OTP via 2Factor");
  //     return false;
  //   } catch (error) {
  //     console.error("Error sending OTP:", error);
  //     return process.env.NODE_ENV === 'development' || false;
  //   }
  // };


  // // Helper function to get device token for a phone number
  // // You need to track device tokens in your database
  // async function getDeviceTokenForPhone(phone) {
  //   // This is just a placeholder - you'll need to implement this
  //   // by storing device tokens when users log in from the app
  //   const user = await User.findOne({ 
  //     where: { phone }, 
  //     include: [{ model: DeviceToken }] // You would need a DeviceToken model
  //   });
    
  //   return user?.deviceToken?.token || null;
  // }

  // const send2FactorOtp = async (phone, otp) => {
  //   try {
  //     const apiKey = process.env.TWOFACTOR_API_KEY || "627c677a-29a7-11f0-8b17-0200cd936042";
  //     const response = await axios.get(
  //       `https://2factor.in/API/V1/${apiKey}/SMS/${phone}/${otp}/BGNLOTP`
  //     );
  //     return response.data.Status === "Success";
  //   } catch (error) {
  //     console.error("Error sending OTP via 2Factor:", error);
  //     return false;
  //   }
  // };
  // // const createUser = async (req, res) => {
  // //   const { phone, referCode } = req.body;
  // //   try {
  // //     const existingUser = await User.findOne({ where: { phone } });
  // //     if (existingUser) {
  // //       // Generate a new OTP for existing users too
  // //       const otp = generateOtp();
  // //       const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  // //       await existingUser.update({ otp, otpExpiry });
        
  // //       // Send the OTP - this was missing
  // //       await sendSmsOtp(phone, otp);
        
  // //       const walletBalance = await Transaction.calculateFinalValueForUser(existingUser.id);
  // //       return res.status(200).json({
  // //         status: true,
  // //         message: "OTP sent to your phone number.",
  // //         user: existingUser,
  // //         walletBalance,
  // //       });
  // //     }
      
  // //     // Rest of the code for new user creation...
  // //     let referBy = 0;
  // //     if (referCode) {
  // //       // ...existing code
  // //     }
      
  // //     // Generate OTP and expiry (5 minutes)
  // //     const otp = generateOtp();
  // //     const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  // //     const newUser = await User.create({
  // //       ...req.body,
  // //       referCode: await createUniqueReferCode(),
  // //       otp,
  // //       otpExpiry,
  // //     });
      
  // //     if (referCode) {
  // //       await Refer.create({ referTo: newUser.id, referBy });
  // //     }
      
  // //     // Send the OTP - this was missing
  // //     await sendSmsOtp(phone, otp);
      
  // //     res.status(201).json({
  // //       status: true,
  // //       message: "OTP sent to your phone number. Please verify OTP to complete registration.",
  // //       user: newUser,
  // //     });
  // //   } catch (error) {
  // //     // ...existing error handling
  // //   }
  // // };

  // const createUser = async (req, res) => {
  //   const { phone, referCode } = req.body;
  //   try {
  //     const existingUser = await User.findOne({ where: { phone } });
  //     if (existingUser) {
  //       const otp = generateOtp();
  //       const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  //       await existingUser.update({ otp, otpExpiry });
        
  //       await sendSmsOtp(phone, otp);
        
  //       const walletBalance = await Transaction.calculateFinalValueForUser(existingUser.id);
  //       return res.status(200).json({
  //         status: true,
  //         message: "OTP sent to your phone number.",
  //         user: existingUser,
  //         walletBalance,
  //       });
  //     }
      
  //     let referBy = 0;
  //     if (referCode) {
  //       // ...existing code
  //     }
      
  //     const otp = generateOtp();
  //     const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  //     const newUser = await User.create({
  //       ...req.body,
  //       referCode: await createUniqueReferCode(),
  //       otp,
  //       otpExpiry,
  //     });
      
  //     if (referCode) {
  //       await Refer.create({ referTo: newUser.id, referBy });
  //     }
      
  //     await sendSmsOtp(phone, otp);
      
  //     res.status(201).json({
  //       status: true,
  //       message: "OTP sent to your phone number. Please verify OTP to complete registration.",
  //       user: newUser,
  //     });
  //   } catch (error) {
  //     // ...existing error handling
  //   }
  // };

  // const sendLoginOtp = async (req, res) => {
  //   const { phone } = req.body;
  //   try {
  //     const user = await User.findOne({ where: { phone } });
  //     if (!user) {
  //       return res.status(404).json({ status: false, message: "User not registered" });
  //     }
      
  //     // Generate a new OTP and update the user record
  //     const newOtp = generateOtp();
  //     const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  //     await user.update({ otp: newOtp, otpExpiry });
      
  //     // Send the OTP - this was missing
  //     await sendSmsOtp(phone, newOtp);
      
  //     res.status(200).json({
  //       status: true,
  //       message: "OTP sent to your phone number for login.",
  //       user,
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       status: false,
  //       message: "Unable to send OTP",
  //       error: error.message,
  //     });
  //   }
  // };


  // const verifyOtp = async (req, res) => {
  //   const { phone, otp } = req.body;
  //   try {
  //     const user = await User.findOne({ where: { phone } });
  //     if (!user) {
  //       return res.status(404).json({ status: false, message: "User not found" });
  //     }
  //     if (user.otp !== otp || user.otpExpiry < new Date()) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "Invalid or expired OTP.",
  //       });
  //     }
  //     // Do not clear OTP; OTP remains until replaced by a new OTP.
  //     const walletBalance = await Transaction.calculateFinalValueForUser(user.id);
  //     res.status(200).json({
  //       status: true,
  //       message: "User registration/login completed successfully.",
  //       user,
  //       walletBalance,
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       status: false,
  //       message: "OTP verification failed",
  //       error: error.message,
  //     });
  //   }
  // };

  // const loginUser = async (req, res) => {
  //   const { phone, otp } = req.body;
  //   try {
  //     const user = await User.findOne({ where: { phone } });
  //     if (!user) {
  //       return res.status(404).json({ status: false, message: "User not found" });
  //     }
  //     if (user.otp !== otp || user.otpExpiry < new Date()) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "Invalid or expired OTP.",
  //       });
  //     }
  //     const walletBalance = await Transaction.calculateFinalValueForUser(user.id);
  //     res.status(200).json({
  //       status: true,
  //       message: "Logged in successfully.",
  //       user,
  //       walletBalance,
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       status: false,
  //       message: "Login failed",
  //       error: error.message,
  //     });
  //   }
  // };

  // const updateUser = async (req, res) => {
  //   const { id } = req.params;
  //   try {
  //     const user = await User.findByPk(id);
  //     if (!user) {
  //       return res
  //         .status(404)
  //         .json({ status: false, message: "User not found." });
  //     }
  //     const updatedUser = await user.update(req.body);
  //     res.status(200).json({
  //       status: true,
  //       message: "User details updated successfully.",
  //       user: updatedUser,
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       status: false,
  //       message: "Unable to update user details.",
  //       error: error.message,
  //     });
  //   }
  // };

  // const getAllUsers = async (req, res) => {
  //   try {
  //     const users = await User.findAll({ order: [["createdAt", "DESC"]] });
  //     res.status(200).json({
  //       status: true,
  //       message: "Users retrieved successfully.",
  //       users,
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       status: false,
  //       message: "Unable to retrieve users.",
  //       error: error.message,
  //     });
  //   }
  // };

  // const getUserDetailsById = async (req, res) => {
  //   try {
  //     const id = req.params.id;
  //     const user = await User.findByPk(id);
  //     if (!user) {
  //       return res.status(404).json({ status: false, message: "User not found" });
  //     }
  //     let isPremium = true;
  //     const plan = await Subscription.findOne({ where: { user: id } });
  //     if (!plan) {
  //       isPremium = false;
  //     }
  //     user.isPremium = isPremium;
  //     const newUser = { ...user.toJSON(), isPremium };
  //     res.status(200).json({ status: true, message: "OK", user: newUser });
  //   } catch (e) {
  //     console.log(e);
  //     res.status(500).json({ status: false, message: "Server Error" });
  //   }
  // };
  // // const googleAuth = async (req, res) => {
  // //   const { token } = req.body;
    
  // //   try { 
  // //     // Verify the token with Google
  // //     const googleResponse = await axios.get(
  // //       `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
  // //     );
      
  // //     const { email, name, sub: googleId, picture } = googleResponse.data;
      
  // //     // Check if user exists with this Google ID
  // //     let user = await User.findOne({ where: { googleId } });
      
  // //     if (!user) {
  // //       // Check if user exists with this email
  // //       user = await User.findOne({ where: { email } });
        
  // //       if (user) {
  // //         // Link Google ID to existing account
  // //         await user.update({ googleId, image: user.image || picture });
  // //       } else {
  // //         // Create a new user
  // //         user = await User.create({
  // //           name,
  // //           email,
  // //           googleId,
  // //           image: picture,
  // //           phone: "", // Generate a placeholder or ask for phone later
  // //           referCode: await createUniqueReferCode(),
  // //         });
  // //       }
  // //     }
      
  // //     const walletBalance = await Transaction.calculateFinalValueForUser(user.id);
      
  // //     return res.status(200).json({
  // //       status: true,
  // //       message: "Google authentication successful",
  // //       user,
  // //       walletBalance,
  // //     });
  // //   } catch (error) {
  // //     console.error("Google auth error:", error);
  // //     return res.status(400).json({
  // //       status: false,
  // //       message: "Google authentication failed",
  // //       error: error.message,
  // //     });
  // //   }
  // // };

  // // // Facebook Authentication
  // // const facebookAuth = async (req, res) => {
  // //   const { userId, accessToken } = req.body;
    
  // //   try {
  // //     // Verify the token with Facebook
  // //     const facebookResponse = await axios.get(
  // //       `https://graph.facebook.com/v13.0/${userId}?fields=id,name,email,picture&access_token=${accessToken}`
  // //     );
      
  // //     const { id: facebookId, name, email, picture } = facebookResponse.data;
      
  // //     // Check if user exists with this Facebook ID
  // //     let user = await User.findOne({ where: { facebookId } });
      
  // //     if (!user) {
  // //       // Check if user exists with this email (if email is provided)
  // //       if (email) {
  // //         user = await User.findOne({ where: { email } });
  // //       }
        
  // //       if (user) {
  // //         // Link Facebook ID to existing account
  // //         await user.update({ 
  // //           facebookId, 
  // //           image: user.image || (picture?.data?.url || null)
  // //         });
  // //       } else {
  // //         // Create a new user
  // //         user = await User.create({
  // //           name,
  // //           email: email || "",
  // //           facebookId,
  // //           image: picture?.data?.url || null,
  // //           phone: "", // Generate a placeholder or ask for phone later
  // //           referCode: await createUniqueReferCode(),
  // //         });
  // //       }
  // //     }
      
  // //     const walletBalance = await Transaction.calculateFinalValueForUser(user.id);
      
  // //     return res.status(200).json({
  // //       status: true,
  // //       message: "Facebook authentication successful",
  // //       user,
  // //       walletBalance,
  // //     });
  // //   } catch (error) {
  // //     console.error("Facebook auth error:", error);
  // //     return res.status(400).json({
  // //       status: false,
  // //       message: "Facebook authentication failed",
  // //       error: error.message,
  // //     });
  // //   }
  // // };

  // const verifyFirebaseToken = async (req, res) => {
  //   // Development/testing bypass
  //   if (process.env.NODE_ENV === 'development' && req.body.testMode === true) {
  //     console.log("[DEV MODE] Firebase token verification bypassed");
      
  //     // Use test phone from request or default
  //     const phone = req.body.phone;
  //     const firebaseUid = `test-uid-${Date.now()}`;
      
  //     // Look for existing user by phone
  //     let user = await User.findOne({ where: { phone } });
      
  //     if (user) {
  //       // Update Firebase UID if needed
  //       if (!user.firebaseUid) {
  //         await user.update({ firebaseUid });
  //       }
  //     } else {
  //       // Create new test user
  //       user = await User.create({
  //         phone,
  //         firebaseUid,
  //         name: req.body.name || 'Test User',
  //         email: req.body.email || null,
  //         referCode: await createUniqueReferCode(),
  //       });
  //     }
      
  //     // Get wallet balance
  //     const walletBalance = await Transaction.calculateFinalValueForUser(user.id);
      
  //     return res.status(200).json({
  //       status: true,
  //       message: "Test authentication successful",
  //       user,
  //       walletBalance,
  //     });
  //   }
    
  //   // Normal token verification (existing code)
  //   const { idToken } = req.body;
    
  //   if (!idToken) {
  //     return res.status(400).json({ 
  //       status: false, 
  //       message: "Firebase ID token is required" 
  //     });
  //   }
    
  //   try {
  //     // Verify the Firebase ID token
  //     const decodedToken = await admin.auth().verifyIdToken(idToken);
  //     const firebaseUid = decodedToken.uid;
  //     const phone = decodedToken.phone_number;
      
  //     if (!phone) {
  //       return res.status(400).json({ 
  //         status: false, 
  //         message: "Phone number not found in token" 
  //       });
  //     }
      
  //     // Format phone number (remove +91 prefix if present)
  //     const formattedPhone = phone.replace(/^\+91/, '');
      
  //     // Look for existing user by phone
  //     let user = await User.findOne({ where: { phone: formattedPhone } });
      
  //     if (user) {
  //       // User exists, add firebaseUid if needed
  //       if (!user.firebaseUid) {
  //         await user.update({ firebaseUid });
  //       }
  //     } else {
  //       // Create new user
  //       const { name, email } = req.body;
  //       user = await User.create({
  //         phone: formattedPhone,
  //         firebaseUid,
  //         name: name || null,
  //         email: email || null,
  //         referCode: await createUniqueReferCode(),
  //       });
  //     }
      
  //     // Get wallet balance
  //     const walletBalance = await Transaction.calculateFinalValueForUser(user.id);
      
  //     res.status(200).json({
  //       status: true,
  //       message: "Authentication successful",
  //       user,
  //       walletBalance,
  //     });
  //   } catch (error) {
  //     console.error("Firebase verification error:", error);
  //     res.status(401).json({
  //       status: false,
  //       message: "Authentication failed",
  //       error: error.message
  //     });
  //   }
  // };
  // const socialAuth = async (req, res) => {
  //   const { idToken, provider } = req.body;
    
  //   if (!idToken || !provider) {
  //     return res.status(400).json({ 
  //       status: false, 
  //       message: "ID token and provider are required" 
  //     });
  //   }
    
  //   try {
  //     // Verify the Firebase ID token
  //     const decodedToken = await admin.auth().verifyIdToken(idToken);
  //     const firebaseUid = decodedToken.uid;
  //     const email = decodedToken.email;
  //     const name = decodedToken.name || req.body.name;
  //     const picture = decodedToken.picture;
      
  //     // Check authentication provider
  //     const providerId = decodedToken.firebase.sign_in_provider;
  //     if (providerId !== `${provider}.com`) {
  //       return res.status(400).json({ 
  //         status: false, 
  //         message: `Token is not from ${provider}` 
  //       });
  //     }
      
  //     // Try to find user by firebaseUid first
  //     let user;
  //     try {
  //       user = await User.findOne({ where: { firebaseUid } });
  //     } catch (dbError) {
  //       console.log("Database schema issue, attempting fallback query:", dbError.message);
        
  //       const [users] = await sequelize.query(
  //         `SELECT id, name, email, phone, image, firebaseUid 
  //          FROM users 
  //          WHERE firebaseUid = ?`,
  //         { 
  //           replacements: [firebaseUid],
  //           type: sequelize.QueryTypes.SELECT
  //         }
  //       );
        
  //       user = users && users.length > 0 ? users[0] : null;
  //     }
      
  //     // If user not found by firebaseUid, try by email
  //     if (!user && email) {
  //       try {
  //         user = await User.findOne({ where: { email } });
  //       } catch (dbError) {
  //         console.log("Trying fallback email query:", dbError.message);
          
  //         const [users] = await sequelize.query(
  //           `SELECT id, name, email, phone, image, firebaseUid 
  //            FROM users 
  //            WHERE email = ?`,
  //           { 
  //             replacements: [email],
  //             type: sequelize.QueryTypes.SELECT
  //           }
  //         );
          
  //         user = users && users.length > 0 ? users[0] : null;
  //       }
  //     }
      
  //     if (user) {
  //       // User exists, update
  //       try {
  //         await sequelize.query(
  //           `UPDATE users 
  //            SET firebaseUid = ?, 
  //                name = CASE WHEN name IS NULL OR name = '' THEN ? ELSE name END,
  //                image = CASE WHEN image IS NULL OR image = '' THEN ? ELSE image END
  //            WHERE id = ?`,
  //           { 
  //             replacements: [firebaseUid, name, picture, user.id] 
  //           }
  //         );
          
  //         // Get updated user
  //         const [updatedUsers] = await sequelize.query(
  //           `SELECT * FROM users WHERE id = ?`,
  //           { 
  //             replacements: [user.id],
  //             type: sequelize.QueryTypes.SELECT
  //           }
  //         );
          
  //         user = updatedUsers[0];
  //       } catch (updateError) {
  //         console.error("Error updating user:", updateError);
  //         // Continue with existing user data if update fails
  //       }
  //     } else {
  //       // Create new user with basic fields
  //       try {
  //         const referCode = await createUniqueReferCode();
          
  //         // Generate a unique temporary phone number for social logins
  //         // Format: SOCIAL-{provider first letter}-{timestamp}
  //         const tempPhone = `SOCIAL-${provider.charAt(0).toUpperCase()}-${Date.now()}`;
          
  //         const [result] = await sequelize.query(
  //           `INSERT INTO users (name, email, firebaseUid, image, referCode, phone, createdAt, updatedAt)
  //            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
  //           { 
  //             replacements: [name, email, firebaseUid, picture, referCode, 
  //              req.body.phone || tempPhone] // Use provided phone or generated one
  //           }
  //         );
          
  //         const userId = result;
          
  //         const [newUsers] = await sequelize.query(
  //           `SELECT * FROM users WHERE id = ?`,
  //           { 
  //             replacements: [userId],
  //             type: sequelize.QueryTypes.SELECT
  //           }
  //         );
          
  //         user = newUsers[0];
  //       } catch (createError) {
  //         console.error("Error creating user:", createError);
  //         return res.status(500).json({
  //           status: false,
  //           message: "Failed to create user account",
  //           error: createError.message
  //         });
  //       }
  //     }
      
  //     // Calculate wallet balance
  //     let walletBalance = 0;
  //     try {
  //       walletBalance = await Transaction.calculateFinalValueForUser(user.id);
  //     } catch (err) {
  //       console.error("Error calculating wallet balance:", err);
  //     }
      
  //     res.status(200).json({
  //       status: true,
  //       message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication successful`,
  //       user,
  //       walletBalance,
  //     });
  //   } catch (error) {
  //     console.error(`${provider} auth error:`, error);
  //     res.status(401).json({
  //       status: false,
  //       message: "Authentication failed",
  //       error: error.message
  //     });
  //   }
  // };

  // const blockUser = async (req, res) => {
  //   const { id } = req.params;
  //   const { isBlocked } = req.body;

  //   try {
  //     const user = await User.findByPk(id);
  //     if (!user) {
  //       return res.status(404).json({ status: false, message: "User not found." });
  //     }

  //     // Check if user is already in the desired state
  //     if (user.isBlocked === isBlocked) {
  //       return res.status(400).json({
  //         status: false,
  //         message: `User is already ${isBlocked ? 'blocked' : 'unblocked'}.`,
  //       });
  //     }

  //     // Update user's block status
  //     await user.update({ isBlocked });

  //     // Optionally, invalidate any active sessions or tokens
  //     // This could involve updating OTP or Firebase tokens
  //     if (isBlocked) {
  //       await user.update({ 
  //         otp: null,
  //         otpExpiry: null,
  //         firebaseUid: null // This will force re-authentication
  //       });
  //     }

  //     res.status(200).json({
  //       status: true,
  //       message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully.`,
  //       user: {
  //         id: user.id,
  //         phone: user.phone,
  //         name: user.name,
  //         email: user.email,
  //         isBlocked: user.isBlocked
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error blocking/unblocking user:", error);
  //     res.status(400).json({
  //       status: false,
  //       message: "Unable to update user block status.",
  //       error: error.message,
  //     });
  //   }
  // };

  // module.exports = {
  //   createUser,
  //   sendLoginOtp,
  //   verifyOtp,
  //   loginUser,
  //   updateUser,
  //   getAllUsers,
  //   getUserDetailsById,
  //   verifyFirebaseToken,
  //   socialAuth, 
  //   blockUser,
  //   // googleAuth,     // Add this
  //   // facebookAuth,
  // };

  const { DataTypes, Sequelize } = require("sequelize");
  const { User, Order, Refer, Transaction, Subscription } = require("../model/index"); // Import from models/index.js
  const { createUniqueReferCode } = require("../../utils/functions");
  const admin = require("../../config/firebaseAdmin");
  const sequelize = require("../../config/database");
  const axios = require('axios');

  // Helper to generate a 6-digit OTP
  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const sendSmsOtp = async (phone, otp) => {
    console.log(`[OTP DEBUG] Phone: ${phone}, OTP: ${otp}`);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV MODE] SMS sending bypassed. Use OTP: ${otp}`);
      return true;
    }

    const formattedPhone = phone.toString().replace(/^\+91/, '');
    
    try {
      const result = await send2FactorOtp(formattedPhone, otp);
      if (result) {
        console.log(`SMS sent via 2Factor to ${formattedPhone}`);
        return true;
      }
      
      console.error("Failed to send OTP via 2Factor");
      return false;
    } catch (error) {
      console.error("Error sending OTP:", error);
      return process.env.NODE_ENV === 'development' || false;
    }
  };

  async function getDeviceTokenForPhone(phone) {
    const user = await User.findOne({ 
      where: { phone }, 
      include: [{ model: DeviceToken }]
    });
    
    return user?.deviceToken?.token || null;
  }

  const send2FactorOtp = async (phone, otp) => {
    try {
      const apiKey = process.env.TWOFACTOR_API_KEY || "627c677a-29a7-11f0-8b17-0200cd936042";
      const response = await axios.get(
        `https://2factor.in/API/V1/${apiKey}/SMS/${phone}/${otp}/BGNLOTP`
      );
      return response.data.Status === "Success";
    } catch (error) {
      console.error("Error sending OTP via 2Factor:", error);
      return false;
    }
  };

  const createUser = async (req, res) => {
    const { phone, referCode } = req.body;
    try {
      const existingUser = await User.findOne({ where: { phone } });
      if (existingUser) {
        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await existingUser.update({ otp, otpExpiry });
        
        await sendSmsOtp(phone, otp);
        
        const walletBalance = await Transaction.calculateFinalValueForUser(existingUser.id);
        return res.status(200).json({
          status: true,
          message: "OTP sent to your phone number.",
          user: existingUser,
          walletBalance,
        });
      }
      
      let referBy = 0;
      if (referCode) {
        const referUser = await User.findOne({ where: { referCode } });
        if (!referUser) {
          return res.status(400).json({ status: false, message: "Invalid referral code." });
        }
        referBy = referUser.id;
      }
      
      const otp = generateOtp();
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
      const newUser = await User.create({
        ...req.body,
        referCode: await createUniqueReferCode(),
        otp,
        otpExpiry,
      });
      
      if (referCode) {
        await Refer.create({ referTo: newUser.id, referBy });
      }
      
      await sendSmsOtp(phone, otp);
      
      res.status(201).json({
        status: true,
        message: "OTP sent to your phone number. Please verify OTP to complete registration.",
        user: newUser,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Unable to create user.",
        error: error.message,
      });
    }
  };

  const sendLoginOtp = async (req, res) => {
    const { phone } = req.body;
    try {
      const user = await User.findOne({ where: { phone } });
      if (!user) {
        return res.status(404).json({ status: false, message: "User not registered" });
      }
      
      const newOtp = generateOtp();
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
      await user.update({ otp: newOtp, otpExpiry });
      
      await sendSmsOtp(phone, newOtp);
      
      res.status(200).json({
        status: true,
        message: "OTP sent to your phone number for login.",
        user,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Unable to send OTP",
        error: error.message,
      });
    }
  };

  const verifyOtp = async (req, res) => {
    const { phone, otp } = req.body;
    try {
      const user = await User.findOne({ where: { phone } });
      if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
      }
      if (user.otp !== otp || user.otpExpiry < new Date()) {
        return res.status(400).json({
          status: false,
          message: "Invalid or expired OTP.",
        });
      }
      const walletBalance = await Transaction.calculateFinalValueForUser(user.id);
      res.status(200).json({
        status: true,
        message: "User registration/login completed successfully.",
        user,
        walletBalance,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "OTP verification failed",
        error: error.message,
      });
    }
  };

  const loginUser = async (req, res) => {
    const { phone, otp } = req.body;
    try {
      const user = await User.findOne({ where: { phone } });
      if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
      }
      if (user.otp !== otp || user.otpExpiry < new Date()) {
        return res.status(400).json({
          status: false,
          message: "Invalid or expired OTP.",
        });
      }
      const walletBalance = await Transaction.calculateFinalValueForUser(user.id);
      res.status(200).json({
        status: true,
        message: "Logged in successfully.",
        user,
        walletBalance,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Login failed",
        error: error.message,
      });
    }
  };

  const updateUser = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found." });
      }
      
      // Prevent updating the primary key if it exists in the body
      const updateData = { ...req.body };
      delete updateData.id;

      const updatedUser = await user.update(updateData);
      res.status(200).json({
        status: true,
        message: "User details updated successfully.",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Update User Error:", error);
      res.status(400).json({
        status: false,
        message: "Unable to update user details.",
        error: error.message,
      });
    }
  };

  const getAllUsers = async (req, res) => {
    try {
      console.log("User associations:", User.associations); // Debug associations
      const users = await User.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Order,
            as: 'orders',
            attributes: [
              'id',
              'product',
              'address',
              'usedCoupon',
              'coupon',
              'couponDiscount',
              'amount',
              'qty',
              'paymentMethod',
              'transactionId',
              'usedBGLCash',
              'bglCash',
              'earnedBglCash',
              'shiping',
              'totalAmount',
              'orderID',
              'trackingID',
              'status',
              'createdAt',
              'updatedAt'
            ]
          }
        ]
      });

      const usersWithOrders = await Promise.all(users.map(async (user) => {
        const userData = user.toJSON();
        const walletBalance = await Transaction.calculateFinalValueForUser(user.id);
        return {
          ...userData,
          bglCash: walletBalance,
          walletBalance,
          orders: userData.orders || []
        };
      }));

      res.status(200).json({
        status: true,
        message: "Users retrieved successfully.",
        users: usersWithOrders,
      });
    } catch (error) {
      console.error("Error retrieving users:", error);
      res.status(400).json({
        status: false,
        message: "Unable to retrieve users.",
        error: error.message,
      });
    }
  };

  const getUserDetailsById = async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
      }
      let isPremium = true;
      const plan = await Subscription.findOne({ where: { user: id } });
      if (!plan) {
        isPremium = false;
      }
      user.isPremium = isPremium;
      const walletBalance = await Transaction.calculateFinalValueForUser(id);
      const newUser = {
        ...user.toJSON(),
        bglCash: walletBalance,
        walletBalance,
        isPremium,
      };
      res.status(200).json({ status: true, message: "OK", user: newUser });
    } catch (e) {
      console.log(e);
      res.status(500).json({ status: false, message: "Server Error" });
    }
  };

  const verifyFirebaseToken = async (req, res) => {
    if (process.env.NODE_ENV === 'development' && req.body.testMode === true) {
      console.log("[DEV MODE] Firebase token verification bypassed");
      
      const phone = req.body.phone;
      const firebaseUid = `test-uid-${Date.now()}`;
      
      let user = await User.findOne({ where: { phone } });
      
      if (user) {
        if (!user.firebaseUid) {
          await user.update({ firebaseUid });
        }
      } else {
        user = await User.create({
          phone,
          firebaseUid,
          name: req.body.name || 'Test User',
          email: req.body.email || null,
          referCode: await createUniqueReferCode(),
        });
      }
      
      const walletBalance = await Transaction.calculateFinalValueForUser(user.id);
      
      return res.status(200).json({
        status: true,
        message: "Test authentication successful",
        user,
        walletBalance,
      });
    }
    
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ 
        status: false, 
        message: "Firebase ID token is required" 
      });
    }
    
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const firebaseUid = decodedToken.uid;
      const phone = decodedToken.phone_number;
      
      if (!phone) {
        return res.status(400).json({ 
          status: false, 
          message: "Phone number not found in token" 
        });
      }
      
      const formattedPhone = phone.replace(/^\+91/, '');
      
      let user = await User.findOne({ where: { phone: formattedPhone } });
      
      if (user) {
        if (!user.firebaseUid) {
          await user.update({ firebaseUid });
        }
      } else {
        const { name, email } = req.body;
        user = await User.create({
          phone: formattedPhone,
          firebaseUid,
          name: name || null,
          email: email || null,
          referCode: await createUniqueReferCode(),
        });
      }
      
      const walletBalance = await Transaction.calculateFinalValueForUser(user.id);
      
      res.status(200).json({
        status: true,
        message: "Authentication successful",
        user,
        walletBalance,
      });
    } catch (error) {
      console.error("Firebase verification error:", error);
      res.status(401).json({
        status: false,
        message: "Authentication failed",
        error: error.message
      });
    }
  };

  const socialAuth = async (req, res) => {
    const { idToken, provider } = req.body;
    
    if (!idToken || !provider) {
      return res.status(400).json({ 
        status: false, 
        message: "ID token and provider are required" 
      });
    }
    
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const firebaseUid = decodedToken.uid;
      const email = decodedToken.email;
      const name = decodedToken.name || req.body.name;
      const picture = decodedToken.picture;
      
      const providerId = decodedToken.firebase.sign_in_provider;
      if (providerId !== `${provider}.com`) {
        return res.status(400).json({ 
          status: false, 
          message: `Token is not from ${provider}` 
        });
      }
      
      let user;
      try {
        user = await User.findOne({ where: { firebaseUid } });
      } catch (dbError) {
        console.log("Database schema issue, attempting fallback query:", dbError.message);
        
        const [users] = await sequelize.query(
          `SELECT id, name, email, phone, image, firebaseUid 
          FROM users 
          WHERE firebaseUid = ?`,
          { 
            replacements: [firebaseUid],
            type: sequelize.QueryTypes.SELECT
          }
        );
        
        user = users && users.length > 0 ? users[0] : null;
      }
      
      if (!user && email) {
        try {
          user = await User.findOne({ where: { email } });
        } catch (dbError) {
          console.log("Trying fallback email query:", dbError.message);
          
          const [users] = await sequelize.query(
            `SELECT id, name, email, phone, image, firebaseUid 
            FROM users 
            WHERE email = ?`,
            { 
              replacements: [email],
              type: sequelize.QueryTypes.SELECT
            }
          );
          
          user = users && users.length > 0 ? users[0] : null;
        }
      }
      
      if (user) {
        try {
          await sequelize.query(
            `UPDATE users 
            SET firebaseUid = ?, 
                name = CASE WHEN name IS NULL OR name = '' THEN ? ELSE name END,
                image = CASE WHEN image IS NULL OR image = '' THEN ? ELSE image END
            WHERE id = ?`,
            { 
              replacements: [firebaseUid, name, picture, user.id] 
            }
          );
          
          const [updatedUsers] = await sequelize.query(
            `SELECT * FROM users WHERE id = ?`,
            { 
              replacements: [user.id],
              type: sequelize.QueryTypes.SELECT
            }
          );
          
          user = updatedUsers[0];
        } catch (updateError) {
          console.error("Error updating user:", updateError);
        }
      } else {
        try {
          const referCode = await createUniqueReferCode();
          const tempPhone = `SOCIAL-${provider.charAt(0).toUpperCase()}-${Date.now()}`;
          
          const [result] = await sequelize.query(
            `INSERT INTO users (name, email, firebaseUid, image, referCode, phone, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            { 
              replacements: [name, email, firebaseUid, picture, referCode, 
              req.body.phone || tempPhone]
            }
          );
          
          const userId = result;
          
          const [newUsers] = await sequelize.query(
            `SELECT * FROM users WHERE id = ?`,
            { 
              replacements: [userId],
              type: sequelize.QueryTypes.SELECT
            }
          );
          
          user = newUsers[0];
        } catch (createError) {
          console.error("Error creating user:", createError);
          return res.status(500).json({
            status: false,
            message: "Failed to create user account",
            error: createError.message
          });
        }
      }
      
      let walletBalance = 0;
      try {
        walletBalance = await Transaction.calculateFinalValueForUser(user.id);
      } catch (err) {
        console.error("Error calculating wallet balance:", err);
      }
      
      res.status(200).json({
        status: true,
        message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication successful`,
        user,
        walletBalance,
      });
    } catch (error) {
      console.error(`${provider} auth error:`, error);
      res.status(401).json({
        status: false,
        message: "Authentication failed",
        error: error.message
      });
    }
  };

  const blockUser = async (req, res) => {
    const { id } = req.params;
    const { isBlocked } = req.body;

    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ status: false, message: "User not found." });
      }

      if (user.isBlocked === isBlocked) {
        return res.status(400).json({
          status: false,
          message: `User is already ${isBlocked ? 'blocked' : 'unblocked'}.`,
        });
      }

      await user.update({ isBlocked });

      if (isBlocked) {
        await user.update({ 
          otp: null,
          otpExpiry: null,
          firebaseUid: null
        });
      }

      res.status(200).json({
        status: true,
        message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully.`,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          email: user.email,
          isBlocked: user.isBlocked
        },
      });
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
      res.status(400).json({
        status: false,
        message: "Unable to update user block status.",
        error: error.message,
      });
    }
  };

  module.exports = {
    createUser,
    sendLoginOtp,
    verifyOtp,
    loginUser,
    updateUser,
    getAllUsers,
    getUserDetailsById,
    verifyFirebaseToken,
    socialAuth, 
    blockUser,
  };
