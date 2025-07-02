const CHATWORK_API_TOKEN = process.env.CWapitoken;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const supabase = require("../supabase/client");
const { DateTime } = require("luxon");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const reqcheck = require("../middleware/sign");
const { sendername: name, fileurl, arashi: arashim } = require("../ctr/cwdata");
const { sendchatwork, deleteMessage, readmessage } = require("../ctr/message");
const arashi = require("../module/arashi");
const command = require("../module/command");
const omikuji = require("../module/omikuji");
const senden = require("../module/senden");
const welcome = require("../module/welcome");

async function getchat(req, res) {
  const c = await reqcheck(req);
  if (c !== "ok") {
    return res.sendStatus(400);
  }
  const today = DateTime.now().setZone("Asia/Tokyo").toFormat("yyyy-MM-dd");
  console.log(req.body);
  const event = req.body.webhook_event_type;
  const {
    body,
    account_id: accountId,
    room_id: roomId,
    message_id: messageId,
    send_time: sendtime,
    update_time: updatetime,
  } = req.body.webhook_event;
  await readmessage(roomId, messageId);
  const sendername = await name(accountId, roomId);
  if (accountId === 9587322　|| body.match(/\[To\:9587322\]/)) {
    if (body.includes("[dtext:chatroom_chat_edited]")) {
      deleteMessage(body, messageId, roomId, accountId);
    } else return res.sendStatus(200);
  }
  if (roomId == 374987857) {
  log(body, messageId, roomId, accountId, event, sendtime, updatetime);
    //メッセージを保存
    const { data, error } = await supabase.from("nyankoのへや").insert({
      messageId: messageId,
      message: body,
      accountId: accountId,
      name: sendername,
      date: today,
    });
  }
  const handlers = [arashi, omikuji, senden, welcome, command];

  for (const handler of handlers) {
    if ((await handler(body, messageId, roomId, accountId)) === "ok") {
      return res.sendStatus(200);
    }
  }

  res.sendStatus(200);
}
async function log(
  body,
  messageId,
  roomId,
  accountId,
  event,
  sendtime,
  updatetime
) {
  try {
    const a = await arashim(body, messageId, roomId, accountId);
    const sendername = await name(accountId, roomId);
    if (a !== "ok") {
      if (body.includes("[info][title][dtext:file_uploaded][/title]")) {
        const url = await fileurl(body, roomId);
        if (url === false) {
          sendchatwork(
            `${sendername}\n[qt][qtmeta aid=${accountId} time=${sendtime}]${body}[/qt]`,
            389966097
          );
        } else {
          try {
            const headResponse = await axios({
              method: 'head',
              url: url.fileurl,
            });

            const contentLength = headResponse.headers['content-length'];
            if (contentLength && parseInt(contentLength, 10) > MAX_FILE_SIZE_BYTES) {
              console.warn(`ファイルが大きすぎます。ダウンロードをスキップします: ${url.filename} (${contentLength} bytes)`);
              sendchatwork(
                `${sendername}さんが送信したファイルは、サイズ制限 (${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB) を超えているため、保存・転送されませんでした。`,
                389966097
              );
              return; // ここで処理を終了
            }
            const dir = 'file';
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
              console.log(`ディレクトリ '${dir}' を作成しました。`);
            }
            const localFilePath = `${dir}/${url.filename}`; // 拡張子をpngに変更
            const writer = fs.createWriteStream(localFilePath);
            const response = await axios({
              method: "get",
              url: url.fileurl,
              responseType: "stream",
            });

            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
              writer.on("finish", resolve);
              writer.on("error", reject);
            });

            const formData = new FormData();
            formData.append("file", fs.createReadStream(localFilePath));
            formData.append("message", sendername);

            const uploadUrl = `https://api.chatwork.com/v2/rooms/389966097/files`;
            const headers = {
              ...formData.getHeaders(),
              "x-chatworktoken": CHATWORK_API_TOKEN,
            };

            const uploadResponse = await axios.post(uploadUrl, formData, {
              headers,
            });

            console.log("ファイルアップロード成功:", uploadResponse.data);

            await new Promise((resolve, reject) => {
              fs.unlink(localFilePath, (err) => {
                if (err) {
                  console.error("ローカルファイルの削除エラー:", err);
                  reject(err); // エラーをreject
                } else {
                  resolve(); // 正常終了
                }
              });
            });

            console.log("ローカルファイルを削除しました。");
          } catch (error) {
            sendchatwork(
              `[To:9487124]ファイル送信でエラーが発生しました\n${error.message}`,
              roomId
            );
            console.error("ファイル送信でエラーが発生しました:", error.message);
            if (error.response) {
              sendchatwork(
                `[To:9487124]\nChatwork APIエラー:${error.response.status}\n${error.response.data}`,
                roomId
              );
              console.error(
                "Chatwork APIエラー:",
                error.response.status,
                error.response.data
              );
            }
          }
        }
      } else {
        if (event === "message_updated") {
          sendchatwork(
            `${sendername} ${accountId}\n[qt][qtmeta aid=${accountId} time=${updatetime}]${body}[/qt]`,
            389966097
          );
        } else {
          sendchatwork(
            `${sendername} ${accountId}\n[qt][qtmeta aid=${accountId} time=${sendtime}]${body}[/qt]`,
            389966097
          );
        }
      }
    }
  } catch (error) {
    console.error("error", error);
  }
}

module.exports = getchat;
