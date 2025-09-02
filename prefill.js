(function () {
  console.log("[prefill] geladen");

  var PARAM = "paket";
  var MAP = { basic: "Entra Basic", pro: "Entra Pro", enterprise: "Entra Enterprise" };

  var path = location.pathname.replace(/\/+$/, "");
  if (path !== "/contact") { return; }

  var params = new URLSearchParams(location.search);
  var raw = (params.get(PARAM) || "").toLowerCase();
  if (!raw) { return; }

  var paketName = MAP[raw] || raw;
  var text = "Ich interessiere mich für das Paket: " + paketName +
             ". Bitte melden Sie sich für ein unverbindliches Erstgespräch.";

  function setValue(el, val) {
    if (!el) return false;
    el.value = val;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    console.log("[prefill] Nachricht gesetzt:", val);
    return true;
  }

  function tryFill() {
    var msg = document.querySelector("textarea[name='message']");
    if (!msg) return false;
    if (!msg.value || !msg.value.trim()) {
      return setValue(msg, text);
    }
    return true;
  }

  // Erst nach Hydration füllen
  var attempts = 0, max = 200;
  var iv = setInterval(function () {
    attempts++;
    if (tryFill() || attempts >= max) {
      clearInterval(iv);
    }
  }, 150);

  // zusätzlich auf DOM-Änderungen reagieren
  var mo = new MutationObserver(tryFill);
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
