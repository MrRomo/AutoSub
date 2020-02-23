require('dotenv').config()
const aws = require('aws-sdk');
const uploader_s3 = require('../../services/uploader').uploader_s3
const uploader = new uploader_s3(process.env)

const srtConvert = require('aws-transcription-to-srt')

const { File } = require('../../models')


aws.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    ACL: process.env.ACL
})
const transcribe = {}
var transcribeservice = new aws.TranscribeService()

transcribe.startJob = async (key, jobName) => {
    console.log('Start transcription');
    const S3 = new aws.S3()

    var params = {
        LanguageCode: "es-US", /* required */
        Media: { /* required */
            MediaFileUri: `https://uploaderator.s3.amazonaws.com/${key}`
        },
        TranscriptionJobName: jobName,
        MediaFormat: "mp4",
        OutputBucketName: 'uploaderator',
    }

    return await transcribeservice.startTranscriptionJob(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
}

transcribe.getJob = async (jobName) => {
    var params = {
        TranscriptionJobName: jobName /* required */
    };
    var result = await new Promise((resolve, reject) => {
        transcribeservice.getTranscriptionJob(params, (err, data) => {
            if (err) {
                console.log('error en la consulta')
            }
            else {
                resolve(data)
            }
        })
    })
    return result
}


transcribe.aws2str = async (job) => {
    const { Bucket, ACL } = process.env
    const data = await uploader.download({ Bucket, Key: `AutoSub/${job.userId}/${job.jobName}/${job.jobName}.json`})
    const subAWS = JSON.parse(data.Body)
    const srt = srtConvert(subAWS)
    const Key = `AutoSub/${job.userId}/${job.jobName}/${job.jobName}.srt`
    const params = {
        Body: Buffer.from(srt, 'utf8'),
        Bucket,
        Key,// pass key
        ACL
    }

    const uploaded = await uploader.uploadFile(params)
    const query = {
        userId: job.userId,
        jobId: job._id,
        Key,
        Bucket,
        filename: job.jobName + '.srt',
        ext: 'srt',
        size: data.ContentLength/1000,
    }
    await db.create(query, File)

    return uploaded
}
module.exports = transcribe