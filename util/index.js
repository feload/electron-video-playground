const electron = require('electron');
const { BrowserWindow } = electron;

function newWindow (file, options = {}) {
    const window = new BrowserWindow(options);
    window.loadURL(file);
    return window;
}

function setHotKey (key) {
    const control = (process.platform === 'darwin') ? 'Command' : 'Ctrl';
    return `${control}+${key}`;
}

module.exports.newWindow = newWindow;
module.exports.setHotKey = setHotKey;