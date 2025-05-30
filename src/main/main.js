import { app, BrowserWindow, ipcMain, Menu, nativeImage, nativeTheme, Tray } from 'electron';
import started from 'electron-squirrel-startup';
import { join } from 'node:path';

import { GPTAgent } from './gpt-agent/gpt-agent';

if (started) {
  app.quit();
}

const agent = new GPTAgent();

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 300,
    title: 'A Chat for penetration testing',
    icon: join(__dirname, 'icons', 'win', 'icon.ico'),
    frame: false,
    alwaysOnTop: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  nativeTheme.themeSource = 'system';

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open PenHub',
      type: 'normal',
      click: () => mainWindow.webContents.send('router', 'home')
    },
    { type: 'separator' },
    {
      label: 'View Options',
      type: 'normal',
      click: () => mainWindow.webContents.send('router', 'options')
    },
    {
      label: 'About PenHub',
      type: 'normal',
      click: () => mainWindow.webContents.send('router', 'about')
    },
    { type: 'separator' },
    { label: 'Close PenHub', type: 'normal', click: () => app.quit() }
  ]);

  const appIcon = nativeImage.createFromPath(join(__dirname, 'icons', 'win', 'icon.ico'));

  const appTray = new Tray(appIcon);

  appTray.setTitle('PenHub • A Chat for penetration testing');

  appTray.setToolTip('A Chat for penetration testing');

  appTray.setContextMenu(contextMenu);

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('isMaximized');
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('isRestored');
  });

  ipcMain.on('minimize', (event, args) => {
    mainWindow.minimize();
  });

  ipcMain.on('maximize', (event, args) => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on('theme', (event, data) => {
    if (data !== 'system' && data !== 'dark' && data !== 'light') {
      nativeTheme.themeSource = 'system';
    }

    nativeTheme.themeSource = data;
  });

  ipcMain.on('ontop', (event, data) => {
    mainWindow.setAlwaysOnTop(data);
  });

  mainWindow.webContents.openDevTools();
};

app.on('ready', () => {
  ipcMain.handle('agent:connect', async (event, data) => {
    try {
      const { apiKey, apiModel } = data;

      const connected = await agent.connect(apiKey, apiModel);
      const prompts = await agent.prompts();
      const tools = await agent.tools();

      return { success: true, connected, prompts, tools };
    } catch (e) {
      console.error('[agent:connect] Error:', e);
      return { success: false, error: e.message ?? 'Unknown error' };
    }
  });

  ipcMain.handle('agent:query', async (event, data) => {
    try {
      const { query } = data;
      const response = await agent.query(query);
      return { success: true, response };
    } catch (e) {
      console.error('[agent:query] Error:', e);
      return { success: false, error: e.message ?? 'Unknown error' };
    }
  });

  createWindow();
});

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
