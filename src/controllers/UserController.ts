import {isUserType, parseBody} from "../utils/tools.ts";
import {User} from "../model/userTypes.ts";
import {myLogger} from "../utils/logger.ts";
import {UserService} from "../services/users/UserService.ts";
import {baseUrl} from "../config/userServerConfig.ts";
import {HttpError} from "../errorHandler/HttpError.js";
import {Request, Response} from "express";
import {UserDtoSchema} from "../joiSchemas/userSchema.js";


export class UserController {
    constructor(private userService: UserService) {
    }

    async addUser(req: Request, res: Response) {
        const body = req.body;
        const {error} = UserDtoSchema.validate(body);
        if (error) throw new HttpError(400, error.message)
        if (!isUserType(body)) {
            throw new HttpError(400, 'Bad request: wrong params!')
        }
        const success = this.userService.addUser(body as User)
        myLogger.save(success ? `User with id ${(body as { id: number }).id} was successfully added` :
            `User with id ${(body as { id: number }).id} already exists`)
        myLogger.log(success ? `User with id ${(body as { id: number }).id} was successfully added` :
            `User with id ${(body as { id: number }).id} already exists`)
        res.status(success ? 201 : 409).send(success ? "User was added" : "User already exists")
        myLogger.log(`Response for add user with id ${(body as { id: number }).id} was send`)
    }

    getAllUsers(req: Request, res: Response) {
        res.status(200).send(JSON.stringify(this.userService.getAllUsers()))
        myLogger.log(`Response getAllUser was send`)
    }

    async updateUser(req: Request, res: Response) {
        const body = req.body;
        const {error} = UserDtoSchema.validate(body);
        if (error) throw new HttpError(400, error.message);
        if (!isUserType(body)) {
            throw new HttpError(400, 'Bad request: wrong params!')
        }
        const success = this.userService.updateUser(body as User);
        myLogger.save(success ? `User with id ${(body as { id: number }).id} was successfully updated` :
            `User with id ${(body as { id: number }).id}  not exists`)
        myLogger.log(success ? `User with id ${(body as { id: number }).id} was successfully updated` :
            `User with id ${(body as { id: number }).id}  not exists`)
        res.status(success ? 201 : 409).send(success ? "User was updated" : "User not exists")
        myLogger.log(`Response for update user with id ${(body as { id: number }).id} was send`)
    }

    async removeUser(req: Request, res: Response) {
        const body = req.body;
        if (!(body as { id: number }).id) {
            throw new HttpError(409, 'Bad request: Missing Id!')
        }
        const removed = this.userService.removeUser((body as { id: number }).id);
        myLogger.save(removed ? `User with id ${(body as { id: number }).id} was successfully removed` :
            `User with id ${(body as { id: number }).id}  not exists`)
        myLogger.log(removed ? `User with id ${(body as { id: number }).id} was successfully removed` :
            `User with id ${(body as { id: number }).id}  not exists`)
        res.status(removed ? 201 : 409).send(removed ? "User was removed" : "User not exists")
        myLogger.log(`Response for delete user with id ${(body as { id: number }).id} was send`)
    }

    getUser(req: Request, res: Response) {
        const url = new URL(req.url!, baseUrl);
        const id = url.searchParams.get('userId');
        if (!id || Number.isNaN(parseInt(id))) {
            throw new HttpError(400, 'Bad request: wrong params!')
        }
        if (!id) {
            throw new HttpError(409, 'no id was received to find user')
        } else {
            const founded = this.userService.getUser(+id);
            if (founded !== null) {
                res.status(200).send(JSON.stringify(founded));
            } else {
                res.status(404).send('User not found')
            }
        }
        myLogger.log(`Response user info with id ${id} was send`)
    }

    getAllLogs(req: Request, res: Response) {
        const allLogs = myLogger.getLogArray();
        res.status(200).send(JSON.stringify(allLogs));
    }

}