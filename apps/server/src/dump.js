const { Queue } = require("bullmq");

(() => {
  const queueNames = ["push", "email", "sms"];
  const queues = [];
  for (const queueName of queueNames) {
    queues.push(
      new Queue(queueName, {
        connection: {
          host: "localhost",
          port: 6379,
        },
      })
    );
  }

  if (queues) {
    queues.forEach((queue) => {
      for (let idx = 0; idx < 200; idx += 1) {
        queue.add(`${queue.name}-test`, {
          id: idx,
          data: `${queue.name}-test-${idx}`,
        });
      }
    });
  }
})();
