'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('window-all-closed', () => {
  // macOS에서는 사용자가 명확하게 Cmd + Q를 누르기 전까지는
  // 애플리케이션이나 메뉴 바가 활성화된 상태로 머물러 있는 것이 일반적입니다.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  })
});

// let win


// function createWindow () {
//   // 브라우저 창을 생성합니다.
//   win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       nodeIntegration: true
//     }
//   })

//   // and load the index.html of the app.
//   // win.loadURL("http://localhost:8080/")
  
//   // win.loadURL("http://www.naver.com/")
//   win.loadFile('index.html')

//   // 개발자 도구를 엽니다.
//   // win.webContents.openDevTools()

//   // 창이 닫힐 때 발생합니다
//   win.on('closed', () => {
//     // window 객체에 대한 참조해제. 여러 개의 창을 지원하는 앱이라면 
//     // 창을 배열에 저장할 수 있습니다. 이곳은 관련 요소를 삭제하기에 좋은 장소입니다.
//     win = null
//   })
// }

// // 이 메서드는 Electron이 초기화를 마치고 
// // 브라우저 창을 생성할 준비가 되었을 때  호출될 것입니다.
// // 어떤 API는 이 이벤트가 나타난 이후에만 사용할 수 있습니다.


// // 모든 창이 닫혔을 때 종료.


// app.on('activate', () => {
//   // macOS에서는 dock 아이콘이 클릭되고 다른 윈도우가 열려있지 않았다면
//   // 앱에서 새로운 창을 다시 여는 것이 일반적입니다.
//   if (win === null) {
//     createWindow()
//   }
// })


// const {BrowserWindow} = require('electron')

// // 또는 렌더러 프로세스에서
// // const {BrowserWindow} = require('electron').remote

// let win = new BrowserWindow({width: 800, height: 600})
// win.on('closed', () => {
//   win = null
// })

// // 원격 URL 로드
// win.loadURL('https://localhost:8080')

// // 또는 로컬 HTML 로드
// win.loadURL(`file://${__dirname}/app/index.html`)