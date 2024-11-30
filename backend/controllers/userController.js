import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'

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
  

}

export default UserController