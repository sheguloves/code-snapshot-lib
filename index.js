const path = require('path')
const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const app = express()
const PORT = 3333
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now())
    }
})
const upload = multer({storage: storage})

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/upload', express.static(path.join(__dirname, './upload')))
app.use('/static', express.static(path.join(__dirname, './node_modules')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './static', 'index.html'))
})

app.get('/api/files', (req, res) => {
    fs.readdir(path.join(__dirname, './upload'), function(err, files){
        if (err) {
            res.status(400).send(err)
        }
        res.send(files)
    });
})

app.get('/file-blob', (req, res) => {
    res.sendFile(path.join(__dirname, './static', 'file-blob.html'))
})
app.get('/post-download', (req, res) => {
    res.sendFile(path.join(__dirname, './static', 'post-download.html'))
})

app.post('/api/download', (req, res) => {
    console.log(req)
    let fileName = req.body.file
    res.sendFile(path.join(__dirname, './upload', fileName))
})

app.post('/api/upload', upload.array('files'), (req, res) => {
    let files = req.files
    if (files.length > 0) {
        files.forEach((file) => {
            console.log(`File Name: ${file.originalname}, File Size: ${file.size}, File MIME: ${file.mimetype}`)
        })
        res.send('Upload Sucess')
    } else {
        res.status(400).send('No File Exist!')
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}!`)
})