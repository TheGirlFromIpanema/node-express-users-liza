
export interface UserFilePersistenceService {
    saveDataToFile():Promise<string>;
    restoreDataFromFile():string;
}