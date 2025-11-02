import { mapToUsersEntity, UserEntity } from "./UserEntity";
import { GithubApiDataSource } from "../data/GithubApiDataSource";

export interface SearchUserRepository {
    searchUser(query: string, singal: AbortSignal): Promise<UserEntity[]>
}


export class SearchUserRepositoryImpl implements SearchUserRepository {

    constructor(private dataSource: GithubApiDataSource) {}

    async searchUser(query: string, singal?: AbortSignal): Promise<UserEntity[]> {
        const response = await this.dataSource.searchUsers(query, singal);   
        return mapToUsersEntity(response);
    }
}


