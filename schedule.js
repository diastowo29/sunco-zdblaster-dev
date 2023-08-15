let Queue = require('bull');
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let workQueue = new Queue('doBlast', REDIS_URL);
const db = require("./models");
const Job = db.job;

startSchedule()

async function startSchedule () {
    let trxId = process.argv[2]
    // console.log(workQueue.getJobs())

    Job.findAll({
        where: {
            transactionId: trxId
        }
    }).then(async function(job) {
        if (job.length > 0) {
            console.log('job found')
            let jobCreated = await workQueue.add({transaction: job[0].transactionId})
            console.log(jobCreated)
        } else {
            console.log('job not found', job)
        }
    })
}

// workQueue.on('global:error', function (error) {
//     console.log('error')
//     console.log(error)
// })

// workQueue.on('waiting', function (jobId) {
//     console.log('waiting')
//     console.log(jobId)
// });

// workQueue.on('active', function (job, jobPromise) {
//     console.log('active')
//     console.log(job)
// })

// workQueue.on('global:stalled', function (job) {
//     console.log('stalled')
//     console.log(job)
// })

// workQueue.on('global:lock-extension-failed', function (job, err) {
//     console.log('lock-extension-failed')
//     console.log(job)
// });

// workQueue.on('global:progress', function (job, progress) {
//     console.log('progress')
//     console.log(job)
// })

// workQueue.on('completed', function (job, result) {
//     console.log('completed')
//     console.log(job)
// })

// workQueue.on('global:failed', function (job, err) {
//     console.log('failed')
//     console.log(job)
// })

// workQueue.on('global:paused', function () {
//     console.log('paused')
// })

// workQueue.on('global:resumed', function (job) {
//     console.log('resumed')
//     console.log(job)
// })

// workQueue.on('cleaned', function (jobs, type) {
//     console.log('cleaned')
//     console.log(jobs)
// });

// workQueue.on('global:drained', function () {
//     console.log('drained')
// });

// workQueue.on('global:removed', function (job) {
//     console.log('removed')
//     console.log(job)
// });


/* function generateRandomPhoneNumber() {
    const digits = '0123456789';
    let phoneNumber = '9'; // Assuming the first digit is always 9 (common for mobile numbers in some countries)

    for (let i = 0; i < 9; i++) {
        phoneNumber += digits[Math.floor(Math.random() * digits.length)];
    }

    return phoneNumber;
}

// Generate an array of random mobile phone numbers
function generateRandomPhoneNumbers(count) {
    const phoneNumbers = [];
    
    for (let i = 0; i < count; i++) {
        phoneNumbers.push(generateRandomPhoneNumber());
    }
    
    return phoneNumbers;
}

// Generate 4000 random mobile phone numbers
const numberOfPhoneNumbers = 4000;
const randomPhoneNumbers = generateRandomPhoneNumbers(numberOfPhoneNumbers);

readFile();
// fs.writeFile('random_phone_numbers.json', JSON.stringify(randomPhoneNumbers), (err) => {
//     if (err) {
//         console.error('Error writing to file:', err);
//     } else {
//         console.log('Random phone numbers saved to random_phone_numbers.json');
//         readFile();
//     }
// });

function readFile () {
    console.log((memoryUsage().heapUsed)/1024/1024);
    console.log(randomPhoneNumbers.length)
    // fs.readFile('random_phone_numbers.json', 'utf8', (err, data) => {
    //     if (err) {
    //         console.error('Error reading file:', err);
    //     } else {
    //         try {
    //             const phoneNumbers = JSON.parse(data);
                
    //             // Loop through the array of phone numbers
    //             // phoneNumbers.forEach((phoneNumber, index) => {
    //             //     console.log(`Phone number ${index + 1}: ${phoneNumber}`);
    //             // });
    //             console.log((memoryUsage().heapUsed)/1024/1024);
    //             console.log(phoneNumbers.length)
                
    //         } catch (parseError) {
    //             console.error('Error parsing JSON:', parseError);
    //         }
    //     }
    // });
} */