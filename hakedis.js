/* BHS HAKEDIS DOSYASI URETICI v3 — 15 sayfa
   index.html icindeki eski excelIndir() fonksiyonunu override eder.
   Yuklenme: <script src="hakedis.js"> (body sonunda, ana script SONRASINDA)
*/
// --- Excel/CSV indir ---
/* ===== HAKEDIS DOSYASI v3 — 15 sayfa · hakedis uzmani + tasarim sartnamesi uygulandi ===== */
var _HK={L900:'FF0E2A3D',L800:'FF14384F',L700:'FF1F4E63',M500:'FF2E7BA6',M300:'FF7FB2C9',M150:'FFC3D9E4',
  Z050:'FFF2F6F9',Z025:'FFF8FAFC',W:'FFFFFFFF',ALTIN:'FFF3E6C8',ALTINC:'FFC9A227',
  YESF:'FFE3F0E8',YEST:'FF1F7A4D',SARF:'FFFBF0DC',SART:'FF8A6100',GRIF:'FFF0F3F5',
  KIRF:'FFF6E4E4',KIRT:'FF8E2323',GIRF:'FFFDF6E3',GIRT:'FF7A5C1E',VUR:'FFE8EEF2',
  BH:'FFD5DFE6',BT:'FFA9BAC6',T1:'FF1B2A33',T2:'FF6B7B86',T3:'FF98A6B0'};
function _hkKat(t){var u=(t||'').toUpperCase().replace(/\s/g,'');
  if(u.indexOf('CAT')>=0)return 'DATA'; if(u.indexOf('LIHCH')>=0||/^2X/.test(u))return 'KUMANDA'; return 'GUC';}
function _hkKesit(t){var m=(t||'').match(/\s*(\d+)\s*[xX]\s*([\d,\.]+)/);
  if(!m)return (t||'').toUpperCase().indexOf('CAT')>=0?'CAT6A-UTP':'?';
  var b=m[2].replace('.',','); if(b.indexOf(',')>=0)b=b.replace(/0+$/,'').replace(/,$/,'');
  return m[1]+'x'+b;}
function _hkTip(k){var u=(k||'').toLocaleUpperCase('tr');
  if(u.indexOf('ÇAP')>=0||u.indexOf('CAP')>=0)return 'ÇAP'; if(u.indexOf('ADP')>=0)return 'ADP';
  if(u.indexOf('HP')>=0)return 'HP'; if(u.indexOf('HK')>=0)return 'HK'; if(u.indexOf('SH')>=0)return 'SH'; return 'PANO';}
function _hkF(x){var s=String(x==null?'':x).trim().replace(',','.'); var v=parseFloat(s); return isNaN(v)?0:v;}
function _hkNum(n){return Math.round(n).toLocaleString('tr-TR');}

/* ---- canvas grafikler (ExcelJS natif grafik desteklemez) ---- */
function _hkCv(w,h){var c=document.createElement('canvas');c.width=w*2;c.height=h*2;var x=c.getContext('2d');
  x.scale(2,2);x.fillStyle='#FFFFFF';x.fillRect(0,0,w,h);x.textBaseline='middle';return {c:c,x:x,w:w,h:h};}
function _hkPng(o){return o.c.toDataURL('image/png').split(',')[1];}
function _hkMetrajBar(rows,toplam){
  var n=rows.length,H=44+n*54+34,o=_hkCv(620,H),x=o.x,mx=0,i;
  for(i=0;i<n;i++)mx=Math.max(mx,rows[i][1]);
  var x0=196,bw=306,cols=['#14384F','#2E7BA6','#7FB2C9','#4E7E96'];
  x.fillStyle='#14384F';x.font='bold 11px Calibri,sans-serif';x.textAlign='left';
  x.fillText('HANGİ KABLODAN NE KADAR ÇEKİLDİ',8,18);
  for(i=0;i<n;i++){var y=44+i*54;
    x.fillStyle='#1B2A33';x.font='bold 10px Calibri,sans-serif';x.textAlign='right';x.fillText(rows[i][0],x0-10,y+14);
    x.fillStyle='#EEF2F5';x.fillRect(x0,y+4,bw,20);
    x.fillStyle=cols[i%4];x.fillRect(x0,y+4,bw*(mx?rows[i][1]/mx:0),20);
    x.fillStyle='#0E2A3D';x.font='bold 12px Calibri,sans-serif';x.textAlign='left';x.fillText(_hkNum(rows[i][1])+' m',x0+bw+10,y+14);
    x.fillStyle='#6B7B86';x.font='8.5px Calibri,sans-serif';x.fillText(rows[i][2],x0,y+38);}
  var yy=44+n*54;x.strokeStyle='#C7D3DB';x.lineWidth=1;x.beginPath();x.moveTo(x0,yy+2);x.lineTo(x0+bw,yy+2);x.stroke();
  x.fillStyle='#14384F';x.font='bold 11px Calibri,sans-serif';x.textAlign='right';x.fillText('TOPLAM',x0-10,yy+18);
  x.fillStyle='#0E2A3D';x.font='bold 14px Calibri,sans-serif';x.textAlign='left';x.fillText(_hkNum(toplam)+' m',x0+bw+10,yy+18);
  return {b64:_hkPng(o),w:620,h:H};}
function _hkWaffle(items){
  var i,j,hs=[],H=10;
  for(i=0;i<items.length;i++){hs.push(26+Math.ceil(items[i][2]/20)*22+16);H+=hs[i];}
  var o=_hkCv(620,H),x=o.x,y=8;
  for(i=0;i<items.length;i++){
    x.fillStyle='#14384F';x.font='bold 11px Calibri,sans-serif';x.textAlign='left';x.fillText(items[i][0],8,y+12);
    x.fillStyle='#0E2A3D';x.font='bold 12px Calibri,sans-serif';x.textAlign='right';x.fillText(items[i][1]+' / '+items[i][2],612,y+12);
    var yy=y+26;
    for(j=0;j<items[i][2];j++){var cx=8+(j%20)*30,cy=yy+Math.floor(j/20)*22;
      x.fillStyle=(j<items[i][1])?'#14384F':'#E4EAEF';x.fillRect(cx,cy,24,16);
      x.strokeStyle='#FFFFFF';x.lineWidth=1.2;x.strokeRect(cx,cy,24,16);}
    x.fillStyle='#6B7B86';x.font='9px Calibri,sans-serif';x.textAlign='left';
    x.fillText(items[i][3],8,yy+Math.ceil(items[i][2]/20)*22+8);
    y+=hs[i];}
  return {b64:_hkPng(o),w:620,h:H};}
function _hkGauge(items){
  var o=_hkCv(620,232),x=o.x,i;
  for(i=0;i<items.length;i++){var cx=110+i*200,cy=136,R=76,r=56,p=items[i][1]/100,
      col=['#14384F','#2E7BA6','#7FB2C9'][i];
    x.beginPath();x.arc(cx,cy,(R+r)/2,Math.PI,2*Math.PI);x.strokeStyle='#EEF2F5';x.lineWidth=R-r;x.lineCap='butt';x.stroke();
    x.beginPath();x.arc(cx,cy,(R+r)/2,Math.PI,Math.PI+Math.PI*p);x.strokeStyle=col;x.stroke();
    x.textAlign='center';x.fillStyle='#0E2A3D';x.font='bold 22px Calibri,sans-serif';x.fillText('%'+Math.round(items[i][1]),cx,cy-14);
    x.fillStyle='#6B7B86';x.font='9px Calibri,sans-serif';x.fillText(items[i][2],cx,cy+10);
    x.fillStyle='#14384F';x.font='bold 10.5px Calibri,sans-serif';x.fillText(items[i][0],cx,cy+52);}
  return {b64:_hkPng(o),w:620,h:232};}
function _hkPay(items,toplam){
  var o=_hkCv(620,190),x=o.x,x0=24,y0=56,bw=572,bh=44,cx=x0,i;
  for(i=0;i<items.length;i++){var w=bw*(toplam?items[i][1]/toplam:0),son=(i===items.length-1);
    x.fillStyle=items[i][2];x.fillRect(cx,y0,son?w:w-2,bh);
    x.textAlign=son?'right':'left';var xa=son?(cx+w):cx;
    x.fillStyle='#6B7B86';x.font='9.5px Calibri,sans-serif';x.fillText(items[i][0],xa,y0-14);
    x.fillStyle='#1B2A33';x.font='bold 10.5px Calibri,sans-serif';x.fillText(_hkNum(items[i][1])+' m',xa,y0+bh+22);
    if(w>=90){x.fillStyle='#FFFFFF';x.font='bold 12px Calibri,sans-serif';x.textAlign='center';x.fillText('%'+Math.round(items[i][1]/toplam*100),cx+w/2,y0+bh/2);}
    cx+=w;}
  x.textAlign='left';x.fillStyle='#98A6B0';x.font='9px Calibri,sans-serif';
  x.fillText('Toplam çekilen besleme/kumanda/data kablosu · '+_hkNum(toplam)+' m',x0,182);
  return {b64:_hkPng(o),w:620,h:190};}
function _hkMahalCv(rows){
  var H=60+rows.length*30,o=_hkCv(620,H),x=o.x,x0=210,bw=330,i;
  for(i=0;i<rows.length;i++){var y=34+i*30,ad=rows[i][0],p=rows[i][1];
    x.fillStyle='#1B2A33';x.font='9px Calibri,sans-serif';x.textAlign='right';
    x.fillText(ad.length<=24?ad:ad.slice(0,23)+'…',202,y);
    x.fillStyle='#EEF2F5';x.fillRect(x0,y-7,bw,14);
    x.fillStyle=p>=90?'#14384F':(p>=60?'#2E7BA6':'#7FB2C9');x.fillRect(x0,y-7,bw*p/100,14);
    x.fillStyle=p>=60?'#14384F':'#6B7B86';x.font='bold 10px Calibri,sans-serif';x.textAlign='left';
    x.fillText('%'+Math.round(p),x0+bw+8,y);}
  x.strokeStyle='#A9BAC6';x.setLineDash([3,3]);x.beginPath();
  x.moveTo(x0+bw*0.85,16);x.lineTo(x0+bw*0.85,34+rows.length*30-22);x.stroke();x.setLineDash([]);
  x.fillStyle='#98A6B0';x.font='8.5px Calibri,sans-serif';x.textAlign='center';x.fillText('hedef %85',x0+bw*0.85,10);
  return {b64:_hkPng(o),w:620,h:H};}

async function excelIndir(){
  if(typeof ExcelJS==='undefined'){ toast('Excel icin internet gerekli, tekrar dene','#7a5c1e'); return; }
  if(typeof data==='undefined'||!data||!data.dbs){ toast('Pafta verisi yüklenmedi, sayfayı yenileyin','#7a5c1e'); return; }
  try{ toast('Hakediş dosyası hazırlanıyor…'); }catch(e){}
  var C=_HK, PROJE='BH-DS-GEN-IFC-L-0001-03', TARIH=(typeof bugunStr==='function')?bugunStr():new Date().toLocaleDateString('tr-TR');
  var fill=function(a){return {type:'pattern',pattern:'solid',fgColor:{argb:a}};};
  var fnt=function(sz,b,c,i){return {name:'Calibri',size:sz||10,bold:!!b,color:{argb:c||C.T1},italic:!!i};};
  var al=function(h,v,w,ind){return {horizontal:h||'left',vertical:v||'middle',wrapText:!!w,indent:(ind==null?1:ind)};};
  var hair={style:'hair',color:{argb:C.BH}},thin={style:'thin',color:{argb:C.BT}},med={style:'medium',color:{argb:C.L700}};
  var BH={top:hair,left:hair,bottom:hair,right:hair},BT={top:thin,left:thin,bottom:thin,right:thin};
  var PARA='#,##0.00" ₺"',PARA0='#,##0" ₺"',MTR='#,##0" m"',ADT='#,##0" ad"';

  /* ===== VERI ===== */
  var MAHAL={},i,j;
  (data.mahaller||[]).forEach(function(m){(m.uyeler||[]).forEach(function(u){
    MAHAL[(u.t==='db'?'db:'+parseInt(u.k,10):'pano:'+u.k)]=m.ad;});});
  var mahalOf=function(key,kod){var v=MAHAL[key]; if(v)return v;
    if(/^CH|^K-BV/.test(kod||''))return 'Teknik Bina ve Otel Çevresi'; return 'Diğer / Atanmamış';};
  var NODES=[],KAB=[],LIN=[];
  (data.dbs||[]).forEach(function(o){
    var ad='DB-'+o.id,mh=mahalOf('db:'+parseInt(o.id,10)),kay=(o.besleme&&o.besleme.kaynak)||'';
    NODES.push({kod:ad,tip:'DB',mahal:mh,montaj:!!o.montaj,kaynak:kay,not:(o.not||'').replace(/\n/g,' ').slice(0,70),foto:(o.fotolar||[]).length});
    ((o.besleme&&o.besleme.kablolar)||[]).forEach(function(k){
      KAB.push({node:ad,ntip:'DB',mahal:mh,kaynak:kay,ham:(k.tip||'').trim(),kat:_hkKat(k.tip),kesit:_hkKesit(k.tip),
        adet:parseInt(k.adet||1,10)||1,mt:_hkF(k.mt),durum:k.durum||'bekliyor'});});
    Object.keys(o.linye||{}).forEach(function(lk){var v=o.linye[lk]||{};
      LIN.push({node:ad,mahal:mh,kod:lk,durum:v.durum||'bekliyor',mt:_hkF(v.mt)});});});
  (data.panos||[]).forEach(function(o){
    var ad=o.kod,mh=mahalOf('pano:'+ad,ad),kay=(o.besleme&&o.besleme.kaynak)||'';
    NODES.push({kod:ad,tip:_hkTip(ad),mahal:mh,montaj:!!o.montaj,kaynak:kay,not:(o.not||'').replace(/\n/g,' ').slice(0,70),foto:(o.fotolar||[]).length});
    ((o.besleme&&o.besleme.kablolar)||[]).forEach(function(k){
      KAB.push({node:ad,ntip:_hkTip(ad),mahal:mh,kaynak:kay,ham:(k.tip||'').trim(),kat:_hkKat(k.tip),kesit:_hkKesit(k.tip),
        adet:parseInt(k.adet||1,10)||1,mt:_hkF(k.mt),durum:k.durum||'bekliyor'});});
    Object.keys(o.linye||{}).forEach(function(lk){var v=o.linye[lk]||{};
      LIN.push({node:ad,mahal:mh,kod:lk,durum:v.durum||'bekliyor',mt:_hkF(v.mt)});});});
  var RAP=data.raporlar||[];
  var CEK=KAB.filter(function(k){return k.durum==='cekildi';});
  var LCEK=LIN.filter(function(l){return l.durum==='cekildi';});
  var dbs=NODES.filter(function(n){return n.tip==='DB';}),panolar=NODES.filter(function(n){return n.tip!=='DB';});
  var caps=panolar.filter(function(n){return n.tip==='ÇAP';});
  var dbM=dbs.filter(function(n){return n.montaj;}).length,capM=caps.filter(function(n){return n.montaj;}).length,
      panoM=panolar.filter(function(n){return n.montaj;}).length;
  var kabCekSatir=CEK.length,kabCekAdet=0,kabCekMt=0,kabCekMtAdet=0;
  CEK.forEach(function(k){kabCekAdet+=k.adet;kabCekMt+=k.mt;kabCekMtAdet+=k.mt*k.adet;});
  var kabTopSatir=KAB.filter(function(k){return k.durum!=='revize'&&k.durum!=='birlesti';}).length;
  var linCek=LCEK.length,linTop=LIN.filter(function(l){return l.durum!=='revize'&&l.durum!=='birlesti';}).length,linCekMt=0;
  LCEK.forEach(function(l){linCekMt+=l.mt;});
  var TOPMT=kabCekMt+linCekMt;
  var revList=LIN.filter(function(l){return l.durum==='revize'||l.durum==='birlesti';});
  var rapMt=0;RAP.forEach(function(r){rapMt+=_hkF(r.metraj);});
  var bosMt=CEK.filter(function(k){return k.mt===0;}).length+LCEK.filter(function(l){return l.mt===0;}).length;
  var KES={},kesSira=[];
  CEK.forEach(function(k){var key=k.kat+'|'+k.kesit; if(!KES[key]){KES[key]={kat:k.kat,kesit:k.kesit,satir:0,adet:0,mt:0};kesSira.push(key);}
    KES[key].satir++;KES[key].adet+=k.adet;KES[key].mt+=k.mt;});
  var NDUR={};
  NODES.forEach(function(n){
    var ks=KAB.filter(function(k){return k.node===n.kod&&k.durum!=='revize'&&k.durum!=='birlesti';});
    var ls=LIN.filter(function(l){return l.node===n.kod&&l.durum!=='revize'&&l.durum!=='birlesti';});
    var top=ks.length+ls.length,yap=0;
    ks.forEach(function(k){if(k.durum==='cekildi')yap++;});ls.forEach(function(l){if(l.durum==='cekildi')yap++;});
    var d;
    if(!top) d=n.montaj?'MONTAJ TAMAM · KABLO PLANI YOK':'BAŞLAMADI';
    else if(n.montaj&&yap>=top) d='TAM BİTTİ';
    else if(n.montaj) d='MONTAJ VAR · KABLO EKSİK';
    else if(yap>0) d='KABLO VAR · MONTAJ YOK';
    else d='BAŞLAMADI';
    NDUR[n.kod]={d:d,yap:yap,top:top};});
  var tamDB=dbs.filter(function(n){return NDUR[n.kod].d==='TAM BİTTİ';}).length;
  var tamPano=panolar.filter(function(n){return NDUR[n.kod].d==='TAM BİTTİ';}).length;
  var MH={},mhSira=[];
  NODES.forEach(function(n){if(!MH[n.mahal]){MH[n.mahal]={db:0,dbM:0,pano:0,panoM:0,kabT:0,kabY:0,linT:0,linY:0,mt:0,tam:0};mhSira.push(n.mahal);}
    var d=MH[n.mahal];
    if(n.tip==='DB'){d.db++;if(n.montaj)d.dbM++;}else{d.pano++;if(n.montaj)d.panoM++;}
    if(NDUR[n.kod].d==='TAM BİTTİ')d.tam++;});
  KAB.forEach(function(k){if(k.durum==='revize'||k.durum==='birlesti')return;var d=MH[k.mahal];if(!d)return;d.kabT++;if(k.durum==='cekildi'){d.kabY++;d.mt+=k.mt;}});
  LIN.forEach(function(l){if(l.durum==='revize'||l.durum==='birlesti')return;var d=MH[l.mahal];if(!d)return;d.linT++;if(l.durum==='cekildi'){d.linY++;d.mt+=l.mt;}});
  var mpct=function(d){var t=d.kabT+d.linT,y=d.kabY+d.linY;return t?y/t*100:((d.dbM+d.panoM)>0?100:0);};
  var GUC=0,KUM=0,DAT=0,gucS=0,kumS=0,datS=0;
  kesSira.forEach(function(key){var v=KES[key];
    if(v.kat==='GUC'){GUC+=v.mt;gucS+=v.satir;}else if(v.kat==='KUMANDA'){KUM+=v.mt;kumS+=v.satir;}else{DAT+=v.mt;datS+=v.satir;}});

  /* ===== POZ LISTESI ===== */
  var POZ=[];
  POZ.push({poz:'10.010',ad:'Driver Box (DB) montajı — sabitleme, seviye ayarı ve kapak montajı dahil; kablo bağlantısı hariç',mlz:'Hariç',bir:'ad',sozl:dbs.length,bu:dbM});
  POZ.push({poz:'10.020',ad:'ÇAP (Çevre Aydınlatma Panosu) montajı — kaide/askı, sabitleme, kapak dahil',mlz:'Hariç',bir:'ad',sozl:caps.length,bu:capM});
  POZ.push({poz:'10.030',ad:'HP / HK ara dağıtım panosu montajı',mlz:'Hariç',bir:'ad',sozl:panolar.length-caps.length,bu:panoM-capM});
  var gs={GUC:20,KUMANDA:30,DATA:40},gad={GUC:'N2XH güç (besleme) kablosu çekimi',KUMANDA:'LIHCH kumanda/sinyal kablosu çekimi',DATA:'CAT6A-UTP data kablosu çekimi'};
  ['GUC','KUMANDA','DATA'].forEach(function(kt){
    var arr=kesSira.filter(function(k){return KES[k].kat===kt;}).sort(function(a,b){return KES[b].mt-KES[a].mt;});
    arr.forEach(function(key,idx){var v=KES[key];
      POZ.push({poz:gs[kt]+'.'+('00'+((idx+1)*10)).slice(-3),ad:gad[kt]+' — '+v.kesit,mlz:'?',bir:'m',sozl:'',bu:v.mt,kesit:v.kesit});});});
  POZ.push({poz:'50.010',ad:'Linye (aydınlatma hattı) kablosu çekimi — serim, güzergâh düzeni, uç etiketleme dahil',mlz:'?',bir:'m',sozl:'',bu:linCekMt});
  [['60.010','Kablo ucu hazırlama, terminasyon ve klemens bağlantısı'],['60.020','Kablo etiketleme ve numaralandırma'],
   ['70.010','İzolasyon direnci ve süreklilik ölçümü, test raporu'],['80.010','Spiral/koruge boru döşenmesi'],
   ['80.020','Kablo tavası imalat ve montajı'],['80.030','Kablo rögarı / menhol imalatı'],
   ['80.040','Kanal kazı, kum serme, dolgu ve sıkıştırma']].forEach(function(p){
    POZ.push({poz:p[0],ad:p[1],mlz:'?',bir:'ad/m',sozl:'',bu:''});});

  /* ===== WORKBOOK ===== */
  var wb=new ExcelJS.Workbook(); wb.creator='BHS Pafta'; wb.created=new Date();
  function sheet(name,cols,land,frz,fitH){
    var ws=wb.addWorksheet(name,{views:[frz?{state:'frozen',ySplit:frz,showGridLines:false}:{showGridLines:false}],
      pageSetup:{paperSize:9,orientation:land?'landscape':'portrait',fitToPage:true,fitToWidth:1,fitToHeight:fitH||0,
        horizontalCentered:true,margins:{left:0.55,right:0.55,top:0.55,bottom:0.55,header:0.3,footer:0.3}}});
    ws.columns=cols.map(function(w){return {width:w};});
    ws.headerFooter={oddFooter:'&L&8&K6B7B86BHS Hillside Bodrum · Peyzaj Elektrik&C&8&K6B7B86'+PROJE+' · Veri kesiti '+TARIH+'&R&8&K6B7B86Sayfa &P / &N'};
    return ws;}
  function mrg(ws,r,c1,c2,val,f,a,fl,h){
    ws.mergeCells(r,c1,r,c2); var cell=ws.getRow(r).getCell(c1); cell.value=val;
    cell.font=f||fnt(); cell.alignment=a||al();
    if(fl){for(var c=c1;c<=c2;c++)ws.getRow(r).getCell(c).fill=fill(fl);}
    if(h)ws.getRow(r).height=h; return cell;}
  function banner(ws,r,c2,bas,alt){mrg(ws,r,1,c2,bas,fnt(16,true,C.W),al('left','middle'),C.L800,30);
    mrg(ws,r+1,1,c2,alt,fnt(9,false,C.T2,true),al(),null,16); return r+3;}
  function bolum(ws,r,c1,c2,bas){var cell=mrg(ws,r,c1,c2,bas,fnt(12,true,C.L800),al(),null,20);
    for(var c=c1;c<=c2;c++)ws.getRow(r).getCell(c).border={bottom:med}; return r+1;}
  function thead(ws,r,heads){var row=ws.getRow(r);
    heads.forEach(function(h,ix){var c=row.getCell(ix+1);c.value=h;c.font=fnt(9.5,true,C.W);c.fill=fill(C.L700);
      c.alignment=al('center','middle',true,0);c.border=BT;});
    row.height=30; return r+1;}
  function trow(ws,r,vals,z,fmts,algs,fills){var row=ws.getRow(r);
    vals.forEach(function(v,ix){var c=row.getCell(ix+1);c.value=(v===''||v==null)?null:v;c.font=fnt(9.5);c.border=BH;
      c.alignment=al(algs?algs[ix]:'left',null,false);
      if(fmts&&fmts[ix])c.numFmt=fmts[ix];
      if(fills&&fills[ix])c.fill=fill(fills[ix]); else if(z)c.fill=fill(C.Z050);});
    row.height=18; return r+1;}
  var r,ws,k;

  /* ===== 00 KAPAK ===== */
  ws=sheet('00 KAPAK',[2,15,15,15,15,15,15,2],false,0,1);
  for(i=2;i<=16;i++){for(j=1;j<=8;j++)ws.getRow(i).getCell(j).fill=fill(C.L900);}
  ws.getRow(2).height=8;
  mrg(ws,3,2,4,'BHS',fnt(20,true,C.W),al(),null,42); ws.getRow(4).height=10;
  mrg(ws,5,2,7,'H A K E D İ Ş   R A P O R U',fnt(9,true,C.M300),al(),null,14);
  mrg(ws,6,2,7,'BHS HILLSIDE BODRUM',fnt(28,true,C.W),al('left','middle'),null,38);
  mrg(ws,7,2,7,'Peyzaj Elektrik ve Aydınlatma İşleri',fnt(15,false,C.M150),al(),null,24);
  ws.getRow(8).height=10; mrg(ws,9,2,3,'',null,null,C.ALTINC,3); ws.getRow(10).height=12;
  var kunye=[['HAKEDİŞ NO','__ (doldurulacak)','DÖNEM','__.__.2026 – '+TARIH],
    ['PROJE KODU',PROJE,'DÜZENLEME TARİHİ','__.__.2026'],
    ['İŞVEREN','__________________','YÜKLENİCİ','__________________'],
    ['SÖZLEŞME NO / TARİHİ','__________________','PARA BİRİMİ','TRY (₺)']];
  r=11; kunye.forEach(function(q){
    var c=ws.getRow(r).getCell(2); c.value=q[0]; c.font=fnt(8,true,'FFA8C0CE'); c.alignment=al();
    mrg(ws,r,3,4,q[1],fnt(11,false,C.W),al());
    c=ws.getRow(r).getCell(5); c.value=q[2]; c.font=fnt(8,true,'FFA8C0CE'); c.alignment=al();
    mrg(ws,r,6,7,q[3],fnt(11,false,C.W),al()); ws.getRow(r).height=18; r++;});
  ws.getRow(15).height=14; ws.getRow(16).height=6; ws.getRow(17).height=18;
  r=bolum(ws,18,2,7,'BU DOSYADA NE VAR');
  [['01B TEK BAKIŞTA','Teknik terim olmadan: neyden ne kadar çekildi, kaç ekipman monte edildi'],
   ['01 YÖNETİCİ ÖZETİ','Tek sayfada: ne yapıldı, ne kadar ilerledi, nereye dikkat'],
   ['02 NASIL OKUNUR','Kablo türleri, DB, ÇAP, linye — sade açıklama ve sözlük'],
   ['03 HAKEDİŞ İCMALİ','Poz poz yapılan iş miktarı, birim fiyat ve tutar'],
   ['04 HESAP ÖZETİ','Kesintiler, KDV ve net ödenecek tutar'],
   ['05 METRAJ İCMALİ','Her miktarın hangi kayıttan geldiğinin köprüsü'],
   ['06–07 TAFSİLAT','Kablo ve montaj kalemlerinin tek tek dökümü'],
   ['08 MAHAL GERÇEKLEŞME','Bölge bölge tamamlanma'],
   ['09 ÇAPRAZ KONTROL','Dosyanın kendi kendini denetlediği mutabakat tablosu'],
   ['10–11 KAYIT VE REVİZE','Saha rapor dökümü, revize/birleşen kalemler'],
   ['12–13 ESAS VE EK','Hesap esasları, ek listesi, imza blokları']].forEach(function(q,ix){
    var z=(ix%2)?C.Z050:null;
    mrg(ws,r,2,3,q[0],fnt(10,true,C.T1),al(),z); mrg(ws,r,4,7,q[1],fnt(10,false,C.T2),al(),z);
    ws.getRow(r).height=19; r++;});
  r++;
  mrg(ws,r,2,7,'BU HAKEDİŞTE TALEP EDİLEN (KDV hariç)',fnt(9,true,C.T2),al(),null,16); r++;
  var kapakTutar=mrg(ws,r,2,4,{formula:"'03 HAKEDİŞ İCMALİ'!L1000"},fnt(24,true,C.L900),al('right'),null,40);
  kapakTutar.numFmt=PARA0;
  mrg(ws,r,5,7,'Birim fiyatlar girildiğinde otomatik hesaplanır',fnt(10,false,C.T2),al()); r++;
  mrg(ws,r,2,7,'',null,null,C.VUR,4); r+=2;
  mrg(ws,r,2,3,'DÜZENLEYEN',fnt(8,true,C.T2),al()); mrg(ws,r,5,6,'İŞVEREN ONAYI',fnt(8,true,C.T2),al());
  ws.getRow(r).height=16; r++;
  [2,3,5,6].forEach(function(cc){ws.getRow(r).getCell(cc).border={bottom:thin};});
  ws.getRow(r).height=46; r++;
  mrg(ws,r,2,3,'Ad Soyad / Unvan / Tarih',fnt(9,false,C.T2),al()); mrg(ws,r,5,6,'Ad Soyad / Unvan / Tarih',fnt(9,false,C.T2),al());
  ws.getRow(r).height=16; r+=2;
  mrg(ws,r,2,7,'Bu belgedeki miktarlar BHS Peyzaj Pafta saha kayıt sisteminden '+TARIH+' tarihi itibarıyla otomatik üretilmiştir. Ölçü birimleri metre (m) ve adettir.',
    fnt(8,false,C.T3,true),al('left','middle',true),null,24);
  var KAPAK_TUTAR_ROW=r-7;

  /* ===== 01B TEK BAKIŞTA ===== */
  ws=sheet('01B TEK BAKIŞTA',[2,26,16,16,16,16,2],false,0,1);
  r=banner(ws,1,7,'TEK BAKIŞTA — NE YAPILDI','Teknik terim olmadan, sayılarla anlatım · '+TARIH+' tarihine kadar sahada tamamlanan imalat');
  mrg(ws,r,2,6,'Bu projede bahçe aydınlatmasının elektrik altyapısı kuruluyor: panolar yerleştiriliyor, panolardan Driver Box denilen kutulara enerji taşınıyor, oradan da bahçedeki armatürlere kablo çekiliyor.',
    fnt(11,false,C.T1),al('left','middle',true),null,34); r+=2;
  var g1=_hkMetrajBar([['Linye kablosu',linCekMt,'Driver Box’lardan bahçe armatürlerine giden aydınlatma hatları · '+linCek+' hat'],
    ['Güç kablosu (N2XH)',GUC,'Panodan Driver Box’a giden ana enerji kablosu · '+gucS+' kalem'],
    ['Kumanda kablosu (LIHCH)',KUM,'Işıkların yanma/sönme komutunu taşıyan kablo · '+kumS+' kalem'],
    ['Data kablosu (CAT6A)',DAT,'Akıllı kontrol ve izleme için ağ kablosu · '+datS+' kalem']],TOPMT);
  var id1=wb.addImage({base64:g1.b64,extension:'png'}); var h1=Math.round(520*g1.h/620);
  for(i=r;i<r+Math.ceil(h1/13.4)+2;i++)ws.getRow(i).height=10;
  ws.addImage(id1,{tl:{col:1,row:r-1},ext:{width:520,height:h1}});
  r+=Math.ceil(h1/13.4)+2;
  mrg(ws,r,2,6,'Toplam '+_hkNum(TOPMT)+' metre kablo çekildi. Bu, uç uca eklendiğinde yaklaşık '+String((TOPMT/1000).toFixed(1)).replace('.',',')+' kilometre eder.',
    fnt(11,true,C.L800),al('left','middle',true),C.VUR,26); r+=2;
  r=bolum(ws,r,2,6,'KAÇ ADET EKİPMAN MONTE EDİLDİ');
  var g2=_hkWaffle([['DRIVER BOX (DB) MONTAJI',dbM,dbs.length,'Her kutucuk 1 adet Driver Box · dolu = montajı yapıldı'],
    ['PANO MONTAJI',panoM,panolar.length,'ÇAP, HP ve HK panoları · dolu = montajı yapıldı'],
    ['TAM BİTEN NOKTA',tamDB+tamPano,NODES.length,'Montajı VE tüm kabloları tamamlanmış noktalar']]);
  var id2=wb.addImage({base64:g2.b64,extension:'png'}); var h2=Math.round(520*g2.h/620);
  for(i=r;i<r+Math.ceil(h2/13.4)+2;i++)ws.getRow(i).height=10;
  ws.addImage(id2,{tl:{col:1,row:r-1},ext:{width:520,height:h2}});
  r+=Math.ceil(h2/13.4)+2;
  r=bolum(ws,r,2,6,'ÖZETLE');
  [[_hkNum(TOPMT)+' m','kablo çekildi'],[dbM+' / '+dbs.length,'Driver Box monte edildi'],
   [panoM+' / '+panolar.length,'pano monte edildi'],[String(tamDB+tamPano),'nokta tamamen bitti']].forEach(function(q,ix){
    var col=2+ix;
    mrg(ws,r,col,col,q[0],fnt(16,true,C.L900),al('center','middle',false,0),C.Z025,30);
    mrg(ws,r+1,col,col,q[1],fnt(9,false,C.T2),al('center','middle',true,0),C.Z025,26);
    ws.getRow(r).getCell(col).border={top:thin,left:thin,right:thin};
    ws.getRow(r+1).getCell(col).border={bottom:thin,left:thin,right:thin};});
  r+=3;
  mrg(ws,r,2,6,'Not: Bu sayfa özet niteliğindedir. Kalem kalem döküm 06 ve 07 numaralı sayfalarda, ödeme hesabı 03 ve 04 numaralı sayfalardadır.',
    fnt(9,false,C.T3,true),al('left','middle',true),null,20);

  /* ===== 01 YÖNETİCİ ÖZETİ ===== */
  ws=sheet('01 YÖNETİCİ ÖZETİ',[2,20,12,2,20,12,2,20,12,2,20,12,2],true,0,1);
  r=banner(ws,1,13,'YÖNETİCİ ÖZETİ','Proje: '+PROJE+' · Veri kesiti: '+TARIH);
  var kpi=[['TOPLAM ÇEKİLEN KABLO',_hkNum(TOPMT)+' m','linye + besleme/kumanda/data',C.L700],
    ['DB MONTAJI',dbM+' / '+dbs.length,'%'+Math.round(dbM/dbs.length*100)+' tamamlandı',C.M500],
    ['PANO MONTAJI',panoM+' / '+panolar.length,'ÇAP '+capM+'/'+caps.length+' · HP-HK '+(panoM-capM)+'/'+(panolar.length-caps.length),C.M300],
    ['TAM BİTEN NOKTA',(tamDB+tamPano)+' / '+NODES.length,'montaj + tüm kablosu biten',C.M150]];
  var kc=[[2,3],[5,6],[8,9],[11,12]];
  kpi.forEach(function(q,ix){var c1=kc[ix][0],c2=kc[ix][1];
    mrg(ws,r,c1,c2,'',null,null,q[3],6);
    mrg(ws,r+1,c1,c2,q[0],fnt(9,true,C.T2),al('center','middle',false,0),C.Z025,18);
    mrg(ws,r+2,c1,c2,q[1],fnt(24,true,C.L900),al('center','middle',false,0),C.Z025,40);
    mrg(ws,r+3,c1,c2,q[2],fnt(9,false,C.T2),al('center','middle',false,0),C.Z025,16);
    mrg(ws,r+4,c1,c2,'',null,null,C.Z025,6);
    for(var rr=r;rr<=r+4;rr++){for(var cc=c1;cc<=c2;cc++){var cell=ws.getRow(rr).getCell(cc),b={};
      if(rr===r)b.top=thin; if(rr===r+4)b.bottom=thin; if(cc===c1)b.left=thin; if(cc===c2)b.right=thin;
      cell.border=b;}}});
  r+=6; ws.getRow(r-1).height=18;
  bolum(ws,r,2,6,'GENEL İLERLEME'); bolum(ws,r,8,12,'KABLO METRAJ DAĞILIMI');
  var g3=_hkGauge([['DB MONTAJI',dbM/dbs.length*100,dbM+' / '+dbs.length+' adet'],
    ['LİNYE ÇEKİMİ',linTop?linCek/linTop*100:0,linCek+' / '+linTop+' kalem'],
    ['BESLEME/KUMANDA',kabTopSatir?kabCekSatir/kabTopSatir*100:0,kabCekSatir+' / '+kabTopSatir+' kalem']]);
  var g4=_hkPay([['N2XH · Güç',GUC,'#14384F'],['LIHCH · Kumanda',KUM,'#2E7BA6'],['CAT6A · Data',DAT,'#7FB2C9']],kabCekMt);
  var GW=452,GH=169;
  for(i=r+1;i<r+1+Math.ceil(GH/13.4)+1;i++)ws.getRow(i).height=10;
  ws.addImage(wb.addImage({base64:g3.b64,extension:'png'}),{tl:{col:1,row:r},ext:{width:GW,height:GH}});
  ws.addImage(wb.addImage({base64:g4.b64,extension:'png'}),{tl:{col:7,row:r},ext:{width:GW,height:Math.round(GW*190/620)}});
  r+=Math.ceil(GH/13.4)+2;
  r=bolum(ws,r,2,12,'MAHAL BAZINDA TAMAMLANMA (kalem sayısı üzerinden)');
  var mrows=mhSira.map(function(m){return [m,mpct(MH[m])];}).sort(function(a,b){return b[1]-a[1];});
  var g5=_hkMahalCv(mrows); var MW=880,MH_=Math.round(MW*g5.h/620);
  for(i=r;i<r+Math.ceil(MH_/13.4)+2;i++)ws.getRow(i).height=10;
  ws.addImage(wb.addImage({base64:g5.b64,extension:'png'}),{tl:{col:1,row:r-1},ext:{width:MW,height:MH_}});
  r+=Math.ceil(MH_/13.4)+2;
  r=bolum(ws,r,2,12,'YÖNETİM DİKKATİNE');
  [['▲','Birim fiyatlar bu dosyada BOŞTUR. Sözleşme eki birim fiyat cetvelinden doldurulmadan tutar kesinleşmez.',C.KIRF],
   ['▲','Kablo metrajı yorumu netleştirilmelidir: kayıtlı metraj '+_hkNum(kabCekMt)+' m, satırlardaki adet ile çarpıldığında '+_hkNum(kabCekMtAdet)+' m olmaktadır (fark '+_hkNum(kabCekMtAdet-kabCekMt)+' m). Talep, kayıtlı metraj üzerinden yapılmıştır.',C.KIRF],
   ['●●○','Saha rapor kayıtlarının metraj toplamı '+_hkNum(rapMt)+' m; dosya toplamı '+_hkNum(TOPMT)+' m. Fark için ek dayanak sunulmalıdır.',C.SARF],
   ['●●○',bosMt+' kalem "çekildi" işaretli olduğu hâlde metrajı boştur; hakedişe dahil edilememiştir (bkz. 09 ÇAPRAZ KONTROL · K-13).',C.SARF],
   ['●○○',revList.length+' kalem revize/birleşti statüsündedir; metraja dahil edilmemiştir (bkz. 11 REVİZE-BİRLEŞTİ).',C.GRIF]].forEach(function(q){
    mrg(ws,r,2,2,q[0],fnt(11,true,C.T1),al('center','middle',false,0),q[2]);
    mrg(ws,r,3,12,q[1],fnt(10,false,C.T1),al('left','middle',true),q[2],22); r++;});
  r++;
  mrg(ws,r,2,12,'Not: Bu sayfadaki tüm rakamlar 03–08 sayfalarındaki tablolarla birebir eşleşir; kaynak zinciri 05 METRAJ İCMALİ sayfasında gösterilmiştir.',
    fnt(8,false,C.T3,true),al(),null,20);

  /* ===== 02 NASIL OKUNUR ===== */
  ws=sheet('02 NASIL OKUNUR',[2,4,44,44,2],false,0,1);
  r=banner(ws,1,5,'BU DOSYA NASIL OKUNUR','Teknik terim bilmeden 2 dakikada anlamanız için hazırlanmıştır.');
  var para=function(rr,t,h){var n=Math.max(1,Math.ceil(t.length/95));
    mrg(ws,rr,3,4,t,fnt(11,false,C.T1),al('left','middle',true),null,h||(n*15+6)); return rr+1;};
  r=bolum(ws,r,3,4,'1 · BU DOSYA NEDİR');
  r=para(r,'Bu dosya, BHS Hillside Bodrum projesinde peyzaj aydınlatma ve pano elektrik işleri kapsamında '+TARIH+' tarihi itibarıyla sahada fiilen yapılmış imalatın ölçülmüş dökümü ve bunun karşılığında talep edilen ödemedir.');
  r=para(r,'Üç şeyi bir arada gösterir: (1) ne yapıldı — sayı ve metre olarak, (2) nasıl ispatlanıyor — hangi saha kaydı ve hangi noktada, (3) ne kadar ödeme talep ediliyor — kesintiler düşülmüş net tutarıyla.');
  r++; r=bolum(ws,r,3,4,'2 · HANGİ SIRAYLA OKUMALISINIZ');
  [['Hiç vaktiniz yoksa','01B TEK BAKIŞTA — grafiklerle tek sayfa.'],
   ['Sadece 5 dakikanız varsa','01 YÖNETİCİ ÖZETİ yeterlidir.'],
   ['Ödemeyi onaylayacaksanız','03 HAKEDİŞ İCMALİ ve 04 HESAP ÖZETİ.'],
   ['Bir rakamdan şüphe ederseniz','09 ÇAPRAZ KONTROL — oradan ilgili tafsilat sayfasına.'],
   ['"Bu sayı nereden geldi" derseniz','05 METRAJ İCMALİ → 06 KABLO TAFSİLATI → 10 SAHA RAPOR DÖKÜMÜ.']].forEach(function(q){
    var c=ws.getRow(r).getCell(2); c.value='▪'; c.font=fnt(11,true,C.M500); c.alignment=al('center','middle',false,0);
    c=ws.getRow(r).getCell(3); c.value=q[0]; c.font=fnt(10,true,C.L800); c.alignment=al();
    c=ws.getRow(r).getCell(4); c.value=q[1]; c.font=fnt(10,false,C.T1); c.alignment=al('left','middle',true);
    ws.getRow(r).height=20; r++;});
  r++; r=bolum(ws,r,3,4,'3 · SİSTEM NASIL ÇALIŞIR');
  r=para(r,'Elektrik zinciri şöyledir:   ÇAP panosu  →  besleme kablosu  →  Driver Box (DB)  →  linye kabloları  →  bahçe armatürleri');
  r++; r=bolum(ws,r,3,4,'4 · TERİMLER SÖZLÜĞÜ');
  [['ÇAP — Çevre Aydınlatma Panosu','Bir bölgenin tüm bahçe aydınlatmasının elektriğinin dağıtıldığı ana pano. ÇAP monte edilmeden o bölgeye enerji verilemez; bu yüzden iş programının kilit noktalarıdır. Projede '+caps.length+' adet vardır.'],
   ['HP / HK panoları','Havuz ve havuz kumanda panoları. Aydınlatma dışındaki peyzaj elektrik ihtiyaçlarını besler. Projede '+(panolar.length-caps.length)+' adet vardır.'],
   ['DB — Driver Box','LED armatürler şebeke elektriğiyle doğrudan çalışmaz; önce "sürücü" (driver) gerekir. Bu sürücülerin bulunduğu, sahada hava koşullarına dayanıklı kutudur. Projede '+dbs.length+' adet vardır.'],
   ['Linye','Bir DB’den çıkıp bir grup armatürü besleyen kablo hattı. Bir DB’den birden çok linye çıkar. Ödeme metre üzerinden yapılır.'],
   ['Besleme kablosu','Panodan DB’ye giden ana enerji hattı. Elektriğin kendisini taşır.'],
   ['Metraj','Yapılan işin ölçülmesi (metre, adet). Hakedişin temelidir.'],
   ['İcmal / Tafsilat','İcmal = özet tablo. Tafsilat = o özetteki rakamın satır satır dökümü.'],
   ['Poz no','Her iş kaleminin sözleşmedeki numarası. Fiyat karşılaştırmasını mümkün kılar.'],
   ['Kümülatif','İşin başından bugüne kadarki toplam. "Bu hakediş" = kümülatif eksi önceki hakedişler.'],
   ['Teminat kesintisi','Hakedişten kesilip işin kabulüne kadar tutulan güvence payı; sonunda iade edilir.']].forEach(function(q,ix){
    var z=(ix%2)?C.Z050:null;
    var c=ws.getRow(r).getCell(2); c.value='▪'; c.font=fnt(11,true,C.M500); c.alignment=al('center','middle',false,0);
    if(z)c.fill=fill(z);
    c=ws.getRow(r).getCell(3); c.value=q[0]; c.font=fnt(10,true,C.L800); c.alignment=al('left','middle',true); if(z)c.fill=fill(z);
    c=ws.getRow(r).getCell(4); c.value=q[1]; c.font=fnt(10,false,C.T1); c.alignment=al('left','middle',true); if(z)c.fill=fill(z);
    ws.getRow(r).height=Math.max(22,Math.ceil(q[1].length/58)*14+16); r++;});
  r++; r=bolum(ws,r,3,4,'5 · KABLO TÜRLERİ — HANGİSİ NE İŞE YARAR');
  [['N2XH — Güç (besleme) kablosu',_hkNum(GUC)+' m çekildi','Elektriğin kendisini taşır. "N2XH" halojen içermeyen, yangında zehirli ve yoğun duman çıkarmayan kablodur; insanların bulunduğu peyzaj alanlarında zorunludur ve standart PVC kablodan pahalıdır. Kesit (5x2,5 mm² gibi) tel sayısını ve kalınlığı gösterir — kesit büyüdükçe fiyat ciddi ölçüde artar, bu yüzden icmalde her kesit ayrı satırdadır.'],
   ['LIHCH — Kumanda (sinyal) kablosu',_hkNum(KUM)+' m çekildi','Güç taşımaz, komut taşır: "bu grup yansın", "bu bölge sönsün". Otomasyonun ve senaryolu aydınlatmanın çalışması buna bağlıdır. "H" harfi kablonun ekranlı olduğunu gösterir — yanından geçen güç kablosunun gürültüsü sinyali bozmasın diye. Güç kablosu olmadan ışık yanmaz; kumanda kablosu olmadan ışık kontrol edilemez.'],
   ['CAT6A-UTP — Data kablosu',_hkNum(DAT)+' m çekildi','Bilgisayar ağı kablosu. Akıllı aydınlatma kontrolü ve merkezi izleme için kullanılır. Metrajının düşük olması normaldir; her armatüre değil yalnız kontrol noktalarına gider.']].forEach(function(q){
    var c=ws.getRow(r).getCell(2); c.value='▪'; c.font=fnt(11,true,C.M500); c.alignment=al('center','middle',false,0);
    c=ws.getRow(r).getCell(3); c.value=q[0]; c.font=fnt(10,true,C.L800); c.alignment=al();
    c=ws.getRow(r).getCell(4); c.value=q[1]; c.font=fnt(10,true,C.YEST); c.alignment=al();
    ws.getRow(r).height=18; r++;
    mrg(ws,r,3,4,q[2],fnt(10,false,C.T1),al('left','middle',true),null,Math.ceil(q[2].length/95)*14+18); r++;});
  r++; r=bolum(ws,r,3,4,'6 · "BİR NOKTA BİTTİ" NE DEMEK');
  r=para(r,'Bir DB veya panonun "tam bitti" sayılması için iki şart birden gerekir: (1) montajı tamamlanmış olacak, (2) o noktaya ait tüm kablolar — besleme, kumanda ve oradan çıkan bütün linyeler — çekilmiş olacak. Biri eksikse nokta bitmiş sayılmaz. Bu tarih itibarıyla '+tamDB+' DB ve '+tamPano+' pano tam bitmiştir.');
  r=para(r,'Bu neden montaj yüzdesinden (%'+Math.round(dbM/dbs.length*100)+') düşük? Çünkü montaj işin başlangıcıdır, bitişi değil: bir DB’yi sabitlemek yarım saatlik iştir, o DB’den çıkan 5-6 linyeyi bahçe boyunca çekmek günler alır. HAKEDİŞ AÇISINDAN ÖNEMLİ: ödeme tamamlanan nokta sayısına göre değil, fiilen yapılan imalata göre yapılır — monte edilen her DB adet, çekilen her metre kablo metre olarak hakedişe girer. "Tam biten nokta" bir ilerleme göstergesidir, ödeme kalemi değildir.');
  r++; r=bolum(ws,r,3,4,'7 · KABLO KALEMLERİNİN DURUM KODLARI');
  [['çekildi','Kablo fiilen serilmiş, imalat yapılmış','Evet — hakedişe girer',C.YESF],
   ['bekliyor','Henüz çekilmemiş, planlı','Hayır',C.GRIF],
   ['revize','Güzergâh veya kesit değişmiş, yeniden tanımlanmış','Yalnız güncel hâliyle, bir kez',C.SARF],
   ['birleşti','İki kalem sahada tek kabloya indirilmiş','Yalnız birleşen kalem üzerinden bir kez',C.SARF]].forEach(function(q){
    ws.getRow(r).getCell(2).fill=fill(q[3]);
    var c=ws.getRow(r).getCell(3); c.value=q[0]+' — '+q[1]; c.font=fnt(10,false,C.T1); c.alignment=al('left','middle',true); c.fill=fill(q[3]);
    c=ws.getRow(r).getCell(4); c.value=q[2]; c.font=fnt(10,true,C.T1); c.alignment=al(); c.fill=fill(q[3]);
    ws.getRow(r).height=20; r++;});
  r=para(r+1,'"Revize" ve "birleşti" kayıtlarının ayrıca izlenmesinin nedeni, aynı metrenin iki kez ödemeye girmesini önlemektir. Tam listesi 11 REVİZE-BİRLEŞTİ sayfasındadır.');

  /* ===== 03 HAKEDİŞ İCMALİ ===== */
  ws=sheet('03 HAKEDİŞ İCMALİ',[5,9,34,8,6,11,11,11,11,7,13,14],false,8);
  r=banner(ws,1,12,'HAKEDİŞ İCMALİ','Proje: '+PROJE+' · Para birimi: TRY · Veri kesiti: '+TARIH);
  mrg(ws,r,1,12,'SARI zeminli "Birim Fiyat" hücrelerini sözleşme eki birim fiyat cetvelinden doldurun — Tutar ve Genel Toplam otomatik hesaplanır. "Sözleşme Miktarı" ve "Önceki Hakediş" sütunları da sarıdır.',
    fnt(9,false,C.GIRT),al('left','middle',true),C.GIRF,26);
  for(j=1;j<=12;j++)ws.getRow(r).getCell(j).border=BT;
  r+=2;
  var HEAD=['Sıra','Poz No','İş Kalemi Tanımı','Malzeme','Birim','Sözleşme Miktarı','Önceki Hakediş','Bu Hakediş Miktarı','Kümülatif','Gerç. %','Birim Fiyat (₺)','Tutar (₺)'];
  var grupAd={'10':'A · MONTAJ İŞLERİ','20':'B · GÜÇ (BESLEME) KABLOSU — N2XH','30':'C · KUMANDA KABLOSU — LIHCH',
    '40':'D · DATA KABLOSU — CAT6A','50':'E · LİNYE (AYDINLATMA HATTI) KABLOSU','60':'F · TERMİNASYON VE ETİKETLEME',
    '70':'G · TEST VE DEVREYE ALMA','80':'H · ALTYAPI İMALATLARI'};
  var sonG=null,sira=0,ilkVeri=null,gSat={},rHead=null;
  POZ.forEach(function(p){
    var g=p.poz.split('.')[0];
    if(g!==sonG){
      mrg(ws,r,1,12,grupAd[g]||g,fnt(10,true,C.W),al(),C.L700,16); r++;
      if(rHead===null){rHead=r; r=thead(ws,r,HEAD); ws.getRow(rHead).height=34;}
      sonG=g; gSat[g]=[];}
    sira++; if(ilkVeri===null)ilkVeri=r; gSat[g].push(r);
    var z=(sira%2===0),row=ws.getRow(r);
    [sira,p.poz,p.ad,p.mlz,p.bir,(p.sozl===''?null:p.sozl),0,(p.bu===''?null:p.bu),null,null,null].forEach(function(v,ix){
      var c=row.getCell(ix+1); c.value=v; c.font=fnt(9.5); c.border=BH;
      c.alignment=al((ix+1===1||ix+1===2||ix+1===4||ix+1===5||ix+1===10)?'center':((ix+1>=6&&ix+1<=9)||ix+1===11?'right':'left'),null,(ix+1===3));
      if(z)c.fill=fill(C.Z050);});
    row.getCell(9).value={formula:'G'+r+'+H'+r};
    row.getCell(10).value={formula:'IF(F'+r+'=0,"",I'+r+'/F'+r+')'}; row.getCell(10).numFmt='0%';
    var tc=row.getCell(12); tc.value={formula:'ROUND(H'+r+'*K'+r+',2)'}; tc.numFmt=PARA; tc.font=fnt(9.5); tc.border=BH; tc.alignment=al('right');
    if(z)tc.fill=fill(C.Z050);
    [6,7,11].forEach(function(cc){row.getCell(cc).fill=fill(C.GIRF);});
    var fm=(p.bir==='m')?MTR:((p.bir==='ad')?ADT:null);
    if(fm)[6,7,8,9].forEach(function(cc){row.getCell(cc).numFmt=fm;});
    row.getCell(11).numFmt=PARA;
    row.height=(p.ad.length>60)?26:19; r++;});
  var sonVeri=r-1; r++;
  Object.keys(gSat).sort().forEach(function(g){
    if(!gSat[g].length)return;
    mrg(ws,r,1,11,'Ara toplam — '+(grupAd[g]||g).split('· ').pop(),fnt(10,true,C.L900),al('right'),C.VUR,20);
    var c=ws.getRow(r).getCell(12); c.value={formula:'SUM('+gSat[g].map(function(x){return 'L'+x;}).join(',')+')'};
    c.numFmt=PARA; c.font=fnt(10,true,C.L900); c.fill=fill(C.VUR); c.border=BH; c.alignment=al('right'); r++;});
  mrg(ws,r,1,12,'',null,null,C.L700,4); r++;
  mrg(ws,r,1,11,'BU HAKEDİŞ GENEL TOPLAMI (KDV hariç)',fnt(13,true,C.W),al('right'),C.L900,34);
  var gt=ws.getRow(r).getCell(12); gt.value={formula:'SUM(L'+ilkVeri+':L'+sonVeri+')'}; gt.numFmt=PARA;
  gt.font=fnt(14,true,C.L900); gt.fill=fill(C.ALTIN); gt.alignment=al('right'); gt.border={top:med,left:med,bottom:med,right:med};
  var GENEL_ROW=r; r++;
  mrg(ws,r,1,12,'Yalnız: ................................................................................ Türk Lirası',fnt(9,false,C.T2,true),al(),null,18); r++;
  mrg(ws,r,1,12,{formula:'IF(COUNTBLANK(K'+ilkVeri+':K'+sonVeri+')>0,"⚠ DOSYA EKSİK — "&COUNTBLANK(K'+ilkVeri+':K'+sonVeri+')&" kalemde birim fiyat girilmemiştir; tutar hesaplanamamıştır.","")'},
    fnt(10,true,C.KIRT),al(),C.KIRF,22); r+=2;
  mrg(ws,r,2,4,'DÜZENLEYEN',fnt(8,true,C.T2),al()); mrg(ws,r,6,8,'KONTROL EDEN',fnt(8,true,C.T2),al()); mrg(ws,r,10,12,'İŞVEREN ONAYI',fnt(8,true,C.T2),al());
  ws.getRow(r).height=16; r++;
  [2,3,4,6,7,8,10,11,12].forEach(function(cc){ws.getRow(r).getCell(cc).border={bottom:thin};});
  ws.getRow(r).height=50; r++;
  [[2,4],[6,8],[10,12]].forEach(function(q){mrg(ws,r,q[0],q[1],'Ad Soyad / Unvan / Tarih / İmza',fnt(9,false,C.T2),al());});
  ws.getRow(r).height=16;
  try{ws.addConditionalFormatting({ref:'H'+ilkVeri+':H'+sonVeri,rules:[{type:'dataBar',cfvo:[{type:'min'},{type:'max'}],color:{argb:'FF2E7BA6'}}]});}catch(e){}
  kapakTutar.value={formula:"'03 HAKEDİŞ İCMALİ'!L"+GENEL_ROW};

  /* ===== 04 HESAP ÖZETİ ===== */
  ws=sheet('04 HESAP ÖZETİ',[5,7,44,12,16,34]);
  r=banner(ws,1,6,'HAKEDİŞ HESAP ÖZETİ','Brüt imalat tutarından net ödenecek tutara — kesintiler ve vergiler');
  r=thead(ws,r,['Sıra','Kod','Açıklama','Oran','Tutar (₺)','Not / Dayanak']);
  var sn=0,rows04={};
  function hs(kod,acik,oran,formul,not_,vurgu,giris){
    sn++; var z=(sn%2===1),row=ws.getRow(r);
    [sn,kod,acik,oran,null,not_].forEach(function(v,ix){
      var c=row.getCell(ix+1); c.value=(v==null?null:v); c.font=fnt(vurgu?11:10,!!vurgu,vurgu?C.L900:C.T1); c.border=BH;
      c.alignment=al((ix+1===1||ix+1===2||ix+1===4)?'center':(ix+1===5?'right':'left'),null,(ix+1===3||ix+1===6));
      if(vurgu)c.fill=fill(C.VUR); else if(z)c.fill=fill(C.Z050);});
    if(oran!=null&&giris){row.getCell(4).fill=fill(C.GIRF);row.getCell(4).numFmt='0%';}
    var c5=row.getCell(5); c5.value=formul; c5.numFmt=PARA; c5.font=fnt(vurgu?11:10,!!vurgu,vurgu?C.L900:C.T1);
    c5.border=BH; c5.alignment=al('right');
    if(vurgu)c5.fill=fill(C.VUR); else if(z)c5.fill=fill(C.Z050);
    if(giris&&oran==null)c5.fill=fill(C.GIRF);
    row.height=22; rows04[kod]=r; r++; return r-1;}
  var rA=hs('A','Bu hakediş imalat tutarı (KDV hariç)',null,{formula:"'03 HAKEDİŞ İCMALİ'!L"+GENEL_ROW},'03 HAKEDİŞ İCMALİ genel toplamı');
  var rB=hs('B','Fiyat farkı (+/−)',null,0,'Sözleşmede fiyat farkı öngörülmemişse 0 bırakılır',false,true);
  var rC=hs('C','ARA TOPLAM','',{formula:'E'+rA+'+E'+rB},'',true);
  var rD=hs('D','Önceki hakedişler kümülatif imalat tutarı',null,0,'İlk hakediş ise 0',false,true);
  var rE=hs('E','Kümülatif imalat tutarı','',{formula:'E'+rC+'+E'+rD},'',true);
  mrg(ws,r,1,6,'KESİNTİLER',fnt(10,true,C.W),al(),C.L700,18); r++;
  var rF=hs('F','Avans mahsubu',0,{formula:'-ROUND(E'+rC+'*D'+r+',2)'},'Avans alınmadıysa oran 0 bırakılır',false,true);
  var rG=hs('G','Teminat (nakit) kesintisi',0.05,{formula:'-ROUND(E'+rC+'*D'+r+',2)'},'Geçici kabulde iade edilir',false,true);
  var rH=hs('H','Gelir vergisi stopajı (yıllara sari inşaat)',0,{formula:'-ROUND(E'+rC+'*D'+r+',2)'},'Yıllara sari değilse 0 ve gerekçesi',false,true);
  var rI=hs('I','İşveren temini malzeme mahsubu',null,0,'Kablo/pano işveren temini ise buraya girilir',false,true);
  var rJ=hs('J','Elektrik / su / konaklama / yemek kesintisi',null,0,'',false,true);
  var rK=hs('K','İSG ihlal ve ceza kesintisi',null,0,'Tutanak no referansı zorunlu',false,true);
  var rL=hs('L','Gecikme cezası',null,0,'',false,true);
  var rM=hs('M','Diğer kesintiler',null,0,'',false,true);
  var rN=hs('N','KESİNTİLER TOPLAMI','',{formula:'SUM(E'+rF+':E'+rM+')'},'',true);
  var rO=hs('O','Kesinti sonrası tutar (KDV matrahı)','',{formula:'E'+rC+'+E'+rN},'',true);
  var rP=hs('P','Hesaplanan KDV',0.20,{formula:'ROUND(E'+rO+'*D'+r+',2)'},'Düzenleme tarihindeki mevzuat oranı',false,true);
  var rQ=hs('Q','KDV tevkifatı (yapım işleri)',0,{formula:'-ROUND(E'+rP+'*D'+r+',2)'},'Tevkifat uygulanmıyorsa 0 ve gerekçesi',false,true);
  var rR=hs('R','Fatura edilecek toplam','',{formula:'E'+rO+'+E'+rP+'+E'+rQ},'',true);
  r++;
  mrg(ws,r,1,4,'NET ÖDENECEK TUTAR',fnt(13,true,C.W),al('right'),C.L900,34);
  var nc=ws.getRow(r).getCell(5); nc.value={formula:'E'+rR}; nc.numFmt=PARA; nc.font=fnt(14,true,C.L900);
  nc.fill=fill(C.ALTIN); nc.alignment=al('right'); nc.border={top:med,left:med,bottom:med,right:med};
  ws.getRow(r).getCell(6).fill=fill(C.L900); r+=2;
  ['Ödeme, SGK ve vergi borcu yoktur yazılarının ibrazı ve fatura teslimini takip eden ____ gün içinde yapılacaktır.',
   'Teminat kesintisi, geçici kabul tutanağının onaylanmasını takiben iade edilir.',
   'KDV ve tevkifat oranları düzenleme tarihindeki mevzuata göre uygulanmıştır.',
   'Sarı zeminli hücreler işveren/yüklenici mutabakatı ile doldurulacaktır.'].forEach(function(t){
    mrg(ws,r,1,6,'· '+t,fnt(9,false,C.T2,true),al('left','middle',true),null,16); r++;});

  /* ===== 05 METRAJ İCMALİ ===== */
  ws=sheet('05 METRAJ İCMALİ',[6,9,34,7,30,10,12,13,9,13],false,5);
  r=banner(ws,1,10,'METRAJ İCMALİ','İcmaldeki her miktarın hangi kayıttan geldiğinin köprüsü — bu sayfa tamamen türetilmiştir');
  r=thead(ws,r,['Sıra','Poz No','İş Kalemi','Birim','Kaynak / Filtre Kriteri','Kayıt Adedi','Miktar','İcmale Aktarılan','Fark','Kontrol']);
  var i5=0,ilk5=r;
  POZ.forEach(function(p){
    if(p.bu==='')return; i5++; var z=(i5%2===0),g=p.poz.split('.')[0],krit,kayit=0;
    if(g==='10'){krit='07 MONTAJ TAFSİLATI · Montaj Durumu = Yapıldı'; kayit=p.bu;}
    else if(g==='50'){krit='06 KABLO TAFSİLATI · Fonksiyon = Linye & Durum = çekildi'; kayit=linCek;}
    else {krit='06 KABLO TAFSİLATI · '+(p.kesit||'')+' & Durum = çekildi';
      kesSira.forEach(function(kk){if(KES[kk].kesit===p.kesit)kayit+=KES[kk].satir;});}
    var row=ws.getRow(r);
    [i5,p.poz,p.ad.slice(0,60),p.bir,krit,kayit,p.bu,p.bu,null,null].forEach(function(v,ix){
      var c=row.getCell(ix+1); c.value=(v==null?null:v); c.font=fnt(9.5); c.border=BH;
      c.alignment=al((ix+1===1||ix+1===2||ix+1===4||ix+1===6||ix+1===10)?'center':((ix+1>=7&&ix+1<=9)?'right':'left'),null,(ix+1===5));
      if(z)c.fill=fill(C.Z050);});
    var fm=(p.bir==='m')?MTR:ADT;
    [7,8,9].forEach(function(cc){row.getCell(cc).numFmt=fm;});
    row.getCell(9).value={formula:'G'+r+'-H'+r};
    row.getCell(10).value={formula:'IF(ABS(I'+r+')<0.5,"✔ OK","✖ FARK")'}; row.getCell(10).font=fnt(9.5,true,C.YEST);
    row.height=20; r++;});
  var son5=r-1;
  mrg(ws,r,1,6,'TOPLAM (kablo + linye metrajı)',fnt(11,true,C.L900),al('right'),C.VUR,22);
  var t5=ws.getRow(r).getCell(7); t5.value={formula:'SUMIF(D'+ilk5+':D'+son5+',"m",G'+ilk5+':G'+son5+')'};
  t5.numFmt=MTR; t5.font=fnt(11,true,C.L900); t5.fill=fill(C.VUR); t5.alignment=al('right');
  [8,9,10].forEach(function(cc){ws.getRow(r).getCell(cc).fill=fill(C.VUR);}); r+=2;
  mrg(ws,r,1,10,'Bu sayfadaki hiçbir hücre elle doldurulmaz. "Miktar" sütunu tafsilat sayfalarından, "İcmale Aktarılan" ise 03 HAKEDİŞ İCMALİ sayfasından gelir; ikisi arasındaki fark sıfır olmalıdır.',
    fnt(9,false,C.T2,true),al('left','middle',true),null,20);

  /* ===== 06 KABLO TAFSİLATI ===== */
  var DUR_A={cekildi:'çekildi',bekliyor:'bekliyor',revize:'revize',birlesti:'birleşti'};
  var DUR_S={cekildi:'●●●',bekliyor:'●○○',revize:'●●○',birlesti:'●●○'};
  var DUR_F={cekildi:C.YESF,bekliyor:C.GRIF,revize:C.SARF,birlesti:C.SARF};
  ws=sheet('06 KABLO TAFSİLATI',[6,11,26,15,15,20,10,6,10,7,10,9,30],true,5);
  r=banner(ws,1,13,'METRAJ TAFSİLATI — KABLO KALEMLERİ','Besleme / kumanda / data kabloları ve linye hatları · toplam '+(KAB.length+LIN.length)+' kayıt');
  r=thead(ws,r,['Sıra','Poz No','Mahal','Kaynak (Pano)','Hedef (DB/Nokta)','Kablo Tipi / Kesit','Fonksiyon','Adet','Metraj (m)','Durum','Durum Adı','Hakedişe Dahil','Açıklama']);
  var ilk6=r,i6=0,KATAD={GUC:'Besleme/Güç',KUMANDA:'Kumanda',DATA:'Data'},pozmap={};
  POZ.forEach(function(p){if(p.kesit)pozmap[p.kesit]=p.poz;});
  KAB.slice().sort(function(a,b){return (a.mahal+a.node).localeCompare(b.mahal+b.node,'tr');}).forEach(function(k){
    i6++; var z=(i6%2===0),row=ws.getRow(r);
    var dahil=(k.durum==='cekildi')?'Evet':'Hayır';
    var acik=(k.durum==='cekildi')?'':((k.durum==='bekliyor')?'Planlı — henüz çekilmedi':'Metraja dahil edilmedi');
    [i6,pozmap[k.kesit]||'',k.mahal,k.kaynak,k.node,k.ham||'(kesit girilmemiş)',KATAD[k.kat],k.adet,
     (k.durum==='cekildi'?k.mt:null),DUR_S[k.durum]||'',DUR_A[k.durum]||k.durum,dahil,acik].forEach(function(v,ix){
      var c=row.getCell(ix+1); c.value=(v===''?null:v); c.font=fnt(9.5); c.border=BH;
      c.alignment=al((ix+1===1||ix+1===2||ix+1===8||ix+1===10||ix+1===12)?'center':(ix+1===9?'right':'left'));
      if(z)c.fill=fill(C.Z050);});
    row.getCell(9).numFmt=MTR;
    row.getCell(10).fill=fill(DUR_F[k.durum]||C.GRIF); row.getCell(11).fill=fill(DUR_F[k.durum]||C.GRIF);
    if(!k.ham){row.getCell(6).fill=fill(C.KIRF);row.getCell(6).font=fnt(9.5,true,C.KIRT);}
    if(k.durum==='cekildi'&&k.mt===0){row.getCell(9).fill=fill(C.KIRF);
      row.getCell(13).value='⚠ ÇEKİLDİ ama METRAJ GİRİLMEMİŞ — hakedişe girmiyor';
      row.getCell(13).font=fnt(9,true,C.KIRT); row.getCell(13).fill=fill(C.KIRF);}
    row.height=18; r++;});
  var kson=r-1;
  mrg(ws,r,1,8,'Ara toplam — besleme / kumanda / data (çekilen)',fnt(10,true,C.L900),al('right'),C.VUR,20);
  var a6=ws.getRow(r).getCell(9); a6.value={formula:'SUBTOTAL(9,I'+ilk6+':I'+kson+')'}; a6.numFmt=MTR;
  a6.font=fnt(10,true,C.L900); a6.fill=fill(C.VUR); a6.alignment=al('right');
  for(j=10;j<=13;j++)ws.getRow(r).getCell(j).fill=fill(C.VUR);
  var kAra=r; r+=2;
  mrg(ws,r,1,13,'LİNYE (AYDINLATMA HATTI) KALEMLERİ',fnt(10,true,C.W),al(),C.L700,18); r++;
  var lilk=r;
  LIN.slice().sort(function(a,b){return (a.mahal+a.node+a.kod).localeCompare(b.mahal+b.node+b.kod,'tr');}).forEach(function(l){
    i6++; var z=(i6%2===0),row=ws.getRow(r);
    var dahil=(l.durum==='cekildi')?'Evet':'Hayır';
    var acik=(l.durum==='cekildi')?'':((l.durum==='bekliyor')?'Planlı — henüz çekilmedi':'Metraja dahil edilmedi — bkz. 11 REVİZE-BİRLEŞTİ');
    [i6,'50.010',l.mahal,'',l.node,l.kod,'Linye',1,(l.durum==='cekildi'?l.mt:null),
     DUR_S[l.durum]||'',DUR_A[l.durum]||l.durum,dahil,acik].forEach(function(v,ix){
      var c=row.getCell(ix+1); c.value=(v===''?null:v); c.font=fnt(9.5); c.border=BH;
      c.alignment=al((ix+1===1||ix+1===2||ix+1===8||ix+1===10||ix+1===12)?'center':(ix+1===9?'right':'left'));
      if(z)c.fill=fill(C.Z050);});
    row.getCell(9).numFmt=MTR;
    row.getCell(10).fill=fill(DUR_F[l.durum]||C.GRIF); row.getCell(11).fill=fill(DUR_F[l.durum]||C.GRIF);
    if(l.durum==='cekildi'&&l.mt===0){row.getCell(9).fill=fill(C.KIRF);row.getCell(9).font=fnt(9.5,true,C.KIRT);
      row.getCell(13).value='⚠ ÇEKİLDİ ama METRAJ GİRİLMEMİŞ — hakedişe girmiyor, saha ölçüsü alınmalı';
      row.getCell(13).font=fnt(9,true,C.KIRT); row.getCell(13).fill=fill(C.KIRF);}
    row.height=18; r++;});
  var lson=r-1;
  mrg(ws,r,1,8,'Ara toplam — linye (çekilen)',fnt(10,true,C.L900),al('right'),C.VUR,20);
  var a7=ws.getRow(r).getCell(9); a7.value={formula:'SUBTOTAL(9,I'+lilk+':I'+lson+')'}; a7.numFmt=MTR;
  a7.font=fnt(10,true,C.L900); a7.fill=fill(C.VUR); a7.alignment=al('right');
  for(j=10;j<=13;j++)ws.getRow(r).getCell(j).fill=fill(C.VUR);
  var lAra=r; r++;
  mrg(ws,r,1,8,'GENEL TOPLAM — çekilen kablo metrajı',fnt(11,true,C.W),al('right'),C.L900,24);
  var gg=ws.getRow(r).getCell(9); gg.value={formula:'I'+kAra+'+I'+lAra}; gg.numFmt=MTR;
  gg.font=fnt(12,true,C.L900); gg.fill=fill(C.ALTIN); gg.alignment=al('right');
  for(j=10;j<=13;j++)ws.getRow(r).getCell(j).fill=fill(C.L900);
  ws.autoFilter='A'+(ilk6-1)+':M'+kson;

  /* ===== 07 MONTAJ TAFSİLATI ===== */
  ws=sheet('07 MONTAJ TAFSİLATI',[6,13,8,26,10,12,10,10,9,30,9,26],true,5);
  r=banner(ws,1,12,'METRAJ TAFSİLATI — DRIVER BOX / PANO MONTAJI',NODES.length+' nokta · montaj durumu ve kablolama tamamlanma oranı');
  r=thead(ws,r,['Sıra','Ekipman Kodu','Tipi','Mahal','Montaj','Besleyen Pano','Kablo Yapılan','Kablo Toplam','Tamamlanma','Nokta Durumu','Foto','Not']);
  var ilk7=r,i7=0,DFL={};
  DFL['TAM BİTTİ']=C.YESF; DFL['MONTAJ VAR · KABLO EKSİK']=C.SARF; DFL['KABLO VAR · MONTAJ YOK']=C.KIRF;
  DFL['BAŞLAMADI']=C.GRIF; DFL['MONTAJ TAMAM · KABLO PLANI YOK']=C.GRIF;
  NODES.slice().sort(function(a,b){
    var x=(a.mahal+(a.tip==='DB'?'0':'1')+a.kod),y=(b.mahal+(b.tip==='DB'?'0':'1')+b.kod);
    return x.localeCompare(y,'tr');}).forEach(function(n){
    i7++; var z=(i7%2===0),row=ws.getRow(r),d=NDUR[n.kod];
    [i7,n.kod,n.tip,n.mahal,(n.montaj?'Yapıldı':'Yapılmadı'),n.kaynak,d.yap,d.top,null,d.d,(n.foto||''),n.not].forEach(function(v,ix){
      var c=row.getCell(ix+1); c.value=(v===''?null:v); c.font=fnt(9.5); c.border=BH;
      c.alignment=al((ix+1===1||ix+1===3||ix+1===5||ix+1===7||ix+1===8||ix+1===9||ix+1===11)?'center':'left',null,(ix+1===12));
      if(z)c.fill=fill(C.Z050);});
    row.getCell(9).value={formula:'IF(H'+r+'=0,"",G'+r+'/H'+r+')'}; row.getCell(9).numFmt='0%';
    row.getCell(5).fill=fill(n.montaj?C.YESF:C.KIRF);
    row.getCell(10).fill=fill(DFL[d.d]||C.GRIF); row.getCell(10).font=fnt(9.5,true,C.T1);
    row.height=18; r++;});
  var son7=r-1;
  [['TAM BİTTİ (montaj + tüm kablo)',tamDB+tamPano,C.YESF],['DB montajı yapılan',dbM,null],['Pano montajı yapılan',panoM,null]].forEach(function(q){
    mrg(ws,r,1,9,q[0],fnt(10,true,C.L900),al('right'),q[2]||C.VUR,20);
    var c=ws.getRow(r).getCell(10); c.value=q[1]; c.font=fnt(10,true,C.L900); c.fill=fill(q[2]||C.VUR);
    c.alignment=al('center','middle',false,0); c.numFmt=ADT;
    ws.getRow(r).getCell(11).fill=fill(q[2]||C.VUR); ws.getRow(r).getCell(12).fill=fill(q[2]||C.VUR); r++;});
  ws.autoFilter='A'+(ilk7-1)+':L'+son7;

  /* ===== 08 MAHAL GERÇEKLEŞME ===== */
  ws=sheet('08 MAHAL GERÇEKLEŞME',[6,32,8,10,9,11,11,11,11,13,12,14],true,5);
  r=banner(ws,1,12,'MAHAL BAZINDA GERÇEKLEŞME','Bölge bölge imalat durumu — hangi mahal geride');
  r=thead(ws,r,['Sıra','Mahal / Bölge','DB','DB Montaj','Pano','Pano Montaj','Kablo Kalem (Yapılan)','Kablo Kalem (Toplam)','Linye (Yapılan)','Linye (Toplam)','Çekilen Metraj (m)','Gerçekleşme']);
  var ilk8=r,i8=0;
  mhSira.slice().sort(function(a,b){return mpct(MH[b])-mpct(MH[a]);}).forEach(function(m){
    i8++; var d=MH[m],z=(i8%2===0),p=mpct(d),row=ws.getRow(r);
    [i8,m,d.db,d.dbM,d.pano,d.panoM,d.kabY,d.kabT,d.linY,d.linT,d.mt,null].forEach(function(v,ix){
      var c=row.getCell(ix+1); c.value=v; c.font=fnt(10); c.border=BH;
      c.alignment=al((ix+1===2)?'left':'center');
      if(z)c.fill=fill(C.Z050);});
    row.getCell(11).numFmt=MTR; row.getCell(11).alignment=al('right');
    row.getCell(12).value={formula:'IF(H'+r+'+J'+r+'=0,"",(G'+r+'+I'+r+')/(H'+r+'+J'+r+'))'};
    row.getCell(12).numFmt='0%'; row.getCell(12).font=fnt(10,true,(p>=60?C.L900:C.T2));
    row.getCell(12).fill=fill(p>=90?C.YESF:(p>=50?C.SARF:C.KIRF));
    row.height=20; r++;});
  var son8=r-1;
  mrg(ws,r,1,10,'TOPLAM',fnt(11,true,C.L900),al('right'),C.VUR,22);
  var t8=ws.getRow(r).getCell(11); t8.value={formula:'SUM(K'+ilk8+':K'+son8+')'}; t8.numFmt=MTR;
  t8.font=fnt(11,true,C.L900); t8.fill=fill(C.VUR); t8.alignment=al('right');
  ws.getRow(r).getCell(12).fill=fill(C.VUR);
  try{ws.addConditionalFormatting({ref:'K'+ilk8+':K'+son8,rules:[{type:'dataBar',cfvo:[{type:'min'},{type:'max'}],color:{argb:'FF2E7BA6'}}]});}catch(e){}

  /* ===== 09 ÇAPRAZ KONTROL ===== */
  ws=sheet('09 ÇAPRAZ KONTROL',[6,8,40,14,14,12,10,12,40]);
  r=banner(ws,1,9,'ÇAPRAZ KONTROL VE MUTABAKAT','Dosyanın kendi kendini denetlediği tablo — mutabakatsızlıklar gizlenmez, listelenir');
  var kesTop=0; kesSira.forEach(function(kk){kesTop+=KES[kk].mt;});
  var acikSayi=0;
  var KTRL=[['K-01','Metraj','Kablo tipi metrajları toplamı = kablo genel toplamı',kesTop,kabCekMt,0,'m','Üç kablo türünün toplamı, çekilen kablo metrajına eşit olmalı'],
    ['K-02','Metraj','Kablo + linye = genel çekilen metraj',kabCekMt+linCekMt,TOPMT,0,'m','Toplam metrajın bileşenlerine ayrışması'],
    ['K-03','Sayım','Çekilen kablo KALEM (satır) sayısı',kabCekSatir,kabCekSatir,0,'ad','Panodaki "kalem" sayacı satır bazlıdır'],
    ['K-04','Sayım','Çekilen kablo ADET sayısı (aynı satırda birden çok kablo olabilir)',kabCekAdet,kabCekAdet,0,'ad','ÖNEMLİ: kalem ile adet farkı buradan gelir — veri hatası değil, birim farkıdır'],
    ['K-05','Metraj','Kayıtlı metraj ile adet çarpımlı metraj farkı',kabCekMt,kabCekMtAdet,null,'m','AÇIK KONU: kayıtlı metrajın tek kablo boyu mu yoksa toplam mı olduğu netleştirilmelidir'],
    ['K-06','Sayım','Nokta durumu bütünlüğü (tüm düğümler sınıflandı)',NODES.length,NODES.length,0,'ad','07 MONTAJ TAFSİLATI satır sayısı = toplam nokta'],
    ['K-07','Sayım','Tam biten nokta sayısı',tamDB+tamPano,tamDB+tamPano,0,'ad','★ '+tamDB+' DB + ◆ '+tamPano+' pano'],
    ['K-08','Metraj','Mahal toplamları = genel toplam',(function(){var s=0;mhSira.forEach(function(m){s+=MH[m].mt;});return Math.round(s);})(),Math.round(TOPMT),0,'m','08 MAHAL sayfası toplamı'],
    ['K-09','Kayıt','Saha rapor kayıtları metraj toplamı',rapMt,TOPMT,null,'m','AÇIK KONU: rapor kayıtları tüm imalat dönemini kapsamıyorsa ek dayanak sunulmalıdır'],
    ['K-10','Fiyat','Birim fiyatı girilmemiş kalem sayısı',null,0,null,'ad','Sıfır olmadan dosya teslim edilmemelidir'],
    ['K-11','Metraj','Revize/birleşti kalemlerin metraja etkisi',0,0,0,'m',revList.length+' kalem metraj dışı bırakıldı'],
    ['K-12','Makul','Ortalama linye boyu',(linCek?Math.round(linCekMt/linCek*10)/10:0),0,null,'m','Beklenen aralık 25–60 m'],
    ['K-13','Kayıt','"Çekildi" işaretli ama METRAJI BOŞ kayıt sayısı',bosMt,0,null,'ad','AÇIK KONU: bu kalemler fiilen yapılmış görünüyor fakat metrajı 0 olduğu için hakedişe GİRMEMEKTEDİR — saha ölçüsü alınıp girilmelidir (doğrudan hakediş kaybı)'],
    ['K-14','Kapsam','Linye kalemlerinde kesit (kablo tipi) bilgisi',0,linCek,null,'ad','AÇIK KONU: pafta linye kaydında kesit alanı bulunmadığından linye tek poz altında toplanmıştır; farklı kesitler aynı birim fiyattan ödenemez']];
  KTRL.forEach(function(q){if(q[5]===null)acikSayi++;});
  mrg(ws,r,1,9,(acikSayi?('◆ '+acikSayi+' ADET AÇIK KONU VAR — teslimden önce mutabakat gerekir · diğer kontroller TEMİZ'):'✔ TÜM KONTROLLER TEMİZ'),
    fnt(11,true,(acikSayi?C.SART:C.YEST)),al('center','middle',false,0),(acikSayi?C.SARF:C.YESF),26); r+=2;
  r=thead(ws,r,['Kod','Tip','Kontrol Adı','Sol Değer','Sağ Değer','Fark','Tolerans','Sonuç','Açıklama']);
  var ilk9=r,i9=0;
  KTRL.forEach(function(q){
    i9++; var z=(i9%2===0),row=ws.getRow(r),bir=q[6],fm=(bir==='m')?MTR:ADT;
    [q[0],q[1],q[2],q[3],q[4],null,(q[5]==null?'—':q[5]),null,q[7]].forEach(function(v,ix){
      var c=row.getCell(ix+1); c.value=v; c.font=fnt(9.5); c.border=BH;
      c.alignment=al((ix+1===1||ix+1===2||ix+1===7||ix+1===8)?'center':((ix+1>=4&&ix+1<=6)?'right':'left'),null,(ix+1===3||ix+1===9));
      if(z)c.fill=fill(C.Z050);});
    [4,5,6].forEach(function(cc){row.getCell(cc).numFmt=fm;});
    if(q[0]==='K-10'){
      row.getCell(4).value={formula:"COUNTBLANK('03 HAKEDİŞ İCMALİ'!K"+ilkVeri+":K"+sonVeri+")"};
      row.getCell(6).value={formula:'D'+r+'-E'+r};
      row.getCell(8).value={formula:'IF(D'+r+'=0,"✔ TAMAM","✖ EKSİK")'};
    }else if(q[0]==='K-12'){
      row.getCell(5).value=null; row.getCell(6).value=null;
      row.getCell(8).value={formula:'IF(AND(D'+r+'>=25,D'+r+'<=60),"✔ MAKUL","✖ İNCELE")'};
    }else if(q[5]===null){
      row.getCell(6).value={formula:'D'+r+'-E'+r};
      row.getCell(8).value='◆ AÇIK KONU'; row.getCell(8).fill=fill(C.SARF); row.getCell(8).font=fnt(9.5,true,C.SART);
    }else{
      row.getCell(6).value={formula:'D'+r+'-E'+r};
      row.getCell(8).value={formula:'IF(ABS(F'+r+')<=0.5,"✔ TUTUYOR","✖ MUTABAKATSIZ")'};
      row.getCell(8).fill=fill(C.YESF); row.getCell(8).font=fnt(9.5,true,C.YEST);}
    row.height=26; r++;});
  r++;
  mrg(ws,r,1,9,'Yüklenici beyanı: Bu dosyada tespit edilen tüm mutabakatsızlıklar ve açıklama bekleyen hususlar yukarıda listelenmiştir. Bu kalemlerin ödemesinin mutabakat sağlanana kadar askıya alınmasını kabul ederiz.',
    fnt(10,true,C.L900),al('left','middle',true),C.VUR,30);

  /* ===== 10 SAHA RAPOR DÖKÜMÜ ===== */
  ws=sheet('10 SAHA RAPOR DÖKÜMÜ',[6,12,34,10,9,12,12,34],false,5);
  r=banner(ws,1,8,'SAHA RAPOR DÖKÜMÜ',RAP.length+' günlük imalat kaydı · metrajın birincil kanıtı');
  r=thead(ws,r,['Sıra','Tarih','Yapılan İş / Hedef','Metraj (m)','Adet','İş Tipi','Foto','Not']);
  var ilk10=r,i10=0;
  RAP.slice().sort(function(a,b){return String(a.tarih||'').localeCompare(String(b.tarih||''));}).forEach(function(x){
    i10++; var z=(i10%2===0),row=ws.getRow(r),tip=[];
    if(x.kablo)tip.push('Kablo'); if(x.montaj)tip.push('Montaj'); if(x.revize)tip.push('Revize');
    var d=null; try{var pp=String(x.tarih||'').split('-'); if(pp.length===3)d=new Date(+pp[0],+pp[1]-1,+pp[2]);}catch(e){}
    [i10,d,String(x.hedef||'').slice(0,60),(_hkF(x.metraj)||null),(x.adet||null),(tip.join('+')||'—'),
     ((x.fotolar||[]).length||''),String(x.not||'').slice(0,60)].forEach(function(v,ix){
      var c=row.getCell(ix+1); c.value=(v===''?null:v); c.font=fnt(9.5); c.border=BH;
      c.alignment=al((ix+1===1||ix+1===2||ix+1===5||ix+1===6||ix+1===7)?'center':(ix+1===4?'right':'left'));
      if(z)c.fill=fill(C.Z050);});
    row.getCell(2).numFmt='dd.mm.yyyy'; row.getCell(4).numFmt=MTR;
    row.height=18; r++;});
  var son10=r-1;
  mrg(ws,r,1,3,'TOPLAM RAPORLU METRAJ',fnt(11,true,C.L900),al('right'),C.VUR,22);
  var t10=ws.getRow(r).getCell(4); t10.value={formula:'SUBTOTAL(9,D'+ilk10+':D'+son10+')'}; t10.numFmt=MTR;
  t10.font=fnt(11,true,C.L900); t10.fill=fill(C.VUR); t10.alignment=al('right');
  for(j=5;j<=8;j++)ws.getRow(r).getCell(j).fill=fill(C.VUR);
  r+=2;
  mrg(ws,r,1,8,'UYARI: Saha rapor kayıtlarının metraj toplamı ('+_hkNum(rapMt)+' m) ile dosya toplamı ('+_hkNum(TOPMT)+' m) farklıysa, kapsanmayan dönem için ölçü tutanağı veya ek dayanak sunulmalıdır (bkz. 09 ÇAPRAZ KONTROL · K-09).',
    fnt(10,true,C.SART),al('left','middle',true),C.SARF,32);
  ws.autoFilter='A'+(ilk10-1)+':H'+son10;

  /* ===== 11 REVİZE-BİRLEŞTİ ===== */
  ws=sheet('11 REVİZE-BİRLEŞTİ',[6,26,14,12,12,14,40]);
  r=banner(ws,1,7,'REVİZE / BİRLEŞTİRME KAYITLARI','Mükerrer metraj riskinin kapatıldığının ispatı — bu kalemler hakediş metrajına DAHİL DEĞİLDİR');
  r=thead(ws,r,['Sıra','Mahal','İş Noktası','Kalem','İşlem Tipi','Hakedişe Yansıması','Açıklama / Gerekçe']);
  var i11=0;
  revList.slice().sort(function(a,b){return (a.mahal+a.node).localeCompare(b.mahal+b.node,'tr');}).forEach(function(l){
    i11++; var z=(i11%2===0),row=ws.getRow(r);
    [i11,l.mahal,l.node,l.kod,DUR_A[l.durum]||l.durum,'Hariç — metraja dahil edilmedi','Gerekçe ve onay belgesi referansı doldurulacak'].forEach(function(v,ix){
      var c=row.getCell(ix+1); c.value=v; c.font=fnt(9.5); c.border=BH;
      c.alignment=al((ix+1===1||ix+1===4||ix+1===5||ix+1===6)?'center':'left',null,(ix+1===7));
      if(z)c.fill=fill(C.Z050);});
    row.getCell(5).fill=fill(C.SARF); row.getCell(7).fill=fill(C.GIRF);
    row.height=19; r++;});
  if(!i11){mrg(ws,r,1,7,'Revize veya birleştirme kaydı bulunmamaktadır.',fnt(10,false,C.T2,true),al(),null,20); r++;}
  mrg(ws,r,1,5,'TOPLAM — metraj dışı bırakılan kalem',fnt(11,true,C.L900),al('right'),C.VUR,22);
  var t11=ws.getRow(r).getCell(6); t11.value=revList.length; t11.numFmt=ADT; t11.font=fnt(11,true,C.L900);
  t11.fill=fill(C.VUR); t11.alignment=al('center','middle',false,0); ws.getRow(r).getCell(7).fill=fill(C.VUR); r+=2;
  mrg(ws,r,1,7,'Kural: Revize edilen veya birleştirilen kalemlerin metrajı hakedişte hem eski hem yeni kodla görünmez. Bu sayfa, aynı metrenin iki kez ödemeye girmediğinin tek kanıtıdır.',
    fnt(10,false,C.T2,true),al('left','middle',true),null,26);

  /* ===== 12 HESAP ESASLARI ===== */
  ws=sheet('12 HESAP ESASLARI',[2,5,42,45,2]);
  r=banner(ws,1,5,'HESAP ESASLARI VE VARSAYIMLAR','İtirazı peşinen kapatan sayfa — ölçüm, kapsam ve yöntem beyanı');
  [['1 · ÖLÇÜM ESASI','Kablo metrajları, kaynak pano klemens çıkışından hedef nokta klemens girişine kadar güzergâh boyu olarak kayda alınmıştır. Her uçta bırakılan bağlantı payının metraja DAHİL / HARİÇ olduğu işveren ile mutabık kalınarak bu satıra yazılacaktır: ____________'],
   ['2 · METRAJ KAYIT YORUMU','Pafta kayıtlarında bir satırda birden çok kablo (adet) bulunabilmektedir. Bu dosyada talep, KAYITLI METRAJ üzerinden yapılmıştır ('+_hkNum(kabCekMt)+' m). Aynı satırlardaki adet ile çarpıldığında metraj '+_hkNum(kabCekMtAdet)+' m olmaktadır. Doğru yorum işveren ile mutabık kalınarak netleştirilecektir (bkz. 09 ÇAPRAZ KONTROL · K-05).'],
   ['3 · FİRE VE ZAYİAT','Kablo firesi hakedişe yansıtılmamıştır. Sözleşmede fire oranı öngörülmüşse belirtilecektir: ____________'],
   ['4 · KISMİ İMALAT ORANLAMASI','Kablo işi aşamaları: çekim, terminasyon, test ve devreye alma. Bu hakedişte ÇEKİM aşaması tamamlanmış kalemler talep edilmiştir; terminasyon ve test kalemleri (poz 60/70) ayrı iş kalemi olarak açık bırakılmıştır. Kısmi oran uygulanacaksa oran şeması burada tanımlanacaktır: ____________'],
   ['5 · MALZEME TEMİNİ','Kablo ve pano malzemelerinin ____________ tarafından temin edildiği; birim fiyatların malzeme DAHİL / HARİÇ olduğu bu satırda beyan edilecektir. Bu tek bilgi birim fiyatı belirleyici ölçüde etkiler.'],
   ['6 · YUVARLAMA','Metrajlar tam metreye, tutarlar iki ondalığa yuvarlanmıştır.'],
   ['7 · VERİ KAYNAĞI','Metrajlar, BHS Peyzaj Pafta saha kayıt sisteminde '+TARIH+' tarihi itibarıyla kayıtlı verilerden otomatik türetilmiştir. Sistemde '+RAP.length+' adet günlük saha rapor kaydı bulunmaktadır.'],
   ['8 · KAPSAM DIŞI','Bu hakediş kapsamına GİRMEYEN işler: terminasyon ve klemens bağlantısı, etiketleme, izolasyon/süreklilik testi, devreye alma, spiral boru/kablo tavası, rögar-menhol, kazı-dolgu, topraklama iletkeni. Bu kalemler icmalde miktar girilmeden açık bırakılmıştır.'],
   ['9 · MONTAJSIZ NOKTALAR',(caps.length-capM)+' adet ÇAP panosunun montajı henüz yapılmamıştır. Bu noktalara ilişkin kablo imalatı yapılmışsa 07 MONTAJ TAFSİLATI sayfasında "KABLO VAR · MONTAJ YOK" olarak ayrıca işaretlenmiştir.'],
   ['10 · REVİZE VE BİRLEŞTİRME',revList.length+' adet kalem revize/birleşti statüsündedir ve metraja dahil edilmemiştir. Tam listesi 11 REVİZE-BİRLEŞTİ sayfasındadır.'],
   ['11 · LİNYE KESİT DÖKÜMÜ','Pafta linye kayıtlarında kablo tipi/kesit alanı bulunmadığından linye imalatı tek poz (50.010) altında toplanmıştır. Farklı kesitlerin birim fiyatı farklı olduğundan, ödeme öncesi linye kesit dökümü sahadan tamamlanacak veya taraflarca tek bir ağırlıklı ortalama birim fiyat üzerinde mutabık kalınacaktır.'],
   ['12 · METRAJI GİRİLMEMİŞ KAYITLAR','Sistemde "çekildi" işaretli olduğu hâlde metraj alanı boş bırakılmış '+bosMt+' kalem bulunmaktadır. Bu kalemler fiilen imal edilmiş görünmekle birlikte metrajı sıfır kabul edildiğinden bu hakedişe DAHİL EDİLMEMİŞTİR. Saha ölçüleri alındıkça sonraki hakedişte talep edilecektir (bkz. 09 ÇAPRAZ KONTROL · K-13).'],
   ['13 · ŞEFFAFLIK BEYANI','Bu hakediş dosyasında tespit edilen tüm mutabakatsızlıklar, eksik veriler ve açıklama bekleyen hususlar 09 ÇAPRAZ KONTROL sayfasında listelenmiştir. Yüklenici, bu kalemlerin ödemesinin mutabakat sağlanana kadar askıya alınmasını kabul eder.']].forEach(function(q){
    mrg(ws,r,2,4,q[0],fnt(11,true,C.L800),al(),null,20);
    for(j=2;j<=4;j++)ws.getRow(r).getCell(j).border={bottom:med};
    r++;
    mrg(ws,r,3,4,q[1],fnt(10,false,C.T1),al('left','middle',true),null,Math.ceil(q[1].length/100)*14+22); r+=2;});

  /* ===== 13 EKLER VE İMZA ===== */
  ws=sheet('13 EKLER VE İMZA',[5,8,40,14,12,14,26]);
  r=banner(ws,1,7,'EK LİSTESİ VE ONAY','Hakediş dosyasının ekleri ve imza blokları');
  r=thead(ws,r,['Sıra','Ek No','Ek Adı','Tür','Tarih','Zorunlu mu','Ekli mi (E/H)']);
  var i13=0;
  [['EK-01','İmzalı ölçü tutanakları (ataşman)','Tutanak','Evet'],
   ['EK-02','Saha rapor kayıtları dökümü ('+RAP.length+' kayıt)','Rapor','Evet'],
   ['EK-03','Fotoğraf albümü — mahal ve nokta indeksli','Fotoğraf','Evet'],
   ['EK-04','Revize / birleştirme onay yazıları','Yazışma','Evet'],
   ['EK-05','İş artışı talimatları (varsa)','Talimat','Koşullu'],
   ['EK-06','Onaylı uygulama projesi / pafta ('+PROJE+')','Çizim','Evet'],
   ['EK-07','Malzeme irsaliyeleri (taşeron temini ise)','Belge','Koşullu'],
   ['EK-08','İzolasyon / süreklilik test raporları','Rapor','Koşullu'],
   ['EK-09','Puantaj cetvelleri','Cetvel','Evet'],
   ['EK-10','SGK ve vergi borcu yoktur yazıları','Belge','Evet'],
   ['EK-11','Sözleşme eki birim fiyat cetveli','Sözleşme','Evet']].forEach(function(q){
    i13++; var z=(i13%2===0),row=ws.getRow(r);
    [i13,q[0],q[1],q[2],null,q[3],null].forEach(function(v,ix){
      var c=row.getCell(ix+1); c.value=v; c.font=fnt(10); c.border=BH;
      c.alignment=al((ix+1===3)?'left':'center');
      if(z)c.fill=fill(C.Z050);});
    row.getCell(5).fill=fill(C.GIRF); row.getCell(5).numFmt='dd.mm.yyyy'; row.getCell(7).fill=fill(C.GIRF);
    row.height=20; r++;});
  r+=2;
  mrg(ws,r,1,7,'ONAY BLOKLARI',fnt(12,true,C.L800),al(),null,22);
  for(j=1;j<=7;j++)ws.getRow(r).getCell(j).border={bottom:med};
  r+=2;
  [['DÜZENLEYEN','Yüklenici / Taşeron Şantiye Şefi'],['KONTROL EDEN','İşveren Saha Kontrol Mühendisi'],
   ['TASDİK EDEN','Proje Müdürü'],['ONAYLAYAN','İşveren Yetkilisi']].forEach(function(q,ix){
    var c1=(ix%2===0)?2:5;
    mrg(ws,r,c1,c1+1,q[0],fnt(9,true,C.L800),al());
    mrg(ws,r+1,c1,c1+1,q[1],fnt(8,false,C.T2),al());
    ws.getRow(r+3).getCell(c1).border={bottom:thin}; ws.getRow(r+3).getCell(c1+1).border={bottom:thin};
    mrg(ws,r+4,c1,c1+1,'Ad Soyad · Tarih · İmza / Kaşe',fnt(8,false,C.T3),al());
    if(ix%2===1){ws.getRow(r).height=16;ws.getRow(r+1).height=14;ws.getRow(r+2).height=8;
      ws.getRow(r+3).height=44;ws.getRow(r+4).height=16; r+=6;}});
  r++;
  mrg(ws,r,1,7,'ŞERH ALANI — Kontrol mühendisi itirazları ve ödemesi askıya alınan kalemler:',fnt(10,true,C.T2),al(),null,20); r++;
  mrg(ws,r,1,7,'',null,null,C.GIRF,60);
  for(j=1;j<=7;j++)ws.getRow(r).getCell(j).border=BT;

  /* ===== KAYDET ===== */
  var buf=await wb.xlsx.writeBuffer();
  var a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
  a.download='BHS_Hakedis_Dosyasi_'+new Date().toISOString().slice(0,10)+'.xlsx';
  document.body.appendChild(a); a.click();
  setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},1500);
  toast('✓ Hakediş dosyası indirildi (15 sayfa)');
}


/* ===== MAHAL RAPORU v2 — pano durumunu KABLO KALEMİ seviyesinde gösterir =====
   index.html icindeki _mahalRaporExcel'i override eder. */
function _mrNode(ad){
  var s=String(ad||'').trim();
  var m=s.match(/^DB[\s\-_]?0*(\d+)$/i);
  if(m){ var n=parseInt(m[1],10);
    for(var i=0;i<(data.dbs||[]).length;i++){ if(parseInt(data.dbs[i].id,10)===n) return {o:data.dbs[i],tip:'db'}; } return null; }
  for(var j=0;j<(data.panos||[]).length;j++){ if(data.panos[j].kod===s) return {o:data.panos[j],tip:'pano'}; }
  return null;
}
function _mrKalemler(nd){
  if(!nd) return [];
  var o=nd.o, tip=nd.tip, out=[];
  var bk=(o.besleme&&Array.isArray(o.besleme.kablolar))?o.besleme.kablolar:null;
  if(!bk){ var key=(tip==='db')?String(o.id).padStart(2,'0'):o.kod;
    var bd=(typeof BESLEME!=='undefined')?BESLEME[key]:null;
    bk=bd?bd.kablolar.map(function(k){return {tip:k.tip,adet:k.adet,durum:'bekliyor',mt:''};}):[]; }
  bk.forEach(function(k){
    var kat=(typeof _hkKat==='function')?_hkKat(k.tip):'GUC';
    out.push({kalem:(k.tip||'(kesit girilmemiş)'),tur:(kat==='DATA'?'Data':(kat==='KUMANDA'?'Kumanda':'Besleme')),
      adet:(parseInt(k.adet||1,10)||1),mt:(parseFloat(String(k.mt||0).replace(',','.'))||0),durum:(k.durum||'bekliyor')});});
  var hat=[];
  if(tip==='db'){ var hb=(typeof HATLAR!=='undefined')?HATLAR[String(o.id).padStart(2,'0')]:null; if(hb)hat=hb.hatlar.slice(); }
  else { if(typeof PANO_LINYE!=='undefined'&&PANO_LINYE[o.kod])hat=PANO_LINYE[o.kod].map(function(x){return x.l;}); }
  var giz=o.gizliLinye||[]; hat=hat.filter(function(h){return giz.indexOf(h)<0;});
  (o.ekLinye||[]).forEach(function(h){ if(hat.indexOf(h)<0)hat.push(h); });
  Object.keys(o.linye||{}).forEach(function(h){ if(hat.indexOf(h)<0)hat.push(h); });
  hat.forEach(function(h){ var l=(o.linye&&o.linye[h])||{};
    out.push({kalem:h,tur:'Linye',adet:1,mt:(parseFloat(String(l.mt||0).replace(',','.'))||0),durum:(l.durum||'bekliyor')});});
  return out;
}
function _mrOzet(kal){
  var s={besC:0,besT:0,linC:0,linT:0,eksik:[]};
  kal.forEach(function(k){
    if(k.durum==='revize'||k.durum==='birlesti')return;
    if(k.tur==='Linye'){ s.linT++; if(k.durum==='cekildi')s.linC++; else s.eksik.push(k.kalem); }
    else { s.besT++; if(k.durum==='cekildi')s.besC++; else s.eksik.push((k.adet>1?k.adet+'× ':'')+k.kalem); }});
  return s;
}
function _mahalRaporExcel(){
  var E=window.ExcelJS, wb=new E.Workbook(), t=new Date(), tarih=t.toLocaleDateString('tr-TR');
  var NAVY='FF12303F',TEAL='FF0F766E',TEAL2='FF155E75',MONTAJ='FFE53935',YOK='FFB23A26',YARIM='FFE8821E',
      TAMAM='FF1E9E5A',GRAY='FF9AA7B3',CARD='FFF4F7FA',LINE='FFD8E0E8',INK='FF1C2733',MUT='FF647585',
      YESF='FFE6F4EA',KIRF='FFFDE7E6',SARF='FFFCEFE0',ZEB='FFF7FAFC';
  function fl(a){return {type:'pattern',pattern:'solid',fgColor:{argb:a}};}
  function ft(sz,b,c){return {name:'Arial',size:sz,bold:!!b,color:{argb:c||INK}};}
  var THIN={style:'thin',color:{argb:LINE}}, MED={style:'medium',color:{argb:'FFB9C6D2'}};
  function bd(){return {top:THIN,bottom:THIN,left:THIN,right:THIN};}
  var CEN={vertical:'middle',horizontal:'center',wrapText:true}, LFT={vertical:'middle',horizontal:'left',wrapText:true};
  function tip(k){k=(k||'').toLocaleUpperCase('tr'); if(k.indexOf('DB')===0)return 'Driver Box'; if(k.indexOf('ÇAP')>=0)return 'ÇAP panosu'; if(k.indexOf('-HK')>=0)return 'HK panosu'; if(k.indexOf('-HP')>=0)return 'HP panosu'; return 'Pano';}
  function dc(n){return n==='montaj yok'?MONTAJ:(n==='kablo yok'?YOK:(n==='kablo yarım'?YARIM:GRAY));}
  function tc(pv){return pv>=80?TEAL:(pv>=50?'FFB35E00':'FFB3261E');}
  var rows=data.mahaller.map(function(m){ var d=mahalDurum(m);
    return {ad:m.ad||'?', yuzde:d.yuzde, biten:d.biten, toplam:d.toplam, eksik:(d.eksik||[]).slice(), uyeler:(m.uyeler||[]).slice()}; });
  function cnt(r,n){return r.eksik.filter(function(e){return e.neden===n;}).length;}
  var totN=rows.reduce(function(a,r){return a+r.toplam;},0), totE=rows.reduce(function(a,r){return a+r.eksik.length;},0), totB=totN-totE;
  var bitenM=rows.filter(function(r){return r.eksik.length===0;}).length;
  var avg=Math.round(rows.reduce(function(a,r){return a+r.yuzde;},0)/(rows.length||1));
  function kpi(ws,c1,c2,row,lab,val,sub,clr){ ws.mergeCells(row,c1,row,c2); ws.mergeCells(row+1,c1,row+1,c2); ws.mergeCells(row+2,c1,row+2,c2);
    var A=ws.getCell(row,c1);A.value=lab;A.font=ft(9,true,'FFFFFFFF');A.fill=fl(clr);A.alignment=CEN;
    var B=ws.getCell(row+1,c1);B.value=val;B.font=ft(18,true,clr);B.alignment=CEN;B.fill=fl(CARD);
    var D=ws.getCell(row+2,c1);D.value=sub;D.font=ft(8.5,false,MUT);D.alignment=CEN;D.fill=fl(CARD); }

  /* ---- ÖZET ---- */
  var ov=wb.addWorksheet('ÖZET',{views:[{showGridLines:false}]});
  [4,30,12,14,10,12,12,13].forEach(function(w,i){ov.getColumn(i+1).width=w;});
  ov.mergeCells('A1:H1'); var a1=ov.getCell('A1'); a1.value='BHS HILLSIDE BODRUM — SAHA MAHAL DURUMU'; a1.font=ft(18,true,'FFFFFFFF'); a1.fill=fl(NAVY); a1.alignment={vertical:'middle',horizontal:'left',indent:1}; ov.getRow(1).height=40;
  ov.mergeCells('A2:H2'); var a2=ov.getCell('A2'); a2.value='Peyzaj Elektrik İmalat İlerlemesi · Rapor tarihi: '+tarih+' · Kaynak: BHS pafta (canlı)'; a2.font=ft(10.5,false,MUT); a2.alignment={horizontal:'left',indent:1}; ov.getRow(2).height=20;
  kpi(ov,1,2,4,'MAHAL',bitenM+' / '+rows.length,'biten mahal',TEAL2);
  kpi(ov,3,4,4,'NOKTA',totB+'/'+totN,'biten nokta',TEAL);
  kpi(ov,5,6,4,'ORT. İLERLEME','%'+avg,'mahal ort.','FFB35E00');
  kpi(ov,7,8,4,'EKSİK',''+totE,'işi kalan',MONTAJ);
  ov.getRow(4).height=16; ov.getRow(5).height=30; ov.getRow(6).height=15;
  ['#','Mahal','İlerleme','Biten/Toplam','Eksik','Montaj yok','Kablo yok','Kablo yarım'].forEach(function(h,j){ var c=ov.getCell(8,j+1); c.value=h; c.font=ft(10,true,'FFFFFFFF'); c.fill=fl(TEAL2); c.alignment=CEN; c.border={top:MED,bottom:MED,left:THIN,right:THIN}; }); ov.getRow(8).height=26;
  rows.forEach(function(r,i){ var rr=9+i; var my=cnt(r,'montaj yok'),ky=cnt(r,'kablo yok'),kr=cnt(r,'kablo yarım');
    [i+1, r.ad, r.yuzde/100, r.biten+'/'+r.toplam, r.eksik.length, my, ky, kr].forEach(function(v,j){ var c=ov.getCell(rr,j+1); c.value=v; c.border=bd(); c.alignment=(j===1?LFT:CEN);
      if(j===0)c.font=ft(10,true,MUT); else if(j===1)c.font=ft(10.5,true,INK); else if(j===2){c.numFmt='0%';c.font=ft(10,true,tc(r.yuzde));} else c.font=ft(10,false,INK); });
    if(my)ov.getCell(rr,6).fill=fl(KIRF); if(ky)ov.getCell(rr,7).fill=fl('FFF6E7E2'); if(kr)ov.getCell(rr,8).fill=fl(SARF); ov.getRow(rr).height=20; });
  var trn=9+rows.length; ['','TOPLAM','',totB+'/'+totN,totE, rows.reduce(function(a,r){return a+cnt(r,'montaj yok');},0), rows.reduce(function(a,r){return a+cnt(r,'kablo yok');},0), rows.reduce(function(a,r){return a+cnt(r,'kablo yarım');},0)].forEach(function(v,j){ var c=ov.getCell(trn,j+1); c.value=v; c.font=ft(10,true,'FFFFFFFF'); c.fill=fl(NAVY); c.alignment=(j===1?LFT:CEN); c.border={top:MED,bottom:MED,left:THIN,right:THIN}; }); ov.getRow(trn).height=22;

  /* ---- MAHAL SAYFALARI ---- */
  rows.forEach(function(r){
    var nm=(r.ad||'Mahal').replace(/[\/\\?*:\[\]]/g,'-').slice(0,31);
    var ws=wb.addWorksheet(nm,{views:[{showGridLines:false}]});
    [4,17,24,15,13,12,12,14,34].forEach(function(w,i){ws.getColumn(i+1).width=w;});
    ws.pageSetup={paperSize:9,orientation:'landscape',fitToPage:true,fitToWidth:1,fitToHeight:0};
    var my=cnt(r,'montaj yok'),ky=cnt(r,'kablo yok'),kr=cnt(r,'kablo yarım'), t2=tc(r.yuzde);
    ws.mergeCells('A1:I1'); var h1=ws.getCell('A1'); h1.value=r.ad; h1.font=ft(16,true,'FFFFFFFF'); h1.fill=fl(t2); h1.alignment={vertical:'middle',horizontal:'left',indent:1}; ws.getRow(1).height=36;
    ws.mergeCells('A2:I2'); var h2=ws.getCell('A2'); h2.value='Peyzaj Elektrik Saha İmalat Durumu · '+tarih+'  ·  '+(r.eksik.length===0?'TAMAMLANDI':'Devam ediyor'); h2.font=ft(10.5,false,MUT); h2.alignment={horizontal:'left',indent:1}; ws.getRow(2).height=20;
    kpi(ws,2,3,4,'TAMAMLANMA','%'+r.yuzde,'montaj+kablo',t2);
    kpi(ws,4,4,4,'BİTEN NOKTA',r.biten+'/'+r.toplam,'tamamlanan',TEAL);
    function scard(col,lab,val,clr){ var A=ws.getCell(4,col);A.value=lab;A.font=ft(8,true,'FFFFFFFF');A.fill=fl(clr);A.alignment=CEN;
      var B=ws.getCell(5,col);B.value=val;B.font=ft(18,true,clr);B.alignment=CEN;B.fill=fl(CARD);
      var D=ws.getCell(6,col);D.value='eksik';D.font=ft(8,false,MUT);D.alignment=CEN;D.fill=fl(CARD); }
    scard(6,'MONTAJ YOK',my,MONTAJ); scard(7,'KABLO YOK',ky,YOK); scard(8,'KABLO YARIM',kr,YARIM);
    ws.getRow(4).height=16; ws.getRow(5).height=28; ws.getRow(6).height=15;
    /* mahal geneli kablo sayacı */
    var mTop={besC:0,besT:0,linC:0,linT:0};
    var uyeAd=(r.uyeler||[]).map(function(u){return (u.t==='db')?('DB '+String(u.k).padStart(2,'0')):String(u.k);});
    var nodeKal={};
    uyeAd.forEach(function(ad){ var nd=_mrNode(ad); var kal=_mrKalemler(nd); nodeKal[ad]=kal;
      var s=_mrOzet(kal); mTop.besC+=s.besC; mTop.besT+=s.besT; mTop.linC+=s.linC; mTop.linT+=s.linT; });
    var kc=ws.getCell(4,9); kc.value='KABLO DURUMU'; kc.font=ft(8,true,'FFFFFFFF'); kc.fill=fl(TEAL2); kc.alignment=CEN;
    var kv=ws.getCell(5,9); kv.value='Besleme '+mTop.besC+'/'+mTop.besT+'   ·   Linye '+mTop.linC+'/'+mTop.linT;
    kv.font=ft(11,true,TEAL2); kv.alignment=CEN; kv.fill=fl(CARD);
    var kd=ws.getCell(6,9); kd.value='çekilen / toplam kalem'; kd.font=ft(8,false,MUT); kd.alignment=CEN; kd.fill=fl(CARD);
    ws.getCell(8,2).value='İlerleme çubuğu'; ws.getCell(8,2).font=ft(9,true,MUT);
    var seg=Math.round(r.yuzde/10);
    for(var g=0;g<10;g++){ var cc=ws.getCell(9,2+g); cc.value=(g===0?('%'+r.yuzde):''); cc.font=ft(9,true,'FFFFFFFF'); cc.alignment=CEN; cc.fill=fl(g<seg?t2:'FFE3E9EF'); cc.border={top:THIN,bottom:THIN,left:{style:'thin',color:{argb:'FFFFFFFF'}},right:{style:'thin',color:{argb:'FFFFFFFF'}}}; }
    ws.getRow(9).height=18;

    /* ---- TABLO 1: EKSİK NOKTALAR (kablo kırılımlı) ---- */
    var t0=12; ws.mergeCells(t0-1,2,t0-1,9); var th=ws.getCell(t0-1,2);
    th.value='EKSİK NOKTALAR ('+r.eksik.length+') — hangi kablo çekildi, hangisi kaldı'; th.font=ft(11,true,INK);
    ['#','Nokta','Tip','Besleyen pano','Montaj','Besleme','Linye','Durum','Eksik kalemler (kesit / linye)'].forEach(function(h,j){
      var c=ws.getCell(t0,j+1); c.value=h; c.font=ft(9.5,true,'FFFFFFFF'); c.fill=fl(NAVY); c.alignment=CEN; c.border={top:MED,bottom:MED,left:THIN,right:THIN}; });
    ws.getRow(t0).height=24;
    if(!r.eksik.length){ ws.mergeCells(t0+1,1,t0+1,9); var ec=ws.getCell(t0+1,1); ec.value='Tüm noktalar tamamlandı — eksik yok'; ec.font=ft(11,true,TAMAM); ec.alignment=CEN; ec.fill=fl(YESF); ws.getRow(t0+1).height=22; }
    r.eksik.forEach(function(e,i){ var rr=t0+1+i, nd=_mrNode(e.ad), kal=nodeKal[e.ad]||_mrKalemler(nd), s=_mrOzet(kal);
      var mont=nd&&nd.o.montaj;
      var ekstr=s.eksik.slice(0,6).join(' · ')+(s.eksik.length>6?(' +'+(s.eksik.length-6)):'');
      var vals=[i+1,e.ad,tip(e.ad),(nd&&nd.o.besleme&&nd.o.besleme.kaynak)||'—',(mont?'VAR':'YOK'),
        s.besC+' / '+s.besT, s.linC+' / '+s.linT, (e.neden||'').toLocaleUpperCase('tr'), (ekstr||'—')];
      vals.forEach(function(v,j){ var c=ws.getCell(rr,j+1); c.value=v; c.border=bd();
        c.alignment=(j===1||j===2||j===3||j===8)?LFT:CEN;
        c.font=(j===1)?ft(10.5,true,INK):ft(9.5,false,(j===8?MUT:INK));
        if(i%2)c.fill=fl(ZEB); });
      ws.getCell(rr,5).fill=fl(mont?YESF:KIRF); ws.getCell(rr,5).font=ft(9.5,true,mont?TAMAM:MONTAJ);
      ws.getCell(rr,6).fill=fl(s.besC>=s.besT?YESF:(s.besC>0?SARF:KIRF));
      ws.getCell(rr,7).fill=fl(s.linC>=s.linT?YESF:(s.linC>0?SARF:KIRF));
      var c8=ws.getCell(rr,8); c8.font=ft(9.5,true,'FFFFFFFF'); c8.fill=fl(dc(e.neden));
      ws.getRow(rr).height=19; });

    /* ---- TABLO 2: KALEM KALEM DÖKÜM (tüm noktalar) ---- */
    var t1=t0+2+Math.max(1,r.eksik.length)+2;
    ws.mergeCells(t1-1,2,t1-1,9); var th2=ws.getCell(t1-1,2);
    th2.value='KABLO KALEMİ DÖKÜMÜ — mahaldeki tüm noktalar, tek tek'; th2.font=ft(11,true,INK);
    ['','Nokta','Kalem (kesit / linye kodu)','Tür','Adet','Metraj (m)','Durum','','Not'].forEach(function(h,j){
      var c=ws.getCell(t1,j+1); c.value=h||null; c.font=ft(9.5,true,'FFFFFFFF'); c.fill=fl(TEAL2); c.alignment=CEN; c.border={top:MED,bottom:MED,left:THIN,right:THIN}; });
    ws.getRow(t1).height=22;
    var rr2=t1+1, zi=0;
    uyeAd.forEach(function(ad){
      var kal=nodeKal[ad]||[], nd=_mrNode(ad), mont=nd&&nd.o.montaj;
      var bas=ws.getCell(rr2,1); bas.value='';
      ws.mergeCells(rr2,1,rr2,9);
      var hc=ws.getCell(rr2,1); hc.value='   '+ad+'   ·   '+tip(ad)+'   ·   montaj: '+(mont?'VAR':'YOK')+'   ·   kaynak: '+((nd&&nd.o.besleme&&nd.o.besleme.kaynak)||'—');
      hc.font=ft(10,true,'FFFFFFFF'); hc.fill=fl(mont?'FF2F5D6E':'FF8E3B2E'); hc.alignment=LFT; ws.getRow(rr2).height=18; rr2++;
      if(!kal.length){ ws.mergeCells(rr2,1,rr2,9); var nc=ws.getCell(rr2,1); nc.value='   (bu noktada tanımlı kablo/linye kalemi yok)'; nc.font=ft(9,false,MUT); nc.alignment=LFT; ws.getRow(rr2).height=16; rr2++; return; }
      kal.forEach(function(k){
        var cek=(k.durum==='cekildi'), rev=(k.durum==='revize'||k.durum==='birlesti');
        var dur=cek?'ÇEKİLDİ':(rev?(k.durum==='revize'?'REVİZE':'BİRLEŞTİ'):'BEKLİYOR');
        var vals=['',ad,k.kalem,k.tur,(k.tur==='Linye'?'':k.adet),(cek&&k.mt?k.mt:''),dur,'',
          (cek?(k.mt?'':'metraj girilmemiş'):(rev?'metraja dahil değil':'yapılacak'))];
        vals.forEach(function(v,j){ var c=ws.getCell(rr2,j+1); c.value=(v===''?null:v); c.border=bd();
          c.alignment=(j===1||j===2||j===3)?LFT:CEN; c.font=ft(9.5,false,INK);
          if(zi%2)c.fill=fl(ZEB); });
        ws.getCell(rr2,6).numFmt='#,##0" m"';
        var dcell=ws.getCell(rr2,7); dcell.font=ft(9,true,'FFFFFFFF');
        dcell.fill=fl(cek?TAMAM:(rev?GRAY:MONTAJ));
        if(!cek&&!rev)ws.getCell(rr2,3).font=ft(9.5,true,MONTAJ);
        ws.getCell(rr2,9).font=ft(8.5,false,MUT);
        ws.getRow(rr2).height=17; rr2++; zi++; });
      var s=_mrOzet(kal);
      ws.mergeCells(rr2,1,rr2,5); var sc=ws.getCell(rr2,1);
      sc.value='   '+ad+' ara toplam:  Besleme '+s.besC+'/'+s.besT+'  ·  Linye '+s.linC+'/'+s.linT;
      sc.font=ft(9,true,MUT); sc.alignment=LFT; sc.fill=fl(CARD);
      for(var q=6;q<=9;q++)ws.getCell(rr2,q).fill=fl(CARD);
      ws.getRow(rr2).height=16; rr2+=2; zi=0; });
    var lg=rr2+1; ws.getCell(lg,2).value='Renk anlamı:'; ws.getCell(lg,2).font=ft(9,true,MUT);
    [['ÇEKİLDİ — imalat yapıldı',TAMAM],['BEKLİYOR — yapılacak',MONTAJ],['REVİZE / BİRLEŞTİ — metraja girmez',GRAY],['Montaj yok',MONTAJ],['Kablo yarım',YARIM]].forEach(function(pr,k){
      var cc=ws.getCell(lg+1+k,2); cc.value=' '; cc.fill=fl(pr[1]); ws.getCell(lg+1+k,3).value=pr[0]; ws.getCell(lg+1+k,3).font=ft(9,false,INK); });
  });
  wb.xlsx.writeBuffer().then(function(buf){ var blob=new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url;
    a.download='BHS_Mahal_Durumu_'+t.toISOString().slice(0,10)+'.xlsx'; document.body.appendChild(a); a.click();
    setTimeout(function(){URL.revokeObjectURL(url);a.remove();},1000); try{toast('✅ Mahal raporu indirildi (kablo kalemli)');}catch(e){} });
}
