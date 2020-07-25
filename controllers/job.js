const crtl = {}
const { prepareFile } = require('../utils/files')
const uploader_s3 = require('../services/uploader').uploader_s3
const uploader = new uploader_s3(process.env)
const { startJob, getJob, aws2str } = require('../services/video_process/aws_trascript')
const jobsUtils = require('../utils/job')
const { User, Job, File } = require('../models')
const fs = require('fs');

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

    const { body } = req
    console.log(body);
    let jobs
    if (!Object.keys(body).keys.length) {
        jobs = await db.get({ 'userId': id }, Job, { 'limit': 2, 'sort': { 'createdAt': -1 } })
    } else {
        jobs = await db.get({ query }, Job, { 'limit': 2, 'sort': { 'createdAt': -1 } })
    }

    jobs = jobs.data

    let jobsChecked = []
    await jobs.forEach(async job => {
        jobCheck = await checkJob(job)
        jobsChecked.push(jobCheck)
    })

    res.json(jobs)
}


checkJob = async (job) => {
    let { Bucket } = process.env
    if (!job.isCompleted) {
        console.log('job not complete');
        const result = await getJob(job.jobName)
        const { TranscriptionJobStatus } = result.TranscriptionJob
        if (TranscriptionJobStatus != job.status) {
            var params = {
                Bucket, /* Another bucket working fine */
                CopySource: `${Bucket}/${job.jobName}.json`, /* required */
                Key: `AutoSub/${job.userId}/${job.jobName}/${job.jobName}.json`, /* required */
                ACL: 'public-read',
            }
            await uploader.move(params)
            await aws2str(job)
            const query = {
                query: { 'jobName': job.jobName },
                options: {
                    'status': TranscriptionJobStatus,
                    'isCompleted': true,
                    'Bucket': Bucket,
                    'Key': `AutoSub/${job.userId}/${job.jobName}/${job.jobName}.srt`
                }
            }
            await uploader.deleteFileS3({ Bucket, Key: `${Bucket}/${job.jobName}.json` })
            const { data } = await db.update(query, Job)
            job = data
        }
    }
    return job
}

module.exports = crtl