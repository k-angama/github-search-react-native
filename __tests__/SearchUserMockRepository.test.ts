import { SearchUserMockRepository } from "../src/domain/mock/SearchUserMockRepository";

describe("SearchUserMockRepository", () => {
    let repository: SearchUserMockRepository;

    beforeEach(() => {
        repository = new SearchUserMockRepository();
    });

    it("should return users matching the query", async () => {
        const result = await repository.searchUser("first", new AbortController().signal);
        expect(result).toHaveLength(1);
        expect(result[0].login).toBe("First Item");
    });

    it("should return multiple users when query matches several items", async () => {
        const result = await repository.searchUser("item", new AbortController().signal);
        expect(result.length).toBeGreaterThan(1);
    });

    it("should return an empty array when the query is empty", async () => {
        const result = await repository.searchUser("", new AbortController().signal);
        expect(result).toEqual([]);
    });

    it("should return an empty array when the search is aborted", async () => {
        const controller = new AbortController();
        const promise = repository.searchUser("first", controller.signal);
        controller.abort(); // simulate early abort
        const result = await promise;
        expect(result).toEqual([]);
    });
});
