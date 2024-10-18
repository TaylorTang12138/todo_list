console.log("预加载脚本");
const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronApi", {
  invokeMethod: (channel, ...args) => {
    return ipcRenderer.invoke(channel, ...args);
  },
});
