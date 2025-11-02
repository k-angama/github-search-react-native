import { GithubApiDataSource } from "../../data/GithubApiDataSource";
import { SearchUserMockRepository } from "../../domain/mock/SearchUserMockRepository";
import { SearchUserRepositoryImpl } from "../../domain/SearchUserRepository";

const dataSource = new GithubApiDataSource();

export const searchUserRepository = false
    ? new SearchUserMockRepository() 
    : new SearchUserRepositoryImpl(dataSource);