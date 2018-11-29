"use strict";

const expect = require("chai").expect;
const codecheck = require("codecheck");
const testcases = require("./basic_testcases.json");
const settings = require("./settings.json");
const app = codecheck.consoleApp(process.env.APP_COMMAND).consoleOut(false).storeStdMax(2000000);
const fs = require('fs');
const exec = require('child_process').exec;
const util = require('util');
const execPromise = util.promisify(require('child_process').exec);

function clip(s, len) {
    let ret = "";
    let lines = 0;
    let omitted = len < s.length;
    for (let i = 0; i < Math.min(len, s.length); i++) {
        if (s[i] === '\n') {
            lines++;
        }
        if (lines > settings.maxLines) {
            omitted = true;
            break;
        }
        ret += s[i];
    }
    if (omitted) {
        ret += "...";
    }

    return ret;
}
function getSummaryString(input, user, expected, user_stdout) {
    let ret = "";
    ret += "#### 入力: \n";
    ret += clip(input, settings.maxCharacters);
    ret += '\n';
    ret += "#### あなたの答え: \n";
    ret += clip(user, 300);
    ret += '\n';
    if (settings.isSpecial === false) {
        ret += "#### 期待された答え: \n";
        ret += clip(expected, 300);
        ret += '\n';
    }
    if (settings.isFileOutput === true) {
        ret += "#### あなたの標準出力: \n";
        ret += clip(user_stdout, 300);
        ret += '\n';
    }
    return ret;
}
function stringToArray(s) {
    s = s.split(/\s/);
    s.some((v, i)=>{if(v=='')s.splice(i,1)});
    return s;
}

describe("", () => {
    before (() => {
        if (settings.isSpecial === true) {
            return util.promisify(exec)('make --directory=test')
        }
        return 0;
    });


    testcases.forEach((t) => {
        it(t.it, async () => {
            // テストケースの入力値から、引数を生成
            let input_val = await util.promisify(fs.readFile)('./test/'+t.input, 'utf-8');
            let input = null; // string[]
            if (!settings.isFileInput) {
                input = stringToArray(input_val);
            } else {
                input = ['./test/'+t.input];
            }

            // 受験者のプログラムを実行
            const result = await app.codecheck(input);
            if (result.stderr.length != 0) {
                console.log("#### 標準エラー出力:");
                for (let i = 0; i < result.stderr.length; i++ ){ 
                    console.log(result.stderr[i]);
                }
                console.log("");
            }
            expect(result.code).to.equal(0, "ステータスコードが正常(0)ではありません");

            // 受験者の出力値を整形
            let userOutput_val = "";
            let userOutput = [];
            let stdout_val = "";
            for (let i = 0; i < result.stdout.length; i++) { // stdoutのi行目
                stdout_val += result.stdout[i] + "\n";
            }

            if (settings.isFileOutput) {
                userOutput_val = await util.promisify(fs.readFile)('answer.txt', 'utf-8');
                userOutput = stringToArray(userOutput_val);
            } else {
                userOutput_val = stdout_val;
                for (let i = 0; i < result.stdout.length; i++) { // stdoutのi行目
                    const ith_line = stringToArray(result.stdout[i]);
                    for (let s of ith_line) {
                        userOutput.push(s);
                    }
                }
            }

            if (settings.isSpecial === false) {
                // 正解の出力値を整形
                let expectedOutput_val = await util.promisify(fs.readFile)('./test/'+t.output, 'utf-8');
                let expectedOutput = stringToArray(expectedOutput_val); // string[]

                expect(expectedOutput.length).to.equal(userOutput.length, `出力すべきデータの個数が違います\n 期待された個数: ${expectedOutput.length}, あなたの個数: ${userOutput.length} \n ${getSummaryString(input_val, userOutput_val, expectedOutput_val, stdout_val)}`);
                // 答えの比較
                for (let i = 0; i < expectedOutput.length; i++){
                    expect(expectedOutput[i]).to.equal(userOutput[i], `${i+1}番目のデータが違います。\n 期待された答え: ${expectedOutput[i]}, あなたの答え: ${userOutput[i]} \n ${getSummaryString(input_val, userOutput_val, expectedOutput_val, stdout_val)}`);
                }
            } else {
                const to_output = userOutput.toString().replace(/,/g,' ');
                fs.writeFileSync("participant.txt", to_output);

                try {
                    const { stdout, stderr } = await execPromise(`./test/judge ./test/${t.input} ./test/${t.output} participant.txt`);
                } catch(error) {
                    const error_message = '\n'+getSummaryString(input_val, userOutput_val, "", stdout_val);
                    expect(error.code).to.not.equal(1, "最小値が違います"+error_message);
                    expect(error.code).to.not.equal(2, "最大値が違います"+error_message);
                    expect(error.code).to.not.equal(3, "数字を連結した文字列が違います"+error_message);
                    expect(0).to.not.equal(0, "ジャッジが異常終了しました"+error_message);
                }
            }
            });
        });
    });
