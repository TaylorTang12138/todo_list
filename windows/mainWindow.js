const {
  app,
  BrowserWindow,
  Notification,
  ipcMain,
  screen,
} = require("electron");
const path = require("path");

let mainWindow;
// login width 300 height 600
// main  width 835 height 525

// 默认窗口配置
const defaultWindow = {
  width: 320,
  height: 500,
  resizable: false, // 可否手动调整大小
  frame: false, // 边框
  titleBarStyle: "hidden",
  title: "todo_list",
  webPreferences: {
    preload: path.resolve(__dirname, "../preload/preload.js"),
    contextIsolation: true, // 启用上下文隔离
    enableRemoteModule: false, // 禁用 remote 模块
    nodeIntegration: false, // 禁用nodeIntegration
  },
  icon: path.resolve(__dirname, "../public/icon.ico"),
};

// 创建面板窗口
const createWindow = () => {
  mainWindow = new BrowserWindow({
    ...defaultWindow,
  });

  if (process.env.NODE_ENV == "development") {
    mainWindow.loadURL("http://localhost:3000/");
    console.log("开发环境");
    // mainWindow.webContents.openDevTools(); // 打开控制台
  } else {
    let entryPath = path.resolve(__dirname, "../build/index.html");
    console.log("加载路径");
    console.log(entryPath);
    mainWindow.loadFile(entryPath);
  }
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

// 显示通知
function showNotification(e) {
  new Notification({
    ...e,
  }).show();
}

// 发送通知
ipcMain.handle("sendNotice", (e, ...args) => {
  showNotification({
    ...args[0],
  });
});

// 登录成功
ipcMain.handle("login-success", () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize; // 获取屏幕工作区的尺寸

  const newWidth = 835,
    newHeight = 525;
  mainWindow.setSize(newWidth, newHeight);
  mainWindow.setMinimumSize(newWidth, newHeight);
  mainWindow.setResizable(true);
  // 计算新窗口的位置并设置居中
  const x = Math.round((width - newWidth) / 2);
  const y = Math.round((height - newHeight) / 2);
  mainWindow.setBounds({ x, y, width: newWidth, height: newHeight });
});
