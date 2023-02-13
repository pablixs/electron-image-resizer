const path = require('path');
const { app, BrowserWindow, Menu, shell } = require('electron');

const isDev = process.env.NODE_ENV !== 'production'
const isMac = process.platform = 'darwin';

//* Create the main window
function createMainWindow(){
    const mainWindow = new BrowserWindow({
        title: 'Image Resizer',
        width: isDev ? 1000 : 500,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    //* Open devtools if in dev env
    if(isDev){
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

//* Create about window
function createAboutWindow() {
    const aboutWindow = new BrowserWindow({
        title: 'About Image Resizer',
        width: 300,
        height: 300
    });


    aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
}

//* App is ready
app.whenReady().then(() => {
    console.log(process.platform)
    createMainWindow();

    //* Implement menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu)

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    })
});

const menu = [
    {
        role: 'fileMenu'
    },
    ...(isMac ? [{
        label: app.name,
        submenu:[
            {
                label: 'About',
                click: createAboutWindow
            },
            {
                label: 'Follow me',
                click: () => shell.openExternal('https://github.com/pablixs')
            },
        ],
    }] : []),
    ...(!isMac ? [{
        label: 'Help',
        submenu: [
            {
                label: 'About',
                click: createAboutWindow
            },
            {
            label: 'About',
            click: () => shell.openExternal('https://github.com/pablixs')
            }]}] : []),
    // {
    //     label: 'File',
    //     submenu: [
    //         {
    //             label: 'Quit',
    //             click: () => app.quit(),
    //             accelerator: 'CmdOrCtrl + W',
    //         },
    //         {
    //             label: 'Follow us',
    //             click: () => shell.openExternal('https://github.com/pablixs')
    //         }
    //     ]
    // }
];

app.on('window-all-closed', () => {
    if (!isMac){
        app.quit();
    }
})