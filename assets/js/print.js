// "Save as PDF" button: opens the print dialog, where the reader picks "Save as PDF".
(function () {
  var btn = document.querySelector(".print-btn");

  // Paragraphs holding only line breaks are spacers between figures; print.css hides them.
  document.querySelectorAll("main p").forEach(function (p) {
    if (p.textContent.trim() === "" && p.querySelectorAll(":scope > :not(br)").length === 0) {
      p.classList.add("print-spacer");
    }
  });

  // Wrap each figure and the table right after it in one block, so print never splits them.
  document.querySelectorAll("main figure").forEach(function (fig) {
    var next = fig.nextElementSibling;
    if (next && next.tagName === "TABLE") {
      var keep = document.createElement("div");
      keep.className = "print-keep";
      fig.parentNode.insertBefore(keep, fig);
      keep.appendChild(fig);
      keep.appendChild(next);
    }
  });

  // Images are lazy-loaded, so ones not scrolled to yet would print blank. Load them all first.
  function loadAllImages() {
    var imgs = Array.from(document.querySelectorAll("main img"));
    imgs.forEach(function (img) { img.loading = "eager"; });
    return Promise.all(imgs.map(function (img) {
      if (img.complete) return Promise.resolve();
      return new Promise(function (done) {
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      });
    }));
  }

  // Also covers Cmd+P / Ctrl+P, though there the browser won't wait for images still loading.
  window.addEventListener("beforeprint", loadAllImages);

  if (!btn || typeof window.print !== "function") return;
  btn.hidden = false;
  btn.addEventListener("click", function () {
    var label = btn.textContent;
    btn.textContent = "Preparing…";
    btn.disabled = true;
    // Give up waiting after 10 seconds so a broken image can't block printing.
    var timeout = new Promise(function (done) { setTimeout(done, 10000); });
    Promise.race([loadAllImages(), timeout]).then(function () {
      btn.textContent = label;
      btn.disabled = false;
      window.print();
    });
  });
})();
