import amqp from 'amqplib';
import { RabbitMQ, Exchanges } from '../config';

const publishData = (channel, exchangeToUse) => {
  const now = Date.now();
  const dataToSend = Buffer.from(now.toString());

  channel.publish(exchangeToUse, '', dataToSend);
  console.log(`Data sent ${now.toString()}`);
  
  setTimeout(() => publishData(channel, exchangeToUse), 1000);
};

const createPublisher = async (options = {}) => {
  console.log(`Options to use ${options}`);

  const connection = await amqp.connect(RabbitMQ.instanceURL);
  console.log(`Connected to instance ${connection}`);

  const channel = await connection.createChannel();
  console.log(`Connected to channel ${channel}`);

  const exchangeToUse = Exchanges.logs;
  console.log(`Exchange to use ${exchangeToUse}`);
  await channel.assertExchange(exchangeToUse, 'fanout', options);

  publishData(channel, exchangeToUse);
};

createPublisher({
  durable: true,
});