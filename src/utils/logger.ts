import {EventEmitter} from "node:events";
import fs from 'fs'

class Logger extends EventEmitter{

    private logArray:Array<{date: string, message: string}> = [];
    log(message:string){
        this.emit('logged', message)
    }
    save(message:string){
        this.emit('saved', message)
    }

    saveToFile(message:string){
        this.emit('ToFile', message)
    }

    addLogToArray(message:string) {
        this.logArray.push({date: new Date().toLocaleString("en-GB", {
                timeZone: "Asia/Jerusalem",
                hour12: false,
            }), message})

    }
    getLogArray(){
        return [...this.logArray]
    }
}

export const myLogger = new Logger();

myLogger.on('logged', (message:string)=> {
    console.log(new Date().toLocaleString("en-GB", {
        timeZone: "Asia/Jerusalem",
        hour12: false,
    }), message)
})

myLogger.on('saved', (message: string) => {
    myLogger.addLogToArray(message)
})

myLogger.on('ToFile', (message:string) => {
    myLogger.addLogToArray(message);
    const fileName = 'log.txt';
    fs.writeFileSync(fileName, JSON.stringify(myLogger.getLogArray()));
})
