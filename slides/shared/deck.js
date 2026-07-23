/* Shared slide engine for every deck under /slides/.
   Fixed 16:9 stage, in-slide fragments, nav, inline editing, verse audio, print, presenter view.

   Load it from a deck folder with  <script src="../shared/deck.js"></script>

   Keys: ←/→ (Space) step/slide · E edit · Ctrl/Cmd+S export · F fullscreen · P print · S presenter.
   Fragments: elements with data-frag="k" reveal on the k-th press (same-step values reveal together);
              elements with data-gold="k" turn gold on step k.
   URL: #n opens slide n · #n.k opens slide n at fragment k · ?print → PDF dialog.
   Slides can listen for the 'deckstep' event to drive their own animations. */
(function(){

  document.body.insertAdjacentHTML('beforeend',
    '<div class="deck-controls"><span class="counter" id="counter">1 / 1</span></div>'+
    '<div class="edit-hotzone"></div>'+
    '<button class="edit-toggle" id="editToggle" title="Edit mode (E)">✏️</button>'+
    '<div class="edit-hint" id="editHint"></div>');

  const parseHash=()=>{const [a,b]=location.hash.slice(1).split('.');return {n:(parseInt(a)||1)-1,s:b===undefined?null:parseInt(b)};};

  class Deck{
    constructor(){
      this.slides=[...document.querySelectorAll('.slide')];
      this.stage=document.getElementById('deckStage');
      this.counter=document.getElementById('counter');
      this.i=0; this.step=0; this.steps=[];
      this.scale();
      addEventListener('resize',()=>this.scale());
      this.keys(); this.touch(); this.wheel();
      window.deck=this;
      const {n,s}=parseHash(); this.show(n,s);
      addEventListener('hashchange',()=>{const{n,s}=parseHash();if(n!==this.i||(s||0)!==this.step)this.show(n,s);});
    }
    scale(){
      const f=Math.min(innerWidth/1920,innerHeight/1080);
      this.stage.style.transform=`translate(${(innerWidth-1920*f)/2}px,${(innerHeight-1080*f)/2}px) scale(${f})`;
    }
    applyFrags(){
      const max=this.step>0?this.steps[this.step-1]:-1;
      const s=this.slides[this.i];
      s.querySelectorAll('[data-frag]').forEach(el=>el.classList.toggle('frag-in',+el.dataset.frag<=max));
      s.querySelectorAll('[data-gold]').forEach(el=>el.classList.toggle('gold',+el.dataset.gold<=max));
      s.dispatchEvent(new CustomEvent('deckstep',{detail:{step:this.step}}));
    }
    show(n,step){
      this.i=Math.max(0,Math.min(n,this.slides.length-1));
      this.slides.forEach((s,k)=>{s.classList.toggle('active',k===this.i);s.classList.toggle('visible',k===this.i);});
      const slide=this.slides[this.i];
      this.steps=[...new Set([...slide.querySelectorAll('[data-frag]')].map(e=>+e.dataset.frag))].sort((a,b)=>a-b);
      this.step=step==null?0:step<0?this.steps.length:Math.max(0,Math.min(step,this.steps.length));
      this.applyFrags();
      this.counter.textContent=`${this.i+1} / ${this.slides.length}`;
      this.sync();
    }
    sync(){
      const h='#'+(this.i+1)+(this.step>0?'.'+this.step:'');
      if(location.hash!==h)history.replaceState(null,'',h);
      dispatchEvent(new CustomEvent('deck:change',{detail:{i:this.i,step:this.step,total:this.slides.length}}));
    }
    next(){ if(this.step<this.steps.length){this.step++;this.applyFrags();this.sync();} else this.show(this.i+1,0); }
    prev(){ if(this.step>0){this.step--;this.applyFrags();this.sync();} else this.show(this.i-1,-1); }
    keys(){
      addEventListener('keydown',e=>{
        if(e.target.isContentEditable)return;
        if(['ArrowRight','ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();this.next();}
        else if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();this.prev();}
        else if(e.key==='Home')this.show(0,0);
        else if(e.key==='End')this.show(this.slides.length-1,-1);
      });
    }
    touch(){
      let x0=null;
      addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});
      addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>60)(dx<0?this.next():this.prev());x0=null;},{passive:true});
    }
    wheel(){
      let lock=false;
      addEventListener('wheel',e=>{if(lock||Math.abs(e.deltaY)<30)return;lock=true;(e.deltaY>0?this.next():this.prev());setTimeout(()=>lock=false,700);},{passive:true});
    }
  }
  window.deck=new Deck();

  /* play a verse recording; the same control toggles to pause and back */
  let audio=null, audioBtn=null;
  const pauseLabel=s=>s.replace('▶','⏸').replace(/play.*/i,'pause');
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-audio]'); if(!b)return;
    if(!b.dataset.playlabel)b.dataset.playlabel=b.innerHTML;   // remember "play" label once
    if(b===audioBtn&&audio){                                   // same control → pause / resume
      if(audio.paused){audio.play().catch(()=>{});b.innerHTML=pauseLabel(b.dataset.playlabel);}
      else{audio.pause();b.innerHTML=b.dataset.playlabel;}
      return;
    }
    if(audio)audio.pause();                                    // switching recordings
    if(audioBtn)audioBtn.innerHTML=audioBtn.dataset.playlabel;
    audio=new Audio(b.getAttribute('data-audio')); audioBtn=b;
    b.innerHTML=pauseLabel(b.dataset.playlabel); audio.play().catch(()=>{});
    audio.addEventListener('ended',()=>{b.innerHTML=b.dataset.playlabel;if(audioBtn===b){audio=null;audioBtn=null;}});
  });

  /* inline editing — edits persist to this browser; Ctrl+S exports a clean copy */
  const editor={
    active:false,
    fields:[...document.querySelectorAll('[data-edit]')],
    KEY:'deck-edits:'+location.pathname,
    init(){this.fields.forEach((el,i)=>el.dataset.k=i);this.restore();this.fields.forEach(el=>el.addEventListener('input',()=>this.save()));},
    toggle(){
      this.active=!this.active;
      document.body.classList.toggle('editing',this.active);
      this.fields.forEach(el=>el.contentEditable=this.active);
      document.getElementById('editToggle').classList.toggle('active',this.active);
      hint(this.active?'Edit mode on — click any text. Ctrl+S saves a copy. Press E to exit.':'Edit mode off.');
    },
    save(){const d={};this.fields.forEach(el=>d[el.dataset.k]=el.innerHTML);localStorage.setItem(this.KEY,JSON.stringify(d));},
    restore(){try{const d=JSON.parse(localStorage.getItem(this.KEY)||'{}');this.fields.forEach(el=>{if(d[el.dataset.k]!=null)el.innerHTML=d[el.dataset.k];});}catch(e){}},
    export(){
      const clone=document.documentElement.cloneNode(true);
      clone.querySelectorAll('[contenteditable]').forEach(el=>el.removeAttribute('contenteditable'));
      clone.querySelectorAll('.editing').forEach(el=>el.classList.remove('editing'));
      clone.querySelectorAll('.deck-controls,.edit-hotzone,.edit-toggle,.edit-hint').forEach(el=>el.remove());
      const name=(location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'slides')+'-export.html';
      const a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob(['<!DOCTYPE html>\n'+clone.outerHTML],{type:'text/html'}));
      a.download=name; a.click(); hint('Saved a copy: '+name);
    }
  };
  editor.init();

  const toggleBtn=document.getElementById('editToggle'), hotzone=document.querySelector('.edit-hotzone');
  let hideT=null;
  const hideBtn=()=>{hideT=setTimeout(()=>{if(!editor.active)toggleBtn.classList.remove('show');},400);};
  toggleBtn.addEventListener('click',()=>editor.toggle());
  hotzone.addEventListener('click',()=>editor.toggle());
  hotzone.addEventListener('mouseenter',()=>{clearTimeout(hideT);toggleBtn.classList.add('show');});
  hotzone.addEventListener('mouseleave',hideBtn);
  toggleBtn.addEventListener('mouseenter',()=>clearTimeout(hideT));
  toggleBtn.addEventListener('mouseleave',hideBtn);

  addEventListener('keydown',e=>{
    const editing=e.target.isContentEditable;
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();editor.export();return;}
    if(editing)return;
    if(e.key==='e'||e.key==='E')editor.toggle();
    else if(e.key==='f'||e.key==='F')document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
    else if(e.key==='p'||e.key==='P'){e.preventDefault();window.print();}
  });

  if(location.search.includes('print')){
    (document.fonts?document.fonts.ready:Promise.resolve()).then(()=>setTimeout(()=>window.print(),300));
  }

  let hintT=null;
  function hint(msg){
    const h=document.getElementById('editHint');
    h.textContent=msg;h.classList.add('show');
    clearTimeout(hintT);hintT=setTimeout(()=>h.classList.remove('show'),3200);
  }
})();

/* Speaker notes + PowerPoint-style presenter view.
   Roles by URL:  default = projector / driver · ?present = presenter UI · ?follow = live preview.
   Press S in the deck to open the presenter; windows sync over BroadcastChannel + localStorage,
   and notes are editable in the presenter (saved to this browser). */
(function(){
  const PATH=location.pathname, BUS='deck-bus:'+PATH, NKEY='deck-notes:'+PATH, QS=location.search;
  const present=/[?&]present\b/.test(QS), follow=/[?&]follow\b/.test(QS), isNext=/[?&]next\b/.test(QS);
  const driver=!present&&!follow;
  let bc=null; try{bc=new BroadcastChannel('deck'+PATH);}catch(e){}
  const seen=new Set();
  const post=m=>{ m=Object.assign({_id:Date.now()+'.'+Math.random()},m); if(bc)bc.postMessage(m); try{localStorage.setItem(BUS,JSON.stringify(m));}catch(e){} };
  const listen=fn=>{ const h=m=>{ if(m&&m._id){ if(seen.has(m._id))return; seen.add(m._id); if(seen.size>60)seen.delete(seen.values().next().value); } fn(m); };
    if(bc)bc.addEventListener('message',e=>h(e.data)); addEventListener('storage',e=>{ if(e.key===BUS&&e.newValue){try{h(JSON.parse(e.newValue));}catch(_){}} }); };
  const slides=[...document.querySelectorAll('.slide')];
  const clamp=i=>Math.max(0,Math.min(i,slides.length-1));
  const seed=i=>{const a=slides[i]&&slides[i].querySelector('.notes');return a?a.textContent.trim():'';};
  const loadN=()=>{try{return JSON.parse(localStorage.getItem(NKEY)||'{}');}catch(e){return{};}};
  const noteFor=i=>{const o=loadN();return o[i]!=null?o[i]:seed(i);};
  const labelFor=i=>{const s=slides[i];if(!s)return '';const t=s.querySelector('.stitle');return (t?t.textContent:(s.dataset.label||'Slide '+(i+1))).trim();};

  if(driver){
    addEventListener('deck:change',e=>post({t:'state',i:e.detail.i,step:e.detail.step,total:e.detail.total}));
    listen(m=>{ const d=window.deck; if(!d)return;
      if(m.t==='hello')post({t:'state',i:d.i,step:d.step,total:d.slides.length});
      else if(m.t==='nav')m.d>0?d.next():d.prev();
    });
    addEventListener('keydown',e=>{ if(e.target.isContentEditable)return;
      if(e.key==='s'||e.key==='S'){e.preventDefault();window.open(PATH+'?present'+location.hash,'presenter','width=1300,height=820');}
    });
    return;
  }

  if(follow){
    const d=window.deck; if(!d)return;
    const show=d.show.bind(d);
    d.next=()=>post({t:'nav',d:1}); d.prev=()=>post({t:'nav',d:-1});
    listen(m=>{ if(m.t==='state') isNext?show(clamp(m.i+1),0):show(m.i,m.step); });
    post({t:'hello'});
    return;
  }

  /* presenter UI */
  document.body.classList.add('presenting');
  const host=document.createElement('div'); host.id='presenter';
  host.innerHTML=
     '<header><span class="clock" id="pClock">00:00</span><span class="pos" id="pPos"></span><button id="pReset">reset timer</button></header>'
    +'<div class="pmain">'
    +'<div class="pcurrent"><div class="plabel">Now · <span id="pTitle"></span></div><iframe id="pCur" title="current slide"></iframe></div>'
    +'<div class="pside">'
    +'<div class="pnextwrap"><div class="plabel">Next · <span id="pNextTitle"></span></div><iframe id="pNextF" title="next slide"></iframe></div>'
    +'<div class="pnotes"><div class="plabel">Notes</div><textarea id="pNotes" placeholder="speaker notes…"></textarea></div>'
    +'</div></div>'
    +'<footer><button id="pPrev">← Prev</button><button id="pNext">Next →</button><span class="phint">edits save to this browser</span></footer>';
  document.body.appendChild(host);
  const q=id=>host.querySelector(id);
  q('#pCur').src=PATH+'?follow'+location.hash;
  q('#pNextF').src=PATH+'?follow&next';
  const elClock=q('#pClock'),elPos=q('#pPos'),elTitle=q('#pTitle'),elNT=q('#pNextTitle'),elNotes=q('#pNotes');
  let cur=0,total=slides.length;
  const render=i=>{cur=i;elPos.textContent=(i+1)+' / '+total;elTitle.textContent=labelFor(i);
    elNT.textContent=i+1<total?labelFor(i+1):'(end of deck)';
    if(document.activeElement!==elNotes)elNotes.value=noteFor(i);};
  elNotes.addEventListener('input',()=>{const o=loadN();o[cur]=elNotes.value;try{localStorage.setItem(NKEY,JSON.stringify(o));}catch(e){}});
  const nav=d=>post({t:'nav',d});
  q('#pPrev').onclick=()=>nav(-1); q('#pNext').onclick=()=>nav(1);
  addEventListener('keydown',e=>{ if(e.target===elNotes)return;
    if(['ArrowRight','ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();nav(1);}
    else if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();nav(-1);}
  });
  let t0=Date.now();
  const tick=()=>{const s=Math.floor((Date.now()-t0)/1000);elClock.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');};
  setInterval(tick,1000);tick(); q('#pReset').onclick=()=>{t0=Date.now();tick();};
  listen(m=>{ if(m.t==='state'){total=m.total||total;render(m.i);} });
  post({t:'hello'}); render(0);
})();
