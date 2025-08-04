import {userController} from "../server.ts";
import asyncHandler from "express-async-handler"
import express from "express";

export const userRouter = express.Router()


userRouter.get('/', asyncHandler((req, res) => {
    if(req.query.userId) userController.getUser(req, res)
    else userController.getAllUsers(req, res);
}))

userRouter.post('/',asyncHandler(async (req, res) => {
    await userController.addUser(req, res);
}))

userRouter.delete('/', asyncHandler(async (req, res) => {
    await userController.removeUser(req, res);
}))

userRouter.put('/', asyncHandler(async (req, res) => {
    await userController.updateUser(req, res);
}))



