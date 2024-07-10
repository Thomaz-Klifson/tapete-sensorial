import { app, shell, BrowserWindow, ipcMain, session } from 'electron';
import { join, extname, resolve } from 'path';
import { is } from '@electron-toolkit/utils';
import * as fs from 'fs';
import { removeBackgroundFromImageBase64 } from 'remove.bg';

const iconPath = join(__dirname, '../../resources/icon.png');

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    icon: iconPath,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      session: session.defaultSession,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  const jogosPath = join(app.getAppPath(), 'resources', 'Jogos');
  if (!fs.existsSync(jogosPath)) {
    fs.mkdirSync(jogosPath, { recursive: true });
  }

  ipcMain.handle('upload-file', async (_event, { fileType, arrayBuffer, originalFileName, fileName }) => {
    const files = fs.readdirSync(jogosPath);
    let counter = 1;
    let prefix = '';

    if (fileType === 'actor') {
      prefix = 'imagem_';
    } else if (fileType === 'bg') {
      prefix = 'cenario_';
    } else if (fileType === 'audio') {
      prefix = 'audio_';
    } else {
      prefix = '';
    }

    const extension = extname(originalFileName);

    files.forEach(file => {
      const match = file.match(new RegExp(`^${prefix}(\\d+)`));
      if (match) {
        const number = parseInt(match[1], 10);
        if (number >= counter) {
          counter = number + 1;
        }
      }
    });

    let buffer = Buffer.from(arrayBuffer);

    if (fileType === 'actor') {
      try {
        const base64Image = buffer.toString('base64');
        const result = await removeBackgroundFromImageBase64({
          base64img: base64Image,
          apiKey: 'gvUoDFSb8q7v9BuEK71TA3x7',
        });
        buffer = Buffer.from(result.base64img, 'base64');
      } catch (error) {
        console.error('Erro ao remover o fundo da imagem:', error);
      }
    }

    const destinationPath = join(jogosPath, `${prefix}${fileType === 'audio' && fileName ? fileName : counter}${extension}`);
    fs.writeFileSync(destinationPath, buffer);

    return { message: `File saved to ${destinationPath}` };
  });

  const getMimeType = (filePath) => {
    const ext = extname(filePath).toLowerCase();
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.gif':
        return 'image/gif';
      case '.bmp':
        return 'image/bmp';
      default:
        return 'image/png';
    }
  };

  ipcMain.handle('list-actors', (_event) => {
    const files = fs.readdirSync(jogosPath)
      .filter(file => file.startsWith('imagem_') && fs.lstatSync(join(jogosPath, file)).isFile())
      .map(file => {
        const filePath = join(jogosPath, file);
        const imageData = fs.readFileSync(filePath).toString('base64');
        const mimeType = getMimeType(filePath);
        return { name: file, data: `data:${mimeType};base64,${imageData}` };
      });
    return files;
  });

  ipcMain.handle('list-bg', (_event) => {
    const files = fs.readdirSync(jogosPath)
      .filter(file => file.startsWith('cenario_') && fs.lstatSync(join(jogosPath, file)).isFile())
      .map(file => {
        const filePath = join(jogosPath, file);
        const imageData = fs.readFileSync(filePath).toString('base64');
        const mimeType = getMimeType(filePath);
        return { name: file, data: `data:${mimeType};base64,${imageData}` };
      });
    return files;
  });

  ipcMain.handle('list-audios', (_event) => {
    const files = fs.readdirSync(jogosPath)
      .filter(file => file.startsWith('audio_') && fs.lstatSync(join(jogosPath, file)).isFile())
      .map(file => {
        const filePath = join(jogosPath, file);
        return {
          name: file,
          path: filePath,
        };
      });
    return files;
  });

  ipcMain.handle('save-javascript', (_event, { javascript }) => {
    const filePath = join(jogosPath, 'javascript.js');
    fs.writeFileSync(filePath, javascript);
    return { message: `File saved to ${filePath}` };
  });

  ipcMain.handle('open-file', async (_event, relativeFilePath) => {
    try {
      const absoluteFilePath = resolve(app.getAppPath(), relativeFilePath);
      await shell.openPath(absoluteFilePath);
      return { success: true, message: `File opened: ${absoluteFilePath}` };
    } catch (error) {
      return { success: false, message: `Failed to open file: ${relativeFilePath}`, error: error.message };
    }
  });

  // Add new handler to load the HTML file in the renderer process
  ipcMain.handle('load-html', (_event, htmlFileName) => {
    const htmlFilePath = join(jogosPath, htmlFileName);
    if (fs.existsSync(htmlFilePath)) {
      mainWindow.loadFile(htmlFilePath);
      return { success: true, message: `HTML file loaded: ${htmlFilePath}` };
    } else {
      return { success: false, message: `HTML file not found: ${htmlFilePath}` };
    }
  });
}

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
