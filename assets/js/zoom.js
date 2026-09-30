// Click any figure image to open it full screen.
// Zoom: scroll wheel, trackpad or touch pinch, or click the image to toggle.
// Pan: drag. Close: Esc, the x button, or click the dark background.
(function () {
  var MAX_SCALE = 8, CLICK_ZOOM = 2.5;

  var overlay = document.createElement("div");
  overlay.className = "zoom-overlay";
  overlay.hidden = true;
  overlay.innerHTML =
    '<img class="zoom-img" alt="">' +
    '<button class="zoom-close" type="button" aria-label="Close">&times;</button>' +
    '<div class="zoom-hint">Scroll or pinch to zoom · drag to pan · Esc to close</div>';
  document.body.appendChild(overlay);
  var img = overlay.querySelector(".zoom-img");

  var s = 1, tx = 0, ty = 0, baseW = 0, baseH = 0;
  var pointers = new Map(), pinchDist = 0, moved = false, downX = 0, downY = 0;

  function apply() {
    img.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + s + ")";
  }

  // Keep the image on screen: centred when smaller than the window, edges clamped when larger.
  function clamp() {
    var vw = window.innerWidth, vh = window.innerHeight, w = baseW * s, h = baseH * s;
    tx = w <= vw ? (vw - w) / 2 : Math.min(0, Math.max(vw - w, tx));
    ty = h <= vh ? (vh - h) / 2 : Math.min(0, Math.max(vh - h, ty));
  }

  function zoomAt(newS, px, py) {
    newS = Math.min(MAX_SCALE, Math.max(1, newS));
    tx = px - (px - tx) * (newS / s);
    ty = py - (py - ty) * (newS / s);
    s = newS;
    clamp();
    apply();
  }

  function fit() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var nw = img.naturalWidth || 1, nh = img.naturalHeight || 1;
    // Fit inside 92% of the window; small images may grow up to 2x their natural size.
    var k = Math.min((vw * 0.92) / nw, (vh * 0.92) / nh, 2);
    baseW = nw * k; baseH = nh * k;
    img.style.width = baseW + "px";
    img.style.height = baseH + "px";
    s = 1;
    clamp();
    apply();
  }

  function open(src, alt) {
    img.onload = fit;
    img.src = src;
    img.alt = alt || "";
    overlay.hidden = false;
    document.documentElement.style.overflow = "hidden";
    if (img.complete) fit();
  }

  function close() {
    overlay.hidden = true;
    document.documentElement.style.overflow = "";
    pointers.clear();
    img.removeAttribute("src");
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t.tagName === "IMG" && t.closest("main figure")) {
      e.preventDefault();
      open(t.currentSrc || t.src, t.alt);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (!overlay.hidden && e.key === "Escape") close();
  });

  overlay.querySelector(".zoom-close").addEventListener("click", close);

  overlay.addEventListener("wheel", function (e) {
    e.preventDefault();
    zoomAt(s * Math.exp(-e.deltaY * 0.002), e.clientX, e.clientY);
  }, { passive: false });

  overlay.addEventListener("pointerdown", function (e) {
    if (e.target.closest(".zoom-close")) return;
    overlay.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) { moved = false; downX = e.clientX; downY = e.clientY; }
    if (pointers.size === 2) {
      var p = Array.from(pointers.values());
      pinchDist = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      moved = true;
    }
  });

  overlay.addEventListener("pointermove", function (e) {
    var prev = pointers.get(e.pointerId);
    if (!prev) return;
    var cur = { x: e.clientX, y: e.clientY };
    pointers.set(e.pointerId, cur);
    if (Math.hypot(cur.x - downX, cur.y - downY) > 4) moved = true;

    if (pointers.size === 1) {
      tx += cur.x - prev.x;
      ty += cur.y - prev.y;
      clamp();
      apply();
    } else if (pointers.size === 2) {
      var p = Array.from(pointers.values());
      var d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      if (pinchDist > 0) zoomAt(s * (d / pinchDist), (p[0].x + p[1].x) / 2, (p[0].y + p[1].y) / 2);
      pinchDist = d;
    }
  });

  function up(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchDist = 0;
    if (pointers.size === 0 && !moved && e.type === "pointerup") {
      if (e.target === img) {
        // Click on the image toggles between fitted and zoomed in at that spot.
        zoomAt(s > 1 ? 1 : CLICK_ZOOM, e.clientX, e.clientY);
      } else {
        close();
      }
    }
  }
  overlay.addEventListener("pointerup", up);
  overlay.addEventListener("pointercancel", up);

  window.addEventListener("resize", function () { if (!overlay.hidden) fit(); });
})();
