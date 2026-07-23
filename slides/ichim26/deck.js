/* Slide engine — fixed 16:9 stage, in-slide fragments, nav, editing, audio, print.
   Keys: ←/→ (Space) step/slide · E edit · Ctrl/Cmd+S export · F fullscreen · P print.
   Fragments: elements with data-frag="k" reveal on the k-th press (same-step values reveal together).
   URL: #n opens slide n · #n.k opens slide n at fragment k · ?print → PDF dialog. */
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
