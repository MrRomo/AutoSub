const crtl = {}
const { prepareFile } = require('../utils/files')
const uploader_s3 = require('../services/uploader').uploader_s3
const uploader = new uploader_s3(process.env)
const { startJob, getJob, aws2str } = require('../services/video_process/aws_trascript')
const jobsUtils = require('../utils/job')
const { User, Job, File } = require('../models')
const fs = require('fs');

const { JobService } = require('./../services/jobs')

crtl.processVideo = async (req, res) => {
    console.log('Processing video¡¡');
    const { user } = req
    const { path } = req.file
    const { name } = req.body
    const { params, data } = await prepareFile(req)

    try {

        const { database } = await uploader.upload(data, params, false)
        const { Key, filename } = database
        await startJob(Key, database.jobName)

        const result = await jobsUtils.save(req.user, database, name)

    } catch (error) {
        console.log(error)
    }
    res.redirect('/jobs')
}

crtl.getJobs = async (req, res) => {
    const { id } = req.user

    jobs = await db.get({ 'userId': id }, Job, { 'limit': 10, 'sort': { 'createdAt': -1 } })

    res.json(jobs.data)
}


crtl.updateState = async (req, res) => {

    const jobsId = req.body._id
    const query = req.body

    const jobs = []


    await Promise.all(jobsId.map(async (id) => {
        console.log('start foreach');
        const job = new JobService(query)
        await job.init()
        await job.check()
        jobs.push(job.job)
        return job.job
    }));

    console.log('jobs', jobs)
    console.log('jobsID', jobsId)

    res.json(jobs)
}

module.exports = crtl