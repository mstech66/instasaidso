const os = require('os');
const storage = require('electron-json-storage');

storage.setDataPath(os.tmpdir());


function saveLoginInfo(finaluserdata) {
    storage.set('login', finaluserdata, function(error) {
        if (error) throw error;
    });
}

function doesLoginExist(callback) {
    storage.get('login', function(err, data) {
        if (err) throw err;
        let result = data['login'] != null ? true : false;
        callback(result);
    });
}

function setData(name, value) {
    let data = {};
    data[name] = value;
    storage.set(name, data, function(error) {
        if (error) throw error;
    });
}

function removeData(name) {
    storage.remove(name, (err) => {
        if (err) throw err;
    });
}

function clearStorage() {
    storage.clear((err) => {
        if (err) throw err;
    })
}

function getData(name, callback) {
    storage.get(name, function(err, data) {
        if (err) throw err;
        callback(data);
    });
}

module.exports = {
    saveLoginInfo: saveLoginInfo,
    doesLoginExist: doesLoginExist,
    setData: setData,
    getData: getData,
    removeData: removeData,
    clearStorage: clearStorage
};