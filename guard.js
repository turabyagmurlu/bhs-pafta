/* BHS PAFTA — ESKİ SEKME KORUMASI (sürüm kilidi)  v1 · 05.08.2026
 *
 * Sorun: pafta tüm durumu tek JSON alanına yazar, alan bazlı birleştirme yoktur.
 * Eski veriyle açık kalmış bir sekme kaydettiğinde aradaki tüm iş silinir.
 * (2026'da en az 3 kez yaşandı: HP/HK montaj bayrakları ve çekilmiş kablolar.)
 *
 * Çözüm: pafta/bhs belgesine yazmadan ÖNCE buluttaki updatedAt kontrol edilir.
 * Bizim bildiğimizden yeniyse yazma iptal edilir ve kullanıcı uyarılır.
 * Ayrıca her yazımdan önce önceki hâl 10 slotluk döner otomatik yedeğe kopyalanır.
 *
 * index.html'e dokunmaz; sadece Firestore yazma metodunu sarar.
 */
(function () {
  if (window.__BHS_GUARD) return;
  window.__BHS_GUARD = 1;

  var HEDEF = 'pafta/bhs';
  var SLOT = 10;                 // döner otomatik yedek slot sayısı
  var son = null;                // bildiğimiz son bulut sürümü (updatedAt)
  var benim = [];                // bizim yazdığımız updatedAt değerleri
  var zorla = false;             // tek seferlik "yine de yaz"
  var bantVar = false;

  function fdb() { return firebase.firestore(); }
  function ref() { return fdb().collection('pafta').doc('bhs'); }

  /* ---------- orijinal metodlar ---------- */
  var DR = firebase.firestore.DocumentReference.prototype;
  var ORJ = { set: DR.set, update: DR.update, get: DR.get };

  /* ---------- arayüz ---------- */
  function stil() {
    if (document.getElementById('bhsGuardStil')) return;
    var s = document.createElement('style');
    s.id = 'bhsGuardStil';
    s.textContent =
      '#bhsBant{position:fixed;left:0;right:0;top:0;z-index:99998;background:#b8730c;color:#fff;' +
      'font:600 14px system-ui;padding:10px 14px;display:flex;gap:12px;align-items:center;justify-content:center}' +
      '#bhsBant button{background:#fff;color:#7a4c05;border:0;border-radius:6px;padding:6px 12px;' +
      'font:600 13px system-ui;cursor:pointer}' +
      '#bhsKilit{position:fixed;inset:0;z-index:99999;background:rgba(6,14,22,.82);display:flex;' +
      'align-items:center;justify-content:center}' +
      '#bhsKilitKutu{background:#12222f;color:#eaf2f7;border:1px solid #2e7ba6;border-radius:12px;' +
      'max-width:520px;padding:24px;font:14px/1.55 system-ui;box-shadow:0 20px 60px rgba(0,0,0,.5)}' +
      '#bhsKilitKutu h3{margin:0 0 12px;font-size:17px;color:#ffd479}' +
      '#bhsKilitKutu .sr{display:flex;gap:10px;margin-top:18px;flex-wrap:wrap}' +
      '#bhsKilitKutu button{border:0;border-radius:8px;padding:10px 16px;font:600 13px system-ui;cursor:pointer}' +
      '#bhsYenile{background:#2e7ba6;color:#fff}#bhsZorla{background:#3a4a56;color:#dfe8ee}';
    document.head.appendChild(s);
  }

  function bantGoster() {
    if (bantVar) return;
    bantVar = true;
    stil();
    var d = document.createElement('div');
    d.id = 'bhsBant';
    d.innerHTML = '<span>⚠ Bu sayfadaki veri artık güncel değil — başka bir oturum paftayı güncelledi.</span>';
    var b = document.createElement('button');
    b.textContent = 'Sayfayı yenile';
    b.onclick = function () { location.reload(); };
    d.appendChild(b);
    document.body.appendChild(d);
  }

  function kilitGoster(bulutZaman) {
    stil();
    var eski = document.getElementById('bhsKilit');
    if (eski) eski.remove();
    var t = bulutZaman ? new Date(bulutZaman).toLocaleString('tr-TR') : 'bilinmiyor';
    var w = document.createElement('div');
    w.id = 'bhsKilit';
    w.innerHTML =
      '<div id="bhsKilitKutu">' +
      '<h3>Kaydedilmedi — elindeki veri eski</h3>' +
      '<p>Bu sayfa açıldıktan sonra pafta <b>başka bir oturumdan</b> güncellenmiş ' +
      '(son bulut kaydı: ' + t + ').</p>' +
      '<p>Şimdi kaydedilseydi aradaki tüm çalışma silinecekti, bu yüzden yazma durduruldu.</p>' +
      '<p><b>Yapman gereken:</b> sayfayı yenile, güncel veri gelsin, değişikliğini tekrar yapıp kaydet.</p>' +
      '<div class="sr"><button id="bhsYenile">Sayfayı yenile (önerilen)</button>' +
      '<button id="bhsZorla">Yine de yaz — üzerine yaz</button></div></div>';
    document.body.appendChild(w);
    document.getElementById('bhsYenile').onclick = function () { location.reload(); };
    document.getElementById('bhsZorla').onclick = function () {
      zorla = true;
      w.remove();
      alert('Bir sonraki kayıt kontrolsüz yazılacak.\nKaydet düğmesine tekrar bas.');
    };
  }

  /* ---------- döner otomatik yedek ---------- */
  function golgeYedek(anlik) {
    try {
      if (!anlik || !anlik.exists) return Promise.resolve();
      var i = (parseInt(localStorage.getItem('bhsYedekSlot') || '0', 10) + 1) % SLOT;
      localStorage.setItem('bhsYedekSlot', String(i));
      var v = anlik.data();
      return ORJ.set.call(fdb().collection('pafta').doc('yedek-oto-' + i), {
        state: v.state, updatedAt: v.updatedAt || null, yazan: v.yazan || null,
        otoYedek: new Date().toISOString()
      }).catch(function () {});
    } catch (e) { return Promise.resolve(); }
  }

  /* ---------- yazma sarmalayıcı ---------- */
  function korumali(hedefRef, metod, args) {
    var yuk = (args && args[0]) || {};
    if (zorla) {
      zorla = false;
      if (yuk.updatedAt) benim.push(yuk.updatedAt);
      return ORJ[metod].apply(hedefRef, args);
    }
    return ORJ.get.call(hedefRef).then(function (anlik) {
      var u = (anlik.exists ? anlik.data().updatedAt : 0) || 0;
      if (son !== null && u > son) {
        kilitGoster(u);
        var h = new Error('BHS-GUARD: bulut verisi değişti, kayıt durduruldu');
        h.bhsGuard = true;
        throw h;
      }
      return golgeYedek(anlik).then(function () {
        if (yuk.updatedAt) benim.push(yuk.updatedAt);
        return ORJ[metod].apply(hedefRef, args).then(function (r) {
          son = yuk.updatedAt || Date.now();
          return r;
        });
      });
    });
  }

  DR.set = function () {
    if (this.path === HEDEF) return korumali(this, 'set', arguments);
    return ORJ.set.apply(this, arguments);
  };
  DR.update = function () {
    if (this.path === HEDEF) return korumali(this, 'update', arguments);
    return ORJ.update.apply(this, arguments);
  };

  /* ---------- sürüm izleme ---------- */
  function izle() {
    ORJ.get.call(ref()).then(function (d) {
      son = (d.exists ? d.data().updatedAt : 0) || 0;
      ref().onSnapshot(function (s) {
        if (!s.exists) return;
        var u = s.data().updatedAt || 0;
        var ix = benim.indexOf(u);
        if (ix >= 0) { benim.splice(ix, 1); son = u; return; }
        if (son !== null && u > son) bantGoster();
      });
    }).catch(function () {});
  }

  function basla() {
    if (!window.firebase || !firebase.apps || !firebase.apps.length) { setTimeout(basla, 800); return; }
    if (!firebase.auth().currentUser) {
      firebase.auth().onAuthStateChanged(function (u) { if (u) izle(); });
      return;
    }
    izle();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla);
  else basla();

  /* sessiz reddetme: kendi hatamız konsolu kirletmesin */
  window.addEventListener('unhandledrejection', function (e) {
    if (e && e.reason && e.reason.bhsGuard) e.preventDefault();
  });

  window.__bhsGuardDurum = function () {
    return { bilinenSurum: son, bekleyen: benim.slice(), bantVar: bantVar };
  };
})();
