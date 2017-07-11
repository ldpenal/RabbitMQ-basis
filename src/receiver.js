import amqp from 'amqplib';
import * as Config from './config';

const consumer = async () => {
  const connection = await amqp.connect(Config.RabbitMQ.instanceURL);
  const channel = await connection.createChannel();
  const queue = 'test_queue';

  console.log(`Waiting for messages on consumer`);

  channel.consume(
    queue,
    message => {
      console.log('Message received ', message.content.toString(), process.env.INSTANCE);
      setTimeout(() => channel.ack(message), (process.env.INSTANCE == 1) ? 3000 : 10);
    },
    Config.RabbitMQ.receiverOptions
  );
};

consumer();