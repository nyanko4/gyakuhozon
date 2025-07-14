const { SelectblockMember } = require("../ctr/filter");
async function nagashi(body, message, messageId, roomId, accountId) {
  if (accountId === 9487124) {
    const extractMatches = (regex) =>
      [...body.matchAll(regex)].map((n) => n[0]);
    const rid = extractMatches(/\d+(?=,)/g);
    const aid = extractMatches(/(?<=,)\d+/g);
    await SelectblockMember(rid, aid)
    }
  }
}
module.exports = nagashi;
