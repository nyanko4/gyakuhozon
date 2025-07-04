const { CronJob } = require("cron");
const { DateTime } = require("luxon");
const { sendchatwork } = require("../ctr/message");
const supabase = require("../supabase/client");

function startDailyTask() {
    console.log("🟡 startDailyTask() called"); // ← これが Renderログに出るか確認
  new CronJob(
    "0 0 0 * * *",
    async () => {
      const date = DateTime.now().setZone("Asia/Tokyo").toFormat("yyyy年MM月dd");
      await sendchatwork(`日付変更　今日は${date}日です`, 374987857);
      await supabase.from("おみくじ").delete().neq("accountId", 0);
      await supabase.from("poker").delete().neq("accountId", 0);
    },
    null,
    true,
    "Asia/Tokyo"
  );
}

module.exports = { startDailyTask };
