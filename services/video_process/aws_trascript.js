require('dotenv').config()
const aws = require('aws-sdk');
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

module.exports = transcribe