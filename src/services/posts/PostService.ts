import {Post} from "../../model/postTypes.ts";


export interface PostService {
    getAllPosts(): Post[];
    getPostById(id: string): Post|null;
    addPost(post:Post): boolean;
    removePost(id: string): Post|null;
    updatePost(post:Post):boolean;
    getPostsByUserName(userName: string): Post[];
}