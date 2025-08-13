import jwt from "jsonwebtoken";
import userModel from "../models/userModal.js";

const isAuth = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: "Token N/A" });
    };
    try {
        const decodeData = jwt.verify(token, process.env.JWt_TOKEN);
        req.user = await userModel.findById(decodeData._id)
        next();
    } catch (error) {
        console.log("error in isAuth middleware", error);
    }
};

export default isAuth;