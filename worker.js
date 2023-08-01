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


var chunk = require('chunk')
let chunkSize = 50

// winston.add(new Loggly({
//   token: "1d835ca8-9a5e-41c9-90e7-f21a729f3a44",
//   subdomain: "rahdityo89",
//   tags: ["maa-zdblaster"],
//   json: true
// }))

var scheduleDate = new Date()
scheduleDate.setHours(scheduleDate.getHours(),0,0)
var q = scheduleDate.toISOString().split('T')[0]
console.log('query',q, 'at',scheduleDate.getHours(), 'UTC time')
// winstonLog('info','scheduler','jobs running..', `schedule run at ${q}, ${scheduleDate.getHours()+7}:00 asia/jakarta timezone`, null)

// job.findAll({
//   where: {
//     transaction_id: '1690282482186' // DF --- hardcoded - nanti ganti 
//   }
// }).then(result =>{
//   if(result.length>0){
//     console.log(`found ${result.length} schedules`)
//     // winstonLog('info','scheduler','get jobs', `found ${result.length} schedules`, result)
//     runSchedule(result, 0)
//   }else{
//     // winstonLog('info','scheduler','get jobs', 'no jobs at this time', result)
//     console.log('no jobs at this time')
//   }
// }).catch(err =>{
//   // winstonLog('error','scheduler','get jobs', `get jobs error`, err)
//   console.log(JSON.stringify(err))
// })

// DF --- exclude manual data yg udah kekirim
// let excludeNumber = ['+6285270100300', 
//   '+6282341975439',
//   '+6282131455812',
//   '+628561802581',
//   '+6281314431333',
//   '+6281232851843',
//   '+6282370119200',
//   '+6285242428023',
//   '+6281287888808',
//   '+628881530025',
//   '+628161970446',
//   '+6281282473808',
//   '+6281234504321',
//   '+6281229010011',
//   '+6281933167890',
//   '+628116060996',
//   '+6281212214112',
//   '+6281285318657',
//   '+6281270564441',
//   '+6281299198102',
//   '+6285728517913',
//   '+6282187467374',
//   '+6281286132260',
//   '+6281361771100',
//   '+6283168151281',
//   '+62818975677',
//   '+628123215188',
//   '+6281221414317',
//   '+6281380333830',
//   '+6281286571751',
//   '+6289673935848',
//   '+6281263395276',
//   '+6281273027300',
//   '+628122045066',
//   '+6281222549972',
//   '+6282117713550',
//   '+6287798050034',
//   '+628119957987',
//   '+6287886951986',
//   '+6287886951986',
//   '+6287889087887',
//   '+628179869865',
//   '+6281288938865',
//   '+62895335335744',
//   '+62816884346',
//   '+62811956056',
//   '+6281212306069',
//   '+6285624111004',
//   '+628561913893',
//   '+6282377624240',
//   '+6285727371694',
//   '+628127592142',
//   '+62816884346',
//   '+6285727371694',
//   '+6281361316557',
//   '+6287798050034',
//   '+628119957987',
//   '+6281288938865',
//   '+6285624111004',
//   '+6287889087887',
//   '+628127592142',
//   '+6281361316557',
//   '+62895335335744',
//   '+628179869865',
//   '+628561913893',
//   '+6287886951986',
//   '+6285727371694',
//   '+6287798050034',
//   '+628119957987',
//   '+6281288938865',
//   '+6285624111004',
//   '+6287889087887',
//   '+628561913893',
//   '+62895335335744',
//   '+628127592142',
//   '+6281361316557',
//   '+62816884346']

runSchedule();
function runSchedule(){
    console.log('runSchedule()')
    let sample = require('./sample.json')
    
    var param = {
        data:{
            row_id: sample.data.id,
            app_id: sample.data.app_id,
            channel_id: sample.data.channel_id,
            zd_agent: sample.data.zd_agent,
            transaction_id: sample.data.transaction_id,
            user_count: sample.data.user_count,
            channel_name: sample.data.channel_name,
            notifications: sample.data.notifications
        },
        cookies: JSON.parse(sample.cookies)
    }
    asyncBlast(param.data, param.cookies);
}

async function asyncBlast(body, cookies){
    console.log('=======asyncBlast()===============')
    var notifications = body.notifications
    var data = {
        app_id: body.app_id,
        channel_id: body.channel_id,
        zd_agent: body.zd_agent,
        transaction_id: body.transaction_id,
        user_count: body.user_count,
        channel_name: body.channel_name
    }

    // console.log('asyncBlast()',JSON.stringify(data))

    if(body.hasOwnProperty('row_id')) data.row_id = body.row_id

    getApiInstance(cookies.account_id, cookies.account_secret)
    var arrChunk = chunk(notifications, chunkSize) //DF --- dibagi per 50 array

    let startChunk = 0; // DF --- in case ada problem tengah jalan
    let startArray = 0; //DF --- in case ada problem tengah jalan

    for (let i = startChunk; i < arrChunk.length; i++) {
        for(var x = startArray; x < arrChunk[i].length; x++){
        console.log('chunk ', (i)*chunkSize)
        console.log('index' , x);
            if (arrChunk[i][x] !== undefined) {
                await retry(() => getUserAsync(data, arrChunk[i][x], cookies, x));
            }
        }
        startArray = 0;
    }
}

function getUserAsync(data, notification, cookies, index){
  console.log('getUserAsync()')
  filter = new SunshineConversationsClient.ConversationListFilter()
  filter.userExternalId = notification.user.id
  var opts = {
    'page': new SunshineConversationsClient.Page()
  }

  // winstonLog('info','getUserAsync()','get sunco conversation', `get conversation by userExternalId : ${notification.user.id}`, {prop: data, notification: notification, cookies: cookies, index: `${index} of ${data.user_count}`})

  return apiInstance.listConversations(cookies.app_id, filter, opts).then(function(list) {
    console.log('get conversations: ' + JSON.stringify(list))
    // winstonLog('info','getUserAsync()','get sunco conversation api', `get conversation by API success`, list)

    if(list.conversations.length<1){
      var createConvParam = {
        type: 'personal',
        participants: [{
          userExternalId: notification.user.id,
          subscribeSDKClient: false
        }]
      }
    //   return createConversationAsync(data, notification, cookies, createConvParam)
    } else {
    //   return postMessageAsync(data, notification, cookies, list.conversations[0].id, 0)
    }
  }, function(error) {
    console.error('get conversations error', JSON.stringify(error))
    // winstonLog('error','getUserAsync()','get sunco conversation api', `get conversation by API failed`, error)
    // return createWaUserAsync(data, notification, cookies)
  })
}

function createConversationAsync(data, notification, cookies, createConvParam){
  console.log('createConversationAsync()')
  // getApiInstance(cookies.account_id, cookies.account_secret)
  // var apiInstance = new SunshineConversationsClient.ConversationsApi()
  var appId = cookies.app_id
  conversationCreateBody = new SunshineConversationsClient.ConversationCreateBody()
  conversationCreateBody.type = createConvParam.type
  conversationCreateBody.participants = createConvParam.participants
  // winstonLog('info','createConversationAsync()','creating conversation', 'create sunco conversation', {create_param: conversationCreateBody, prop: data, notification: notification, cookies:cookies})

  apiInstance.createConversation(appId, conversationCreateBody).then(function(conv) {
    // console.log('conversation created' + JSON.stringify(conv))
    // winstonLog('info','createConversationAsync()','create sunco conversation api', 'create sunco conversation success', conv)
    var createClientParam = {
      matchCriteria: {
        type: 'whatsapp',
        integrationId: data.channel_id,
        primary: true,
        phoneNumber: notification.user.phone_number
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
    console.error('create conversation error',JSON.stringify(error))
    // winstonLog('error','createConversationAsync()','create sunco conversation api', 'create sunco conversation failed', error)
    // if(data.hasOwnProperty('row_id')) jobIncrement(data.row_id)
    createHistory(rowHistory(data.transaction_id, notification,null,false,'create sunco conversation failed'))
  })
}

function createWaUserAsync(data, notification, cookies){
  console.log('createWaUserAsync')
  // console.log(notification.user)
  // getApiInstance(cookies.account_id, cookies.account_secret)
  var appId = cookies.app_id
  var displayName = notification.user.name === undefined ? 'WA User: ' + notification.user.phone_number : notification.user.name.split(' ') // DF --- ada nama yg gak keisi
  console.log('create user', displayName)
  userCreateBody = new SunshineConversationsClient.UserCreateBody()
  var surename = null

  if(displayName.length>1){
    surename = ''
    for(var x=1; x < displayName.length; x++){
      surename += ' ' + displayName[x]
    }
  }

  userCreateBody.externalId = notification.user.id
  userCreateBody.profile = {
    givenName: displayName[0] == '' ? displayName[1] : displayName[0], // DF --- kadang array pertama empty
    surename: surename
  }

  // winstonLog('info','createWaUserAsync()','creating sunco user', `create sunco user  with phone number ${notification.user.phone_number}`, {create_param: userCreateBody, prop: data, notification: notification, cookies: cookies})
  userApiInstance.createUser(appId, userCreateBody).then(function(user) {
    console.log('user created', JSON.stringify(user))
    // winstonLog('info','createWaUserAsync()','create user api', `create sunco user success`, user)
    var createConvParam = {
      type: 'personal',
      participants: [{
        userExternalId: notification.user.id,
        subscribeSDKClient: false
      }]
    }

    createConversationAsync(data, notification, cookies, createConvParam)
  }, function(error) {
    console.error('create user error', JSON.stringify(error))
    // winstonLog('error','createWaUserAsync()','create user api', `create sunco user failed`, error)
    // if(data.hasOwnProperty('row_id')) jobIncrement(data.row_id)
    createHistory(rowHistory(data.transaction_id, notification,null,false,'create sunco user failed'))
  })
}


function createClientAsync(data, notification, cookies, param){
  console.log('createClientAsync()')
  // getApiInstance(cookies.account_id, cookies.account_secret)
  var appId = cookies.app_id
  var userIdOrExternalId = notification.user.id
  // winstonLog('info','createClientAsync()','creating sunco client', `create sunco client with userExternalId ${userIdOrExternalId}`, {create_param: param, notification: notification, cookies: cookies})
  
  clientApiInstance.createClient(appId, userIdOrExternalId, param).then(function(client) {
    console.log('client created' + JSON.stringify(client))
    // throw new Error('done')
    // winstonLog('info','createClientAsync()','create sunco client api', 'create sunco client success', client)
    postMessageAsync(data, notification, cookies, param.target.conversationId, 0)
  }, function(error) {
    console.error('create client error', JSON.stringify(error))
    // winstonLog('error','createClientAsync()','create sunco client api', 'create sunco client failed', error)
    // if(data.hasOwnProperty('row_id')) jobIncrement(data.row_id)
    createHistory(rowHistory(data.transaction_id, notification,null,false,'create sunco client failed'))
  })
}


function postMessageAsync(data, notification, cookies, conversationId, retryTime){
    console.log('postMessageAsync()');
  /* console.log('postMessageAsync()',retryTime)
  var appId = cookies.app_id
  console.log('message param', JSON.stringify(notification.message_data))

  messageApiInstance.postMessage(appId, conversationId, notification.message_data).then(function(message) {
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
  }) */
}

function createHistory(param){
  // winstonLog('info','createHistory()','create history', `creating history with user phone number ${param.phone_number}`, param)
  history.create(param).then(result => {
    console.log('createRowHistoryTable',JSON.stringify(result))
    // winstonLog('info','createHistory()','create row history', `create row history success`, result)
  }).catch(err =>{
    console.log('create history data error', JSON.stringify(err))
    // winstonLog('error','createHistory()','create row history', `create row history failed`, err)
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
  // getApiInstance(cookies.account_id, cookies.account_secret)
  // var apiInstance = new SunshineConversationsClient.UsersApi();

  var appId = cookies.app_id
  var userIdOrExternalId = notification.user.id
  // winstonLog('info','removeUserAsync()','deleting sunco user', `remove sunco user ${userIdOrExternalId}`, notification)

  userApiInstance.deleteUser(appId, userIdOrExternalId).then(function(del) {
    console.log('delete user API called successfully.')
    // winstonLog('info','removeUserAsync()','delete sunco user api', `remove sunco user success`, del)
    createWaUserAsync(data, notification,cookies)
  }, function(error) {
    console.error('remove user error', JSON.stringify(error))
    // winstonLog('error','removeUserAsync()','delete sunco user api', `remove sunco failed`, error)
    // if(data.hasOwnProperty('row_id')) jobIncrement(data.row_id)
    createHistory(rowHistory(data.transaction_id, notification,null,false,'re-creating user failed'))
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
  var row
  if(isSuccess) {
    row = {
      transaction_id: transactionId,
      end_user_name: notification.user.name,
      phone_number: notification.user.phone_number,
      message_id : messageId,
      status: 'SENT'
    }
  }else{
    row = {
      transaction_id: transactionId,
      end_user_name: notification.user.name,
      phone_number: notification.user.phone_number,
      status: 'UNSENT',
      detail: failDetail
    }
  }

  return row
}