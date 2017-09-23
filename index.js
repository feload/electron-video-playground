const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const ffmpeg = require('fluent-ffmpeg');
let mainWindow;

app.on('ready', () => {
    const index = `file://${__dirname}/index.html`;
    mainWindow = new BrowserWindow();
    mainWindow.loadURL(index);
});

ipcMain.on('video:submit', (event, path) => {
    ffmpeg.ffprobe(path, (err, metadata) => {
        mainWindow.webContents.send('video:metadata', metadata);
    });
});