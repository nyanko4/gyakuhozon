const CHATWORK_API_TOKEN = process.env.CWapitoken;
const supabase = require("../supabase/client");
const axios = require("axios");
const reqcheck = require("../middleware/sign");
const command = require("../module/command");

async function getchat(req, res) {
  const c = await reqcheck(req);
  if (c !== "ok") {
    return res.sendStatus(400);
  }
  console.log(req.body);
  const {
    body,
    account_id: accountId,
    room_id: roomId,
    message_id: messageId,
  } = req.body.webhook_event;
  const handlers = [command];

  for (const handler of handlers) {
    if ((await handler(body, messageId, roomId, accountId)) === "ok") {
      return res.sendStatus(200);
    }
  }

  res.sendStatus(200);
}
module.exports = getchat;
