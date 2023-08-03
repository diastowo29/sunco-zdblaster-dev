let Queue = require('bull');
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

let workQueue = new Queue('work', REDIS_URL);
const db = require("./models");
const History = db.histories;

startSchedule()

async function startSchedule () {
    // History.findAll().then(function(histories) {
    //     console.log(histories)
    // })
    let job = await workQueue.add();
    console.log(job)
}