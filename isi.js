/* BHS PAFTA — ISI HARİTASI RENK SKALASI + LEJANT  v2 · 05.08.2026
 *
 * v1'de olanlar:
 *   - renk artık yalnız kablo ilerlemesine bakar (montaj rengi bozmuyor)
 *   - skala açıldı: %0 kırmızı → %1-30 turuncu → %31-60 sarı → %61-99 açık yeşil → %100 yeşil
 *
 * v2 değişiklikleri (Türab):
 *   - ayrı yüzen ısı lejantı KALDIRILDI, içerik ana lejanta taşındı
 *   - lejant artık katlanır: varsayılan KAPALI, başlıktan açılıp kapanır (tercih hatırlanır)
 *   - montaj kaydı olmayan PANO artık kırmızı değil MOR kenarlıklı (yanıp sönme yok)
 *
 * index.html'e dokunmaz; _isiC ve _isiRenk fonksiyonlarını sarar.
 */
(function () {
  if (window.__BHS_ISI) return;
  window.__BHS_ISI = 2;

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
  /* DİKKAT: orijinal _isiRenk [ton, doygunluk, açıklık] DİZİSİ döndürür,
     çağıran taraf hsla(c[0],c[1]%,c[2]%,a) kuruyor. Aynı biçim korunmalı. */
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
    if (v <= 0) return [CAPA[0][1], CAPA[0][2], CAPA[0][3]];
    if (v >= 1) return [CAPA[5][1], CAPA[5][2], CAPA[5][3]];
    for (var i = 0; i < CAPA.length - 1; i++) {
      var a = CAPA[i], b = CAPA[i + 1];
      if (v >= a[0] && v <= b[0]) {
        var t = (b[0] === a[0]) ? 0 : (v - a[0]) / (b[0] - a[0]);
        return [Math.round(ara(a[1], b[1], t)),
                Math.round(ara(a[2], b[2], t)),
                Math.round(ara(a[3], b[3], t))];
      }
    }
    return [CAPA[0][1], CAPA[0][2], CAPA[0][3]];
  };

  function hsl(v) {
    var c = window._isiRenk(v);
    return 'hsl(' + c[0] + ',' + c[1] + '%,' + c[2] + '%)';
  }

  /* ---------- stil: mor kenar + katlanır lejant ---------- */
  function stil() {
    if (document.getElementById('bhsIsiStil')) return;
    var s = document.createElement('style');
    s.id = 'bhsIsiStil';
    s.textContent =
       /* paftanın eski yüzen ısı şeridi — içeriği artık ana lejantta */
      '#isiLejant{display:none !important}' +
      /* katlanır lejant */
      '#lejant{padding:0 !important;overflow:hidden}' +
      '#lejantBas{display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none;' +
      'padding:8px 12px;font:600 12px system-ui;color:#cfe6f2;letter-spacing:.3px}' +
      '#lejantBas:hover{color:#fff}' +
      '#lejantOk{margin-left:auto;font-size:11px;opacity:.75;transition:transform .15s}' +
      '#lejant.kapali #lejantOk{transform:rotate(-90deg)}' +
      '#lejantIc{padding:2px 12px 12px}' +
      '#lejant.kapali #lejantIc{display:none}' +
      '#bhsIsiBolum{margin-top:10px;padding-top:9px;border-top:1px solid rgba(255,255,255,.14)}' +
      '#bhsIsiBolum b{display:block;font-size:10.5px;letter-spacing:.4px;color:#9fd2ea;margin-bottom:5px}' +
      '#bhsIsiBolum .sr{display:flex;align-items:center;gap:7px;margin:3px 0;font-size:11.5px}' +
      '#bhsIsiBolum i{width:20px;height:10px;border-radius:3px;display:inline-block;flex:none}';
    document.head.appendChild(s);
  }

  /* ---------- her noktaya kendi rengiyle halka ----------
     Komşu noktaların ışıması bir noktanın kendi durumunu örtüyordu
     (ör. DB-17 %10 iken çevresi yeşil olduğu için yeşil görünüyordu).
     Bu halka, noktanın kendi kablo oranını komşulardan bağımsız gösterir. */
  function halkaCiz() {
    var k = document.getElementById('isiKat');
    if (!k || !k.getContext) return;
    var g = getComputedStyle(k);
    if (g.display === 'none' || g.visibility === 'hidden') return;
    var ctx = k.getContext('2d');
    if (!ctx) return;
    var liste = [];
    try {
      (data.dbs || []).forEach(function (o) { liste.push([o, 'db']); });
      (data.panos || []).forEach(function (o) { liste.push([o, 'pano']); });
    } catch (e) { return; }
    ctx.save();
    liste.forEach(function (p) {
      var o = p[0];
      if (typeof o.x !== 'number' || typeof o.y !== 'number') return;
      var c = window._isiRenk(oran(o, p[1]));
      var x = o.x * k.width, y = o.y * k.height;
      var r = (p[1] === 'db') ? 18 : 20;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832);
      ctx.lineWidth = 8;
      ctx.strokeStyle = 'hsla(' + c[0] + ',' + c[1] + '%,' + c[2] + '%,0.96)';
      ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, r + 4.5, 0, 6.2832);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(8,16,22,.55)';
      ctx.stroke();
    });
    ctx.restore();
  }

  /* ---------- lejantı katlanır yap + ısı bölümünü içine ekle ---------- */
  function lejantKur() {
    var l = document.getElementById('lejant');
    if (!l || l.dataset.bhsKuruldu) return;
    stil();

    var ic = document.createElement('div');
    ic.id = 'lejantIc';
    while (l.firstChild) ic.appendChild(l.firstChild);

    /* paftanın kendi "Lejant" başlığı artık üstteki katlama başlığıyla çakışıyor */
    var ilk = ic.firstElementChild;
    if (ilk && ilk.tagName === 'B' && /lejant/i.test(ilk.textContent || '')) {
      var sonraki = ilk.nextElementSibling;
      ilk.remove();
      if (sonraki && sonraki.tagName === 'BR') sonraki.remove();
    }

    var bas = document.createElement('div');
    bas.id = 'lejantBas';
    bas.innerHTML = '<span>☰ LEJANT</span><span id="lejantOk">▾</span>';

    l.appendChild(bas);
    l.appendChild(ic);

    /* ısı skalası bölümü — ana lejantın içinde */
    var b = document.createElement('div');
    b.id = 'bhsIsiBolum';
    function sat(o, ad) {
      return '<div class="sr"><i style="background:' + hsl(o) + '"></i>' + ad + '</div>';
    }
    b.innerHTML = '<b>ISI HARİTASI — KABLO İLERLEMESİ</b>' +
      sat(0, 'hiç çekilmemiş') +
      sat(0.2, '%1–30 · az başlanmış') +
      sat(0.45, '%31–60 · yarı yolda') +
      sat(0.8, '%61–99 · çoğu bitti') +
      sat(1, 'tamamlandı') +
       '<div class="sr" style="opacity:.72;font-size:10.5px;margin-top:5px">' +
      'Her noktanın çevresindeki halka kendi oranıdır — komşu ışıması yanıltmaz.</div>';
    ic.appendChild(b);

    var acik = localStorage.getItem('bhsLejantAcik') === '1';
    l.classList.toggle('kapali', !acik);
    bas.onclick = function () {
      var k = l.classList.toggle('kapali');
      localStorage.setItem('bhsLejantAcik', k ? '0' : '1');
    };
    l.dataset.bhsKuruldu = '1';
  }

  /* ısı her çizildiğinde halkaları üstüne bas; lejantı da tazele */
  ['isiToggle', 'isiCiz'].forEach(function (ad) {
    if (typeof window[ad] !== 'function') return;
    var orj = window[ad];
    window[ad] = function () {
      var r = orj.apply(this, arguments);
      try { halkaCiz(); } catch (e) {}
      setTimeout(function () { try { halkaCiz(); } catch (e) {} lejantKur(); }, 60);
      return r;
    };
  });
  window._bhsHalka = halkaCiz;

  function basla() { stil(); lejantKur(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla);
  else basla();
  setTimeout(basla, 1200);
  setTimeout(basla, 3500);
})();

/* ============================================================
   RAPOR -> PAFTA AKTARIMI - LINYE/SORTI DUZELTMESI (12.08.2026)
   index.html icindeki _rpUygulaItem yalniz is==='linye' isliyor;
   is==='sorti' satirlari BESLEME kablosu sanilip yanlis yere yaziliyordu.
   Ayrica plan disi linye kodlari ekLinye'ye girmedigi icin gorunmez kaliyordu.
   Bu blok o fonksiyonu sarar - index.html'e dokunmaz.
   ============================================================ */
(function () {
  if (window.__BHS_AKTARIM) return;
  window.__BHS_AKTARIM = 1;
  if (typeof window._rpUygulaItem !== 'function') return;
  var PLAN = {"H":{"58":["L01","L02","L03","L04","L05","L06","L07","L08","L09"],"59":["L01","L02","L03","L04","L05","L06","L07","L08","L09"],"01":["L02","L13","L14","L15"],"08":["L03","L07","L08","L09","L10","L11","L12","L13","L14"],"03":["L04","L20","L21","L22","L23","L35"],"04":["L05","L06","L24","L25","L26","L27","L34"],"05":["L07","L28","L29"],"06":["L30","L31","L32"],"07":["L08","L33"],"02":["L03","L16","L17","L18","L19"],"15":["L15","L16","L17"],"09":["L03","L07","L08","L09","L10"],"10":["L03","L07","L08","L09","L10","L11"],"11":["L04","L12","L13"],"12":["L05","L14","L18"],"13":["L06","L15","L16","L17"],"14":["L04","L05","L11","L12","L13"],"16":["L03","L07","L08","L09","L10","L11","L12","L13","L14"],"57":["L07","L08"],"17":["L03","L07","L08","L09","L10","L11","L12","L13"],"18":["L07","L08"],"19":["L03","L04","L07","L08"],"20":["L03","L07","L08","L09","L10","L11","L12"],"21":["L22","L23","L24","L25"],"22":["L03","L07","L08","L09","L10","L11","L12"],"23":["L04","L13","L14","L15","L16"],"24":["L03","L07","L08","L09"],"56":["L15","L16"],"25":["L01","L17","L18"],"26":["L19","L20","L21","L22"],"27":["L17","L18","L19","L20"],"28":["L06","L22","L23"],"29":["L07","L24","L25"],"30":["L03","L16","L17","L18","L19"],"31":["L02","L03"],"33":["L04","L15","L16","L17","L18"],"34":["L05","L19","L20","L21"],"35":["L08","L22","L23"],"36":["L24","L25"],"37":["L03","L19","L20"],"38":["L04","L05","L21","L22","L23","L24"],"39":["L06","L10","L25","L26"],"40":["L20","L21","L22"],"41":["L23","L24","L25"],"42":["L26","L27"],"32":["L09"],"43":["L04","L11","L12","L13","L14","L15"],"44":["L05","L16","L17","L18"],"45":["L06","L07","L08"],"46":["L03","L04","L13","L14","L15","L16"],"47":["L05","L17","L18","L19"],"48":["L06","L20","L21","L22","L23"],"49":["L03","L04"],"50":["L11","L12","L13"],"51":["L14","L15","L16"],"52":["L17"],"53":["L18"],"54":["L05","L19","L20","L21","L22"],"55":["L23","L24","L25","L26","L27","L28"]},"P":{"V-O27-ÇAP":["L01","L11","L12"],"V-O24A-HK":["L16","L17","L18"],"V-O22-HK":["L16","L17","L18","L19","L20","L21"],"A-O19-HK":["L06","L07","L16"],"A-O20-ÇAP":["L11","L12","L13","L14","L15"],"C-O16-ÇAP":["L01","L02","L11","L12","L13","L14","L15"],"SH-ÇAP-01":["L01","L02"],"K-BV-ÇAP":["L01","L02"],"C-O5-ÇAP":["L01","L11","L12","L13","L14"],"C-O6-HK":["L06","L07","L16","L17","L18","L19","L20","L21"],"C-O4-ÇAP":["L01","L02","L07","L08","L16","L17","L18"],"C-O9-ÇAP":["L01","L02","L11","L12"],"C-O10-HK":["L16","L17","L18","L19"],"SH-ÇAP-02":["L01","L02","L03","L19"]}};
  function planli(o, tip, kod) {
    try { var l = (tip === 'db') ? (PLAN.H[String(o.id).padStart(2, '0')] || []) : (PLAN.P[o.kod] || []); return l.indexOf(kod) >= 0; } catch (e) { return false; }
  }
  function metraj(it) {
    var m = parseFloat(it.metraj) || 0; if (m > 0) return m;
    var s = String(it.satir || it.not || ''), re = /(\d+(?:[.,]\d+)?)\s*[.,\u00b7\-]?\s*(?:m|mt|metre)\b/ig, g, son = 0;
    while ((g = re.exec(s)) !== null) { son = parseFloat(g[1].replace(',', '.')) || son; }
    return son;
  }
  var orj = window._rpUygulaItem;
  window._rpUygulaItem = function (it, tarih) {
    if (!it || !((it.is === 'linye' || it.is === 'sorti') && it.linye)) return orj.apply(this, arguments);
    var o = (it.hedefTip === 'db') ? _rpDbBul(it.hedefKod) : _rpPanoBul(it.hedefKod);
    if (!o) return orj.apply(this, arguments);
    var ad = o.kod || ('DB ' + String(o.id).padStart(2, '0'));
    var kod = String(it.linye).trim();
    o.linye = o.linye || {}; o.ekLinye = o.ekLinye || [];
    var anahtar = o.linye[kod] ? kod : null;
    if (!anahtar) { Object.keys(o.linye).forEach(function (k) { if (anahtar) return; if (k === kod || k.indexOf(kod + ' ') === 0 || k.indexOf(kod + '(') === 0) anahtar = k; }); }
    var yildiz = false;
    if (!anahtar) { var p = planli(o, it.hedefTip, kod); yildiz = !p; anahtar = p ? kod : (kod + ' (*)');
      if (yildiz && o.ekLinye.indexOf(anahtar) < 0) o.ekLinye.push(anahtar); }
    var eski = o.linye[anahtar] || {}; var mt = metraj(it);
    o.linye[anahtar] = { durum: (it.durum || 'cekildi'), mt: (mt ? String(mt) : (eski.mt || '')) };
    if (it.hedefTip === 'db') o.kablo = true;
    var sorti = (it.is === 'sorti');
    try {
      data.raporlar.push({ tarih: tarih, hedef: ad + ' ' + anahtar + (sorti ? (' (' + (it.adet || 1) + ' sorti)') : ''),
        montaj: false, kablo: true, revize: (it.durum === 'revize'), metraj: (mt || null), adet: (it.adet || null),
        not: 'Saf veri: ' + (sorti ? 'sorti ' : '') + (it.kesit || '') + (yildiz ? ' | PLAN DISI YENI LINYE (*)' : ''), fotolar: [] });
    } catch (e) {}
    return { ok: true, desc: ad + ' ' + anahtar + (mt ? (' ' + mt + 'm') : '') + (sorti ? (' \u00b7 ' + (it.adet || 1) + ' sorti') : '') + ' \u00e7ekildi' + (yildiz ? '  \u26a0 plan d\u0131\u015f\u0131 yeni linye' : '') };
  };
})();
