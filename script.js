const sections = document.querySelectorAll(".reveal");
const lineUrl = "https://line.me/R/oaMessage/%40221xmqpi/?%E8%A8%BA%E6%96%AD%E7%B5%90%E6%9E%9C%E5%B8%8C%E6%9C%9B";

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

async function startDiagnosis() {
  const error = document.getElementById("formError");
  error.classList.add("hidden");

  try {
    const url = normalizeSalonUrl(document.getElementById("salonUrl").value);
    document.getElementById("salonUrl").value = url;
    await navigator.clipboard.writeText(url);
    window.location.href = lineUrl;
  } catch (reason) {
    error.textContent = reason.message || "URLをコピーできませんでした。もう一度お試しください。";
    error.classList.remove("hidden");
  }
}

document.getElementById("startDiagnosis").addEventListener("click", startDiagnosis);
document.getElementById("salonUrl").addEventListener("keydown", (event) => {
  if (event.key === "Enter") startDiagnosis();
});
