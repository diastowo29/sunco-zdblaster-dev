let workQueue = require('./config/redis.config')
const db = require("./models");
const Job = db.job;

startSchedule()

async function startSchedule () {
    let trxId = process.argv[2]
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