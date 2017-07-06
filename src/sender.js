import amqp from 'amqplib';
import * as Config from './config';

console.log(Config);

const sendData = async (channel, initial, end) => {
  if (initial === end) return;

  console.log(initial);

  channel.sendToQueue('test_queue', Buffer.from(initial.toString()), {
    persistent: true,
  });

  setTimeout(() => {
    sendData(channel, ++initial, end);
  }, 1);
};

const producer = async () => {
  const connection = await amqp.connect(Config.RabbitMQ.instanceURL);
  console.log(`Connected to instance with ${connection}`);

  const channel = await connection.createChannel();
  console.log(`Created channel to comunicate ${channel}`);

  const queue = 'test_queue';
  await channel.assertQueue(queue, Config.RabbitMQ.senderOptions);
  await channel.prefetch(1);
  console.log(`Queue assert ok`);

  // channel.sendToQueue(queue, Buffer.from(initial.toString()));

  sendData(channel, 0, 100000);
};

producer();