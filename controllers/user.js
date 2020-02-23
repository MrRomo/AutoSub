const crtl = {}
const { prepareFile } = require('../utils/files')
const uploader_s3 = require('../services/uploader').uploader_s3
const uploader = new uploader_s3(process.env)
const { startJob, getJob } = require('../services/video_process/aws_trascript')
const jobsUtils = require('../utils/job')
const {User, Job} = require('../models')


crtl.getJobs = async (req,res) => {
    
    res.render('jobs', {title:'Trabajos', user:req.user})
}




module.exports = crtl