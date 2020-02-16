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

const paperSearchURL = 'https://arion.aut.ac.nz/ArionMain/CourseInfo/Information/Qualifications/PaperSearch.aspx';

const URL = "localhost:" + port;
const table = __dirname + "/table.html";

var papers = ['COMP601', 'COMP717'];

(async () => {

    console.log('Launching puppeteer.')

    const browser = await puppeteer.launch({ 
        executablePath: './chrome-win/chrome.exe',
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    for(var i = 0; i < papers.length; i++) {
        let paperCode = papers[i];

        console.log(`Paper: ${paperCode}`);

        await page.goto(paperSearchURL, {
            waitUntil: 'networkidle2'
        })

        await page.waitForSelector('input#wucControl_txtPaperSearch');
        await page.type('input#wucControl_txtPaperSearch', paperCode);
        await page.click('input#wucControl_cmdPaperSearch');
        await page.waitForSelector('tbody');
        await page.click('a#wucControl_repPaperSearch__ctl1_hypCode');
        await page.waitForSelector('table');

        let pageData = await page.evaluate( async () => {
            let tables = document.querySelectorAll('table');
            console.log(tables)
            let index = 0;
            let data = {};
            tables.forEach(table => {
                console.log('tables: ' + index);
                if(index == 0) {
                    data.details = [];
                    let td = table.querySelectorAll('td');
                    console.log('td:' + td);
                    td.forEach( element => {
                        console.log(element)
                        if(!element.firstChild) data.details.push(element.firstChild.innerHTML);
                    })
                } else if(index == 1) {
                    data.requisites = {}
                }
                index++;
            })
        return data;
        })
        console.dir(pageData)
    }

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

