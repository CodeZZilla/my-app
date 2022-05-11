const {app, BrowserWindow, ipcMain, Tray, ipcRenderer} = require('electron')
const path = require('path')
const Store = require('electron-store');
const store = new Store();


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
        transparent: true,
        backgroundColor: "rgba(255,0,0,0)",
        autoHideMenuBar: true,
        resizable: false,
        width: 500,
        height: 200,
        x: 0,
        y: 0,
        minimizable: false,
        webPreferences: {
            backgroundThrottling: false,
            nodeIntegration: true,
            contextIsolation: false
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

    let sendObj = JSON.stringify({
        mood: store.get('mood'),
        language: store.get('language'),
        sound: store.get('sound')
    })
    window.webContents.on('did-finish-load', () => {
        window.webContents.send('save-settings', sendObj);
    });

    duckWindow.webContents.on('did-finish-load', () => {
        duckWindow.webContents.send('save-settings', sendObj)
    })
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
        width: 315, //355
        height: 700,
        show: false,
        frame: false,
        resizable: false,
        backgroundColor: "rgba(255,255,255,0)",
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
    // window.webContents.openDevTools();
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
    // duckWindow.hide()
    // duckWindow.width == 300 ?
    //     duckWindow.setSize(300, 200) :  duckWindow.setSize(500, 200);
    duckWindow.setSize(json.size, 200);
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

ipcMain.on('change-mood-store', (event, json) => {
    store.set('mood', json);
})

ipcMain.on('change-sound-store', (event, json) => {
    store.set('sound', json);
})

ipcMain.on('change-language-store', (event, json) => {
    store.set('language', json);
})
// let showAndHideCallout = setInterval(()=>{
//     if (calloutWindow.isVisible()) {
//         calloutWindow.hide()
//     } else {
//         calloutWindow.show()
//     }
// },15000)
