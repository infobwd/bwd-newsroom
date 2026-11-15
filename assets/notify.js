/* BWD Notify — public UI feedback for News, Gallery, Reader and PWA.
 * No external dependencies, private data, credentials or native alert().
 * The page keeps persistent inline errors for failures that need user action. */
(function (host) {
  'use strict';
  const doc=host.document;
  if(!doc)return;
  const kinds=new Set(['success','error','warning','info']);
  const labels={success:'สำเร็จ',error:'ไม่สำเร็จ',warning:'โปรดตรวจสอบ',info:'แจ้งให้ทราบ'};
  const symbols={success:'✓',error:'!',warning:'!',info:'i'};
  const durations={success:3200,error:6500,warning:5500,info:4000};
  const banners=new Map();

  function kind(value){return kinds.has(value)?value:'info';}
  function node(tag,className,text){
    const el=doc.createElement(tag);
    if(className)el.className=className;
    if(text!==undefined)el.textContent=String(text);
    return el;
  }
  function ensure(root,className){
    let el=Array.from(root.children).find(child=>child.classList?.contains(className));
    if(!el){el=node('div',className);root.append(el);}
    return el;
  }
  function mountRoot(requested){
    return requested && requested.nodeType===1 && requested.isConnected ? requested : doc.body;
  }
  function messageContent(el,type,title,message){
    el.append(node('span','bwd-notify-icon',symbols[type]));
    el.lastChild.setAttribute('aria-hidden','true');
    const copy=node('div','bwd-notify-copy');
    copy.append(node('strong','bwd-notify-title',title || labels[type]));
    copy.append(node('span','bwd-notify-message',message));
    el.append(copy);
  }
  function toast(message,options={}){
    if(!message)return null;
    const type=kind(options.type),root=mountRoot(options.mount);
    const region=ensure(root,'bwd-notify-toasts');
    region.setAttribute('aria-label','การแจ้งเตือนของ BWD Newsroom');
    const key=String(options.key||type+'-'+message);
    for(const existing of Array.from(region.children)){
      if(existing.dataset.key===key)existing.dismissToast?.();
    }
    const item=node('section','bwd-notify-toast');
    item.dataset.type=type;item.dataset.key=key;
    item.setAttribute('role',type==='error'?'alert':'status');
    messageContent(item,type,options.title,message);
    const close=node('button','bwd-notify-dismiss','×');
    close.type='button';close.setAttribute('aria-label','ปิดการแจ้งเตือน');
    item.append(close);
    let timer=0,until=0;
    const duration=options.persistent?0:
      Math.max(1500,Math.min(30000,Number(options.duration)||durations[type]));
    function dismiss(){
      host.clearTimeout(timer);
      item.remove();
      if(!region.children.length)region.remove();
    }
    function start(ms){
      if(!ms)return;
      host.clearTimeout(timer);
      until=Date.now()+ms;
      timer=host.setTimeout(dismiss,ms);
    }
    function pause(){if(!duration)return;host.clearTimeout(timer);}
    function resume(){if(!duration)return;start(Math.max(1200,until-Date.now()));}
    item.dismissToast=dismiss;
    close.addEventListener('click',dismiss);
    item.addEventListener('mouseenter',pause);
    item.addEventListener('mouseleave',resume);
    item.addEventListener('focusin',pause);
    item.addEventListener('focusout',e=>{if(!item.contains(e.relatedTarget))resume();});
    region.append(item);
    while(region.children.length>2)region.firstElementChild.dismissToast?.();
    start(duration);
    return Object.freeze({dismiss});
  }
  function dismissBanner(key){
    const old=banners.get(String(key));
    if(!old)return false;
    old.remove();banners.delete(String(key));
    const stack=doc.body.querySelector('.bwd-notify-banners');
    if(stack && !stack.children.length)stack.remove();
    doc.body.classList.toggle('bwd-has-notify-banner',banners.size>0);
    return true;
  }
  function banner(key,message,options={}){
    if(!key||!message)return null;
    const id=String(key),type=kind(options.type||'info');
    dismissBanner(id);
    const stack=ensure(doc.body,'bwd-notify-banners');
    const item=node('section','bwd-notify-banner');
    item.dataset.type=type;item.dataset.key=id;
    item.setAttribute('role',type==='error'?'alert':'status');
    messageContent(item,type,options.title,message);
    if(options.actionText && typeof options.onAction==='function'){
      const action=node('button','bwd-notify-banner-action',options.actionText);
      action.type='button';
      action.addEventListener('click',options.onAction);
      item.append(action);
    }
    if(options.dismissible){
      const close=node('button','bwd-notify-banner-close','×');
      close.type='button';close.setAttribute('aria-label','ปิดการแจ้งเตือน');
      close.addEventListener('click',()=>dismissBanner(id));
      item.append(close);
    }
    stack.append(item);
    banners.set(id,item);
    doc.body.classList.add('bwd-has-notify-banner');
    return Object.freeze({dismiss:()=>dismissBanner(id)});
  }
  function confirm(options={}){
    // Never approve an irreversible action if <dialog> is unavailable.
    const dialog=node('dialog','bwd-notify-confirm');
    if(typeof dialog.showModal!=='function')return Promise.resolve(false);
    const type=kind(options.type||'warning');
    dialog.dataset.type=type;
    dialog.setAttribute('aria-labelledby','bwd-notify-confirm-title');
    dialog.setAttribute('aria-describedby','bwd-notify-confirm-description');
    const head=node('div','bwd-notify-confirm-head');
    messageContent(head,type,options.title||'ยืนยันการดำเนินการ','');
    const heading=head.querySelector('.bwd-notify-title');
    heading.id='bwd-notify-confirm-title';
    head.querySelector('.bwd-notify-message').remove();
    const details=node('p','bwd-notify-confirm-description',options.message||'ต้องการดำเนินการต่อหรือไม่');
    details.id='bwd-notify-confirm-description';
    const actions=node('div','bwd-notify-confirm-actions');
    const cancel=node('button','bwd-notify-confirm-cancel',options.cancelText||'ยกเลิก');
    cancel.type='button';
    const accept=node('button','bwd-notify-confirm-accept',options.confirmText||'ยืนยัน');
    accept.type='button';
    actions.append(cancel,accept);
    dialog.append(head,details,actions);
    const previous=doc.activeElement;
    return new Promise(resolve=>{
      let settled=false;
      const finish=()=>{
        if(settled)return;
        settled=true;const approved=dialog.returnValue==='accept';
        dialog.remove();
        if(previous?.isConnected)previous.focus?.({preventScroll:true});
        resolve(approved);
      };
      cancel.addEventListener('click',()=>dialog.close('cancel'));
      accept.addEventListener('click',()=>dialog.close('accept'));
      dialog.addEventListener('close',finish,{once:true});
      dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close('cancel');});
      doc.body.append(dialog);
      try{dialog.showModal();cancel.focus();}
      catch(_){dialog.remove();resolve(false);}
    });
  }
  function syncNetwork(){
    if(host.navigator?.onLine===false){
      banner('network-offline','ไม่มีอินเทอร์เน็ต · ข้อมูลข่าวและภาพใหม่อาจไม่พร้อมใช้งาน',{type:'warning',title:'กำลังใช้งานออฟไลน์'});
    }else{
      const wasOffline=dismissBanner('network-offline');
      if(wasOffline)toast('เชื่อมต่ออินเทอร์เน็ตอีกครั้งแล้ว',{type:'success',key:'network-restored'});
    }
  }
  const api=Object.freeze({toast,banner,dismissBanner,confirm});
  host.BWDNotify=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  host.addEventListener('online',syncNetwork);
  host.addEventListener('offline',syncNetwork);
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',syncNetwork,{once:true});
  else syncNetwork();
})(typeof window==='undefined'?globalThis:window);
