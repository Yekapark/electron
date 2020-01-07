// 'use strict';

// console.log("실행");

// const ff = require('fs');
// const filePath = '/Users/pje/Desktop/hi.java'
// const fileReader = ff.createReadStream(filePath, {encoding:'utf8'});
// let termFound = false;

// fileReader.on('data', (data) => {
//     if(data.match(/maiasdn/) !== null){
//         termFound = true;
//     }
// });

// fileReader.on('end', (err) => {
//     if(err) {
//         return err;
//     }
//     console.log('term found : ', termFound);
// })


// console.log(fileReader);





// const testFolder = 'C:\\Users\\pje\\Desktop\\project_git';

// 하위 디렉토리 싹 뒤져서 java 파일 찾는 스크립트.

const testFolder = $("#current-folder").children(':last').attr('data-path')
const fss = require('fs');

replay(testFolder)

function replay(testFolder) {                       // 하위 디렉토리 검색해서 파일 불러오는 함수.


    try{
    fss.readdirSync(testFolder, {withFileTypes: true}).forEach(file => {
        if(file.isFile()){
            if(file.name.substr(-4) === 'java')


            parsing(testFolder + '\\' + file.name)
        }

        else if(file.isDirectory()){    
            replay(testFolder + "\\" + file.name);
        }

        
    });
}catch(e){
//  console.log(e.name)
}
}