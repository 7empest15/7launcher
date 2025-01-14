const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const Store = require('electron-store');

// Initialiser le store
const store = new Store();

// Création de la fenêtre principale
let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hidden',
    title: 'Game Launcher'
  });

  mainWindow.loadFile('index.html');

  // Envoyer les informations des tuiles à la fenêtre principale
  mainWindow.webContents.on('did-finish-load', () => {
    const tiles = store.get('tiles', []);
    mainWindow.webContents.send('load-tiles', tiles);
  });

  // Gestion des événements lorsque la fenêtre est fermée
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

// Quitter l'application lorsque toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC pour lancer un jeu depuis l'interface
ipcMain.handle('launch-game', async (event, gamePath) => {
  exec(`"${gamePath}"`, (error) => {
    if (error) {
      console.error(`Erreur lors du lancement du jeu : ${error.message}`);
    } else {
      console.log(`Jeu lancé : ${gamePath}`);
    }
  });
});

// IPC pour quitter l'application
ipcMain.handle('quit-app', () => {
  app.quit();
});

// IPC pour ajouter une tuile
ipcMain.handle('add-tile', (event, tile) => {
  const tiles = store.get('tiles', []);
  tiles.push(tile);
  store.set('tiles', tiles);
  mainWindow.webContents.send('load-tiles', tiles);
});

// IPC pour supprimer une tuile
ipcMain.handle('delete-tile', (event, tileId) => {
  let tiles = store.get('tiles', []);
  tiles = tiles.filter(tile => tile.id !== tileId);
  store.set('tiles', tiles);
  mainWindow.webContents.send('load-tiles', tiles);
});

// IPC pour modifier une tuile
ipcMain.handle('edit-tile', (event, updatedTile) => {
  let tiles = store.get('tiles', []);
  tiles = tiles.map(tile => tile.id === updatedTile.id ? updatedTile : tile);
  store.set('tiles', tiles);
  mainWindow.webContents.send('load-tiles', tiles);
});