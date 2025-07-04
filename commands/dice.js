const { sendchatwork } = require("../ctr/message");
//サイコロを振る
async function diceroll(body, message, messageId, roomId, accountId) {
  const saikoro = [...body.matchAll(/\d+(?=d)/g)].map((saikoro) => saikoro[0]);
  const men = [...body.matchAll(/(?<=d)\d+/g)].map((men) => men[0]);
  const number = [];
  for (let s = 0; s < saikoro; s++) {
    number.push(Math.floor(Math.random() * men) + 1);
  }
  const sum = number.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
  if (saikoro <= 100) {
    if (men <= 100) {
      if (saikoro == 1) {
        if (men > 0 && saikoro > 0) {
          await sendchatwork(
            `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}] さん\n${number}`,
            roomId
          );
        } else {
          await sendchatwork(
            `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}] さん\nダイスの数と面の数を指定してください`,
            roomId
          );
        }
      } else if (men > 0 && saikoro > 0) {
        await sendchatwork(
          `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}] さん\n${number} ${
            "合計値" + sum
          }`,
          roomId
        );
      } else {
        await sendchatwork(
          `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}] さん\nダイスの数と面の数を指定してください`,
          roomId
        );
      }
    } else {
      await sendchatwork(`[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}] さん\n面の数が正しくありません(1~100)`, roomId);
    }
  } else {
    await sendchatwork(`[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}] さん\nサイコロの数が正しくありません(1~100)`, roomId);
  }
}
module.exports = diceroll
