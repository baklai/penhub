import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('app', {
  versions: () => {
    const versions = [
      { key: 'version', title: 'Version' },
      { key: 'chrome', title: 'Chromium' },
      { key: 'electron', title: 'Electron' },
      { key: 'node', title: 'Node.js' },
      { key: 'v8', title: 'V8' }
    ];

    return versions.map(item => {
      return {
        ...item,
        version: process.versions[item.key] || '-'
      };
    });
  },

  close: () => ipcRenderer.send('close'),
  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  ontop: data => ipcRenderer.send('ontop', data),
  theme: data => {
    if (data !== 'system' && data !== 'dark' && data !== 'light') {
      return;
    }

    ipcRenderer.send('theme', data);
  },

  on: (channel, func) => {
    const validChannels = ['isMaximized', 'isRestored'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});

contextBridge.exposeInMainWorld('agent', {
  connect: async (apiKey, apiModel) => {
    return await ipcRenderer.invoke('agent:connect', { apiKey, apiModel });
  },
  query: async query => {
    return await ipcRenderer.invoke('agent:query', { query });
  }
});

window.addEventListener('DOMContentLoaded', () => {});
