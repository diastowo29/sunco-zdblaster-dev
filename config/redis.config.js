let Queue = require('bull');
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
var redis_url = require('url').parse(REDIS_URL)

let workQueue = new Queue('job6', {redis: {
    port: redis_url.port,
    host: redis_url.hostname,
    db: redis_url.db,
    password: redis_url.password
}});


module.exports=workQueue