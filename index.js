const { app, BrowserWindow, session } = require('electron');
const express = require('express');
const expressApp = express();
let request = require('request');
const dotenv = require('dotenv');

let win;

dotenv.config();

function setCount(newCount) {
    session.defaultSession.cookies.set({ url: "http://localhost", name: "pageCount", value: `${newCount}` }).then(() => {
        console.log("Set the cookie with count ~ " + newCount);
    }).catch((err) => console.log("Smth happened while setting cookies " + err));
}

function getCount(callback) {
    session.defaultSession.cookies.get({ name: "pageCount" }).then((cookies) => {
        let intCount = parseInt(cookies[0].value);
        return callback(intCount);
    }).catch((err) => {
        console.log("Something happened while getting cookies " + err);
        return callback(0);
    });
}

function initCount() {
    session.defaultSession.cookies.set({
        url: "http://localhost",
        name: "pageCount",
        value: "0"
    });
}

function getQuote() {
    return new Promise((resolve) => {
        getCount((count) => {
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
    initCount();
}

app.whenReady().then(createWindow);