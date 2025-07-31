import {PostService} from "./PostService.ts";
import {PostFilePersistenceService} from "./PostFilePersistenceService.ts";
import {Post} from "../../model/postTypes.ts";
import fs from "fs";
import {myLogger} from "../../utils/logger.ts";
import {userService} from "../../server.ts";

export class PostServiceEmbeddedImpl implements PostService, PostFilePersistenceService {
    private posts: Post[] = [];
    private rs = fs.createReadStream('dataPosts.txt', {encoding: "utf-8", highWaterMark: 24});

    addPost = (post: Post): boolean => {
        if (this.posts.findIndex((p: Post) => p.id === post.id) === -1) {
            this.posts.push(post);
            return true;
        }
        return false;
    }

    getAllPosts = () => [...this.posts];

    updatePost = (newPost: Post): boolean => {
        const index = this.posts.findIndex(elem => elem.id === newPost.id)
        if (index !== -1) {
            this.posts[index] = newPost;
            return true
        }
        return false
    }

    removePost = (postId: string): Post | null => {
        const index = this.posts.findIndex(elem => elem.id === postId);
        if (index !== -1) {
            const temp = this.posts[index];
            this.posts.splice(index, 1);
            return temp;
        }
        return null
    }

    getPostById = (postId: string): Post | null => {
        const index = this.posts.findIndex(elem => elem.id === postId);
        if (index !== -1) {
            return this.posts[index];
        }
        return null
    }

    getPostsByUserName = (userName: string): Post[] => {
        const id = userService.getUserId(userName);
        if (id) {
            return this.posts.filter(post => post.userId === id);
        }
        return [];
    }


    restoreDataPostsFromFile(): string {
        let result = ""
        this.rs.on('data', (chunk) => {
            if(chunk){
                result += chunk.toString()
            } else {
                result = "[]";
            }
        })

        this.rs.on('end', () => {
            if(result){
                this.posts = JSON.parse(result);
                myLogger.log("Data was restored from file")
                myLogger.save("Data was restored from file")
                this.rs.close();
            }else {
                this.posts = [{id: "1", userId: "0", text: "Something", title: "TestPost"}]
            }
        })

        this.rs.on('error', () => {
            myLogger.log('File to restore not found')
        })
        return "Ok";
    }


    async saveDataPostToFile(): Promise<string> {
        return new Promise((resolve, reject) => {
            const ws = fs.createWriteStream('dataPosts.txt')
            const data = JSON.stringify(this.posts);
            ws.write((data), (e) => {
                if(e){
                    myLogger.log("Error!" + e?.message)
                    return reject(e);
                }
            })
            ws.on('finish', () => {
                myLogger.log("Data was saved to file");
                myLogger.save("Data was saved to file");
                resolve("Ok");
            })
            ws.on('error', (e) => {
                myLogger.log("error: data not saved!")
                reject(e);
            })
            ws.end();
        })
    }

}