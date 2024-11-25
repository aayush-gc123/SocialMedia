import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.utils.js";




// Register user
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "All fields are required",
                success: false
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({
                message: "This email is already registered",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword,
           
        });

        return res.status(201).json({
            message: "Registered successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are required",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect password",
                success: false
            });
        }

        const token = jwt.sign({ userID: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        const populatePost = await Promise.all(          
              user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post.author.equals(user._id)) {
                 return post;   
                }
                return null;
            })
        )
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 })

            .json({
                message: `Welcome back ${user.username}`,
                success: true,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    bio: user.bio,
                    followers: user.followers,
                    following: user.following,
                    posts:populatePost
        
                }
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Logout user
export const logoutUser = async (req, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const userID = req.params.id;
        const user = await User.findById(userID).select('-password');
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Edit user profile
export const editProfile = async (req, res) => {
    try {
        const userID = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;

        let updatedProfilePicture;


    
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            const uploadResult = await cloudinary.uploader.upload(fileUri);
            updatedProfilePicture = uploadResult.secure_url;
        }else{
            console.log("Profile Picture not uploaded")
        }

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (updatedProfilePicture) user.profilePicture = updatedProfilePicture;

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get other users
export const getOtherUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (users.length === 0) {
            return res.status(404).json({
                message: "No users found",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Follow or unfollow user
export const followOrUnfollowUser = async (req, res) => {
    try {
        const userId = req.id;
        const targetUserId = req.params.id;

        if (userId === targetUserId) {
            return res.status(400).json({
                message: "You cannot follow/unfollow yourself",
                success: false
            });
        }

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!user || !targetUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const isFollowing = user.following.includes(targetUserId);

        if (isFollowing) {
            // Unfollow logic
            await Promise.all([
                User.updateOne({ _id: userId }, { $pull: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $pull: { followers: userId } })
            ]);

            return res.status(200).json({
                message: "Unfollowed successfully",
                success: true
            });
        } else {
            // Follow logic
            await Promise.all([
                User.updateOne({ _id: userId }, { $addToSet: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $addToSet: { followers: userId } })
            ]);

            return res.status(200).json({
                message: "Followed successfully",
                success: true
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
