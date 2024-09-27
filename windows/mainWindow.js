const { app, BrowserWindow } = require("electron");
const path = require('path')

// 创建窗口
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 400,
    frame: true,
    title: "todo_list",
    webPreferences:{
      preload:path.resolve(__dirname,'../preload/preload.js')
    },
    icon:path.resolve(__dirname,"../public/icon.ico")
  });

  if (process.env.NODE_ENV == "development") {
    win.loadURL("http://localhost:3000/");
    console.log("开发环境");
  }else{
    let entryPath = path.resolve(__dirname,'../build/index.html')
    console.log('加载路径')
    console.log(entryPath)
    win.loadFile(entryPath)
  }

  win.webContents.openDevTools(); // 打开控制台
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length == 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform != "darwin") app.quit();
});
