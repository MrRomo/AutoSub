const srtConvert = require('aws-transcription-to-srt')

const fs = require('fs');

const subtitules = {}



const read = async () => {
    let rawdata = fs.readFileSync('../transcript/AutoSub5.json');
    let sub = JSON.parse(rawdata);
    const srt = srtConvert(sub)

    console.log(sub);
    console.log(srt);
    fs.writeFile('nirvana.srt', srt, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

read()


