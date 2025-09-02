(function () {
  // ---- Konfiguration ----
  var PAKET_PARAM = "paket";
  var MAP = { basic: "Entra Basic", pro: "Entra Pro", enterprise: "Entra Enterprise" };

  // nur auf /contact laufen (Trailing Slash egal)
  var path = location.pathname.replace(/\/+$/, "");
  if (path !== "/contact") return;

  var params = new URLSearchParams(location.search);
  var raw = (params.get(PAKET_PARAM) || "").toLowerCase();
  if (!raw) return;

  var paketName = MAP[raw] || raw;
  var text = "Ich interessiere mich für das Paket: " + paketName +
             ". Bitte melden Sie sich für ein unverbindliches Erstgespräch.";

  function setValue(el, val) {
    try {
      if (!el) return false;
      el.value = val;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    } catch { return false; }
  }

  function tryFillOnce() {
    // Dein Feld heißt name="message" – exakt treffen, plus Fallbacks
    var msg =
      document.querySelector("textarea[name='message']") ||
      document.querySelector("textarea#message") ||
      document.querySelector("form textarea");

    if (!msg) return false;

    if (!msg.value || !msg.value.trim()) {
      setValue(msg, text);
    }

    // Hidden-Feld für saubere Submission (separat vom Nachrichtentext)
    var form = msg.closest("form") || document.querySelector("form");
    if (form && !form.querySelector("input[name='selected_package']")) {
      var hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.name = "selected_package";
      hidden.value = paketName;
      form.appendChild(hidden);
    }
    return true;
  }

  // direkt versuchen + bei Lazy-Load wiederholen
  if (tryFillOnce()) return;
  var attempts = 0, max = 120; // bis ~12s
  var iv = setInterval(function () {
    attempts++;
    if (tryFillOnce() || attempts >= max) clearInterval(iv);
  }, 100);

  // zusätzlich auf DOM-Änderungen reagieren
  var mo = new MutationObserver(function () { tryFillOnce(); });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
