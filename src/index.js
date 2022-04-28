const {app, BrowserWindow, ipcMain, Tray, ipcRenderer} = require('electron')
const path = require('path')

if (require('electron-squirrel-startup')) {
    app.quit();
}

const assetsDirectory = path.join(__dirname, 'assets')

let duckWindow = undefined
let tray = undefined
let window = undefined
// let calloutWindow = undefined

const createDuckWindow = () => {
    duckWindow = new BrowserWindow({
        frame: 0,
        hasShadow: false,
        transparent: false,
        backgroundColor: "rgba(255,0,0,0)",
        autoHideMenuBar: true,
        resizable: false,
        width: 300,
        height: 200,
        x: 0,
        y: 0,
        minimizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    duckWindow.setAlwaysOnTop(true, "screen-saver");
    duckWindow.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen:true});
    duckWindow.loadFile(path.join(__dirname, 'index.html'));
    // duckWindow.on('move', (e)=>{
    //     //для теста
    //     duckWindow.transparent = false;
    //
    //     //должно по факту произойти
    //     calloutWindow.x = duckWindow.x +70;
    //     calloutWindow.y = duckWindow.y - 100;
    // })
};

// const createCalloutWindow = () => {
//     calloutWindow = new BrowserWindow({
//         frame: 0,
//         hasShadow: false,
//         transparent: true,
//         backgroundColor: "rgba(255,0,0,0)",
//         autoHideMenuBar: true,
//         resizable: false,
//         width: 350,
//         height: 115,
//         x: 70,
//         y: 0,
//         minimizable: false,
//         webPreferences: {
//             nodeIntegration: true
//         }
//     })
//     calloutWindow.setAlwaysOnTop(true, "screen-saver");
//     calloutWindow.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen:true})
//     calloutWindow.loadFile(path.join(__dirname, 'callout.html'))
// }


app.dock.hide()

app.on('ready', () => {
    createDuckWindow()
    createTray()
    createWindowSettings()
    // createCalloutWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createDuckWindow()
    }
})



const createTray = () => {
    tray = new Tray(path.join(assetsDirectory, 'duck-icon.png'))
    tray.on('right-click', toggleWindow)
    tray.on('double-click', toggleWindow)
    tray.on('click', function (event) {
        toggleWindow()
        // Show devtools when command clicked
        if (window.isVisible() && process.defaultApp && event.metaKey) {
            window.openDevTools({mode: 'detach'})
        }
    })
}

const getWindowPosition = () => {
    const windowBounds = window.getBounds()
    const trayBounds = tray.getBounds()

    // Center window horizontally below the tray icon
    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4)

    return {x: x, y: y}
}

const createWindowSettings = () => {
    window = new BrowserWindow({
        width: 355, //355
        height: 450,
        show: false,
        frame: false,
        resizable: false,
        backgroundColor: "rgb(255,255,255)",
        transparent: true,
        fullscreen: false,
        webPreferences: {
            // Предотвращает запуск кода процесса рендеринга, когда окно скрыто.
            backgroundThrottling: false,
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    window.setAlwaysOnTop(true, "screen-saver");
    window.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen:true})
    //window.webContents.openDevTools();
    window.loadURL(`file://${path.join(__dirname, 'settings.html')}`)

    // Скрыть окно, когда оно теряет фокус
    window.on('blur', () => {
        if (!window.webContents.isDevToolsOpened()) {
            window.hide()
        }
    })
}

const toggleWindow = () => {
    if (window.isVisible()) {
        window.hide()
    } else {
        showWindow()
    }
}


const showWindow = () => {
    const position = getWindowPosition()
    window.setPosition(position.x, position.y, false)
    window.show()
    window.focus()
}

ipcMain.on('show-window', () => {
    showWindow()
})

ipcMain.on('show-callout', (event, json) => {
    duckWindow.hide()

    duckWindow.width === 300 ? duckWindow.setBounds({ width: 600 }) : duckWindow.setBounds({ width: 300 });

    // calloutWindow.isVisible() ? calloutWindow.hide() : calloutWindow.show()
})

ipcMain.on('duck-window-status', (event, json) => {
    if (duckWindow.isVisible()) {
        duckWindow.hide()
        // calloutWindow.hide()
        // let showAndHideCallout = setInterval(()=>{
        //     if (calloutWindow.isVisible()) {
        //         calloutWindow.hide()
        //     } else {
        //         calloutWindow.show()
        //     }
        // },15000)
    } else {
        duckWindow.show()
        // calloutWindow.show()
        // clearInterval(showAndHideCallout);
    }
});

// let showAndHideCallout = setInterval(()=>{
//     if (calloutWindow.isVisible()) {
//         calloutWindow.hide()
//     } else {
//         calloutWindow.show()
//     }
// },15000)
