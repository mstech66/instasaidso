const { app, BrowserWindow } = require('electron');
const express = require('express');
const expressApp = express();
const dotenv = require('dotenv');
const { request } = require('gaxios');
const { google } = require('googleapis');
const { initCookie, getCount, setCount } = require('./js/utility');

const CLIENT_ID = "609317059477-3qk698v49g107e09dri3mb0pm5tt0dco.apps.googleusercontent.com";
const CLIENT_SECRET = "JhUWjVOO5uSg_RVz2Yji73Wa";
const REDIRECT_URL = "http://localhost:3000/redirect";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
const scopes = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];
const url = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes });

let win;

dotenv.config();


async function codparser(url, callback) {
    let rawurl = url;
    let unreplacedurl = rawurl.substring(rawurl.indexOf("code=") + 5, rawurl.indexOf("&scope="));
    var code = unreplacedurl.replace("%2F", "/");
    let { tokens } = await oauth2Client.getToken(code)
    return callback(tokens.access_token)
}
async function httpcaller(gottoken) {
    const userdata = await request({ baseURL: 'https://www.googleapis.com', url: '/oauth2/v2/userinfo', headers: { 'Authorization': 'Bearer ' + gottoken } })
    return (userdata.data)
}

function getQuote() {
    return new Promise((resolve) => {
        getCount((count) => {
            request({
                method: 'GET',
                baseURL: 'https://instaquotes.herokuapp.com',
                url: `/quotes?skip=${count}&limit=1`,
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
                        if (Object.keys(quote).length == 0) {
                            resolve(JSON.parse('{"id": -1}'));
                        }
                        setCount(count + 1);
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
    const finaluserdata = await codparser(req.url, httpcaller)
    console.log(finaluserdata);
    initCookie('login', JSON.stringify(finaluserdata));
    res.status(200).send();
    win.loadFile("./view/index.html");
});

function createWindow() {
    win = new BrowserWindow({
        width: 865,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // win.setMenu(null);
    win.loadFile("./view/index.html");
    initCookie("pageCount", 0);
}

app.whenReady().then(createWindow);