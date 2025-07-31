
export interface PostFilePersistenceService {
    saveDataPostToFile():Promise<string>;
    restoreDataPostsFromFile():string;
}