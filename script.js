const titleDoctorText = document.getElementById("titleDoctorText");
const homeDoctorText = document.getElementById("homeDoctorText");

let selectedSuffix = "くん";

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    alert("このブラウザでは音声が使えないかもしれません。");
    return;
  }

  window.speechSynthesis.cancel();

  const voice = new SpeechSynthesisUtterance(text);
  voice.lang = "ja-JP";
  voice.rate = 0.86;
  voice.pitch = 1.05;

  window.speechSynthesis.speak(voice);
}

function getPlayerName() {
  return localStorage.getItem("pikoPlayerName") || "";
}

function getPlayerSuffix() {
  return localStorage.getItem("pikoPlayerSuffix") || "くん";
}

function getPlayerCall() {
  const name = getPlayerName() || "しゅり";
  const suffix = getPlayerSuffix();
  return name + suffix;
}

function speakIntro() {
  const message = "やあ！ぼくはドクターうろこ！きみを待っていたよ。今日はどんな恐竜に会えるかな？";
  titleDoctorText.textContent = "やあ！ぼくは Dr.うろこ！きみを待っていたよ。";
  speak(message);
}

function goNext() {
  const savedName = getPlayerName();

  if (savedName) {
    openHome();
  } else {
    showScreen("nameScreen");
    speak("ぼくはドクターうろこ。きみの名前を教えてね。");
  }
}

function selectSuffix(suffix) {
  selectedSuffix = suffix;

  document.getElementById("kunBtn").classList.toggle("selected", suffix === "くん");
  document.getElementById("chanBtn").classList.toggle("selected", suffix === "ちゃん");
  document.getElementById("sanBtn").classList.toggle("selected", suffix === "さん");
}

function savePlayerName() {
  const input = document.getElementById("nameInput");
  const name = input.value.trim() || "しゅり";

  localStorage.setItem("pikoPlayerName", name);
  localStorage.setItem("pikoPlayerSuffix", selectedSuffix);

  openHome();
  speak("よろしくね。" + name + selectedSuffix + "。いっしょに恐竜を探しに行こう。");
}

function openHome() {
  const player = getPlayerCall();
  homeDoctorText.textContent = "おかえり、" + player + "！今日もたんけんに行こう。";
  showScreen("homeScreen");
}

function speakWelcome() {
  const player = getPlayerCall();
  const message = "おかえり、" + player + "。今日も恐竜を探しに行こう。";
  homeDoctorText.textContent = "おかえり、" + player + "！今日も恐竜を探しに行こう。";
  speak(message);
}

function startAdventure() {
  const player = getPlayerCall();
  const message = "よーし。" + player + "。きょうりゅうたんけんに出発だ。";
  homeDoctorText.textContent = "よーし！" + player + "、出発だ！";
  speak(message);
}

function resetName() {
  localStorage.removeItem("pikoPlayerName");
  localStorage.removeItem("pikoPlayerSuffix");
  document.getElementById("nameInput").value = "しゅり";
  selectSuffix("くん");
  showScreen("nameScreen");
  speak("もういちど、おなまえを教えてね。");
}

window.addEventListener("load", () => {
  const savedName = getPlayerName();

  if (savedName) {
    openHome();
  }
});
