const crtl = {}
const { prepareFile } = require('../utils/files')
const uploader_s3 = require('../services/uploader').uploader_s3
const uploader = new uploader_s3(process.env)
const { startJob, getJob } = require('../services/video_process/aws_trascript')
const jobsUtils = require('../utils/job')
const { User, Job } = require('../models')

crtl.processVideo = async (req, res) => {
    console.log('Processing video¡¡');
    const { user } = req
    const { path } = req.file
    const { name } = req.body
    const { params, data } = await prepareFile(req)

    try {

        const { database } = await uploader.upload(data, params, false)
        const { Key, filename } = database
        const jobName = filename.split('.')[0]

        await startJob(Key, jobName)

        const result = await jobsUtils.save(req.user, database, jobName, name)

    } catch (error) {
        console.log(error)
    }
    res.redirect('/jobs')
}

crtl.getJobs = async (req, res) => {

    const { id } = req.user

    const jobs = await db.get({ 'userId': id }, Job, { 'limit': 10, 'sort': { 'createdAt': -1 } })

    const { data } = jobs

    data.forEach(async job => {
        const result = await getJob(job.jobName)
        const { TranscriptionJobStatus } = result.TranscriptionJob
        const query = { query: { 'jobName': job.jobName }, options: { 'status': TranscriptionJobStatus, 'isCompleted': true } }
        if (TranscriptionJobStatus != job.status) db.update(query, Job)
    });

    console.log(jobs);

    res.json(jobs.data)

}

module.exports = crtl