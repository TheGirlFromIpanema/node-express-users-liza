
import {isUserType, parseBody} from "../utils/tools.ts";
import {User} from "../model/userTypes.ts";
import {IncomingMessage, ServerResponse} from "node:http";
import {myLogger} from "../utils/logger.ts";
import {UserService} from "../services/users/UserService.ts";
import {baseUrl} from "../config/userServerConfig.ts";


export class UserController {
    constructor(private userService: UserService) {
    }

    async addUser(req: IncomingMessage, res: ServerResponse) {
        try {
            const body = await parseBody(req);
            if (body) {
                if(!isUserType(body)){
                    res.writeHead(400, {'Content-Type': 'text/html'})
                    res.end('Bad request: wrong params!')
                    myLogger.log('Wrong params!')
                    return;
                }
                const success = this.userService.addUser(body as User)
                if (success) {
                    myLogger.save(`User with id ${(body as { id: number }).id} was successfully added`)
                    myLogger.log(`User with id ${(body as { id: number }).id} was successfully added`)
                } else {
                    myLogger.save(`User with id ${(body as { id: number }).id} already exists`)
                    myLogger.log(`User with id ${(body as { id: number }).id} already exists`)
                }
                res.writeHead(success ? 201 : 409, {"Content-Type": "text/plain"});
                res.end(success ? "User was added" : "User already exists");
                myLogger.log(`Response for add user with id ${(body as { id: number }).id} was send`)
            }
        } catch (e) {
            res.writeHead(400, {"Content-Type": "text/plain"});
            res.end("Invalid JSON");
            myLogger.save(`Wrong JSON`);
            myLogger.log(`Wrong JSON`);
        }
    }

    getAllUsers(req: IncomingMessage, res: ServerResponse) {
        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(JSON.stringify(this.userService.getAllUsers()))
        myLogger.log(`Response getAllUser was send`)
    }

    async updateUser(req: IncomingMessage, res: ServerResponse) {
        try {
            const body = await parseBody(req);
            if (body) {
                const success = this.userService.updateUser(body as User);
                if (success) {
                    myLogger.save(`User with id ${(body as { id: number }).id} was successfully updated`)
                    myLogger.log(`User with id ${(body as { id: number }).id} was successfully updated`)
                } else {
                    myLogger.save(`User with id ${(body as { id: number }).id} not exists`)
                    myLogger.log(`User with id ${(body as { id: number }).id} not exists`)
                }
                res.writeHead(success ? 200 : 409, {"Content-Type": "text/plain"});
                res.end(success ? "User was updated" : "User not exists");
                myLogger.log(`Response for update user with id ${(body as { id: number }).id} was send`)
            }
        } catch (e) {
            res.writeHead(400, {"Content-Type": "text/plain"});
            res.end("Invalid JSON");
            myLogger.save(`Wrong JSON`);
            myLogger.log(`Wrong JSON`);
        }
    }

    async removeUser(req: IncomingMessage, res: ServerResponse) {
        try {
            const body = await parseBody(req);
            if (body) {
                const removed = this.userService.removeUser((body as { id: number }).id)
                if (removed) {
                    myLogger.save(`User with id ${(body as { id: number }).id} was successfully removed`)
                    myLogger.log(`User with id ${(body as { id: number }).id} was successfully removed`)
                } else {
                    myLogger.save(`User with id ${(body as { id: number }).id} not exists`)
                    myLogger.log(`User with id ${(body as { id: number }).id} not exists`)
                }
                res.writeHead(removed ? 200 : 409, {"Content-Type": "text/plain"});
                res.end(removed ? "User was removed" : "User not exists");
                myLogger.log(`Response for delete user with id ${(body as { id: number }).id} was send`)
            }
        } catch (e) {
            res.writeHead(400, {"Content-Type": "text/plain"});
            res.end("Invalid JSON");
            myLogger.save(`Wrong JSON`);
            myLogger.log(`Wrong JSON`);
        }
    }

    getUser(req: IncomingMessage, res: ServerResponse) {
        const url = new URL( req.url!, baseUrl);
        const id = url.searchParams.get('userId');
        if(!id || Number.isNaN(parseInt(id))){
            res.writeHead(400, {'Content-Type': 'text/html'})
            res.end('Bad request: wrong params!');
            myLogger.log('Wrong params!');
        }
        if (!id) {
            res.writeHead(409, {'Content-Type': 'text/html'})
            res.end('no id was received to find user')
        } else {
            const founded = this.userService.getUser(+id);
            if (founded !== null) {
                res.writeHead(200, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(founded))
            } else {
                res.writeHead(404, {'Content-Type': 'text/html'})
                res.end('User not found')
            }
        }
        myLogger.log(`Response user info with id ${id} was send`)
    }

    getAllLogs(req: IncomingMessage, res: ServerResponse) {
        const allLogs = myLogger.getLogArray();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(allLogs));
    }

}