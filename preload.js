const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  launchGame: (command) => ipcRenderer.invoke('launch-game', command),
  quitApp: () => ipcRenderer.invoke('quit-app'),
  addTile: (tile) => ipcRenderer.invoke('add-tile', tile),
  deleteTile: (tileId) => ipcRenderer.invoke('delete-tile', tileId),
  editTile: (tile) => ipcRenderer.invoke('edit-tile', tile),
  onLoadTiles: (callback) => ipcRenderer.on('load-tiles', callback)
});