import {PostService} from "../services/posts/PostService.ts";
import {IncomingMessage, ServerResponse} from "node:http";
import {getRandomNumber, isPostType, parseBody} from "../utils/tools.ts";
import {myLogger} from "../utils/logger.ts";

import {Post} from "../model/postTypes.ts";
import {baseUrl} from "../config/userServerConfig.ts";


export class PostController {
    constructor(private postService: PostService) {}

    async addPost(req: IncomingMessage, res: ServerResponse) {
        try {
            const body = await parseBody(req);
            if (body) {
                if(!isPostType(body)){
                    res.writeHead(400, {'Content-Type': 'text/html'})
                    res.end('Bad request: wrong params!')
                    myLogger.log('Wrong params!')
                    return;
                }
                if (!(body as { id: string}).id) {
                    (body as { id: string}).id = getRandomNumber(1000, 10000).toString()
                }
                const success = this.postService.addPost(body as Post)
                if (success) {
                    myLogger.save(`Post with id ${(body as { id: string }).id} was successfully added`)
                    myLogger.log(`Post with id ${(body as { id: string }).id} was successfully added`)
                } else {
                    myLogger.save(`Post with id ${(body as { id: string }).id} already exists`)
                    myLogger.log(`Post with id ${(body as { id: string }).id} already exists`)
                }
                res.writeHead(success ? 201 : 409, {"Content-Type": "text/plain"});
                res.end(success ? "Post was added" : "Post already exists");
                myLogger.log(`Response for add post with id ${(body as { id: string }).id} was send`)
            }
        } catch (e) {
            res.writeHead(400, {"Content-Type": "text/plain"});
            res.end("Invalid JSON");
            myLogger.save(`Wrong JSON`);
            myLogger.log(`Wrong JSON`);
        }
    }

    getAllPosts(req: IncomingMessage, res: ServerResponse) {
        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(JSON.stringify(this.postService.getAllPosts()))
        myLogger.log(`Response getAllPosts was send`)
    }

    async updatePost(req: IncomingMessage, res: ServerResponse) {
        try {
            const body = await parseBody(req);
            if (body) {
                if(!isPostType(body)){
                    res.writeHead(400, {'Content-Type': 'text/html'})
                    res.end('Bad request: wrong params!')
                    myLogger.log('Wrong params!')
                    return;
                }
                if (!(body as { id: string}).id) {
                    res.writeHead(400, {'Content-Type': 'text/html'})
                    res.end('Bad request: Missing Id!')
                    myLogger.log('Missing Id!')
                    return;
                }
                const success = this.postService.updatePost(body as Post);
                if (success) {
                    myLogger.save(`Post with id ${(body as { id: string }).id} was successfully updated`)
                    myLogger.log(`Post with id ${(body as { id: string }).id} was successfully updated`)
                } else {
                    myLogger.save(`Post with id ${(body as { id: string }).id} not exists`)
                    myLogger.log(`Post with id ${(body as { id: string }).id} not exists`)
                }
                res.writeHead(success ? 200 : 409, {"Content-Type": "text/plain"});
                res.end(success ? "Post was updated" : "Post not exists");
                myLogger.log(`Response for update post with id ${(body as { id: string }).id} was send`)
            }
        } catch (e) {
            res.writeHead(400, {"Content-Type": "text/plain"});
            res.end("Invalid JSON");
            myLogger.save(`Wrong JSON`);
            myLogger.log(`Wrong JSON`);
        }
    }

    async removePost(req: IncomingMessage, res: ServerResponse) {
        try {
            const body = await parseBody(req);
            if (body) {
                if (!(body as { id: string}).id) {
                    res.writeHead(400, {'Content-Type': 'text/html'})
                    res.end('Bad request: Missing Id!')
                    myLogger.log('Missing Id!')
                    return;
                }
                const removed = this.postService.removePost((body as { id: string }).id)
                if (removed) {
                    myLogger.save(`Post with id ${(body as { id: string }).id} was successfully removed`)
                    myLogger.log(`Post with id ${(body as { id: string }).id} was successfully removed`)
                } else {
                    myLogger.save(`Post with id ${(body as { id: string }).id} not exists`)
                    myLogger.log(`Post with id ${(body as { id: string }).id} not exists`)
                }
                res.writeHead(removed ? 200 : 409, {"Content-Type": "text/plain"});
                res.end(removed ? "Post was removed" : "Post not exists");
                myLogger.log(`Response for delete post with id ${(body as { id: string }).id} was send`)
            }
        } catch (e) {
            res.writeHead(400, {"Content-Type": "text/plain"});
            res.end("Invalid JSON");
            myLogger.save(`Wrong JSON`);
            myLogger.log(`Wrong JSON`);
        }
    }

    getPostById(req: IncomingMessage, res: ServerResponse) {
        const url = new URL( req.url!, baseUrl);
        const id = url.searchParams.get('postId');
        if (!id) {
            res.writeHead(409, {'Content-Type': 'text/html'})
            res.end('no id was received to find post')
        } else {
            const founded = this.postService.getPostById(id);
            if (founded !== null) {
                res.writeHead(200, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(founded))
            } else {
                res.writeHead(404, {'Content-Type': 'text/html'})
                res.end('Post not found')
            }
        }
        myLogger.log(`Response post info with id ${id} was send`)
    }

    getPostsByUserName(req: IncomingMessage, res: ServerResponse) {
        const url = new URL( req.url!, baseUrl);
        const name = url.searchParams.get('userName');
        if (!name) {
            res.writeHead(409, {'Content-Type': 'text/html'})
            res.end('no user name was received to find posts')
        } else {
            const founded = this.postService.getPostsByUserName(name);
            if (founded !== null) {
                res.writeHead(200, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(founded))
            } else {
                res.writeHead(404, {'Content-Type': 'text/html'})
                res.end('Posts not found')
            }
        }
        myLogger.log(`Response posts info for ${name} was send`)
    }


}