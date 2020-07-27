const uploader_s3 = require('../../services/uploader').uploader_s3
const uploader = new uploader_s3(process.env)
const { Job } = require('../../models')
const { getJob, aws2str } = require('../../services/video_process/aws_trascript')


class JobService {

    constructor(query) {
        this.query = query
    }

    async init() {
        const { Bucket } = process.env
        console.log('Consulta query', this.query);
        const result = await db.get(this.query, Job)
        this.job = result.data[0]
        this.params = {
            Bucket, /* Another bucket working fine */
            CopySource: `${Bucket}/${this.job.jobName}.json`, /* required */
            Key: `AutoSub/${this.job.userId}/${this.job.jobName}/${this.job.jobName}.json`, /* required */
            ACL: 'public-read',
        }
    }

    async check() {
        let { Bucket } = process.env
        if (!this.job.isCompleted) {
            console.log(`job ${this.job.jobName} not complete`);
            const result = await getJob(this.job.jobName)
            const { TranscriptionJobStatus } = result.TranscriptionJob
            if (TranscriptionJobStatus != this.job.status) {
                await uploader.move(this.params)
                await aws2str(this.job)
                const query = {
                    query: { 'jobName': this.job.jobName },
                    options: {
                        'status': TranscriptionJobStatus,
                        'isCompleted': true,
                        'Bucket': Bucket,
                        'Key': `AutoSub/${this.job.userId}/${this.job.jobName}/${this.job.jobName}.srt`
                    }
                }
                await uploader.deleteFileS3({ Bucket, Key: `${Bucket}/${this.job.jobName}.json` })
                const { data } = await db.update(query, Job)
                this.job = data[0]
            }
        }
    }
}

module.exports = JobService