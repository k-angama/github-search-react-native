
export class RateLimitError extends Error {
    constructor(
        message: string,
        public readonly resetDate: Date,
        public readonly remaining: number
    ) {
        super(message);
        this.name = 'RateLimitError';
    }
}