import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import generateTokens from '../utils/generateTokens.js';
import setTokensCookies from '../utils/setTokensCookies.js';



class UserController {
  // User Registration
  static userRegistration = async (req, res) => {
    try {
      // Extract request body parameters
      const { name, email, password, password_confirmation } = req.body;
  
      // Check if all required fields are provided
      if (!name || !email || !password || !password_confirmation) {
        return res.status(400).json({ status: "failed", message: "All fields are required" });
      }
  
      // Check if password and password_confirmation match
      if (password !== password_confirmation) {
        return res.status(400).json({ status: "failed", message: "Password and Confirm Password don't match" });
      }
  
      // Check if email already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ status: "failed", message: "Email already exists" });
      }
  
      // Generate salt and hash password
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create new user
      const newUser = await new UserModel({ name, email, password: hashedPassword }).save();
  
      // Send success response
      res.status(201).json({
        status: "success",
        message: "Registration Success",
        user: { id: newUser._id, email: newUser.email }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: "Unable to Register, please try again later" });
    }
  };
  // User Login
  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body
      // Check if email and password are provided
      if (!email || !password) {
        return res.status(400).json({ status: "failed", message: "Email and password are required" });
      }
      // Find user by email
      const user = await UserModel.findOne({ email });

      // Check if user exists
      if (!user) {
        return res.status(404).json({ status: "failed", message: "Invalid Email or Password" });
      }

      // Check if user verified
      // if (!user.is_verified) {
      //   return res.status(401).json({ status: "failed", message: "Your account is not verified" });
      // }

      // Compare passwords / Check Password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ status: "failed", message: "Invalid email or password" });
      }

      // Generate tokens
      const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = await generateTokens(user)

      // Set Cookies
      setTokensCookies(res, accessToken, refreshToken, accessTokenExp, refreshTokenExp)

      // Send success response with tokens
      res.status(200).json({
        user: { id: user._id, email: user.email, name: user.name, roles: user.roles[0] },
        status: "success",
        message: "Login successful",
        access_token: accessToken,
        refresh_token: refreshToken,
        access_token_exp: accessTokenExp,
        is_auth: true
      });


    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: "Unable to login, please try again later" });
    }
  }
  

}

export default UserController