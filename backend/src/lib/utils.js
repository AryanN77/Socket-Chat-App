import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
        expiresIn: '4d'
    });

    res.cookie("jwt", token, {
        maxAge: 4 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production" ? true : false
    });

    return token;
}