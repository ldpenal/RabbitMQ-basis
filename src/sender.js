import amqp from 'amqplib';

const sendData = async (channel, initial, end) => {
  if (initial === end) return;

  console.log(initial);

  channel.sendToQueue('test_queue', Buffer.from(initial.toString()));

  setTimeout(() => {
    sendData(channel, ++initial, end);
  }, 1500);
};

const producer = async () => {
  const connection = await amqp.connect('amqp://localhost');
  console.log(`Connected to instance with ${connection}`);

  const channel = await connection.createChannel();
  console.log(`Created channel to comunicate ${channel}`);

  const queue = 'test_queue';
  await channel.assertQueue(queue, { durable: true });
  console.log(`Queue assert ok`);

  // channel.sendToQueue(queue, Buffer.from(initial.toString()));

  sendData(channel, 0, 100);
};

producer();