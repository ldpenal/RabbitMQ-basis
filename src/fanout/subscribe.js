import amqp from 'amqplib';
import { RabbitMQ, Exchanges } from '../config';

const createReceiver = async (queue, options = {}) => {
  const connection = await amqp.connect(RabbitMQ.instanceURL);
  console.log(`Connected to instance ${connection}`);

  const channel = await connection.createChannel();
  console.log(`Created channel ${channel}`);

  await channel.assertExchange(Exchanges.logs, 'fanout', options);
  console.log(`asserted exchange`);

  const queueToBind = await channel.assertQueue(queue, { durable: true, exclusive: true });
  console.log(`Queue to bind to exchange: ${queueToBind}`);

  await channel.bindQueue(queueToBind.queue, Exchanges.logs, '');

  console.log(`Waiting for messages on consumer`);
  channel.consume(
    queueToBind.queue,
    message => {
      console.log('Message received ', message.content.toString());
      channel.ack(message);
    },
    RabbitMQ.receiverOptions
  );
};

const indexOf = process.argv.indexOf('-q');
const queueName = process.argv[indexOf + 1] || String.valueOf(Date.now());
console.log(`Queue name ${queueName}`);

createReceiver(queueName, {
  durable: true,
});