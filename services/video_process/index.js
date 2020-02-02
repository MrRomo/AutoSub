const extractAudio = require('ffmpeg-extract-audio')

const task = {}

task.extractAudio = async (file) => {
    await extractAudio({
        input: 'media/1.mp4',
        output: `${file.originalName}.mp3`
      })
    return
}


module.exports = task