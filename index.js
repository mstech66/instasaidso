const { app, BrowserWindow } = require('electron');
const express = require('express');
const expressApp = express();
const dotenv = require('dotenv');
const gaxios = require('gaxios');
const request = require('request');
const { google } = require('googleapis');
const util = require('util');
const { saveLoginInfo, doesLoginExist, getData, setData } = require('./js/utility');

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
const scopes = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];
const url = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes });

let win;

async function codparser(url, callback) {
    let rawurl = url;
    let unreplacedurl = rawurl.substring(rawurl.indexOf("code=") + 5, rawurl.indexOf("&scope="));
    var code = unreplacedurl.replace("%2F", "/");
    let { tokens } = await oauth2Client.getToken(code)
    return callback(tokens.access_token)
}
async function httpcaller(gottoken) {
    const userdata = await gaxios.request({ baseURL: 'https://www.googleapis.com', url: '/oauth2/v2/userinfo', headers: { 'Authorization': 'Bearer ' + gottoken } })
    return (userdata.data)
}

function getQuote() {
    return new Promise((resolve) => {
        getData('pageCount', (count) => {
            count = count['pageCount'];
            request.get({
                url: `https://instaquotes.herokuapp.com/quotes?skip=${count}&limit=1`,
                headers: {
                    "Content-Type": "Application/json",
                    "auth-token": process.env.TOKEN_SECRET
                }
            }, (err, res, body) => {
                if (err) {
                    resolve(JSON.parse('[{"text": "You seem lost", "author": "Please connect to the internet"}]'));
                } else {
                    if (res.statusCode == 200) {
                        let quote = JSON.parse(body);
                        console.log(util.inspect(quote, false, null, true /* enable colors */ ));
                        if (Object.keys(quote).length == 0) {
                            resolve(JSON.parse('{"id": -1}'));
                        }
                        setData('pageCount', (count + 1));
                        resolve(quote[0]);
                    }
                }
            });
        });
    });
}

expressApp.listen(3000);

expressApp.get('/', function(req, res) {
    getQuote().then((quoteData) => {
        if (quoteData.id != -1) {
            let author = quoteData.author;
            author = author.toLowerCase().replace(/ /g, '');
            console.log(quoteData._id);
            let quote = {
                "id": quoteData._id,
                "text": quoteData.text,
                "author": author,
                "length": quoteData.length
            };
            res.json(quote);
        } else {
            res.json({ "id": -1 });
        }
    }).catch((err) => {
        console.log(err);
    });
});

expressApp.get('/login', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.redirect(url);
});

expressApp.get('/redirect', async function(req, res) {
    const finaluserdata = await codparser(req.url, httpcaller);
    console.log(finaluserdata);
    saveLoginInfo(JSON.stringify(finaluserdata));
    res.status(200).json(finaluserdata);
    win.loadFile("./view/index.html");
});

expressApp.get('/profile', function(req, res) {
    getData('login', (data) => {
        res.status(200).json(data);
    });
})

function createWindow() {
    win = new BrowserWindow({
        width: 865,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    doesLoginExist((result) => {
        console.log(`result is ${result}`);
        result === true ? win.loadFile('./view/index.html') : win.loadFile('./view/login.html');
    });
    setData("pageCount", 0);
}
app.whenReady().then(createWindow);