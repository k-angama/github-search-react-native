import { RateLimitError } from "./RateLimitError";
import { UsersResponseRaw } from "./UsersResponseRaw";

export class GithubApiDataSource {

    private readonly baseUrl = 'https://api.github.com';

    async searchUsers(query: string, singal?: AbortSignal): Promise<UsersResponseRaw> {
        
        const response = await fetch(
                    `${ this.baseUrl }/search/users?q=${ encodeURIComponent(query) }`,
                    { 
                        signal: singal,
                        headers: {
                            'Accept': 'application/vnd.github.text-match+json',
                            'X-GitHub-Api-Version': '2022-11-28'
                        }
                     } 
                );

         // Check rate limit headers
        const remaining = response.headers.get('X-RateLimit-Remaining');
        const reset = response.headers.get('X-RateLimit-Reset');
        if ((response.status === 403 || response.status === 429) && remaining === '0' && reset) { 
            const resetTimestamp = parseInt(reset, 10);
            const resetDate = new Date(resetTimestamp * 1000);
            throw new RateLimitError(
                    `Rate limit exceeded. Resets at ${resetDate.toLocaleString()}`,
                    resetDate,
                    0
                );
        }
                
        if (!response.ok) {
            throw new Error(
                `GitHub API request failed with status ${response.status}: ${response.statusText}`
            );
        }
                
        return await response.json();
    }
}