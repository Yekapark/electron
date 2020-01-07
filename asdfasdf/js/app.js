'use strict';


const async = require('async');
const fs = require('fs');
const osenv = require('osenv');
const path = require('path');
const lunr = require('lunr');
let index;

// let document;
// const remote = require('electron').remote;
// const appPath = remote.app.getAppPath();
// console.log('appPath: ', appPath);

// const irisPath = `/${appPath}/app/data/iris.json`;
// const irisData = JSON.parse(fs.readFileSync(irisPath, 'utf8'));
// console.log('irisData: ', irisData);




// fileSystem.js

function getUsersHomeFolder(){
    return osenv.home();
}

function getFilesInFolder(folderPath, cb){
    fs.readdir(folderPath, cb);
}

function inspectAndDescribeFile(filePath, cb){
    let result = {
        file: path.basename(filePath),
        path: filePath, type: ''
    };
    fs.stat(filePath, (err, stat) => {
        if (err){
            cb(err);
        } else{
            if (stat.isFile()){
                result.type = 'file';
            }
            if (stat.isDirectory()){
                result.type = 'directory';
            }
            cb(err, result);
        }
    });
}

function inspectAndDescribeFiles(folderPath, files, cb) {
    async.map(files, (file, asyncCb) => {
        let resolvedFilePath = path.resolve(folderPath, file);
        inspectAndDescribeFile(resolvedFilePath, asyncCb);
    }, cb);
}






// userInterface.js

function bindSearchField(cb){
    document.getElementById('search').addEventListener('keyup', cb, false);
}


function displayFolderPath(folderPath){
    const folders = folderPath.split(path.sep);
    console.log(folders)
    document.getElementById('current-folder').innerHTML = convertFolderPathIntoLinks(folderPath);
    bindCurrentFolderPath();
}

function clearView(){
    const mainArea = document.getElementById('main-area');
    let firstChild = mainArea.firstChild;
    while(firstChild){
        mainArea.removeChild(firstChild);
        firstChild = mainArea.firstChild;
    }
}

function loadDirectory(folderPath){
    return function (window){
        if(!document) document = window.document;
        resetIndex();
        displayFolderPath(folderPath);
        getFilesInFolder(folderPath, (err, files) =>{
            clearView();
            if(err){
                return alert('Sorry, you could not load your folder');
            }
            inspectAndDescribeFiles(folderPath, files, displayFiles);
        });
    };
}

function displayFile(file){
    const mainArea = document.getElementById('main-area');
    const template = document.querySelector('#item-template');
    let clone = document.importNode(template.content, true);
    addToIndex(file);
    clone.querySelector('img').src = 'images/' + file.type + '.png';
    // clone.querySelector('.filename').innerText = file.file;
    clone.querySelector('img').setAttribute('data-filePath', file.path);

    if(file.type === 'directory'){
        clone.querySelector('img').addEventListener('dblclick', () => {
            loadDirectory(file.path)();
        }, false);
    }
    clone.querySelector('.filename').innerText = file.file;
    mainArea.appendChild(clone);
    // console.log(file);  // 현지 폴더 내 모든 파일
}


function displayFiles(err, files){
    if(err){
        return alert('Sorry, we could not display your files');
    }
    files.forEach(displayFile);
}

function filterResults(results){
    const validFilePaths = results.map((result) => {
        return result.ref;
    });
    const items = document.getElementsByClassName('item');
    for(var i = 0; i < items.length; i++){
        let item = items[i];
        let filePath = item.getElementsByTagName('img')[0].getAttribute('data-filepath');
        if(validFilePaths.indexOf(filePath) !== -1){
            item.style = null;
        } else {
            item.style = 'display:none;';
        }
    }
}

function resetFilter(){
    const items = document.getElementsByClassName('item');
    for(var i = 0; i < items.length; i++){
        items[i].style = null;
    }
}

function bindDocument(window){
    if(!document){
        document = window.document;
    }
}



// search.js

function resetIndex(){
    index = lunr(function() {
        this.field('file');
        this.field('type');
        this.ref('path');
    });
}

function addToIndex(file){
    index.add(file);
}

function find(query, cb){
    if(!index){
        resetIndex();
    }
    const results = index.search(query);
    cb(results);
}






function main(){
    bindDocument(window)
    let folderPath = getUsersHomeFolder();
    getFilesInFolder(folderPath, (err, files) => {
        if(err){
            return alert('Sorry, we could not load your home folder');
        }
        inspectAndDescribeFiles(folderPath, files);  // 여기 마지막에 , displayFiles 있었음.
    });

    loadDirectory(folderPath)(window);
    bindSearchField((event) => {
        const query = event.target.value;
        if(query === ''){
            resetFilter();
        } else {
            find(query, filterResults);
        }
    });

    


    // loadDirectory(folderPath)(window);
    // bindSearchField((evnet) => {
    //     const query = event.target.value;
    //     if ( query === ''){
    //         resetFilter();
    //     }else{
    //         find(query, filterResults);
    //     }
    // });
}

function convertFolderPathIntoLinks(folderPath){
    const folders = folderPath.split(path.sep);
    const contents = [];
    let pathAtFolder = '';
    folders.forEach((folder) => {
        pathAtFolder += folder + path.sep;
        contents.push('<span class="path" data-path=' + pathAtFolder.slice(0,-1) + '>' + folder + '</span>');
    }); 
    return contents.join(path.sep).toString();
}

function bindCurrentFolderPath(){
    const load = (event) => {
        $('.code-content').html('');
        const folderPath = event.target.getAttribute('data-path');
        loadDirectory(folderPath)();
    };

    const paths = document.getElementsByClassName('path');
    for(var i = 0; i < paths.length; i++){
        paths[i].addEventListener('click', load, false);
    }
}

main();