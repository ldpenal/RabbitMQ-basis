export const Exchanges = {
  logs: 'logs',
};

export const RabbitMQ = {
  instanceURL: 'amqp://localhost',
  receiverOptions: {
    persistent: true,
    noAck: false,
  },
  senderOptions: {
    durable: true,
    noAck: false,
  },
};