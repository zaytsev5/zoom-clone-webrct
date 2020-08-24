const youtubeStream = require('youtube-audio-stream')
const express = require('express')
const app = express();

var getAudio = function (req, res) {
    var requestUrl = 'http://youtube.com/watch?v=' + req.params.videoId
    try {
      youtubeStream(requestUrl).pipe(res)
    } catch (exception) {
      res.status(500).send(exception)
    }
  }

app.get('/:videoId',getAudio)
app.listen(5000,()=>{
    console.log("server started on port");
})
// const url = 'http://youtube.com/watch?v=34aQNMvGEZQ'
// const decoder = require('lame').Decoder
// const speaker = require('speaker')

// stream(url)
// .pipe(decoder())
// .pipe(speaker())