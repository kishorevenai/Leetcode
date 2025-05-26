"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = (0, redis_1.createClient)({
            url: "redis://localhost:6379",
        });
        yield client.connect().catch((err) => {
            console.error("Redis connection error:", err);
        });
        setInterval(() => {
            client
                .rPop("messages")
                .then((message) => {
                if (message) {
                    const parsedMessage = JSON.parse(message);
                    console.log("Received message:", parsedMessage);
                    client.publish(parsedMessage.clientId, JSON.stringify({
                        status: "completed",
                        message: "Successfully processed message",
                    }));
                }
                else {
                    console.log("No messages in the queue");
                }
            })
                .catch((err) => {
                console.error("Error reading from Redis:", err);
            });
        }, 5000);
    });
}
main();
