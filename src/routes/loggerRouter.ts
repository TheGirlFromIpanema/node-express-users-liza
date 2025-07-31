import express from "express";
import {userController} from "../server.ts";


export const loggerRouter = express.Router()


loggerRouter.get('/', (req, res) => {
    userController.getAllLogs(req, res)
})
