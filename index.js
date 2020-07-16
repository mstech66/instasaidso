const { app, BrowserWindow, Notification, session } = require('electron')
const express = require('express');
const expressApp = express();
let request = require('request');
const path = require('path');
const dotenv = require('dotenv');

let win;

let count = 0;

dotenv.config();

function getRandomQuote() {
    return new Promise((resolve, reject) => {
        request.get({
            "url": `https://instaquotes.herokuapp.com/quotes?skip=${count}&limit=1`,
            "headers": {
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
                    count = count + 1;
                    resolve(quote[0]);
                }
            }
        });
    });
}

expressApp.listen(3000);

expressApp.get('/', function(req, res, next) {
    getRandomQuote().then((quoteData) => {
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

expressApp.get('/reload', function(req, res, next) {
    reload();
});


function reload() {
    win.reload();
}

function createWindow() {
    win = new BrowserWindow({
        width: 850,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.setMenu(null);
    win.loadFile("./view/index.html");
}

app.whenReady().then(createWindow);