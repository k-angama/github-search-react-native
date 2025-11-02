import { GithubApiDataSource } from "../src/data/GithubApiDataSource";
import { UsersResponseRaw } from "../src/data/UsersResponseRaw";
import { SearchUserRepositoryImpl } from "../src/domain/SearchUserRepository";


describe("SearchUserRepositoryImpl", () => {
    let dataSource: jest.Mocked<GithubApiDataSource>;
    let repository: SearchUserRepositoryImpl;

    beforeEach(() => {
        dataSource = {
            searchUsers: jest.fn(),
        } as unknown as jest.Mocked<GithubApiDataSource>;

        repository = new SearchUserRepositoryImpl(dataSource);
    });

    it("should return mapped user entities when API responds successfully", async () => {
        const mockResponse: UsersResponseRaw = {
        total_count: 1,
        items: [
            {
            id: 123,
            login: "mockUser",
            node_id: "MDQ6VXNlcjEyMw==",
            avatar_url: "https://example.com/avatar.png",
            },
        ],
        };

        dataSource.searchUsers.mockResolvedValue(mockResponse);

        const result = await repository.searchUser("mockUser", new AbortController().signal);

        expect(dataSource.searchUsers).toHaveBeenCalledWith("mockUser", expect.any(AbortSignal));
        expect(result).toEqual([
        {
            id: "123",
            login: "mockUser",
            nodeId: "MDQ6VXNlcjEyMw==",
            avatarUrl: "https://example.com/avatar.png",
        },
        ]);
    });

    it("should return an empty array when API returns no items", async () => {
        const mockResponse: UsersResponseRaw = { total_count: 0, items: [] };
        dataSource.searchUsers.mockResolvedValue(mockResponse);

        const result = await repository.searchUser("unknown", new AbortController().signal);

        expect(result).toEqual([]);
    });

    it("should throw an error when the data source throws", async () => {
        dataSource.searchUsers.mockRejectedValue(new Error("Network error"));

        await expect(
            repository.searchUser("mockUser", new AbortController().signal)
        ).rejects.toThrow("Network error");
    });
});
