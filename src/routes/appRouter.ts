import express from 'express'
import {userRouter} from "./userRouter.ts";
import {loggerRouter} from "./loggerRouter.ts";
import {postRouter} from "./postRouter.ts";

export const apiRouter = express.Router();
apiRouter.use('/users', userRouter)
apiRouter.use('/logger', loggerRouter)
apiRouter.use('/posts', postRouter)
