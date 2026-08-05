/* BHS PAFTA — ISI HARİTASI RENK SKALASI v1 · 05.08.2026
 *
 * Eski davranış:
 *   puan = 0,30 × montaj + 0,70 × (yapılan kalem / plan kalem)
 *   renk rampası: 0→h2, 0,25→h46, 0,50→h58, 0,75→h69, 1→h152
 *   Sorun 1: %25 ile %75 arası hep aynı sarı tonda kalıyordu — ayırt edilemiyordu.
 *   Sorun 2: montaj kaydı yoksa puan 0'a düşüyor, çekilmiş kablolar görünmüyordu.
 *
 * Yeni davranış:
 *   renk = yalnızca kablo ilerlemesi (yapılan/plan), montaj rengi bozmuyor
 *   montaj kaydı olmayan nokta = mor halka (ısı haritası açıkken)
 *   skala: %0 kırmızı · %1-30 turuncu · %31-60 sarı · %61-99 açık yeşil · %100 koyu yeşil
 *
 * index.html'e dokunmaz; _isiC ve _isiRenk fonksiyonlarını sarar.
 */
(function () {
  if (window.__BHS_ISI) return;
  window.__BHS_ISI = 1;

  var DISLA = ['revize', 'birlesti'];   // hakedişte sayılmayan durumlar

  /* ---------- plan kalemleri (panel.html ile aynı mantık) ---------- */
  function planLinye(o, tip) {
    var h = [];
    try {
      if (tip === 'db') {
        var hb = (typeof HATLAR !== 'undefined') ? HATLAR[String(o.id).padStart(2, '0')] : null;
        if (hb && hb.hatlar) h = hb.hatlar.slice();
      } else {
        if (typeof PANO_LINYE !== 'undefined' && PANO_LINYE[o.kod])
          h = PANO_LINYE[o.kod].map(function (x) { return x.l; });
      }
    } catch (e) { h = []; }
    var g = o.gizliLinye || [];
    h = h.filter(function (x) { return g.indexOf(x) < 0; });
    (o.ekLinye || []).forEach(function (x) { if (h.indexOf(x) < 0) h.push(x); });
    return h;
  }

  function planKablo(o, tip) {
    var bk = (o.besleme && Array.isArray(o.besleme.kablolar)) ? o.besleme.kablolar : null;
    if (!bk) {
      try {
        var key = (tip === 'db') ? String(o.id).padStart(2, '0') : o.kod;
        var bd = (typeof BESLEME !== 'undefined') ? BESLEME[key] : null;
        bk = bd ? bd.kablolar.map(function () { return { durum: 'bekliyor' }; }) : [];
      } catch (e) { bk = []; }
    }
    return bk;
  }

  /* ---------- kablo ilerleme oranı (0..1) ---------- */
  function oran(o, tip) {
    var top = 0, yap = 0;
    planLinye(o, tip).forEach(function (k) {
      var v = (o.linye && o.linye[k]) || {};
      var s = v.durum || 'bekliyor';
      if (DISLA.indexOf(s) >= 0) return;
      top++; if (s === 'cekildi') yap++;
    });
    planKablo(o, tip).forEach(function (c) {
      var s = (c && c.durum) || 'bekliyor';
      if (DISLA.indexOf(s) >= 0) return;
      top++; if (s === 'cekildi') yap++;
    });
    if (!top) return 1;              // planda kalem yok = yapılacak iş yok
    return yap / top;
  }

  window._isiC = function (o, tip) { return oran(o, tip); };
  window._bhsIsiOran = oran;

  /* ---------- renk skalası ---------- */
  /* Çapa noktaları: oran → [ton, doygunluk, açıklık]  (hsl) */
  var CAPA = [
    [0.00,   2, 88, 47],   // kırmızı  — hiç çekilmemiş
    [0.30,  24, 92, 50],   // turuncu  — az başlanmış
    [0.60,  48, 95, 52],   // sarı     — yarı yolda
    [0.85,  78, 62, 45],   // fıstık   — çoğu bitti
    [0.999, 104, 58, 40],  // açık yeşil
    [1.00, 142, 68, 38]    // koyu yeşil — tamam
  ];

  function ara(a, b, t) { return a + (b - a) * t; }

  window._isiRenk = function (v) {
    v = (typeof v === 'number' && isFinite(v)) ? Math.max(0, Math.min(1, v)) : 0;
    if (v <= 0) return CAPA[0][1] + ',' + CAPA[0][2] + ',' + CAPA[0][3];
    if (v >= 1) return CAPA[5][1] + ',' + CAPA[5][2] + ',' + CAPA[5][3];
    for (var i = 0; i < CAPA.length - 1; i++) {
      var a = CAPA[i], b = CAPA[i + 1];
      if (v >= a[0] && v <= b[0]) {
        var t = (b[0] === a[0]) ? 0 : (v - a[0]) / (b[0] - a[0]);
        return Math.round(ara(a[1], b[1], t)) + ',' +
               Math.round(ara(a[2], b[2], t)) + ',' +
               Math.round(ara(a[3], b[3], t));
      }
    }
    return CAPA[0][1] + ',' + CAPA[0][2] + ',' + CAPA[0][3];
  };

  /* ---------- montaj kaydı olmayan nokta: mor halka ---------- */
  function stil() {
    if (document.getElementById('bhsIsiStil')) return;
    var s = document.createElement('style');
    s.id = 'bhsIsiStil';
    s.textContent =
      '.isiAcik .mk.m0{box-shadow:0 0 0 3px #a855f7,0 0 10px 2px rgba(168,85,247,.75) !important;' +
      'border-color:#c084fc !important}' +
      '#bhsIsiLejant{position:fixed;left:12px;bottom:64px;z-index:9997;background:rgba(10,20,28,.92);' +
      'border:1px solid #2b3f4d;border-radius:10px;padding:10px 12px;font:11px/1.5 system-ui;color:#dce8f0;' +
      'box-shadow:0 8px 24px rgba(0,0,0,.45)}' +
      '#bhsIsiLejant b{display:block;font-size:11px;margin-bottom:6px;color:#9fd2ea;letter-spacing:.3px}' +
      '#bhsIsiLejant .sr{display:flex;align-items:center;gap:7px;margin:3px 0}' +
      '#bhsIsiLejant i{width:22px;height:11px;border-radius:3px;display:inline-block}';
    document.head.appendChild(s);
  }

  function lejant(goster) {
    var v = document.getElementById('bhsIsiLejant');
    if (!goster) { if (v) v.remove(); return; }
    if (v) return;
    stil();
    function sat(o, ad) {
      return '<div class="sr"><i style="background:hsl(' + window._isiRenk(o) + ')"></i>' + ad + '</div>';
    }
    var d = document.createElement('div');
    d.id = 'bhsIsiLejant';
    d.innerHTML = '<b>KABLO İLERLEMESİ</b>' +
      sat(0, 'hiç çekilmemiş') +
      sat(0.2, '%1–30 · az başlanmış') +
      sat(0.45, '%31–60 · yarı yolda') +
      sat(0.8, '%61–99 · çoğu bitti') +
      sat(1, 'tamamlandı') +
      '<div class="sr"><i style="background:transparent;box-shadow:0 0 0 2px #a855f7 inset"></i>montaj kaydı yok</div>';
    document.body.appendChild(d);
  }

  function isiAcikMi() {
    var k = document.getElementById('isiKat');
    if (!k) return false;
    var g = window.getComputedStyle(k);
    return g.display !== 'none' && g.visibility !== 'hidden' && parseFloat(g.opacity || '1') > 0.05;
  }

  function isaretle() {
    stil();
    var acik = isiAcikMi();
    document.body.classList.toggle('isiAcik', acik);
    lejant(acik);
  }

  /* isiToggle ve isiCiz sonrası halkayı/lejantı tazele */
  ['isiToggle', 'isiCiz'].forEach(function (ad) {
    if (typeof window[ad] !== 'function') return;
    var orj = window[ad];
    window[ad] = function () {
      var r = orj.apply(this, arguments);
      setTimeout(isaretle, 30);
      return r;
    };
  });

  setTimeout(isaretle, 1500);
})();
