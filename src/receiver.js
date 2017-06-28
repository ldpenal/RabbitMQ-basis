import amqp from 'amqplib';

const consumer = async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'test_queue';

  console.log(`Waiting for messages on consumer`);

  channel.consume(
    queue,
    message => {
      console.log(`Message received ${JSON.stringify(message)} \n`);
      channel.ack(message);
    },
    { noAck: false }
  );
};

consumer();