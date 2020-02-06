var fs = require('fs');
var path = require('path')
var express = require('express');
//var bodyParser = require('body-parser');
//var HTMLParser = require('node-html-parser');
const puppeteer = require('puppeteer');
const calendar = require('calendar');

var app = express();

const sleep = async (ms) => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res();
      }, ms)
    });
}

const port = process.env.PORT || 7000;

const URL = "localhost:" + port;
const table = __dirname + "/table.html";

(async () => {

    console.log('Launching puppeteer.')

    const browser = await puppeteer.launch({ 
        executablePath: './chrome-win/chrome.exe',
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    await page.goto(URL, {
        waitUntil: 'networkidle2'
    })

    let pageData = await page.evaluate( async () => {
        let months = document.querySelectorAll("#month");
    })
    
    console.log("done");

})();


/**-----------------
 * 
 * Express Backend
 * 
 -----------------*/

 app.set('views', __dirname + '/views');
 app.set('view engine', 'ejs');
 
 //app.use(express.static(path.join(__dirname, '/public/')));
 //app.use(express.static('public'));
 //app.use(bodyParser.urlencoded({ extended: true })); 
 app.use(express.json())
 
 app.get('/', (req, res) => {
    res.render('table')
 });
 
 const server = app.listen(port, () => {
 
     console.log(`Express running → PORT ${server.address().port}`);
     console.log(`http:localhost:${port}`)
 
 })

