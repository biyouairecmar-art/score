const sections = document.querySelectorAll(".reveal");
const lineAccount = "%40221xmqpi";

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("isVisible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  sections.forEach((section) => observer.observe(section));
} else {
  sections.forEach((section) => section.classList.add("isVisible"));
}

function normalizeSalonUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) throw new Error("店舗のHPB URLを入力してください。");

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error("URLの形式を確認してください。");
  }

  if (parsed.hostname !== "beauty.hotpepper.jp" || !/^\/slnH\d{9}\/?/.test(parsed.pathname)) {
    throw new Error("ホットペッパービューティーのサロンURLを入力してください。");
  }

  return `${parsed.origin}${parsed.pathname.endsWith("/") ? parsed.pathname : `${parsed.pathname}/`}`;
}

function startDiagnosis() {
  const error = document.getElementById("formError");
  error.classList.add("hidden");

  try {
    const url = normalizeSalonUrl(document.getElementById("salonUrl").value);
    document.getElementById("salonUrl").value = url;
    const message = `診断結果希望\nホットペッパーURL：\n${url}`;
    window.location.href = `https://line.me/R/oaMessage/${lineAccount}/?${encodeURIComponent(message)}`;
  } catch (reason) {
    error.textContent = reason.message || "LINEを開けませんでした。もう一度お試しください。";
    error.classList.remove("hidden");
  }
}

document.getElementById("startDiagnosis").addEventListener("click", startDiagnosis);
document.getElementById("salonUrl").addEventListener("keydown", (event) => {
  if (event.key === "Enter") startDiagnosis();
});
