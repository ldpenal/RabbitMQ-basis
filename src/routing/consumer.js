import Config from './config';
import amqp from 'amqplib';

console.log('Config ', Config);

export const sendData = async (channel, data, routingKey) => {
  console.log(data);
  channel.publish(Config.exchange.name, routingKey, Buffer.from(data));
};

const createConnection = async () => {
  return await amqp.connect(Config.url, {});
};

export const createConsumer = async (queue) => {
  const connection = await createConnection();
  console.log(`Connection ${connection}`);

  const channel = await connection.createChannel();
  console.log(`Channel ${channel}`);

  await channel.assertExchange(
    Config.exchange.name,
    Config.exchange.type,
    { durable: true }
  );

  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, Config.exchange.name, 'q1');
  
  channel.consume(
    queue,
    message => {
      console.log(message.content.toString());
      channel.ack(message);
    },
    {}
  );
}

const indexOf = process.argv.indexOf('-q');
const queueName = process.argv[indexOf + 1] || String.valueOf(Date.now());
console.log(`Queue name ${queueName}`);

createConsumer(queueName);

