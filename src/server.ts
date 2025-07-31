import express from 'express';
import {apiRouter} from "./routes/appRouter.ts";
import {UserServiceEmbeddedImpl} from "./services/users/UserServiceEmbeddedImpl.ts";
import {UserController} from "./controllers/UserController.ts";
import {myLogger} from "./utils/logger.ts";
import {PostServiceEmbeddedImpl} from "./services/posts/PostServiceEmbeddedImpl.ts";
import {PostController} from "./controllers/PostController.ts";

export const userService = new UserServiceEmbeddedImpl();
export const postService = new PostServiceEmbeddedImpl();
userService.restoreDataFromFile();
postService.restoreDataPostsFromFile();
export const userController = new UserController(userService);
export const postController = new PostController(postService);

export const launchServer = () => {
    const app = express();
    app.listen(3009, () => console.log("Server runs at http://localhost:3009"))
    app.use('/api', apiRouter)
    app.use((req, res) => {
        res.status(404).send("Page not found")
    })

    process.on('SIGINT', async (code) => {
        try {
            await userService.saveDataToFile();
            await postService.saveDataPostToFile()
            myLogger.log("Saving....");
        } catch (e) {
            myLogger.log("Failed to save data on shutdown");
            myLogger.save("Failed to save data on shutdown");
        }
        myLogger.saveToFile("Server shutdown by Ctrl+C");
        process.exit();
    })

}