const redis = require('redis');
const util = require('util');

const clientGet = redis.createClient(6379, 'localhost');

clientGet.on('error', (err) => {
  console.log('Redis went wrong: ', err);
});

clientGet.once('connect', () => {
  console.log('Redis is connected');
});

clientGet.config('SET', 'maxmemory', '500mb');
clientGet.config('SET', 'maxmemory-policy', 'allkeys-lfu');

clientGet.hsetnx = util.promisify(clientGet.hsetnx).bind(clientGet);
clientGet.hget = util.promisify(clientGet.hget).bind(clientGet);
clientGet.hdel = util.promisify(clientGet.hdel).bind(clientGet);
clientGet.hexists = util.promisify(clientGet.hexists).bind(clientGet);
clientGet.hmset = util.promisify(clientGet.hmset).bind(clientGet);
clientGet.hmget = util.promisify(clientGet.hmget).bind(clientGet);

module.exports = {
  clientGet,
};

// const testing = async () => {
//   // await clientGet.sendCommand(`HSET booking:10000000 booking ${JSON.stringify([{ user_id: 100039, start_date: '2018-6-18', duration: 10 }])}`);
//   await clientGet.hset('10000000', 'booking', JSON.stringify([{ user_id: 100039, start_date: '2018-6-18', duration: 10 }]));
//   console.log(JSON.parse(await clientGet.hget('10000000', 'booking')));
// };

// testing().then(() => { process.exit(-1); });
