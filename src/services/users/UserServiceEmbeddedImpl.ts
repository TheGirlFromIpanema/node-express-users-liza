import {UserService} from "./UserService.ts";
import {User} from "../../model/userTypes.ts";
import {UserFilePersistenceService} from "./UserFilePersistenceService.ts";
import fs from "fs";
import {myLogger} from "../../utils/logger.ts";

export  class UserServiceEmbeddedImpl implements UserService, UserFilePersistenceService{
    private users: User[] = [];
    private rs = fs.createReadStream('data.txt',{encoding: "utf-8", highWaterMark:24})

    addUser(user: User): boolean {
        if(this.users.findIndex((u:User) => u.id === user.id) === -1)
        {
            this.users.push(user);
            return true;
        }
        return false;
    }

    getAllUsers = () => [...this.users];

    updateUser = (newUserData: User): boolean => {
        const index = this.users.findIndex(elem => elem.id === newUserData.id)
        if (index !== -1) {
            this.users[index] = newUserData;
            return true
        }
        return false
    }

    removeUser = (userId: number): User | null => {
        const index = this.users.findIndex(elem => elem.id === userId);
        if (index !== -1) {
            const temp = this.users[index];
            this.users.splice(index, 1);
            return temp;
        }
        return null
    }

    getUser = (userId: number): User | null => {
        const index = this.users.findIndex(elem => elem.id === userId);
        if (index !== -1) {
            return this.users[index];
        }
        return null
    }

    restoreDataFromFile(): string {
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
                this.users = JSON.parse(result);
                myLogger.log("Data was restored from file")
                myLogger.save("Data was restored from file")
                this.rs.close();
            }else {
                this.users = [{id: 123, userName: "Panikovsky"}]
            }
        })

        this.rs.on('error', () => {
            this.users = [{id: 2, userName: "Bender"}]
            myLogger.log('File to restore not found')
        })
        return "Ok";
    }


    async saveDataToFile(): Promise<string> {
        return new Promise((resolve, reject) => {
            const ws = fs.createWriteStream('data.txt')
            const data = JSON.stringify(this.users);
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

    getUserId = (userNameForPost: string): string | null => {
        const user = this.users.find(u => u.userName.toLowerCase() === userNameForPost.toLowerCase());
        return user ? user.id.toString() : null;
    }
}
