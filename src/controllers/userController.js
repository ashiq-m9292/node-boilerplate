import userModel from "../models/userModal.js";
import cloudinary from "cloudinary";

class userController {

    // registerUser function 
    static registerUser = async (req, res) => {
        try {
            const { name, email, password, readableDate } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ message: "Please fill all the fields" });
            }
            // check if user already exists
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            };

            //    user created successfully    
            const newUser = new userModel({
                name: name,
                email: email,
                password: password,
                readableDate: readableDate
            });
            await newUser.save();
            res.status(201).json({ message: "User registered successfully", user: newUser });
        } catch (error) {
            console.log("error in regiter user controller", error)
        }
    };

    // loginUser function
    static loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Please fill all the fields" });
            }
            // check if user exists
            const existingUser = await userModel.findOne({ email });
            if (!existingUser) {
                return res.status(400).json({ message: "User does not exist" });
            };

            // password compare function
            const isMatch = await existingUser.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            };

            // jwt token function
            const token = await existingUser.jwtToken();
            res.cookie("token", token, {
                httpOnly: true,
                secure: 'true',
                sameSite: 'strict',
                maxAge: 10 * 60 * 1000 // 10 minutes
            }).status(200).json({ message: "User logged in successfully", user: existingUser, token: token });
        } catch (error) {
            console.log("error in login user controller", error);
        }
    };


    // logout User function
    static logoutUser = async (req, res) => {
        try {
            // check user id 
            const userId = await userModel.findById(req.params.id);
            if (!userId) {
                return res.status(404).json({ message: "User not found" });
            };

            if (!req.cookies.token) {
                return res.status(400).json({ message: "No user is logged in" });
            };
            res.cookie("token", "", {
                expires: new Date(0),
            }).status(200).json({ message: "User logout successfully" });
        } catch (error) {
            console.log("error in logout user controller", error);
        }
    };


    // getAll users function
    static getAllUsers = async (req, res) => {
        try {
            const getAll = await userModel.find(req.body);

            // check if any users found
            if (getAll.length === 0) {
                return res.status(404).json({ message: "No users found" });
            }
            res.status(200).json({ message: "Users retrieved successfully", users: getAll });
        } catch (error) {
            console.log("error in get all users controller", error)
        }
    };

    // getSingleUser 
    static getSingleUser = async (req, res) => {
        try {
            const getSingle = await userModel.findById(req.params.id);

            // check if any users found
            if (!getSingle) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({ message: "Users retrieved successfully", users: getSingle });
        } catch (error) {
            console.log("error in get gingle users controller", error)
        }
    }

    // updateUser function
    static updateUser = async (req, res) => {
        try {
            const updateUser = await userModel.findByIdAndUpdate(req.params.id);
            if (!updateUser) {
                return res.status(404).json({ message: "User not found" });
            };
            const { name, email, password } = req.body;
            if (name) updateUser.name = name;
            if (email) updateUser.email = email;
            await updateUser.save();
            res.status(200).json({ message: "User updated successfully", user: updateUser });

        } catch (error) {
            console.log("error in update user controller", error)
        }
    };

    // deleteUser function
    static deleteUser = async (req, res) => {
        try {
            const deleteUser = await userModel.findByIdAndDelete(req.params.id);
            if (!deleteUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.cookie("token", "", {
                expires: new Date(0),
            }).status(200).json({ message: "Users deleted successfully" });
        } catch (error) {
            console.log("error in delete user controller", error)
        }
    };

    // update password function
    static updatePassword = async (req, res) => {
        try {
            const user = await userModel.findById(req.user.id);
            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) {
                return res.json({
                    massage: "please fill all field"
                })
            }
            const isMatch = await user.comparePassword(oldPassword)
            if (!isMatch) {
                return res.json({
                    massage: 'invalid old password'
                })
            }
            user.password = newPassword
            await user.save();
            res.json({
                massage: 'successfully updated',
                user
            })
        } catch (error) {
            console.log(error)
        }
    };

    // update profile picture 
    static updateProfilePicture = async (req, res) => {
        try {
            // check if user exists
            const user = await userModel.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            };
            // check if file is present
            if (!req.file) {
                return res.status(400).json({ message: "Please select a profile picture" });
            }

            // already exist profilePicture
            if (user.profilePicture.public_id) {
                await cloudinary.v2.uploader.destroy(user.profilePicture.public_id);
            }

            // upload image to cloudinary
            const fileBase64 = req.file.buffer.toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${fileBase64}`;
            const cdb = await cloudinary.v2.uploader.upload(dataURI, {
                folder: "profilePicture",
            });
            // update user profile picture
            user.profilePicture = {
                public_id: cdb.public_id,
                url: cdb.secure_url
            }
            await user.save();
            res.status(200).json({ message: "Profile picture updated successfully", user });
        } catch (error) {
            console.log("error in update profile picture controller", error)
        }

    }


}
export default userController;

