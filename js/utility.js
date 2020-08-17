const { session } = require('electron');

function initCookie(name, value) {
    session.defaultSession.cookies.set({
        url: "http://localhost",
        name: name,
        value: value
    });
}

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

module.exports = {
    initCookie: initCookie,
    getCount: getCount,
    setCount: setCount
};