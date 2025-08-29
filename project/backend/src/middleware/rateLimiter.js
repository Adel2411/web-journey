import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs :15 * 60* 1500,
    max : 15,
    message : "Too many login attempts, please try again later."
})