import {getAllUsers , findUserById , deleteUser , addUser , updateUser} from "../Controllers/user.js";
import express from "express";
import authorize from "../Middlewares/auth.js";

const router = express.Router();

router.get("/", authorize, getAllUsers);
router.get("/:id", authorize, findUserById);
router.delete("/:id", authorize, deleteUser);
router.post("/", authorize, addUser);
router.put("/:id", authorize, updateUser);

export default router;
