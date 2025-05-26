import { createClient } from "redis";

export interface MessageToEngine {
  clientId: string;
  message: {
    code: string;
    language: string;
  };
}

async function main() {
  const client = createClient({
    url: "redis://localhost:6379",
  });

  await client.connect().catch((err) => {
    console.error("Redis connection error:", err);
  });

  setInterval(() => {
    client
      .rPop("messages")
      .then((message) => {
        if (message) {
          const parsedMessage: any = JSON.parse(message);
          console.log("Received message:", parsedMessage);
          client.publish(
            parsedMessage.clientId,
            JSON.stringify({
              status: "completed",
              message: "Successfully processed message",
            })
          );
        } else {
          console.log("No messages in the queue");
        }
      })
      .catch((err) => {
        console.error("Error reading from Redis:", err);
      });
  }, 5000);
}

main();
