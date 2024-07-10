import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

const api = {
  uploadFile: (fileType, fileName, arrayBuffer, originalFileName) => 
    ipcRenderer.invoke('upload-file', { fileType, fileName, arrayBuffer, originalFileName }),
  listActors: () => ipcRenderer.invoke('list-actors'),
  listBG: () => ipcRenderer.invoke('list-bg'),
  listAudios: () => ipcRenderer.invoke('list-audios'),
  saveJavaScript: (javascript) => ipcRenderer.invoke('save-javascript', { javascript }),
  openFile: (relativeFilePath) => ipcRenderer.invoke('open-file', relativeFilePath),
  loadHtml: (htmlFileName) => ipcRenderer.invoke('load-html', htmlFileName)
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
