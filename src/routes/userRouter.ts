import {userController} from "../server.ts";
import asyncHandler from "express-async-handler"
import express, {RequestHandler} from "express";
import {validate} from "express-validation";
import {userIDQueryValidation} from "../joiSchemas/userSchema.js";

export const userRouter = express.Router()


userRouter.get('/', validate(userIDQueryValidation, {}, {}) as unknown as RequestHandler,
    asyncHandler((req, res) => {
        if (req.query.userId) userController.getUser(req, res)
        else userController.getAllUsers(req, res);
    }))

userRouter.post('/', asyncHandler(async (req, res) => {
    await userController.addUser(req, res);
}))

userRouter.delete('/', asyncHandler(async (req, res) => {
    await userController.removeUser(req, res);
}))

userRouter.put('/', asyncHandler(async (req, res) => {
    await userController.updateUser(req, res);
}))



