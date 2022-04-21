const {app, BrowserWindow} = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    // eslint-disable-line global-require
    app.quit();
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        frame: 0,
        transparent: true,
        backgroundColor: "rgba(255,0,0,0)",
        autoHideMenuBar: true,
        resizable: false,
        width: 300,
        height: 350,
        x: 0,
        y: 0
    });
    mainWindow.setAlwaysOnTop(true)
    mainWindow.setVisibleOnAllWorkspaces(true)
    mainWindow.setMinimizable(false)

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // let start = 1
    // let flag = true
    // setInterval(() => {
    //     if (flag) {
    //         mainWindow.setPosition(start++, 0)
    //         if (start === 200) {
    //             flag = false
    //         }
    //     } else {
    //         mainWindow.setPosition(start--, 0)
    //         if (start === 1) {
    //             flag = true
    //         }
    //     }
    // }, 2)
    // mainWindow.webContents.openDevTools();
};

app.dock.hide()

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

