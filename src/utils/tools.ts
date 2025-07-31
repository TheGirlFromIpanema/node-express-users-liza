import {IncomingMessage} from "node:http";

export async function parseBody(req: IncomingMessage) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', () => {
            try {
                resolve(JSON.parse(body))
            } catch (e) {
                reject(new Error('Invalid json'))
            }
        })
    })
}

export const isUserType = (obj:any):boolean => {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.id === 'number' &&
        typeof obj.userName === 'string'
    );
}

export const isPostType = (obj:any):boolean => {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.userId === 'string' &&
        typeof obj.title === 'string' &&
        typeof obj.text === 'string'
    );
}

export const getRandomNumber = (start:number, finish:number) => {
    return Math.trunc(Math.random() * (finish - start) + start);
}
