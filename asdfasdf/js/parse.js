function parsing(lastVal) {

    const ff = require('fs');
    // const filePath = '/Users/pje/Desktop/hi.java'
    const filePath = lastVal;
    const fileReader = ff.createReadStream(filePath, { encoding: 'utf8' });
    let termFound = false;

    // console.log(lastVal)                 // 파일 경로
    // console.log(keyword);

    ff.readFile(filePath, 'utf8', function (err, data) {
        var code = '';
        var isComment = false;
        var isBrace = false;
        var isCode = false;
        var blank = false;
        var tenline = false;
        var flag = false;
        var checkBrace = [];

        var maxline = 0;
        var tbrace = 0;
        var k = 0;

        if (err) throw err;
        else {
            var array = data.toString().split("\n");


            for (i in array) {                              // java파일 한줄씩 비교 시작

                open = 0;
                cloase = 0;

                if (array[i].includes("{")) {
                    open++;
                }

                if (array[i].includes("}")) {
                    close++;
                }

                if (open > 0 && open === close) {
                    flag = true;
                    tbrace++;
                } else {
                    flag = false;
                    tbrace = 0;
                }


                /////////////////////////////////////////////////////////
                if (array[i].trim().startsWith('/*')) {
                    isComment = true;
                }

                if (isComment) {
                    if (array[i].includes(keyword)) {
                        code = "";
                        maxline = 0;
                        isCode = true;
                    }
                }

                if (array[i].trim().startsWith('*/')) {
                    isComment = false;
                }
                /////////////////////////////////////////////////////////



                //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                if(array[i].trim().startsWith('//')){
                    if (array[i].includes(keyword)) {
                        code = "";
                        maxline = 0;
                        isCode = true;

                        k = i + 11;
                    }
                }
                //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

                maxline++;



                if (isCode) {
                    isBrace = ((array[i].includes("{")) != -1 || (array[i].includes("}"))) ? true : isBrace;
                }
                //////////////////////////////////////////////////////////
                if(isCode && tenline){
                    if(i <= k){
                        code += array[i] + '\n';
                        isBrace = false;
                    }
                    if(i == k+1){
                        console.log(code);
                        code = "";
                        flag = false;
                        isBrace = false;
                        tenline = false;
                        isCode = false;
                        keywordOn = false;
                    }
                }

                //////////////////////////////////////////////////////////
                else if (isCode && isBrace) {
                    code += array[i] + '\n';

                    if(flag && tbrace >= 2){
                        tenline = true;
                        tbrace = 0;
                    }

                    else if(isCode && !flag){
                        if (array[i].includes("{")) {
                            checkBrace.push("{");
                            blank = false;
                        }
                        if (array[i].includes("}")) {
                            checkBrace.pop();
                            blank = true;
                        }
                        if (checkBrace.length === 0 && blank) {
                            console.log(code);
                            code = '';
                            blank = false;
                            isBrace = false;
                            isCode = false;
                            keywordOn = false;
                        }
                    }
                }
                //////////////////////////////////////////////////////////
                else if(isCode && !isBrace){
                    code += array[i] + '\n';
                    if(i <= k){
                        code += array[i] + '\n';
                        isBrace = false;
                    }
                    if(i == k+1){
                        console.log(code);
                        code = "";
                        flag = false;
                        isBrace = false;
                        tenline = false;
                        isCode = false;
                        keywordOn = false;
                    }
                }
                //////////////////////////////////////////////////////////
            }                                               // java파일 한줄씩 비교 끝
        }
    });
}