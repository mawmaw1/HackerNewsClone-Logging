'use strict'
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const fs = require('fs')
const os = require('os')
const exec = require('child_process').exec;

const PORT = 8080
const HOST = '0.0.0.0'
const app = express();
const cmd = 'tail -r -n 1000 errors.txt';


app.use(cors())
app.use(morgan('short'))
app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log(os.hostname())
    exec(cmd, function(error, stdout, stderr) {
        if (error) {
            console.log(error)
            return res.end('error')
        }
        console.log(stdout)
        res.end(stdout)
    });
})

app.post('/log', (req, res) => {
    const errObj = {
        level: req.body.level || '',
        message: req.body.message || '',
        error: req.body.error || '',
        host: req.body.host || '',
        timestamp: new Date().toString()
    }

    fs.appendFile('errors.txt', JSON.stringify(errObj) + '\r\n', err => {
        if (err) {
            console.log(err)
            return res.status(500).json(err)
        }
        res.end('ok')
    })
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
