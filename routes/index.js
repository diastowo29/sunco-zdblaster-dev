var express = require('express');
var router = express.Router();
const db = require("../models");
const History = db.histories;
// let Queue = require('bull');
// let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
// let workQueue = new Queue('job4', REDIS_URL);

let workQueue = require('./config/redis.config')
const Op = db.Sequelize.Op;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/db', function(req, res, next) {
  History.findAll().then(function(histories) {
    res.status(200).send({ data: histories })
  })
})

router.get('/job', function(req, res, next) {
  workQueue.getJobs().then(function(jobsList) {
    res.status(200).send({jobs: jobsList})
  })
})

router.get('/job/:jobid', function({params}, res, next) {
    workQueue.getJob(params.jobid).then(function(job) {
      res.status(200).send({job: job})
    })
})

router.get('/joblog/:jobid', function({params}, res, next) {
    workQueue.getJobLogs(params.jobid).then(function(job) {
      res.status(200).send({job: job})
    })
})

workQueue.on('global:error', function (error) {
  console.log('error', error)
})

workQueue.on('global:waiting', function (jobId) {
  console.log('waiting', jobId)
});

workQueue.on('active', function (job, jobPromise) {
  console.log('active')
  console.log(job)
})

workQueue.on('global:stalled', function (job) {
  console.log('stalled', job)
  // workQueue.getJob(job).then(function(thisJob) {
  //   thisJob.moveToFailed('error',true)
  // })
  // console.log(job)
})

workQueue.on('global:lock-extension-failed', function (job, err) {
  console.log('lock-extension-failed', job)
});

workQueue.on('global:progress', function (job, progress) {
  console.log('progress', job)
})

workQueue.on('global:completed', function (job, result) {
  console.log('completed', job)
})

workQueue.on('global:failed', function (jobId, err) {
  console.log('failed', jobId)
  workQueue.getJob(jobId).then(function(thisJob) {
    //GET JOB ID and UPDATE TRANSACTION
  })
})

workQueue.on('global:paused', function () {
  console.log('paused')
})

workQueue.on('resumed', function (job) {
  console.log('resumed')
  console.log(job)
})

workQueue.on('cleaned', function (jobs, type) {
  console.log('cleaned')
  console.log(jobs)
});

workQueue.on('global:drained', function () {
  console.log('drained')
});

workQueue.on('global:removed', function (job) {
  console.log('removed')
  console.log(job)
});

module.exports = router;
