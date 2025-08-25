import express from "express";
import {validateUser , validateExistingUser} from "../Middlewares/Validation.js"
import {signup , login} from "../Controllers/auth.js"

const route = express.Router();

route.post("/register" , validateUser,  signup);
route.post("/login", validateExistingUser, login);

export default route;