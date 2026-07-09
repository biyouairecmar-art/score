const $ = (id) => document.getElementById(id);

function show(element, visible) {
  element.classList.toggle("hidden", !visible);
}

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("店舗のHPB URLを入力してください。");
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error("URLの形式を確認してください。");
  }

  const isHpb = parsed.hostname === "beauty.hotpepper.jp";
  const isSalonPage = /^\/slnH\d{9}\/?/.test(parsed.pathname);
  if (!isHpb || !isSalonPage) {
    throw new Error("ホットペッパービューティーのサロンURLを入力してください。");
  }

  return `${parsed.origin}${parsed.pathname.endsWith("/") ? parsed.pathname : `${parsed.pathname}/`}`;
}

function createMessage(url) {
  return `診断結果希望\nホットペッパーURL：\n${url}`;
}

function submitRequest() {
  show($("error"), false);

  try {
    const url = normalizeUrl($("url").value);
    $("url").value = url;
    $("requestMessage").textContent = createMessage(url);
    $("copyStatus").textContent = "";
    show($("requestPanel"), false);
    show($("requestComplete"), true);
    $("requestComplete").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    $("error").textContent = error.message;
    show($("error"), true);
  }
}

async function copyMessage() {
  const message = $("requestMessage").textContent;
  try {
    await navigator.clipboard.writeText(message);
    $("copyStatus").textContent = "コピーしました。続けてLINEを開き、貼り付けて送信してください。";
    $("copyMessage").textContent = "コピー済み";
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents($("requestMessage"));
    selection.removeAllRanges();
    selection.addRange(range);
    $("copyStatus").textContent = "文章を選択しました。コピーしてLINEへ貼り付けてください。";
  }
}

function editUrl() {
  show($("requestComplete"), false);
  show($("requestPanel"), true);
  $("copyMessage").textContent = "文章をコピー";
  $("requestPanel").scrollIntoView({ behavior: "smooth", block: "start" });
  $("url").focus();
}

$("analyze").addEventListener("click", submitRequest);
$("copyMessage").addEventListener("click", copyMessage);
$("editUrl").addEventListener("click", editUrl);
$("url").addEventListener("keydown", (event) => {
  if (event.key === "Enter") submitRequest();
});
