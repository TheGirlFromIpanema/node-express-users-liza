import {PostService} from "../services/posts/PostService.ts";
import {getRandomNumber} from "../utils/tools.ts";
import {myLogger} from "../utils/logger.ts";
import {Post} from "../model/postTypes.ts";
import {Request, Response} from "express";
import {PostDtoSchema} from "../joiSchemas/postSchema.js";
import {HttpError} from "../errorHandler/HttpError.js";


export class PostController {
    constructor(private postService: PostService) {
    }

    async addPost(req: Request, res: Response) {
        const body = req.body;
        if(!body) throw new HttpError(409, 'Bad request: Missing Body!')
        const {error} = PostDtoSchema.validate(body);
        if (error) throw new HttpError(400, error.message)
        if (!(body as { id: string }).id) {
            (body as { id: string }).id = getRandomNumber(100, 999).toString();
        }
        const success = this.postService.addPost(body as Post)
        myLogger.save(success ? `Post with id ${(body as { id: string }).id} was successfully added` :
            `Post with id ${(body as { id: string }).id} already exists`)
        myLogger.log(success ? `Post with id ${(body as { id: string }).id} was successfully added` :
            `Post with id ${(body as { id: string }).id} already exists`)
        res.status(success ? 201 : 409).send(success ? "Post was added" : "Post already exists")
        myLogger.log(`Response for add post with id ${(body as { id: string }).id} was send`)
    }

    getAllPosts(req: Request, res: Response) {
        res.status(200).send(JSON.stringify(this.postService.getAllPosts()))
        myLogger.log(`Response getAllPosts was send`)
    }

    async updatePost(req: Request, res: Response) {
        const body = req.body;
        if(!body) throw new HttpError(409, 'Bad request: Missing Body!')
        const {error} = PostDtoSchema.validate(body);
        if (error) throw new HttpError(400, error.message)
        if (!(body as { id: string }).id) {
            throw new HttpError(409, 'Bad request: Missing Id!')
        }
        const success = this.postService.updatePost(body as Post);
        myLogger.save(success ? `Post with id ${(body as { id: string }).id} was successfully updated` :
            `Post with id ${(body as { id: string }).id} not exists`)
        myLogger.log(success ? `Post with id ${(body as { id: string }).id} was successfully updated` :
            `Post with id ${(body as { id: string }).id} not exists`)
        res.status(success ? 201 : 409).send(success ? "Post was updated" : "Post not exists")
        myLogger.log(`Response for update post with id ${(body as { id: string }).id} was send`)

    }

    async removePost(req: Request, res: Response) {
        const body = req.body;
        if (!(body as { id: string }).id) {
            throw new HttpError(409, 'Bad request: Missing Id!')
        }
        const removed = this.postService.removePost((body as { id: string }).id);
        myLogger.save(removed ? `Post with id ${(body as { id: string }).id} was successfully removed` :
            `Post with id ${(body as { id: string }).id} not exists`)
        myLogger.log(removed ? `Post with id ${(body as { id: string }).id} was successfully removed` :
            `Post with id ${(body as { id: string }).id} not exists`)
        res.status(removed ? 201 : 409).send(removed ? "Post was removed" : "Post not exists")
        myLogger.log(`Response for delete post with id ${(body as { id: string }).id} was send`)
    }

    getPostById(req: Request, res: Response) {
        const id = req.query.postId as string | undefined;
        if (!id) {
            throw new HttpError(409, 'no id was received to find post')
        } else {
            const founded = this.postService.getPostById(id);
            if (founded !== null) {
                res.status(200).send(JSON.stringify(founded));
            } else {
                res.status(404).send('Post not found');
            }
        }
        myLogger.log(`Response post info with id ${id} was send`)
    }

    getPostsByUserName(req: Request, res: Response) {
        const name = req.query.userName as string | undefined;
        if (!name) {
            throw new HttpError(409, 'no user name was received to find posts')
        } else {
            const founded = this.postService.getPostsByUserName(name);
            if (founded !== null) {
                res.status(200).send(JSON.stringify(founded));
            } else {
                res.status(404).send('Posts not found');
            }
        }
        myLogger.log(`Response posts info for ${name} was send`)
    }

}