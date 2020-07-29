const crtl = {}
const { prepareFile } = require('../utils/files')
const uploader_s3 = require('../services/uploader').uploader_s3
const uploader = new uploader_s3(process.env)
const { startJob } = require('../services/video_process/aws_trascript')
const jobsUtils = require('../utils/job')
const { Job } = require('../models')

const { JobService } = require('./../services/jobs')

crtl.processVideo = async (req, res) => {
    console.log('Processing video¡¡');
    const { name } = req.body
    const { params, data } = await prepareFile(req)

    try {

        const { database } = await uploader.upload(data, params, false)
        const { Key } = database
        await startJob(Key, database.jobName)

        await jobsUtils.save(req.user, database, name)

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
    const jobs = []

    await Promise.all(jobsId.map(async (id) => {
        const job = new JobService({ '_id': id })
        await job.init()
        await job.check()
        jobs.push(job.job)
        return job.job
    }));

    console.log(jobsId);
    console.log(jobs);

    res.json(jobs)
}

crtl.updateRating = async (req, res) => {

    const query = { query: { '_id': req.body.id }, options: { stars: req.body.value } }
    
    const { data } = await db.update(query, Job)

    console.log(data);
    res.json(data)
}

module.exports = crtl