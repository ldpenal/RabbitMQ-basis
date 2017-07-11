export default {
  url: 'amqp://localhost',
  exchange: {
    type: 'direct',
    name: 'logs_exchange',
  },
  routingKeys: {
    criticalLogs: 'critical_logs',
    normalLogs: 'normal_logs',
  },
};