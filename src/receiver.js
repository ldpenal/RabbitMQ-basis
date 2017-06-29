import amqp from 'amqplib';
import Config from './config';

const consumer = async () => {
  const connection = await amqp.connect(Config.RabbitMQ.instanceURL);
  const channel = await connection.createChannel();
  const queue = 'test_queue';

  console.log(`Waiting for messages on consumer`);

  channel.consume(
    queue,
    message => {
      console.log('Message received ', message.content.toString());
      channel.ack(message);
    },
    Config.RabbitMQ.receiverOptions
  );
};

consumer();