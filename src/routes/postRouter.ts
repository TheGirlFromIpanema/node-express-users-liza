import express, {Request, Response, NextFunction} from "express";
import {postController} from "../server.ts";
import {myLogger} from "../utils/logger.ts";
import asyncHandler from "express-async-handler"

export const postRouter = express.Router();

postRouter.use((req:Request, res:Response, next:NextFunction) => {
    myLogger.log(`Request "api/posts${req.url}" was recieved`)
    next();
})
postRouter.use((req:Request, res:Response, next:NextFunction) => {
    myLogger.save(`Request "api/posts${req.url}" was recieved`)
    next();
})


postRouter.get("/", asyncHandler((req, res) => {
    if(req.query.postId) postController.getPostById(req, res)
    postController.getAllPosts(req,res)
}))

postRouter.post("/", async (req, res) => {
    await postController.addPost(req,res)
})

postRouter.put("/", async (req, res) => {
    await postController.updatePost(req,res)
})

postRouter.delete("/", async (req, res) => {
    await postController.removePost(req,res)
})

postRouter.get("/user", (req, res) => {
    postController.getPostsByUserName(req,res)
})