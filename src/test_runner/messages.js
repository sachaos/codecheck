"use strict";

const MESSAGES_JA = {
  NON_ZERO_STATUS_CODE: "ステータスコードが正常(0)ではありません",
  NO_OUTPUT_FILE: "出力ファイル {0} が作成されていません",
  INVALID_DATA_LENGTH: `出力すべきデータの個数が違います
期待された個数: {0}
あなたの個数: {1}
`,
  INVALID_DATA_ROW: `{0}番目のデータが違います。
期待された答え: {1}
あなたの答え: {2}
`,
  FAIL_TO_RUN_JUDGE: `judgeの実行に失敗しました。管理者に問い合わせてください。: command={0}
{1}
`,
  SUMMARY_INPUT: "#### 入力:",
  SUMMARY_YOUR_OUTPUT: "#### あなたの答え:",
  SUMMARY_EXPECTED_OUTPUT: "#### 期待された答え:",
  SUMMARY_STDOUT: "#### 標準出力:",
  SUMMARY_STDERR: "#### 標準エラー出力:",
  APP_TIMEOUT: "アプリケーションの実行が規定時間内に終了しませんでした。: 規定時間={0}ms, 実行時間={1}ms",
};

const MESSAGES_EN = {
  NON_ZERO_STATUS_CODE: "Exit status should be 0.",
  NO_OUTPUT_FILE: "Output file {0} is not created.",
  INVALID_DATA_LENGTH: `The number of outputs is wrong
Expected number: {0}
Participant's number: {1}
`,
  INVALID_DATA_ROW: `{0} data is wrong
Expected data: {1}
Participant's data: {2}
`,
  FAIL_TO_RUN_JUDGE: `Fail to run judge. Please contact the administrator.: command={0},
{1}
`,
  SUMMARY_INPUT: "#### Input:",
  SUMMARY_YOUR_OUTPUT: "#### Your Output:",
  SUMMARY_EXPECTED_OUTPUT: "#### Expected Output:",
  SUMMARY_STDOUT: "#### Standard Output:",
  SUMMARY_STDERR: "#### Standard Error Output:",
  APP_TIMEOUT: "Your application didn't finish in expected time.: Expected={0}ms, Execution={1}ms",
};

class Messages {
  constructor(json) {
    Object.assign(this, json);
  }

  format() {
    let ret = arguments[0];
    if (!ret) {
      return "No message: " + arguments[0];
    }
    for (let i = 1; i < arguments.length; i++) {
      ret = ret.replace("{" + (i - 1) + "}", arguments[i]);
    }
    return ret;
  }
}

function getMessages(lang) {
  const json = lang === "ja" ? MESSAGES_JA : MESSAGES_EN;
  return new Messages(json);
}

module.exports = {
  getMessages: getMessages
};
