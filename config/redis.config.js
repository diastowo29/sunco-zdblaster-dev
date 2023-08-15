let Queue = require('bull');
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let workQueue = new Queue('job6', REDIS_URL);

module.exports=workQueue