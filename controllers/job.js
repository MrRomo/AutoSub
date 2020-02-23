const crtl = {}
const { prepareFile } = require('../utils/files')
const uploader_s3 = require('../services/uploader').uploader_s3
const uploader = new uploader_s3(process.env)
const { startJob, getJob } = require('../services/video_process/aws_trascript')
const jobsUtils = require('../utils/job')
const {User, Job} = require('../models')

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


crtl.getJob = async (req, res) => {
    const { id } = req.params

    const response = await getJob(id)

    const file = response
    const { TranscriptionJobName, TranscriptionJobStatus } = file.TranscriptionJob
    let url = '#'
    if (TranscriptionJobStatus == 'COMPLETED') url = file.TranscriptionJob.Transcript.TranscriptFileUri

    res.json({
        name: TranscriptionJobName,
        id: TranscriptionJobName,
        status: TranscriptionJobStatus,
        url
    })
}

crtl.getJobs = async (req,res)=>{

    const {id} = req.user

    const jobs = await db.get({'userId': id}, Job, {'limit': 10})

    console.log(jobs);

    res.json(jobs.data)   
    
}

module.exports = crtl