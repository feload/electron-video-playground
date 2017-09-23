const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');
const { app, BrowserWindow, ipcMain, Menu } = electron;
const { newWindow, setHotKey } = require('./util');

let mainWindow;
let newTodoWindow;

const index = `file://${__dirname}/main.html`;
const newTodo = `file://${__dirname}/new-todo.html`;

let menuTemplate = [
    { },
    {
        label: "File",
        submenu: [
            {
                label: 'New Todo',
                accelerator: setHotKey('N'),
                click () {
                    newTodoWindow = newWindow(newTodo, {
                        width: 300,
                        height: 200,
                        title: 'Add new todo'
                    });

                    // Ensure we don't leave flaoting references to old windows.
                    // GC will do its job later.
                    newTodoWindow.on('closed', () => { newTodoWindow = null; });
                }
            },
            {
                label: 'Quit',
                accelerator: setHotKey('Q'),
                click () {
                    app.quit();
                }
            }
        ]
    }
];

if(process.platform === 'darwin') menuTemplate.unshift({});

app.on('ready', () => {
    mainWindow = newWindow(index);
    // Ensure to quit the app when main window is closed.
    mainWindow.on('closed', () => { app.quit(); });

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('new-todo:input', (event, value) => {
    newTodoWindow.close();
    mainWindow.webContents.send('new-todo:success', value);
});

// Video metadata.
ipcMain.on('video:submit', (event, path) => {
    ffmpeg.ffprobe(path, (err, metadata) => {
        mainWindow.webContents.send('video:metadata', metadata);
    });
});

if(process.env.NODE_ENV !== 'production')  {
    menuTemplate.push({
        label: 'View',
        submenu: [
            {
                role: 'reload'
            },
            {
                label: 'Toggle dev console',
                accelerator: setHotKey('D'),
                click (item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
}