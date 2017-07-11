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

export const createPoducer = async () => {
  const connection = await createConnection();
  console.log(`Connection ${connection}`);

  const channel = await connection.createChannel();
  console.log(`Channel ${channel}`);

  await channel.assertExchange(
    Config.exchange.name,
    Config.exchange.type,
    { durable: true }
  );

  return channel;

  // TODO send data through channel;
  // await sendData(channel);
}

