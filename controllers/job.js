const crtl = {}
const { prepareFile } = require('../utils/files')
const uploader_s3 = require('../services/uploader').uploader_s3
const uploader = new uploader_s3(process.env)
const { startJob, getJob } = require('../services/video_process/aws_trascript')

crtl.processVideo = async (req, res) => {
    console.log('Processing video¡¡');
    req.user = require('../mocks/user')
    const { path } = req.file
    const { params, data } = await prepareFile(req)

    try {
        // const { database } = await uploader.upload(data, params, false)
        const { Key, filename } = require('../mocks/file').original
        console.log(Key, filename);

        const jobName = filename.split('.')[0]

        console.log('Start transcription');

        await startJob(Key, jobName)

        res.json(database)
    } catch (error) {
        res.json(error)
    }
}


crtl.getJob = async (req, res) => {
    const {id} = req.params

    const response = await getJob(id)
    
    const file = response
    const {TranscriptionJobName, TranscriptionJobStatus} = file.TranscriptionJob
    let url = '#'
    if(TranscriptionJobStatus == 'COMPLETED') url =  file.TranscriptionJob.Transcript.TranscriptFileUri
    
    res.json({
        name: TranscriptionJobName,
        id: TranscriptionJobName,
        status: TranscriptionJobStatus,
        url
    })
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

module.exports = crtl