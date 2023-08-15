// const winston = require('winston')
// const {Loggly} = require('winston-loggly-bulk')
// var { job } = require('./sequelize')
const SunshineConversationsClient = require('sunshine-conversations-client')

var apiInstance = new SunshineConversationsClient.ConversationsApi()
var filter = new SunshineConversationsClient.ConversationListFilter()
var conversationCreateBody = new SunshineConversationsClient.ConversationCreateBody()
var clientApiInstance = new SunshineConversationsClient.ClientsApi()
var userApiInstance = new SunshineConversationsClient.UsersApi()
var userCreateBody = new SunshineConversationsClient.UserCreateBody()
var messageApiInstance = new SunshineConversationsClient.MessagesApi()
const v8 = require('v8');


const { memoryUsage } = require('node:process');

const db = require("./models"); // GANTI
const History = db.histories; // GANTI
const Job = db.job; // GANTI

var chunk = require('chunk')
let chunkSize = 50

// var scheduleDate = new Date()
// scheduleDate.setHours(scheduleDate.getHours(),0,0)
// var q = scheduleDate.toISOString().split('T')[0]
// console.log('query',q, 'at',scheduleDate.getHours(), 'UTC time')

let maxJob = 1;
let workers = maxJob;
let maxJobsPerWorker = maxJob;

let throng = require('throng');
let Queue = require("bull");
const { throws } = require('assert')
let REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

let DEV_MODE = true;

function start() {
  // Connect to the named work queue
  let workQueue = new Queue('job4', {
    redis: REDIS_URL,
    settings: {}
  });
  // let workQueue = new Queue('doBlast', REDIS_URL);
  workQueue.process(maxJobsPerWorker, async (job, done) => {
    console.log('get new job')
    excludeNumber = [];
    runSchedule(job, done);

    /* CREATE ERROR HEAP SIZE LIMIT */
    // const array = [];
    // while (true) {
    //     array.push(new Array(1000000)); // Allocating a large array
    // }
  });
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start });

function runSchedule(jobQueue, done){
  console.log('runSchedule()')
  History.findAll({
    where: {
      transactionId: jobQueue.data.transaction
    }
  }).then(function(histories) {
    let excludeNumber = []
    histories.forEach(history => {
      excludeNumber.push(history.phoneNumber);
    });

    Job.findAll({
      where: {
        transactionId: jobQueue.data.transaction
      }
    }).then(function(job) {
      var param = {
        data:{
          row_id: job[0].id,
          app_id: job[0].appId,
          channel_id: job[0].channelId,
          zd_agent: job[0].zdAgent,
          transaction_id: job[0].transactionId,
          user_count: job[0].userCount,
          channel_name: job[0].channelName,
          notifications: JSON.parse(job[0].jobs)
        },
        cookies: JSON.parse(job[0].cookies)
      }
      asyncBlast(param.data, param.cookies, excludeNumber, jobQueue, done);
    })
  })
}

async function asyncBlast(body, cookies, excludeNumber, jobQueue, done){
    console.log('======= Start Blast ==========')
    var notifications = body.notifications
    var data = {
        app_id: body.app_id,
        channel_id: body.channel_id,
        zd_agent: body.zd_agent,
        transaction_id: body.transaction_id,
        user_count: body.user_count,
        channel_name: body.channel_name
    }

    if(body.hasOwnProperty('row_id')) data.row_id = body.row_id

    getApiInstance(cookies.account_id, cookies.account_secret)
    var arrChunk = chunk(notifications, chunkSize) //DF --- dibagi per 50 array

    let startChunk = 0; // DF --- in case ada problem tengah jalan
    let startArray = 0; // DF --- in case ada problem tengah jalan

    for (let i = startChunk; i < arrChunk.length; i++) {
      for(var x = startArray; x < arrChunk[i].length; x++){
        const heapStatistics = v8.getHeapStatistics();
        console.log('chunk', (i)*chunkSize, 'index', x)
        console.log('rss', (memoryUsage().rss)/1024/1024);
        console.log('total', (memoryUsage().heapTotal)/1024/1024);
        console.log('used', (memoryUsage().heapUsed)/1024/1024);
        console.log('Heap Size Limit: ', heapStatistics.heap_size_limit / 1024 / 1024, 'MB');
        if (arrChunk[i][x] !== undefined) {
          if (!excludeNumber.includes(arrChunk[i][x].metadata.user_phone)) {
            await retry(() => getUserAsync(data, arrChunk[i][x], cookies, x));
          } else {
            console.log(`this phone number: ${arrChunk[i][x].metadata.user_phone} already blasted`)
          }
        }
        if (x == 3) {
          throw new Error ('TEST')
        }
        console.log('progress', (((i)*chunkSize)+x))
        jobQueue.progress(((i)*chunkSize)+x)
      }
      startArray = 0;
    }
    console.log('job done')
    done();
}

function getUserAsync(data, notification, cookies, index){
  console.log('getUserAsync()')
  filter = new SunshineConversationsClient.ConversationListFilter()
  filter.userExternalId = notification.metadata.user_external_id
  var opts = {
    'page': new SunshineConversationsClient.Page()
  }
  return apiInstance.listConversations(cookies.app_id, filter, opts).then(function(list) {
    if(list.conversations.length<1){
      var createConvParam = {
        type: 'personal',
        participants: [{
          userExternalId: notification.metadata.user_external_id,
          subscribeSDKClient: false
        }]
      }
      if (!DEV_MODE) {
        return createConversationAsync(data, notification, cookies, createConvParam)
      }
    } else {
      if (!DEV_MODE) {
        return postMessageAsync(data, notification, cookies, list.conversations[0].id, 0)
      }
    }
  }, function(error) {
    console.error('//// get conversations error:', error.status)
    if (!DEV_MODE) {
      return createWaUserAsync(data, notification, cookies)
    }
  })
}

function createConversationAsync(data, notification, cookies, createConvParam){
  console.log('createConversationAsync()')
  var appId = cookies.app_id
  conversationCreateBody = new SunshineConversationsClient.ConversationCreateBody()
  conversationCreateBody.type = createConvParam.type
  conversationCreateBody.participants = createConvParam.participants

  apiInstance.createConversation(appId, conversationCreateBody).then(function(conv) {
    var createClientParam = {
      matchCriteria: {
        type: 'whatsapp',
        integrationId: data.channel_id,
        primary: true,
        phoneNumber: notification.metadata.user_phone
      },
      confirmation: {
          type: 'immediate'
      },
      target: {
          conversationId: conv.conversation.id
      }
    }
    createClientAsync(data, notification, cookies, createClientParam)
  }, function(error) {
    console.error('//// create conversation error',error.status)
    createHistory(rowHistory(data.transaction_id, notification,null,false,'create sunco conversation failed'))
  })
}

function createWaUserAsync(data, notification, cookies){
  console.log('createWaUserAsync')
  var appId = cookies.app_id
  var displayName = notification.metadata.user_name === undefined ? 'WA User: ' + notification.metadata.user_phone : notification.metadata.user_name.split(' ') // DF --- ada nama yg gak keisi
  console.log('create user', displayName)
  userCreateBody = new SunshineConversationsClient.UserCreateBody()
  var surename = null

  if(displayName.length>1){
    surename = ''
    for(var x=1; x < displayName.length; x++){
      surename += ' ' + displayName[x]
    }
  }

  userCreateBody.externalId = notification.metadata.user_external_id
  userCreateBody.profile = {
    givenName: displayName[0] == '' ? displayName[1] : displayName[0], // DF --- kadang array pertama empty
    surename: surename
  }
  userApiInstance.createUser(appId, userCreateBody).then(function(user) {
    console.log('user created', JSON.stringify(user))
    var createConvParam = {
      type: 'personal',
      participants: [{
        userExternalId: notification.metadata.user_external_id,
        subscribeSDKClient: false
      }]
    }

    createConversationAsync(data, notification, cookies, createConvParam)
  }, function(error) {
    console.error('//// create user error', error.status)
    createHistory(rowHistory(data.transaction_id, notification,null,false,'create sunco user failed'))
  })
}


function createClientAsync(data, notification, cookies, param){
  console.log('createClientAsync()')
  var appId = cookies.app_id
  var userIdOrExternalId = notification.metadata.user_external_id
  
  clientApiInstance.createClient(appId, userIdOrExternalId, param).then(function(client) {
    console.log('client created' + JSON.stringify(client))
    postMessageAsync(data, notification, cookies, param.target.conversationId, 0)
  }, function(error) {
    console.error('//// create client error', error.status)
    createHistory(rowHistory(data.transaction_id, notification,null,false,'create sunco client failed'))
  })
}


function postMessageAsync(data, notification, cookies, conversationId, retryTime){
  console.log('postMessageAsync()');
  console.log('postMessageAsync()',retryTime)
  var appId = cookies.app_id

  if (!DEV_MODE) {
    messageApiInstance.postMessage(appId, conversationId, notification).then(function(message) {
      console.log('=== messagePosted ===',JSON.stringify(message))
      createHistory(rowHistory(data.transaction_id, notification,message.messages[0].id,true,null))
    }, function(err) {
      console.log(JSON.stringify(err))
      var errorTitle = err.body.errors[0].title
      if(errorTitle == "The integration exists but the participant does not have the specified client"){
        removeUserAsync(data, notification,cookies)
      }else{
        if(retryTime<3){
          setTimeout(function(){
            retryTime = retryTime+1
            postMessageAsync(data, notification, cookies, conversationId, retryTime) // DF --- masih perlu?
          }, 5000)
        }else{
          createHistory(rowHistory(data.transaction_id, notification,null,false,'sunco client has not active'))
        }
      }
    })
  }
}

function createHistory(param){
  History.create(param).then(result => {
    console.log('createRowHistoryTable',JSON.stringify(result))
  }).catch(err =>{
    console.log('create history data error', JSON.stringify(err))
  })
}

// DF --- exponential backoff - belum dites (blm ada kejadian 429)
async function retry(fn, retries = 10, initialDelayMs = 10000, maxDelayMs = 60000, factor = 2) {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.message.includes('429')) {
      console.log(`Retrying... (${retries} attempts left)`);
      const delay = Math.min(initialDelayMs * Math.pow(factor, retries - 1), maxDelayMs);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return await retry(fn, retries - 1, initialDelayMs, maxDelayMs, factor);
    } else {
      throw error;
    }
  }
}

function getApiInstance(username, password){
  var defaultClient = SunshineConversationsClient.ApiClient.instance
  var basicAuth = defaultClient.authentications['basicAuth']
  basicAuth.username = username
  basicAuth.password = password
}

function removeUserAsync(data, notification, cookies){
  console.log('remove user')
  var appId = cookies.app_id
  var userIdOrExternalId = notification.metadata.user_external_id

  userApiInstance.deleteUser(appId, userIdOrExternalId).then(function(del) {
    console.log('delete user API called successfully.')
    // winstonLog('info','removeUserAsync()','delete sunco user api', `remove sunco user success`, del)
    createWaUserAsync(data, notification,cookies)
  }, function(error) {
    console.error('remove user error', JSON.stringify(error))
  })
}

// level = router name, fun = function name, process = process running, data = additional data when exist
function winstonLog(level, fun, process, message, data){
  /* winston.log(level, {
    router: 'bin/every_hour_jobs.js',
    function: fun,
    process: process,
    message: message,
    data: data
  }) */
}

function rowHistory(transactionId, notification, messageId, isSuccess, failDetail){
  var row;
  // GANTI KEY OBJECTNYA
  if(isSuccess) {
    row = {
      transactionId: transactionId,
      endUserName: notification.metadata.user_name,
      phoneNumber: notification.metadata.user_phone,
      messageId : messageId,
      status: 'SENT'
    }
  }else{
    row = {
      transactionId: transactionId,
      endUserName: notification.metadata.user_name,
      phoneNumber: notification.metadata.user_phone,
      status: 'UNSENT',
      detail: failDetail
    }
  }

  return row
}