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
  var acilis = Date.now();       // sayfa açılış anı
  var yazdikMi = false;          // bu sekmeden hiç kayıt yapıldı mı
  var ACILIS_PENCERESI = 25000;  // paftanın kendi açılış kaydını yabancı sanmamak için

  /* Açılıştan hemen sonra gelen ve henüz hiç kayıt yapmadığımız değişiklik,
     paftanın kendi açılış yazımıdır — çakışma sayma, sürümü benimse. */
  function acilisYarisi() { return !yazdikMi && (Date.now() - acilis) < ACILIS_PENCERESI; }

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
      if (son !== null && u > son && acilisYarisi()) son = u;   // açılış yazımı — benimse
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
          yazdikMi = true;
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
        if (son !== null && u > son && acilisYarisi()) { son = u; return; }
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

/* ====== RAPOR KOPYA KORUMASI (21.08.2026) ======
   Kaydet dugmesi kilitlenmedigi ve liste yenilenmedigi icin ayni rapor 4 kez eklenmisti.
   Ayni metinden ikinci kayit olusursa geri alinir ve kullaniciya bildirilir. */
(function () {
  if (window.__BHS_KOPYA) return;
  window.__BHS_KOPYA = 1;
  if (!window.firebase || !firebase.firestore || !firebase.firestore.CollectionReference) return;
  var CR = firebase.firestore.CollectionReference.prototype;
  var orjAdd = CR.add;
  var STIL = 'position:fixed;left:50%;top:18px;transform:translateX(-50%);z-index:999999;color:#fff;padding:11px 18px;border-radius:9px;font:600 13px system-ui;box-shadow:0 8px 26px rgba(0,0,0,.45);max-width:82vw;text-align:center;background:';
  function bildir(msg, renk) {
    try {
      var d = document.createElement('div');
      d.style.cssText = STIL + (renk || '#14384F');
      d.textContent = msg;
      document.body.appendChild(d);
      setTimeout(function () { try { d.remove(); } catch (e) {} }, 4200);
    } catch (e) {}
  }
  CR.add = function (veri) {
    var self = this;
    if (self.id !== 'sahaRaporlari' || !veri || !veri.metin) return orjAdd.apply(self, arguments);
    var metin = String(veri.metin).trim();
    return orjAdd.call(self, veri).then(function (ref) {
      return self.get().then(function (q) {
        var ayni = 0;
        q.forEach(function (d) { if (String((d.data() || {}).metin || '').trim() === metin) ayni++; });
        if (ayni > 1) {
          return ref.delete().then(function () { bildir('Bu rapor zaten kayitli — kopya eklenmedi', '#8a5a12'); return ref; })
            .catch(function () { bildir('Bu rapor zaten kayitli', '#8a5a12'); return ref; });
        }
        bildir('Rapor kaydedildi ✓', '#1F6B4A');
        return ref;
      }).catch(function () { bildir('Rapor kaydedildi ✓', '#1F6B4A'); return ref; });
    });
  };
})();


/* ===== BHS ARSIV — rapor cevrimdisi yedegi + arsiv indirici (v2) ===== */
(function(){
  try{ if(String(location.pathname).indexOf("saha-raporlari")<0) return; }catch(e){ return; }
  window.__BHS_ARSIV=(window.__BHS_ARSIV||0)+1;
  var K="bhsRaporArsiv", basarili=false;
  function yaz(a){ try{ localStorage.setItem(K,JSON.stringify({t:Date.now(),r:a})); }catch(e){} }
  function oku(){ try{ return JSON.parse(localStorage.getItem(K)||"null"); }catch(e){ return null; } }
  function bugun(){ var d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
  function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  var n=0, iv=setInterval(function(){ n++;
    try{ if(window.firebase && firebase.firestore && firebase.apps && firebase.apps.length){ clearInterval(iv); setTimeout(cek,4000); } }catch(e){}
    if(n>300) clearInterval(iv);
  },200);
  function cek(){
    try{
      firebase.firestore().collection("sahaRaporlari").get().then(function(q){
        var a=[]; q.forEach(function(d){ var o=d.data()||{};
          a.push({id:d.id,tarih:o.tarih||"",konum:o.konum||"",kisi:o.kisi||o.ekleyen||"",metin:String(o.metin||""),onayli:!!o.onayli,uygulandi:!!o.paftaUygulandi,paftaVeri:o.paftaVeri||[]}); });
        if(a.length){ basarili=true; yaz(a); bulut(a); }
      }).catch(function(){});
    }catch(e){}
  }
  function bulut(a){ try{ var bg=bugun(); if(localStorage.getItem("bhsRaporBulutGun")===bg) return; localStorage.setItem("bhsRaporBulutGun",bg);
    firebase.firestore().doc("pafta/rapor-yedek").set({tarih:bg,zaman:Date.now(),adet:a.length,veri:JSON.stringify(a)}).catch(function(){}); }catch(e){} }
  function arsivHTML(c){
    var r=(c.r||[]).slice().sort(function(x,y){ return String(y.tarih||"").localeCompare(String(x.tarih||"")); });
    var ts=new Date(c.t||Date.now()).toLocaleString("tr-TR");
    var h="<!doctype html><meta charset=\"utf-8\"><title>BHS Saha Raporlari Arsivi</title>";
    h+="<style>body{font-family:system-ui,Segoe UI,Arial;background:#0f1216;color:#e8eef5;margin:0;padding:18px}h1{font-size:19px;margin:0 0 4px}.b{font-size:12px;color:#8fa6bd;margin-bottom:6px}.ust{position:sticky;top:0;background:#0f1216;padding:10px 0;border-bottom:1px solid #263241;margin-bottom:8px}input{width:100%;box-sizing:border-box;padding:10px;border-radius:9px;border:1px solid #2b3a4b;background:#151b22;color:#e8eef5;font-size:14px}.k{border:1px solid #263241;border-radius:11px;padding:11px 13px;margin:10px 0;background:#141a21}.m{white-space:pre-wrap;font-size:13px;line-height:1.5}.et{display:inline-block;font-size:11px;padding:2px 8px;border-radius:99px;margin-left:6px}.ok{background:#12351f;color:#7ee2a8}.bk{background:#3a2c12;color:#f0c674}</style>";
    h+="<h1>BHS Peyzaj — Saha Raporlari Arsivi</h1>";
    h+="<div class=\"b\">"+r.length+" rapor · arsiv tarihi: "+esc(ts)+" · cevrimdisi kopya (sunucu gerektirmez)</div>";
    h+="<div class=\"ust\"><input id=\"ara\" placeholder=\"Ara: DB 30 · L16 · villa · 08.04 ...\"></div><div id=\"liste\">";
    for(var i=0;i<r.length;i++){ var x=r[i];
      h+="<div class=\"k\" data-s=\""+esc((x.tarih+" "+x.konum+" "+x.kisi+" "+x.metin).toLowerCase())+"\">";
      h+="<div class=\"b\">"+esc(x.tarih)+" · "+esc(x.konum)+" · "+esc(x.kisi)+(x.onayli?"<span class=\"et ok\">onayli</span>":"")+(x.uygulandi?"<span class=\"et ok\">paftaya islendi</span>":"<span class=\"et bk\">islenmedi</span>")+"</div>";
      h+="<div class=\"m\">"+esc(x.metin)+"</div></div>"; }
    h+="</div><scr"+"ipt>document.getElementById('ara').addEventListener('input',function(){var q=this.value.toLowerCase();[].forEach.call(document.querySelectorAll('.k'),function(k){k.style.display=(!q||k.getAttribute('data-s').indexOf(q)>=0)?'':'none';});});</scr"+"ipt>";
    return h;
  }
  function indir(ad,ic,tip){ var b=new Blob([ic],{type:tip}); var u=URL.createObjectURL(b); var a=document.createElement("a"); a.href=u; a.download=ad; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(u); a.remove(); },1500); }
  function ui(){
    if(!document.body) return;
    if(document.getElementById("bhsArsivKok")) return;
    var d=document.createElement("div"); d.id="bhsArsivKok";
    d.style.cssText="position:fixed;right:14px;bottom:14px;z-index:99999;display:flex;flex-direction:column;gap:6px;align-items:flex-end;font-family:system-ui,Segoe UI,Arial";
    var m=document.createElement("div"); m.style.cssText="display:none;background:#141a21;border:1px solid #2b3a4b;border-radius:11px;padding:6px;min-width:225px;box-shadow:0 8px 26px rgba(0,0,0,.45)";
    function sat(t,f){ var x=document.createElement("div"); x.textContent=t; x.style.cssText="padding:9px 11px;font-size:13px;color:#dbe7f3;cursor:pointer;border-radius:8px"; x.onmouseover=function(){x.style.background="#1d2a38";}; x.onmouseout=function(){x.style.background="";}; x.onclick=f; m.appendChild(x); }
    sat("💾 HTML arsiv indir",function(){ var c=oku(); if(!c){ alert("Henuz arsiv yok — raporlar yuklendikten birkac saniye sonra tekrar dene."); return; } indir("BHS_saha_raporlari_arsiv_"+bugun()+".html",arsivHTML(c),"text/html"); });
    sat("🗄 JSON yedek indir",function(){ var c=oku(); if(!c){ alert("Henuz arsiv yok."); return; } indir("BHS_saha_raporlari_"+bugun()+".json",JSON.stringify(c,null,1),"application/json"); });
    sat("👁 Cevrimdisi goruntule",function(){ var c=oku(); if(!c){ alert("Henuz arsiv yok."); return; } var w=window.open("","_blank"); w.document.write(arsivHTML(c)); w.document.close(); });
    var b=document.createElement("button"); b.textContent="📦 Arsiv";
    b.style.cssText="background:#1d2a38;color:#dbe7f3;border:1px solid #33465c;border-radius:999px;padding:9px 15px;font-size:13px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.35)";
    b.onclick=function(){ var c=oku(); b.title=c?("Son arsiv: "+new Date(c.t).toLocaleString("tr-TR")+" · "+c.r.length+" rapor"):"Arsiv yok"; m.style.display=(m.style.display==="none")?"block":"none"; };
    d.appendChild(m); d.appendChild(b); document.body.appendChild(d);
  }
  setInterval(ui,2000); setTimeout(ui,600); if(document.readyState!=="loading") ui();
  setTimeout(function(){ if(basarili) return; var c=oku(); if(!c||!c.r||!c.r.length) return;
    var w=document.createElement("div"); w.textContent="⚠ Rapor sunucusuna ulasilamadi — "+c.r.length+" raporluk cevrimdisi arsiv mevcut. Sag alttaki 📦 Arsiv > Cevrimdisi goruntule.";
    w.style.cssText="position:fixed;left:0;right:0;top:0;z-index:99998;background:#3a2c12;color:#f0c674;padding:10px 14px;font-size:13px;text-align:center;font-family:system-ui,Segoe UI,Arial"; document.body.appendChild(w);
  },20000);
})();
