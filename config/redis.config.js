let Queue = require('bull');
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
var redis_url = require('url').parse(REDIS_URL)

let workQueue = new Queue('job7', REDIS_URL, {
    settings: {
        maxStalledCount: 0
    }
});


module.exports=workQueue