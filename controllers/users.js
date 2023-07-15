import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userDetails from "../models/user.js";

export const signin = async (req, res) => {
    const { email, password } = req.body;
    // const newUser = new userDetails(user);
    try {
        const existingUser = await userDetails.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "user don't exist" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "invalid credentials" })

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" })
        res.status(200).json({ result: existingUser, token })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const signup = async (req, res) => {
    
    console.log("req",req.body)
    const { email, password, fname, lname, confirmPassword } = req.body;
    try {
        const existingUser = await userDetails.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "user already exists" });
        if (password !== confirmPassword) return res.status(400).json({ message: "passwords dont match" });
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await userDetails.create({ email, password: hashedPassword, name: `${fname} ${lname}` })
        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h" })

        res.status(200).json({ result, token })
    } catch (error) {
        res.status(500).json({ message: "something went wrong" })
    }
}