const electron = require('electron');
const { BrowserWindow } = electron;

function newWindow (file, options = {}) {
    const window = new BrowserWindow(options);
    window.loadURL(file);
    return window;
}

module.exports.newWindow = newWindow;