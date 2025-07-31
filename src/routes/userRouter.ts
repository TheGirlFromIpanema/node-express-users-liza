import express from "express";
import {userController} from "../server.ts";

export const userRouter = express.Router()


userRouter.get('/', (req, res) => {
    if(req.query.userId) userController.getUser(req, res)
    else userController.getAllUsers(req, res);
})

userRouter.post('/',async (req, res) => {
    await userController.addUser(req, res);
})

userRouter.delete('/', async (req, res) => {
    await userController.removeUser(req, res);
})

userRouter.put('/', async (req, res) => {
    await userController.updateUser(req, res);
})



