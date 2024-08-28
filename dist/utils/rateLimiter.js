import { RateLimiterMemory } from "rate-limiter-flexible";
const rateLimiter = new RateLimiterMemory({
    points: 3,
    duration: 60,
    blockDuration: 30,
});
export { rateLimiter };
