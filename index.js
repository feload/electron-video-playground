const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');
const { app, BrowserWindow, ipcMain, Menu } = electron;
const { newWindow } = require('./util');

const index = `file://${__dirname}/main.html`;
const newTodo = `file://${__dirname}/new-todo.html`;

let menuTemplate = [
    { },
    {
        label: "File",
        submenu: [
            {
                label: 'New Todo',
                click () {
                    newTodoWindow = newWindow(newTodo, {
                        width: 300,
                        height: 200,
                        title: 'Add new todo'
                    });
                }
            },
            {
                label: 'Quit',
                accelerator: (process.platform === 'darwin') ? 'Command+Q' : 'Ctrl+Q',
                click () {
                    app.quit();
                }
            }
        ]
    }
];

if(process.platform === 'darwin') menuTemplate.unshift({});

let mainWindow;
let newTodoWindow;

app.on('ready', () => {
    mainWindow = newWindow(index);

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});



// Video metadata.
ipcMain.on('video:submit', (event, path) => {
    ffmpeg.ffprobe(path, (err, metadata) => {
        mainWindow.webContents.send('video:metadata', metadata);
    });
});