import {User} from "../../model/userTypes.ts";

export interface UserService {
    addUser(user:User):boolean;
    getAllUsers():User[];
    updateUser(user:User):boolean;
    removeUser(userId:number):User|null;
    getUser(userId:number):User|null;
    getUserId(userName:string):string|null;
}