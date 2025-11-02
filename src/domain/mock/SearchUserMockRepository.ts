import { SearchUserRepository } from "../../domain/SearchUserRepository";
import { UserEntity } from "../../domain/UserEntity";

export class SearchUserMockRepository implements SearchUserRepository {

    private mockUsers: UserEntity[] = [
                    {
                        id: '8761081',
                        login: 'First Item',
                        nodeId: 'MDQ6VXNlcjg3NjEwODE=',
                        avatarUrl: ""
                    },
                    {
                        id: '76406456',
                        login: 'Second Item',
                        nodeId: 'MDQ6VXNlcjc2NDA2NDU2',
                        avatarUrl: ""
                    },
                    {
                        id: '8867121',
                        login: 'Third Item',
                        nodeId: 'U_kgDOBtXmFA',
                        avatarUrl: ""
                    },
                    {
                        id: '497812',
                        login: 'Fourth Item',
                        nodeId: 'MDQ6VXNlcjg4NjcxMjE=',
                        avatarUrl: ""
                    },
                    {
                        id: '5029053',
                        login: 'Fifth Item',
                        nodeId: 'MDQ6VXNlcjQ5NzgxMg==',
                        avatarUrl: ""
                    },
                    {
                        id: '94116967',
                        login: 'Sixth Item',
                        nodeId: 'MDQ6VXNlcjIwNjA0ODM1',
                        avatarUrl: ""
                    }
    ]

    async searchUser(query: string, signal: AbortSignal): Promise<UserEntity[]> {

         await new Promise<void>((resolve) => {
            const timeoutId = setTimeout(resolve, 500);
            if (signal) {
                signal.addEventListener('abort', () => {
                    clearTimeout(timeoutId);
                    resolve(); 
                });
            }
        });

        if (signal?.aborted) {
            return [];
        }

        if (!query || query.trim() === "") {
            return [];
        }

        return this.mockUsers.filter(
                user => user.login.toLowerCase().includes(query.toLowerCase())
            )
    }

}