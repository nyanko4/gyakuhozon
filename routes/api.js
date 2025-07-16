// qtmetaParser.js

const accountIdToName = {
  12345: "山田太郎",
  67890: "佐藤花子",
  // 他ユーザー追加
};

function formatUnixTime(unixTime) {
  const date = new Date(unixTime * 1000);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
}

function convertQtmetaToHTML(input) {
  return input.replace(
    /\[qtmeta\]\[meta aid=(\d+) time=(\d+)\]\s*([\s\S]*?)\s*\[\/meta\]/g,
    (_, aid, time, message) => {
      const formattedTime = formatUnixTime(Number(time));
      const name = accountIdToName[aid] || `ユーザーID: ${aid}`;
      return `<blockquote class="chatwork-quote">
  <p>${message.trim()}</p>
  <footer>
    投稿日時: ${formattedTime}<br>
    投稿者: ${name}（<a href="/search?aid=${aid}">検索</a>）
  </footer>
</blockquote>`;
    }
  );
}

module.exports = { convertQtmetaToHTML };
