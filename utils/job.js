const jobs = {}
const { File, Job, User } = require('../models')
const { mongo_db } = require('../database')



jobs.save = async (user, fileQuery, jobname) => {

    const databaseService = new mongo_db(process.env)

    console.log('SAVING JOBS');
    console.log(user, database, jobname);
    const { id } = req.user
    const jobQuery = {
        userId: user.id,
        name: jobname
    }

    const jobResult = await databaseService.create(jobQuery, Job)

    console.log(jobResult);

    await databaseService.update({ id, $inc: { jobs: 1 } }, User)

    const fileVideoQuery = {
        userId: id,
        jobId: jobResult._id,
        Key: fileQuery.Key,
        Bucket: fileQuery.Bucket,
        filename: fileQuery.filename,
        ext,
        size: fileQuery.size
    }

    const videoFile = await databaseService.create(fileVideoQuery, File)
    console.log(videoFile);

    // await db.create(query, Job)


}

module.exports = jobs