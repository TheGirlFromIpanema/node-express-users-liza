import express from "express";
import {userController} from "../server.ts";
import asyncHandler from "express-async-handler"

export const loggerRouter = express.Router()


loggerRouter.get('/', asyncHandler((req, res) => {
    userController.getAllLogs(req, res)
}))
