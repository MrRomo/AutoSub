const jobs = {}
const { File, Job, User } = require('../models')
const { mongo_db } = require('../database')



jobs.save = async (user, fileQuery, name) => {


    const { id } = user
    const jobQuery = {
        userId: user.id,
        name,
        jobName: fileQuery.jobName
    }

    console.log('SAVING JOBS', jobQuery);

    const jobResult = await db.create(jobQuery, Job)

    console.log(jobResult);   
    
    const userResult = await db.update({ query: { 'id': id }, options: { $inc: { jobs: 1 } } }, User)
    
    console.log(userResult);

    const fileVideoQuery = {
        userId: id,
        jobId: jobResult.data._id,
        Key: fileQuery.Key,
        Bucket: fileQuery.Bucket,
        filename: fileQuery.filename,
        ext: fileQuery.filename.split('.')[1],
        size: fileQuery.size
    }

    console.log('savingFile', fileVideoQuery);    

    const videoFile = await db.create(fileVideoQuery, File)

    console.log('jobResult of process');
    console.log(jobResult);
    console.log(userResult);
    console.log(videoFile);

}

module.exports = jobs