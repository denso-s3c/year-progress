// うるう年判定
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// 年の総日数を取得
function getTotalDaysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

// 日時を YYYY-MM-DD HH:MM:SS 形式でフォーマット
function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 進捗データを計算
function calculateProgress() {
  const now = new Date();
  const currentYear = now.getFullYear();

  // 今年の開始と終了（ローカル時刻基準）
  const yearStart = new Date(currentYear, 0, 1, 0, 0, 0, 0);
  const yearEnd = new Date(currentYear + 1, 0, 1, 0, 0, 0, 0);

  // 総ミリ秒
  const totalMs = yearEnd.getTime() - yearStart.getTime();

  // 経過ミリ秒
  let elapsedMs = now.getTime() - yearStart.getTime();

  // クリップ処理
  if (elapsedMs < 0) {
    elapsedMs = 0;
  } else if (elapsedMs > totalMs) {
    elapsedMs = totalMs;
  }

  // 進捗％（小数2桁）
  const progressPercent = (elapsedMs / totalMs) * 100;

  // 残り日数（切り上げ）
  const msPerDay = 24 * 60 * 60 * 1000;
  const remainingMs = yearEnd.getTime() - now.getTime();
  const daysRemaining = remainingMs >= 0 ? Math.ceil(remainingMs / msPerDay) : 0;

  // 経過日数（切り捨て、0日目スタート）
  const daysElapsed = Math.floor(elapsedMs / msPerDay);

  // 総日数
  const totalDays = getTotalDaysInYear(currentYear);

  return {
    currentYear,
    isLeap: isLeapYear(currentYear),
    currentTime: formatDateTime(now),
    daysRemaining,
    progressPercent: progressPercent.toFixed(2),
    daysElapsed,
    totalDays
  };
}

// UI更新
function render() {
  const data = calculateProgress();

  // 残り日数
  document.getElementById('daysRemaining').textContent = `今年が終わるまで：あと ${data.daysRemaining} 日`;

  // 進捗％
  document.getElementById('progressPercent').textContent = `進捗： ${data.progressPercent} %`;

  // 経過日数
  document.getElementById('daysFraction').textContent = `経過： ${data.daysElapsed} / ${data.totalDays} 日`;

  // 補助情報
  document.getElementById('currentTime').textContent = data.currentTime;
  document.getElementById('currentYear').textContent = data.currentYear;
  document.getElementById('leapYear').textContent = data.isLeap ? 'Yes' : 'No';
}

// 初回実行
render();

// 60秒ごとに自動更新
setInterval(render, 60000);
