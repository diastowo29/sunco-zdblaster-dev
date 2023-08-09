let Queue = require('bull');
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

let workQueue = new Queue('rerunBlast', REDIS_URL);

const db = require("./models");
const Job = db.job;

startSchedule()

async function startSchedule () {
    let trxId = process.argv[2]
    return Job.findAll({
        where: {
            transactionId: trxId
        }
    }).then(async function(job) {
        console.log('get job', job[0].id)
        await workQueue.add({transaction: job[0].transactionId});
    })
}