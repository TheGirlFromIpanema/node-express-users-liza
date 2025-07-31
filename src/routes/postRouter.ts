import express from "express";
import {postController} from "../server.ts";


export const postRouter = express.Router();

postRouter.get("/", (req, res) => {
    if(req.query.postId) postController.getPostById(req, res)
    postController.getAllPosts(req,res)
})

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