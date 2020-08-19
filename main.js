const { app, BrowserWindow } = require('electron');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 865,
        height: 600
    });
    win.loadFile(`dist/InstaSaidSo/index.html`);
}

app.whenReady().then(createWindow);