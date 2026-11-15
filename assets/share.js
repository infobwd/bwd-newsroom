/* BN-SHARE-2569: approved-news image and text sharing, no LINE tokens. */
(function (host) {
  'use strict';
  const ISSUE_RE=/^WDNEWS-\d{4}-\d{4}$/;
  function issueUrl(issue,base){
    if(!issue || !ISSUE_RE.test(issue.id||''))throw new Error('Invalid issue ID');
    const root=base||new URL('./',document.baseURI).href;
    return new URL('share/'+issue.id+'.html',root).href;
  }
  function dateThai(iso){
    const d=new Date(iso+'T05:00:00Z');
    if(Number.isNaN(d.getTime()))throw new Error('Invalid issue date');
    return new Intl.DateTimeFormat('th-TH-u-ca-buddhist',{
      day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Bangkok'
    }).format(d);
  }
  function message(issue,base){
    const url=issueUrl(issue,base);
    return [
      'จดหมายข่าวประชาสัมพันธ์ WD’NEWS',
      'โรงเรียนบ้านวังด้ง · สพป.กาญจนบุรี เขต 4',
      '',
      'เรื่อง '+issue.title_th,
      'วันที่ '+dateThai(issue.date),
      '',
      String(issue.excerpt_th||'').trim(),
      '',
      'อ่านจดหมายข่าวฉบับเต็มและชมภาพเพิ่มเติม',
      url
    ].filter((s,i,a)=>s!==''||a[i-1]!=='').join('\n');
  }
  function lineTextUrl(issue,base){
    return 'https://line.me/R/share?text='+encodeURIComponent(message(issue,base));
  }
  async function imageFile(issue,page){
    if(!ISSUE_RE.test(issue.id||'')||typeof page.web_image!=='string'||
      !new RegExp('^assets/issues/'+issue.id+'/[A-Za-z0-9._-]+\\.webp$','i').test(page.web_image)||
      page.web_image.includes('..'))throw new Error('Image path not approved');
    const url=new URL('./'+page.web_image,document.baseURI);
    const img=new Image();
    img.decoding='async';
    const loaded=new Promise((resolve,reject)=>{
      img.onload=resolve;
      img.onerror=()=>reject(new Error('Unable to load newsletter image'));
    });
    img.src=url.href;
    await loaded;
    const scale=Math.min(1,2400/Math.max(img.naturalWidth,img.naturalHeight));
    const canvas=document.createElement('canvas');
    canvas.width=Math.round(img.naturalWidth*scale);
    canvas.height=Math.round(img.naturalHeight*scale);
    const context=canvas.getContext('2d');
    if(!context)throw new Error('Image conversion unavailable');
    context.fillStyle='#fff';
    context.fillRect(0,0,canvas.width,canvas.height);
    context.drawImage(img,0,0,canvas.width,canvas.height);
    const blob=await new Promise((resolve,reject)=>{
      canvas.toBlob(output=>output?resolve(output):reject(new Error('JPEG conversion failed')),'image/jpeg',0.91);
    });
    if(blob.type!=='image/jpeg')throw new Error('JPEG conversion not supported');
    return new File([blob],issue.id+'-page-'+String(page.page_no).padStart(2,'0')+'.jpg',
      {type:'image/jpeg',lastModified:Date.now()});
  }
  function prepareFiles(issue){
    if(!issue || issue.status!=='published'||!issue.visibility_approved_at||!issue.published_at||
      !ISSUE_RE.test(issue.id||'')||!Array.isArray(issue.pages)||!issue.pages.length){
      return Promise.reject(new Error('News not published'));
    }
    return Promise.all(issue.pages.slice(0,6).map(page=>imageFile(issue,page)));
  }
  function canShareFiles(files){
    try{return Boolean(files?.length && navigator.share && navigator.canShare &&
      navigator.canShare({files}));}catch(_){return false;}
  }
  function shareFiles(issue,files){
    if(!canShareFiles(files))throw new Error('File sharing unsupported');
    // Must be invoked immediately from a click: do not await fetch or clipboard first.
    return navigator.share({
      files,title:'WD’NEWS · '+issue.title_th,
      text:message(issue),url:issueUrl(issue)
    });
  }
  function downloadFile(file){
    const href=URL.createObjectURL(file);
    const a=document.createElement('a');
    a.href=href;a.download=file.name;document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(href),15000);
  }
  async function copyText(value){
    if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(value);
  }
  const api=Object.freeze({issueUrl,message,lineTextUrl,prepareFiles,canShareFiles,shareFiles,downloadFile,copyText});
  host.BWDShare=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
