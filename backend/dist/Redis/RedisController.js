"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisController = void 0;
const redis_1 = require("redis");
class RedisController {
    constructor() {
        this.client = (0, redis_1.createClient)({
            url: process.env.REDIS_URL || "redis://localhost:6379",
        });
        this.client.connect().catch((err) => {
            console.error("Redis connection error:", err);
        });
        this.publisher = (0, redis_1.createClient)({
            url: process.env.REDIS_URL || "redis://localhost:6379",
        });
        this.publisher.connect().catch((err) => {
            console.error("Redis connection error:", err);
        });
    }
    static getInstance() {
        if (!RedisController.instance) {
            RedisController.instance = new RedisController();
        }
        return RedisController.instance;
    }
    sendAndAwait(message) {
        return new Promise((resolve) => {
            const id = this.getRandomClientId();
            this.client.subscribe(id, (message) => {
                this.client.unsubscribe(id);
                resolve(JSON.parse(message));
            });
            this.publisher.lPush("messages", JSON.stringify({ clientId: id, message }));
        });
    }
    getRandomClientId() {
        return (Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15));
    }
}
exports.RedisController = RedisController;
