require('dotenv').config()
const aws = require('aws-sdk');
aws.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

var transcribeservice = new aws.TranscribeService()
const S3 = new aws.S3()

var params = {
    LanguageCode: "es-US", /* required */
    Media: { /* required */
        MediaFileUri: 'https://uploaderator.s3.amazonaws.com/AutoSub/nirvana.mp3'
    },
    TranscriptionJobName: 'AutoSub4', /* required */
    // JobExecutionSettings: {
    //     AllowDeferredExecution: false
    // },
    MediaFormat: "mp3",
    OutputBucketName: 'uploaderator',
    // OutputEncryptionKMSKeyId: 'STRING_VALUE',
    // Settings: {
    //   ChannelIdentification: true || false,
    //   MaxAlternatives: 'NUMBER_VALUE',
    //   MaxSpeakerLabels: 'NUMBER_VALUE',
    //   ShowAlternatives: true || false,
    //   ShowSpeakerLabels: true || false,
    //   VocabularyFilterMethod: remove | mask,
    //   VocabularyFilterName: 'STRING_VALUE',
    //   VocabularyName: 'STRING_VALUE'
    // }
};
transcribeservice.startTranscriptionJob(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);           // successful response
});