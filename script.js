let TODAY=(()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`})();
let dashboardUnlocked=false;
const cap=250,other=100;
const branches=['Computer Science and Engineering with AI','Computer Science and Engineering','Mechanical Engineering','Electrical and Electronics Engineering','Civil Engineering','Chemical Engineering'];
function validBranch(value){return branches.includes(value)?value:/computer science/i.test(value||'')?branches[1]:''}
const subjects=['Chemistry','Mathematics','Engineering Graphics','Lifeskill','Physics','History','Algorithmic thinking with Python','Electronics and Electrical Engineering','Basic Electronics and Engineering'];
let files=[
 {id:1,name:'Thermodynamics lecture 7.pdf',s:'Physics',mb:8.4,up:'2026-09-29',open:'2026-09-30',unread:true,star:true},
 {id:2,name:'Graph algorithms slides.pptx',s:'Algorithmic thinking with Python',mb:22.1,up:'2026-09-28',open:'2026-09-29',unread:true,star:false},
 {id:3,name:'Integration practice set.pdf',s:'Mathematics',mb:3.2,up:'2026-09-27',open:'2026-09-30',unread:false,star:true},
 {id:4,name:'Reaction mechanisms notes.docx',s:'Chemistry',mb:1.9,up:'2026-09-26',open:'2026-09-25',unread:true,star:true},
 {id:5,name:'Industrial revolution timeline.png',s:'History',mb:4.6,up:'2026-09-24',open:'2026-09-22',unread:false,star:false},
 {id:6,name:'Past paper 2025.pdf',s:'Physics',mb:12.7,up:'2026-09-22',open:'2026-09-28',unread:false,star:true},
 {id:7,name:'Binary trees cheat sheet.pdf',s:'Algorithmic thinking with Python',mb:1.1,up:'2026-09-20',open:'2026-09-27',unread:true,star:false},
 {id:8,name:'Limits and continuity.pptx',s:'Mathematics',mb:18.3,up:'2026-09-18',open:null,unread:true,star:false}];
const exams=[{n:'Physics midterm',s:'Physics',d:'2026-10-05'},{n:'Mathematics quiz 2',s:'Mathematics',d:'2026-10-09'},{n:'Algorithmic Thinking with Python test',s:'Algorithmic thinking with Python',d:'2026-10-14'},{n:'Chemistry midterm',s:'Chemistry',d:'2026-10-21'}];
let tab='attention',subj=null,query='',newId=null;
let trash=[
 {id:21,name:'Old exam paper 2023.pdf',s:'Physics',mb:6.5,up:'2026-09-10',open:'2026-09-12',unread:false,star:false,del:'2026-09-27'},
 {id:22,name:'Draft notes.docx',s:'History',mb:0.8,up:'2026-09-05',open:null,unread:false,star:false,del:'2026-09-15'}];
const $=id=>document.getElementById(id);
const NOTES_KEY='sv-quick-notes',ASSIGNMENTS_KEY='sv-assignments',NOTIFICATION_LOG_KEY='sv-notification-log';
function readSavedList(key,valid){
 try{
  const saved=JSON.parse(localStorage.getItem(key)||'[]');
  if(!Array.isArray(saved)||saved.some(item=>!valid(item)))throw new Error('Saved data has an invalid format.');
  return saved;
 }catch(error){console.error(`Could not read ${key}:`,error);toast('Some saved study data could not be read from this browser.');return []}
}
let quickNotes=readSavedList(NOTES_KEY,n=>n&&typeof n.id==='string'&&typeof n.title==='string'&&typeof n.text==='string'&&typeof n.subject==='string');
let assignments=readSavedList(ASSIGNMENTS_KEY,a=>a&&typeof a.id==='string'&&typeof a.title==='string'&&typeof a.due==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(a.due)&&typeof a.subject==='string');
let notificationLog=readSavedList(NOTIFICATION_LOG_KEY,n=>n&&typeof n==='string');
const dateNumber=d=>{const[y,m,day]=d.split('-').map(Number);return Date.UTC(y,m-1,day)};
const days=d=>Math.round((dateNumber(d)-dateNumber(TODAY))/864e5);
const ago=d=>{const n=-days(d);return n<=0?'today':n===1?'yesterday':n+' days ago'};
const ext=n=>{const m=n.match(/\.([a-z0-9]{2,4})$/i);return m?m[1].toUpperCase():'LINK'};
const used=()=>files.concat(trash).reduce((a,f)=>a+f.mb,0)+other;
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;$('toasts').appendChild(t);setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300)},2200)}
function toastUndo(m,fn){const t=document.createElement('div');t.className='toast';const s=document.createElement('span');s.textContent=m;const b=document.createElement('button');b.className='act';b.textContent='Undo';t.append(s,b);$('toasts').appendChild(t);
 const end=()=>{t.classList.add('out');setTimeout(()=>t.remove(),300)};b.onclick=()=>{clearTimeout(tm);t.remove();fn()};const tm=setTimeout(end,5000)}
function count(el,to){const from=+el.dataset.v||0;el.dataset.v=to;if(from===to){el.textContent=to;return}
 const t0=performance.now();(function s(t){const p=Math.min(1,(t-t0)/700),e=1-Math.pow(1-p,3);el.textContent=Math.round(from+(to-from)*e);if(p<1)requestAnimationFrame(s)})(t0)}
function summary(){
 const bn=$('binN'),n=trash.length;
 if(bn.textContent!==String(n)){bn.textContent=n;bn.classList.remove('bump');void bn.offsetWidth;bn.classList.add('bump')}
 bn.classList.toggle('zero',n===0);
 $('binBtn').setAttribute('aria-label','Open recycle bin, '+n+(n===1?' file':' files'));
 const un=files.filter(f=>f.unread).length,st=files.filter(f=>f.star).length,nx=Math.min(...exams.map(e=>days(e.d)));
 count($('s1'),files.length);count($('s2'),un);count($('s3'),st);count($('s4'),nx);
 const h=new Date().getHours();$('hello').textContent=(h<12?'Good morning':h<18?'Good afternoon':'Good evening')+(profile.name?', '+profile.name.split(' ')[0]:'');
 $('sub').textContent=un?`You have ${un} file${un>1?'s':''} to read. Your next exam is in ${nx} days.`:'You have read everything. Nice work.';
 const r=files.filter(f=>f.open).sort((a,b)=>b.open.localeCompare(a.open))[0]||files[0];
 $('resume').innerHTML=!r?'<div><b>No files yet</b><br><span class="meta">Add a file to start studying.</span></div>':`<div><span class="meta">Continue where you left off</span><br><b>${r.name}</b><br><span class="meta">${r.s}, last opened ${r.open?ago(r.open):'never'}</span></div><button class="btn" data-open="${r.id}">Open file</button>`;
 $('exams').innerHTML=[...exams].sort((a,b)=>a.d.localeCompare(b.d)).map(e=>{const d=days(e.d),n=files.filter(f=>f.s===e.s&&f.unread).length;
  return `<div class="exam"><div class="days ${d<=7?'soon':''}"><b>${d}</b><small>days</small></div><div class="t"><b>${e.n}</b><span class="meta">${n?n+' file'+(n>1?'s':'')+' still unread':'All files read'}</span></div><button class="act" data-subj="${e.s}">Study</button></div>`}).join('');
 const u=used(),p=Math.round(100*u/cap),big=[...files].sort((a,b)=>b.mb-a.mb)[0];
 $('storage').innerHTML=`<div><b>${u.toFixed(0)} MB</b> <span class="meta">of ${cap} MB used (${p}%)</span></div><div class="track"><div class="fill" id="fill" style="background:${p>85?'var(--warn)':'var(--ok)'}"></div></div><div class="meta" style="margin-bottom:14px">${p>85?'Space is almost full. ':''}${big?'Biggest file: '+big.name+' ('+big.mb+' MB)':'No files yet.'}${trash.length?'. Recycle bin: '+trash.reduce((a,f)=>a+f.mb,0).toFixed(1)+' MB, empty it to free space.':''}</div>`;
 requestAnimationFrame(()=>requestAnimationFrame(()=>{const f=$('fill');if(f)f.style.width=p+'%'}));
}
function lists(){
 const tabs=[['attention','Needs attention'],['added','Recently added'],['opened','Recently opened'],['all','All']];
 $('tabs').innerHTML=tabs.map(([k,l])=>`<button class="chip" role="tab" aria-selected="${tab===k}" data-tab="${k}">${l}</button>`).join('');
 $('subjects').innerHTML=subjects.map(s=>`<button class="subjectTile" type="button" aria-pressed="${subj===s}" data-subj="${s}"><span class="subjectTileIndex" aria-hidden="true"></span><span class="subjectTileName">${s}</span><span class="subjectTileArrow" aria-hidden="true">View files</span></button>`).join('');
 let v=files.filter(f=>(!subj||f.s===subj)&&(f.name+f.s).toLowerCase().includes(query));
 if(tab==='attention')v=v.filter(f=>f.unread||f.star).sort((a,b)=>b.star-a.star||b.unread-a.unread);
 if(tab==='added')v=v.sort((a,b)=>b.up.localeCompare(a.up)||b.id-a.id).slice(0,6);
 if(tab==='opened')v=v.filter(f=>f.open).sort((a,b)=>b.open.localeCompare(a.open)).slice(0,6);
 $('list').innerHTML=v.length?v.map(f=>`<div class="file ${f.id===newId?'new':''}"><div class="ext">${ext(f.name)}</div><div class="t"><b>${f.unread?'<span class="dot" title="Not read yet"></span>':''}${f.name}</b><span class="meta">${f.s}, ${f.url?'Link':f.mb+' MB'}, added ${ago(f.up)}</span>${f.info?`<span class="meta info">${infoLine(f.info)}</span>`:''}</div><button class="star" data-star="${f.id}" aria-pressed="${f.star}" aria-label="Star ${f.name}">${f.star?'★':'☆'}</button>${f.info?`<button class="act" data-info="${f.id}">Details</button>`:''}<button class="act" data-open="${f.id}">Open</button><button class="act danger" data-del="${f.id}" aria-label="Delete ${f.name}">Delete</button></div>`).join(''):`<div class="empty">Nothing here yet. ${query||subj?'Try clearing your search or subject.':'Add a file to get started.'}</div>`;
 newId=null;
}
function renderRecycleBin(){
 const list=$('recycleList');
 list.innerHTML=trash.length?`<div class="binbar"><span class="meta">${trash.length} deleted file${trash.length===1?'':'s'}</span><button class="act danger" data-empty="1">Empty bin</button></div>`+trash.map(f=>`<div class="file"><div class="ext">${ext(f.name)}</div><div class="t"><b>${f.name}</b><span class="meta">${f.s}, ${f.url?'Link':f.mb+' MB'}, deleted ${ago(f.del)}, ${30+days(f.del)} days left</span></div><button class="act" data-restore="${f.id}">Restore</button><button class="act danger" data-purge="${f.id}">Delete forever</button></div>`).join(''):'<div class="empty">The recycle bin is empty.</div>';
}
function all(){refreshAssistantScope();summary();lists();if($('recycleDialog').open)renderRecycleBin()}
document.addEventListener('click',e=>{
 const inf=e.target.closest('[data-info]');if(inf){details(inf.dataset.info);return}
 const dl=e.target.closest('[data-del]');if(dl){const id=dl.dataset.del;dl.closest('.file').classList.add('out');
  setTimeout(()=>{const i=files.findIndex(x=>x.id==id),f=files.splice(i,1)[0];f.del=TODAY;trash.unshift(f);
   toastUndo('Moved to recycle bin',()=>{trash.splice(trash.indexOf(f),1);delete f.del;files.unshift(f);toast('Restored '+f.name);all()});all()},280);return}
 const rs=e.target.closest('[data-restore]');if(rs){const i=trash.findIndex(x=>x.id==rs.dataset.restore),f=trash.splice(i,1)[0];delete f.del;files.unshift(f);toast('Restored '+f.name);all();return}
 const pg=e.target.closest('[data-purge],[data-empty]');if(pg){
  if(!pg.dataset.arm){pg.dataset.arm=1;const t=pg.textContent;pg.textContent='Click again to confirm';setTimeout(()=>{if(pg.isConnected){delete pg.dataset.arm;pg.textContent=t}},3000);return}
  if(pg.dataset.empty){trash=[];toast('Recycle bin emptied')}else{trash=trash.filter(x=>x.id!=pg.dataset.purge);toast('Deleted for good')}all();return}
 const o=e.target.closest('[data-open]');if(o){const f=files.find(x=>x.id==o.dataset.open);f.open=TODAY;f.unread=false;toast('Opened '+f.name);if($('dlg').open)$('dlg').close();if(f.url)window.open(f.url,'_blank','noopener');else if(f.blob)window.open(URL.createObjectURL(f.blob),'_blank');all();return}
 const s=e.target.closest('[data-star]');if(s){const f=files.find(x=>x.id==s.dataset.star);f.star=!f.star;toast(f.star?'Starred':'Star removed');all();return}
 const t=e.target.closest('[data-tab]');if(t){tab=t.dataset.tab;lists();return}
 const j=e.target.closest('[data-subj]');if(j){subj=subj===j.dataset.subj?null:j.dataset.subj;if(j.classList.contains('act')){tab='all';$('list').scrollIntoView({behavior:'smooth',block:'center'});toast('Showing '+subj+' files')}else if(j.closest('#subjects')&&tab!=='bin'){tab='all'}lists()}
});
$('q').oninput=e=>{query=e.target.value.toLowerCase();if(query)tab='all';lists()};
const OK=['pdf','doc','docx','ppt','pptx','png','jpg','jpeg','gif','webp','zip','txt','md','csv'],MAXMB=25,CDN='https://cdnjs.cloudflare.com/ajax/libs/';
let uid=100;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dec=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&');
const STOP=new Set('the and for with that this from are was were been have has had not but you your our their they them its into than then these those which what when where how can will would should could may might also more most such other about over under between each any all one two using use used does did very explain simple terms topic topics important material materials uploaded notes file files please give create generate summarize summary questions question marks mcq based unit chapter'.split(' '));
const SUBJECT_TERMS={
 'Chemistry':'chemistry chemical reaction molecule atom organic inorganic acid base compound bond stoichiometry periodic equilibrium',
 'Mathematics':'mathematics math calculus algebra integral derivative equation limit matrix probability statistics trigonometry',
 'Engineering Graphics':'graphics drawing orthographic isometric projection dimensioning drafting autocad solidworks sectioning',
 'Lifeskill':'lifeskill lifeskills communication leadership teamwork aptitude interview presentation personality ethics resume employability',
 'Physics':'physics force energy thermodynamics velocity momentum quantum wave entropy newton electric magnetic heat temperature pressure gravity',
 'History':'history war revolution empire century treaty dynasty industrial colonial independence civilization',
 'Algorithmic thinking with Python':'algorithmic thinking python algorithm programming code flowchart pseudocode loop function data structure recursion sorting',
 'Electronics and Electrical Engineering':'electronics electrical circuit transformer generator motor current voltage power semiconductor transistor diode electromagnetism',
 'Basic Electronics and Engineering':'basic workshop materials mechanics manufacturing measurement basics'
};
const SUBJECT_PHRASES={
 'Engineering Graphics':['engineering graphics','engineering drawing'],
 'Lifeskill':['life skill','life skills','soft skill','soft skills'],
 'Algorithmic thinking with Python':['algorithmic thinking','python programming'],
 'Electronics and Electrical Engineering':['electronics and electrical engineering','electrical engineering'],
 'Basic Electronics and Engineering':['basic electronics','basic electronics and engineering','basic engineering']
};
const libs={};
const load=u=>libs[u]||(libs[u]=new Promise((ok,no)=>{const t=document.createElement('script');t.src=u;t.onload=ok;t.onerror=()=>{delete libs[u];no(new Error('lib'))};document.head.appendChild(t)}));
const wordsOf=t=>t.toLowerCase().match(/[a-z][a-z'-]{2,}/g)||[];
function analyze(text,name){
 const w=wordsOf(text),n=(text.match(/\S+/g)||[]).length,freq={};
 w.forEach(x=>{if(!STOP.has(x))freq[x]=(freq[x]||0)+1});
 const keywords=Object.entries(freq).filter(([k,c])=>c>1||w.length<40).sort((a,b)=>b[1]-a[1]).slice(0,6).map(x=>x[0]);
 const sents=(text.replace(/\s+/g,' ').match(/[^.!?]{25,240}[.!?]/g)||[]).map((t,i)=>{const ws=wordsOf(t);return{i,t:t.trim(),v:ws.reduce((a,x)=>a+(freq[x]||0),0)/Math.sqrt(ws.length||1)-i*.01}});
 const summary=sents.sort((a,b)=>b.v-a.v).slice(0,2).sort((a,b)=>a.i-b.i).map(x=>x.t);
 const normalize=t=>' '+t.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()+' ';
 const nameText=normalize(name.replace(/\.[^.]+$/,'')),contentText=normalize(text),nameWords=new Set(wordsOf(nameText)),contentWords=new Set(w);
 const hasTerm=(set,term)=>set.has(term)||set.has(term+'s')||set.has(term+'es')||(term.endsWith('y')&&set.has(term.slice(0,-1)+'ies'));
 let best=null,bs=0,bestHasNameMatch=false,bestContentMatches=0;
 for(const [subject,termsText] of Object.entries(SUBJECT_TERMS)){
  const terms=termsText.split(' '),nameMatches=terms.filter(term=>hasTerm(nameWords,term)).length,contentMatches=terms.filter(term=>hasTerm(contentWords,term)).length;
  const subjectPhrase=normalize(subject),phrases=[subject,...(SUBJECT_PHRASES[subject]||[])].map(normalize),phraseInName=phrases.some(phrase=>nameText.includes(phrase)),phraseInContent=phrases.some(phrase=>contentText.includes(phrase));
  const score=nameMatches*3+contentMatches+(phraseInName?12:0)+(phraseInContent?6:0);
  if(score>bs){bs=score;best=subject;bestHasNameMatch=nameMatches>0||phraseInName;bestContentMatches=contentMatches+(phraseInContent?1:0)}
 }
 return{words:n,minutes:Math.max(1,Math.round(n/200)),keywords,summary,guess:best&&(bestHasNameMatch||bestContentMatches>=2)?best:null}
}
function infoLine(i){const p=[];if(i.count)p.push(i.count.toLocaleString()+' '+i.unit);if(i.words)p.push(i.words.toLocaleString()+' words, '+i.minutes+' min read');if(i.dims)p.push(i.dims);return p.length?p.join(', '):i.kind}
async function extract(fl,e){
 if(['txt','md','csv'].includes(e))return{text:(await fl.text()).slice(0,2e6),kind:'Text file'};
 if(e==='pdf'){await load(CDN+'pdf.js/3.11.174/pdf.min.js');pdfjsLib.GlobalWorkerOptions.workerSrc=CDN+'pdf.js/3.11.174/pdf.worker.min.js';
  const d=await pdfjsLib.getDocument({data:new Uint8Array(await fl.arrayBuffer())}).promise,m=Math.min(d.numPages,40);let t='';
  for(let i=1;i<=m;i++){const c=await(await d.getPage(i)).getTextContent();t+=c.items.map(x=>x.str).join(' ')+'\n'}
  return{text:t,kind:'PDF document',count:d.numPages,unit:'pages',notes:[m<d.numPages?'Analysed the first '+m+' pages.':'',t.trim()?'':'No selectable text was found. This may be a scanned PDF.'].filter(Boolean)}}
 if(e==='docx'){await load(CDN+'mammoth/1.6.0/mammoth.browser.min.js');return{text:(await mammoth.extractRawText({arrayBuffer:await fl.arrayBuffer()})).value,kind:'Word document'}}
 if(e==='pptx'){await load(CDN+'jszip/3.10.1/jszip.min.js');const z=await JSZip.loadAsync(fl),names=Object.keys(z.files).filter(n=>/^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a,b)=>a.match(/\d+/)-b.match(/\d+/)),titles=[];let t='';
  for(const n of names){const parts=[...(await z.file(n).async('string')).matchAll(/<a:t>([^<]*)<\/a:t>/g)].map(m=>dec(m[1]));if(parts[0]&&titles.length<6)titles.push(parts[0]);t+=parts.join(' ')+'\n'}
  return{text:t,kind:'Presentation',count:names.length,unit:'slides',list:titles,listLabel:'Slide titles'}}
 if(e==='doc'||e==='ppt')return{text:'',kind:e==='doc'?'Word document (older format)':'Presentation (older format)',notes:['Older .doc and .ppt files cannot be read automatically. Save them as .docx or .pptx to get a summary.']};
 if(e==='zip'){await load(CDN+'jszip/3.10.1/jszip.min.js');const z=await JSZip.loadAsync(fl),all=Object.values(z.files).filter(f=>!f.dir),types={};let t='';
  all.forEach(f=>{const x=f.name.split('.').pop().toLowerCase();types[x]=(types[x]||0)+1});
  for(const f of all.filter(f=>/\.(txt|md|csv)$/i.test(f.name)).slice(0,5))t+=(await f.async('string')).slice(0,1e5)+'\n';
  return{text:t,kind:'ZIP archive',count:all.length,unit:'files inside',list:all.slice(0,8).map(f=>f.name),listLabel:'Contents',notes:['File types: '+Object.entries(types).slice(0,6).map(([k,v])=>v+' .'+k).join(', ')+'.']}}
 const u=URL.createObjectURL(fl),im=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=u});
 return{text:'',kind:'Image',dims:im.naturalWidth+' x '+im.naturalHeight+' px',thumb:u,notes:['Text inside images is not read automatically.']}
}
function build(name,x,size,extra,id){
 const a=analyze(x.text||'',name),kw=a.keywords.length?a.keywords:analyze(name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' '),'').keywords;
 const s=a.guess||'General';
 return{id,name:esc(name),s,mb:size?Math.max(.1,+(size/1048576).toFixed(1)):0,up:TODAY,open:null,unread:true,star:false,...extra,
  info:{kind:x.kind,count:x.count,unit:x.unit,words:x.text?a.words:0,minutes:a.minutes,keywords:kw,summary:x.text?a.summary:[],text:x.text||'',notes:x.notes||[],list:x.list,listLabel:x.listLabel,dims:x.dims,thumb:x.thumb,guessed:!!a.guess}}
}
function prog(name){const el=document.createElement('div');el.className='pitem';el.innerHTML='<span></span><div class="track"><div class="fill"></div></div>';$('upl').appendChild(el);
 return{el,set:(t,p)=>{el.firstChild.textContent=t;el.querySelector('.fill').style.width=p+'%'}}}
async function add(list){
 let first=null;
 for(const fl of [...list]){
  const e=(fl.name.split('.').pop()||'').toLowerCase();
  if(!OK.includes(e)){toast('.'+e+' files are not supported. Try PDF, Word, PowerPoint, image, ZIP or text.');continue}
  if(fl.size>MAXMB*1048576){toast(fl.name+' is larger than '+MAXMB+' MB');continue}
  const P=prog(fl.name);P.set('Reading '+fl.name,15);let x;
  try{await new Promise(r=>setTimeout(r,250));P.set('Extracting information from '+fl.name,55);x=await extract(fl,e)}
  catch(err){x={text:'',kind:e.toUpperCase()+' file',notes:['We could not read the contents of this file, but it was added to your library.']}}
  const id=++uid;first=first||id;files.unshift(build(fl.name,x,fl.size,{blob:fl},id));
  P.set('Done',100);setTimeout(()=>P.el.remove(),900);
 }
 if(first){tab='added';newId=first;toast('Added and analysed');all();details(first)}
}
function addUrl(){
 const raw=$('urlIn').value.trim();if(!raw)return;
 let u;try{u=new URL(/^https?:\/\//i.test(raw)?raw:'https://'+raw);if(!u.hostname.includes('.'))throw 0}catch(e){toast('That does not look like a web address');return}
 const host=u.hostname.replace(/^www\./,'');let path=u.pathname;try{path=decodeURIComponent(path)}catch(e){}
 const w=(path.split('/').filter(Boolean).pop()||'').replace(/\.[a-z0-9]+$/i,'').replace(/[-_+]+/g,' ').trim();
 const yt=/youtube\.com|youtu\.be/.test(host),pdf=/\.pdf$/i.test(u.pathname);
 const x={text:'',kind:yt?'Video link':pdf?'PDF link':'Web page link',list:[u.href],listLabel:'Address',notes:['Page contents cannot be read from here, so the topic is guessed from the address.']};
 const id=++uid;files.unshift(build((w?w.replace(/\b\w/g,c=>c.toUpperCase()):host)+' ('+host+')',x,0,{url:u.href},id));
 $('urlIn').value='';tab='added';newId=id;toast('Link added');all();details(id)
}
function details(id){
 const f=files.find(x=>x.id==id);if(!f||!f.info)return;const i=f.info,st=(v,l)=>`<div class="ds"><b>${v}</b><span>${l}</span></div>`;
 $('dBody').innerHTML=`<h3>${f.name}</h3><p class="meta">${i.kind}${f.url?'':', '+f.mb+' MB'}. Sorted into <b>${f.s}</b>${i.guessed?' (detected automatically)':''}.</p>
 ${i.thumb?`<img class="thumb" src="${i.thumb}" alt="Preview of ${f.name}">`:''}
 <div class="dstats">${i.count?st(i.count.toLocaleString(),i.unit):''}${i.words?st(i.words.toLocaleString(),'words')+st(i.minutes+' min','reading time'):''}${i.dims?st(i.dims,'image size'):''}</div>
 ${i.summary.length?`<h4>Summary</h4><p>${i.summary.map(esc).join(' ')}</p>`:''}
 ${i.keywords.length?`<h4>Key topics</h4><div class="chips">${i.keywords.map(k=>`<span class="chip">${esc(k)}</span>`).join('')}</div>`:''}
 ${i.list&&i.list.length?`<h4>${i.listLabel}</h4><ul class="dl">${i.list.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
 ${i.notes.map(n=>`<p class="note">${esc(n)}</p>`).join('')}`;
 $('dOpen').dataset.open=id;$('dOpen').textContent=f.url?'Open link':'Open file';$('dlg').showModal()
}
const assistantMessages=[];
function refreshAssistantScope(){
 const select=$('assistantScope'),selected=select.value;
 const readable=files.filter(f=>f.info&&f.info.text&&f.info.text.trim());
 const noteSources=quickNotes.map(n=>({id:`note:${n.id}`,name:esc(`Quick note: ${n.title}`),s:n.subject||'Quick notes',info:{text:n.text}}));
 const options='<option value="all">All readable materials and quick notes</option>'+
  (readable.length?'<optgroup label="Uploaded materials">'+readable.map(f=>`<option value="${f.id}">${esc(dec(f.name))} (${esc(f.s)})</option>`).join('')+'</optgroup>':'')+
  (noteSources.length?'<optgroup label="Quick notes"><option value="quick-notes">All quick notes</option>'+noteSources.map(n=>`<option value="${n.id}">${esc(dec(n.name))}</option>`).join('')+'</optgroup>':'');
 select.innerHTML=options;
 if(readable.some(f=>String(f.id)===selected)||noteSources.some(n=>n.id===selected)||(selected==='quick-notes'&&noteSources.length))select.value=selected;
 $('assistantQuestion').placeholder=select.value==='all'?'Ask a question about your study materials…':'Ask about the selected study material…';
}
function assistantMaterials(){
 const sourceFiles=files.filter(f=>f.info&&f.info.text&&f.info.text.trim());
 const sourceNotes=quickNotes.filter(n=>n.text.trim()).map(n=>({
  id:`note:${n.id}`,name:esc(`Quick note: ${n.title}`),s:n.subject||'Quick notes',info:{text:n.text},quickNote:true
 }));
 return[...sourceFiles,...sourceNotes];
}
function assistantSentences(text){
 return text.replace(/\r/g,' ').replace(/([.!?])\s+/g,'$1\n').split(/[\n]+/)
  .map(s=>s.replace(/^\s*[-*#\d.)]+\s*/,'').trim()).filter(s=>s.length>=28&&s.length<=500);
}
function assistantRankedTerms(text){
 const counts=Object.create(null);
 wordsOf(text).forEach(w=>{if(!STOP.has(w))counts[w]=(counts[w]||0)+1});
 return Object.entries(counts).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
}
function assistantUnitSection(text,unit){
 const headings=[...text.matchAll(/\b(?:unit|chapter|module|part)\s+(\d+)\b/gi)];
 for(let i=0;i<headings.length;i++){
  if(headings[i][1]===unit)return text.slice(headings[i].index,headings[i+1]?.index??text.length);
 }
 return assistantSentences(text).filter(s=>new RegExp(`\\b(?:unit|chapter|module|part)\\s+${unit}\\b`,'i').test(s)).join(' ');
}
function assistantAnswer(question){
 const scope=$('assistantScope').value;
 const materials=assistantMaterials().filter(f=>scope==='all'||(scope==='quick-notes'&&f.quickNote)||String(f.id)===scope);
 const lower=question.toLowerCase(),unitMatch=lower.match(/\b(?:unit|chapter|module|part)\s+(\d+)\b/);
 const isSummary=/\b(summar|summary|overview)\w*/.test(lower);
 const isMcq=/\b(mcqs?|multiple[- ]choice|quizzes?)\b/.test(lower);
 const isFiveMark=/\b5[- ]?mark\b|\bfive[- ]mark\b/.test(lower);
 const isQuestionSet=isMcq||isFiveMark;
 const requested=(lower.match(/\b(\d{1,2})\s*(?:mcqs?|multiple[- ]choice|questions?)\b/)||lower.match(/\b(?:mcqs?|multiple[- ]choice)\s*(\d{1,2})\b/)||[])[1];
 const amount=Math.min(20,Math.max(1,Number(requested)||(isMcq?10:5)));
 if(!materials.length){
  if(/\bdeadlock\b/.test(lower)&&/\b(explain|mean|what|simple)\b/.test(lower))return{
   text:'I couldn’t find readable notes for this question, so this is a general explanation: a deadlock is when two or more processes are each waiting for a resource held by another, so none can continue. Think of two people each holding one key the other needs: both wait, and neither can move.',
   sources:[]};
  return{text:'I don’t have readable study material to answer from yet. Add a quick note or upload a text-based PDF, Word document, PowerPoint, or text file, then ask again. Scanned PDFs, images, and links do not provide readable text here.',sources:[]};
 }
 if(unitMatch){
  const sections=materials.map(f=>({file:f,text:assistantUnitSection(f.info.text,unitMatch[1])})).filter(x=>x.text.trim());
  if(!sections.length)return{text:`I couldn’t find a clearly labeled Unit ${unitMatch[1]} section in the selected materials. Try selecting a specific file or checking that its unit headings are readable.`,sources:[]};
  const terms=assistantRankedTerms(sections.map(x=>x.text).join(' ')).slice(0,8).map(x=>x[0]);
  const excerpts=sections.flatMap(x=>assistantSentences(x.text).slice(0,2).map(s=>`• ${s}`)).slice(0,5);
  return{text:`Important topics found in Unit ${unitMatch[1]}:\n${terms.map(t=>`• ${t}`).join('\n')||'• The section has too little readable text to identify recurring topics.'}\n\nFrom the section:\n${excerpts.join('\n')}`,sources:sections.map(x=>x.file)};
 }
 if(isSummary){
  const summaries=materials.slice(0,4).map(f=>{
   const sentences=assistantSentences(f.info.text),ranked=assistantRankedTerms(f.info.text),freq=Object.fromEntries(ranked);
   const selected=sentences.map((text,i)=>({text,i,score:wordsOf(text).reduce((n,w)=>n+(freq[w]||0),0)/Math.sqrt(wordsOf(text).length||1)}))
    .sort((a,b)=>b.score-a.score).slice(0,5).sort((a,b)=>a.i-b.i);
   return{file:f,selected};
  }).filter(x=>x.selected.length);
  if(!summaries.length)return{text:'I couldn’t find enough readable sentences in the selected material to summarize.',sources:materials};
  return{text:summaries.map(x=>`${dec(x.file.name)}\n${x.selected.map(s=>`• ${s.text}`).join('\n')}`).join('\n\n'),sources:summaries.map(x=>x.file)};
 }
 if(isQuestionSet){
  const sentences=materials.flatMap(file=>assistantSentences(file.info.text).map(text=>({file,text})));
  const allTerms=assistantRankedTerms(materials.map(f=>f.info.text).join(' ')).map(x=>x[0]);
  const usedAnswers=new Set(),items=[];
  for(const item of sentences){
   const terms=wordsOf(item.text).filter(w=>w.length>=4&&!STOP.has(w)&&!usedAnswers.has(w));
   const target=terms.sort((a,b)=>(allTerms.indexOf(a)<0?999:allTerms.indexOf(a))-(allTerms.indexOf(b)<0?999:allTerms.indexOf(b)))[0];
   if(!target)continue;
   const distractors=allTerms.filter(w=>w!==target&&!wordsOf(item.text).includes(w)&&!usedAnswers.has(w)).slice(0,3);
   if(distractors.length<3)continue;
   usedAnswers.add(target);
   items.push({file:item.file,text:item.text,target,distractors});
   if(items.length===amount)break;
  }
  if(isMcq){
   if(!items.length)return{text:'There isn’t enough readable text with distinct key terms to create reliable multiple-choice questions. Try uploading more detailed notes.',sources:materials};
   const answerText=items.map((x,i)=>{
    const options=[x.target,...x.distractors].sort((a,b)=>a.localeCompare(b));
    return`${i+1}. Which term completes this statement from the notes?\n“${x.text.replace(new RegExp(`\\b${x.target}\\b`,'i'),'_____')}”\n${options.map((o,j)=>`   ${String.fromCharCode(65+j)}. ${o}`).join('\n')}\nAnswer: ${String.fromCharCode(65+options.indexOf(x.target))}. ${x.target}`;
   }).join('\n\n');
   return{text:`Practice MCQs (${items.length}):\n\n${answerText}${items.length<amount?`\n\nOnly ${items.length} distinct questions could be made from the available notes.`:''}`,sources:[...new Set(items.map(x=>x.file))]};
  }
  if(!items.length)return{text:'There isn’t enough readable text in the selected material to create reliable 5-mark questions.',sources:materials};
  return{text:`Practice questions (5 marks each):\n\n${items.map((x,i)=>`${i+1}. Explain the main idea in the following statement, then describe its significance: “${x.text}”`).join('\n\n')}${items.length<amount?`\n\nOnly ${items.length} questions could be made from the available notes.`:''}`,sources:[...new Set(items.map(x=>x.file))]};
 }
 const terms=wordsOf(lower).filter(w=>!STOP.has(w));
 const matches=materials.flatMap(file=>assistantSentences(file.info.text).map(text=>{
  const sentenceTerms=wordsOf(text),score=terms.reduce((n,w)=>n+(sentenceTerms.includes(w)?1:0),0);
  return{file,text,score};
 })).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,3);
 if(matches.length)return{text:`From your materials:\n${matches.map(x=>`• ${x.text}`).join('\n')}`,sources:[...new Set(matches.map(x=>x.file))]};
 if(/\bdeadlock\b/.test(lower)&&/\b(explain|mean|what|simple)\b/.test(lower))return{
  text:'I couldn’t find this topic in the selected notes, so this is a general explanation: a deadlock is when two or more processes are each waiting for a resource held by another, so none can continue. Think of two people each holding one key the other needs: both wait, and neither can move.',
  sources:[]};
 return{text:'I couldn’t find a relevant passage in the selected material. Try rephrasing with a key term from your notes, or upload material that covers this topic.',sources:[]};
}
function renderAssistant(){
 const thread=$('assistantThread');
 thread.innerHTML=assistantMessages.map(m=>`<div class="assistantMessage ${m.role==='user'?'assistantUser':'assistantReply'}"><p>${esc(m.text).replace(/\n/g,'<br>')}</p>${m.sources&&m.sources.length?`<div class="assistantSources">Sources: ${m.sources.map(f=>esc(dec(f.name))).join(', ')}</div>`:''}</div>`).join('');
 thread.scrollTop=thread.scrollHeight;
}
function askAssistant(question){
 const text=question.trim();if(!text)return;
 assistantMessages.push({role:'user',text});
 $('assistantQuestion').value='';$('assistantSend').disabled=true;$('assistantForm').setAttribute('aria-busy','true');
 renderAssistant();
 setTimeout(()=>{
  try{assistantMessages.push({role:'assistant',...assistantAnswer(text)})}
  catch(error){console.error('Study assistant failed to answer:',error);assistantMessages.push({role:'assistant',text:'I couldn’t process that request. Please try again with a shorter question.',sources:[]})}
  $('assistantSend').disabled=false;$('assistantForm').removeAttribute('aria-busy');renderAssistant();
 },40);
}
$('assistantForm').addEventListener('submit',e=>{e.preventDefault();askAssistant($('assistantQuestion').value)});
$('assistantScope').addEventListener('change',e=>{
 $('assistantQuestion').placeholder=e.target.value==='all'?'Ask a question about your study materials…':'Ask about the selected study material…';
});
document.querySelectorAll('[data-prompt]').forEach(button=>button.addEventListener('click',()=>{
 if(button.dataset.prompt==='Summarize my quick notes.')$('assistantScope').value='quick-notes';
 askAssistant(button.dataset.prompt);
}));
const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
let voiceRecognition=null;
function stopVoiceInput(){
 if(voiceRecognition)voiceRecognition.stop();
}
if(!SpeechRecognition){
 $('assistantMic').disabled=true;
 $('assistantMic').title='Voice input is not supported by this browser';
 $('assistantVoiceStatus').textContent='Voice input is not supported by this browser. You can type your question instead.';
}
$('assistantMic').addEventListener('click',()=>{
 if(!SpeechRecognition)return;
 if(voiceRecognition){stopVoiceInput();return}
 const recognition=new SpeechRecognition();
 let transcript='',baseText=$('assistantQuestion').value.trim(),failure='';
 recognition.lang=navigator.language||'en-US';
 recognition.continuous=false;
 recognition.interimResults=true;
 recognition.onstart=()=>{
  voiceRecognition=recognition;
  $('assistantMic').setAttribute('aria-pressed','true');
  $('assistantMic').setAttribute('aria-label','Stop voice input');
  $('assistantVoiceStatus').textContent='Listening… Speak your question.';
 };
 recognition.onresult=event=>{
  let interim='';
  for(let i=event.resultIndex;i<event.results.length;i++){
   const result=event.results[i];
   if(result.isFinal)transcript+=result[0].transcript;
   else interim+=result[0].transcript;
  }
  $('assistantQuestion').value=[baseText,transcript,interim].filter(Boolean).join(' ').trim();
  if(interim)$('assistantVoiceStatus').textContent='Listening… '+interim;
 };
 recognition.onerror=event=>{
  const messages={
   'not-allowed':'Microphone access was denied. Allow microphone access in your browser settings and try again.',
   'service-not-allowed':'Speech recognition is blocked by your browser. Check its microphone or speech-recognition permissions.',
   'no-speech':'No speech was detected. Tap the microphone and try again.',
   'audio-capture':'No microphone was found. Connect a microphone and try again.',
   'network':'Speech recognition could not connect. Check your internet connection and try again.',
   'language-not-supported':'Speech recognition does not support your browser’s current language.'
  };
  failure=messages[event.error]||'Voice input stopped unexpectedly. Please try again or type your question.';
  $('assistantVoiceStatus').textContent=failure;
 };
 recognition.onend=()=>{
  if(voiceRecognition===recognition)voiceRecognition=null;
  $('assistantMic').setAttribute('aria-pressed','false');
  $('assistantMic').setAttribute('aria-label','Start voice input');
  if(!failure)$('assistantVoiceStatus').textContent=transcript?'Voice input added. Review your question, then press Ask.':'Voice input stopped.';
 };
 try{recognition.start()}
 catch(error){
  console.error('Could not start voice input:',error);
  $('assistantVoiceStatus').textContent='Could not start voice input. Check microphone permissions and try again.';
 }
});
function setAssistantOpen(open){
 const panel=$('assistantPanel'),launcher=$('assistantLauncher');
 if(open){
  assistantMessages.push({role:'assistant',text:'Welcome to your AI Study Assistant! Ask a question, summarize your notes, find important topics, or create practice questions. I can use your uploaded readable materials and saved quick notes.',sources:[]});
  renderAssistant();
 }
 panel.hidden=!open;
 panel.setAttribute('aria-hidden',String(!open));
 launcher.setAttribute('aria-expanded',String(open));
 if(!open)stopVoiceInput();
 if(open)setTimeout(()=>$('assistantQuestion').focus(),0);
 else launcher.focus();
}
$('assistantLauncher').addEventListener('click',()=>setAssistantOpen($('assistantPanel').hidden));
$('assistantClose').addEventListener('click',()=>setAssistantOpen(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('assistantPanel').hidden)setAssistantOpen(false)});
$('urlBtn').onclick=addUrl;$('urlIn').onkeydown=e=>{if(e.key==='Enter')addUrl()};
$('dClose').onclick=()=>$('dlg').close();$('dlg').onclick=e=>{if(e.target===$('dlg'))$('dlg').close()};
$('drop').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('file').click()}};
$('binBtn').onclick=()=>{renderRecycleBin();$('recycleDialog').showModal()};
$('recycleClose').onclick=()=>$('recycleDialog').close();
$('recycleDialog').addEventListener('click',e=>{if(e.target===$('recycleDialog'))$('recycleDialog').close()});
$('upBtn').onclick=()=>$('file').click();$('drop').onclick=()=>$('file').click();
$('file').onchange=e=>{add(e.target.files);e.target.value=''};
['dragover','dragenter'].forEach(n=>$('drop').addEventListener(n,e=>{e.preventDefault();$('drop').classList.add('over')}));
['dragleave','drop'].forEach(n=>$('drop').addEventListener(n,e=>{e.preventDefault();$('drop').classList.remove('over')}));
$('drop').addEventListener('drop',e=>add(e.dataTransfer.files));
const SETTINGS_KEY='sv-settings',REPORTS_KEY='sv-reports';
const validThemes=['system','light','dark'];
let preferences={theme:'system'};
try{
 const saved=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}');
 if(saved&&validThemes.includes(saved.theme))preferences.theme=saved.theme;
}catch(error){console.error('Could not read saved settings:',error);toast('Saved settings could not be read. Default appearance is in use.')}
function applyPreferences(){
 const root=document.documentElement;
 if(preferences.theme==='system')delete root.dataset.theme;
 else root.dataset.theme=preferences.theme;
 delete root.dataset.accent;
 if($('themeSelect'))$('themeSelect').value=preferences.theme;
 const isDark=preferences.theme==='dark'||(preferences.theme==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
 document.querySelectorAll('[data-theme-toggle]').forEach(button=>{
  button.classList.toggle('isDarkMode',isDark);
  const action=`Switch to ${isDark?'light':'dark'} mode`;
  button.setAttribute('aria-label',action);
  button.setAttribute('title',action);
  button.setAttribute('aria-pressed',String(isDark));
 });
}
function savePreferences(next){
 preferences=next;
 applyPreferences();
 try{
  localStorage.setItem(SETTINGS_KEY,JSON.stringify(preferences));
  $('settingsStatus').textContent='Appearance settings saved on this device.';
 }catch(error){
  console.error('Could not save appearance settings:',error);
  $('settingsStatus').textContent='Settings are applied for now, but could not be saved on this device.';
 }
}
applyPreferences();
document.querySelectorAll('[data-theme-toggle]').forEach(button=>button.addEventListener('click',()=>{
 const isDark=preferences.theme==='dark'||(preferences.theme==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
 savePreferences({...preferences,theme:isDark?'light':'dark'});
}));
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{
 if(preferences.theme==='system')applyPreferences();
});
$('settingsOpen').addEventListener('click',()=>{$('settingsStatus').textContent='';$('settingsDialog').showModal()});
$('settingsClose').addEventListener('click',()=>$('settingsDialog').close());
$('settingsDialog').addEventListener('click',e=>{if(e.target===$('settingsDialog'))$('settingsDialog').close()});
$('themeSelect').addEventListener('change',e=>savePreferences({...preferences,theme:e.target.value}));
let reports=[],reportStorageError='';
try{
 const saved=JSON.parse(localStorage.getItem(REPORTS_KEY)||'[]');
 if(!Array.isArray(saved)||saved.some(r=>!r||typeof r.id!=='string'||typeof r.subject!=='string'||typeof r.details!=='string'))throw new Error('Saved reports have an invalid format.');
 reports=saved;
}catch(error){reportStorageError='Saved reports could not be read on this device. New reports cannot be registered until browser storage is available.';console.error(reportStorageError,error)}
function renderReports(){
 const list=$('reportList');list.replaceChildren();
 if(!reports.length){const empty=document.createElement('p');empty.className='meta';empty.textContent='No reports registered on this device yet.';list.appendChild(empty);return}
 reports.slice().reverse().forEach(report=>{
  const item=document.createElement('article');item.className='registeredReport';
  const heading=document.createElement('b');heading.textContent=`${report.type==='problem'?'Problem report':'Feedback'} · ${report.subject}`;
  const reference=document.createElement('span');reference.className='meta';reference.textContent=`Reference ${report.id} · ${new Date(report.createdAt).toLocaleString()}`;
  const details=document.createElement('p');details.textContent=report.details;
  item.append(heading,reference,details);list.appendChild(item);
 });
}
renderReports();
if(reportStorageError)$('reportStatus').textContent=reportStorageError;
$('helpOpen').addEventListener('click',()=>{
 $('settingsDialog').close();
 $('reportStatus').textContent=reportStorageError||'';
 renderReports();
 $('helpDialog').showModal();
});
$('helpClose').addEventListener('click',()=>$('helpDialog').close());
$('helpDialog').addEventListener('click',e=>{if(e.target===$('helpDialog'))$('helpDialog').close()});
$('helpForm').addEventListener('submit',e=>{
 e.preventDefault();
 const subject=$('reportSubject').value.trim(),details=$('reportDetails').value.trim(),email=$('reportEmail').value.trim();
 if(!subject||!details){$('reportStatus').textContent='Enter a subject and details before registering your report.';return}
 if(reportStorageError){$('reportStatus').textContent=reportStorageError;return}
 const report={id:`SV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`,type:$('reportType').value,subject,details,email,createdAt:new Date().toISOString()};
 try{
  const updated=[...reports,report];
  localStorage.setItem(REPORTS_KEY,JSON.stringify(updated));
  reports=updated;
  renderReports();
  $('helpForm').reset();
  $('reportStatus').textContent=`Report registered on this device. Reference: ${report.id}. It has not been sent to a support team.`;
 }catch(error){
  console.error('Could not register report in browser storage:',error);
  $('reportStatus').textContent='Could not save your report on this device. Check that browser storage is available and try again.';
 }
});
function dueLabel(offset){
 if(offset<0)return`${Math.abs(offset)} day${Math.abs(offset)===1?'':'s'} overdue`;
 if(offset===0)return'Due today';
 if(offset===1)return'Due tomorrow';
 return`Due in ${offset} days`;
}
function dateLabel(value){
 const[y,m,d]=value.split('-').map(Number);
 return new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric'}).format(new Date(y,m-1,d));
}
function studyEvents(){
 const examEvents=exams.map((e,i)=>({id:`exam-${i}`,kind:'exam',title:e.n,subject:e.s,date:e.d,offset:days(e.d)})).filter(e=>e.offset>=0&&e.offset<=30);
 const assignmentEvents=assignments.filter(a=>!a.completed&&days(a.due)<=30).map(a=>({id:`assignment-${a.id}`,kind:'assignment',title:a.title,subject:a.subject,date:a.due,offset:days(a.due)}));
 return[...examEvents,...assignmentEvents].sort((a,b)=>a.date.localeCompare(b.date)||a.title.localeCompare(b.title));
}
function updateNotificationBadge(events=studyEvents()){
 const countEl=$('notificationCount'),urgent=events.filter(event=>event.offset<=7).length;
 countEl.textContent=urgent>9?'9+':String(urgent);
 countEl.hidden=urgent===0;
 $('notificationsOpen').setAttribute('aria-label',urgent?`Open notifications, ${urgent} due soon`:'Open notifications');
}
function renderNotificationCenter(){
 const events=studyEvents(),list=$('notificationList');list.replaceChildren();
 updateNotificationBadge(events);
 if(!events.length){
  const empty=document.createElement('p');empty.className='meta';empty.textContent='Nothing due in the next 30 days. Add an assignment to get reminders.';list.appendChild(empty);
 }else events.forEach(event=>{
  const item=document.createElement('article');item.className=`notificationItem${event.offset<=3?' notificationSoon':''}`;
  const heading=document.createElement('b');heading.textContent=event.title;
  const meta=document.createElement('span');meta.className='meta';meta.textContent=[event.kind==='exam'?'Exam':'Assignment',event.subject,dateLabel(event.date)].filter(Boolean).join(' · ');
  const when=document.createElement('span');when.className='notificationDue';when.textContent=dueLabel(event.offset);
  item.append(heading,meta,when);list.appendChild(item);
 });
 const assignmentList=$('assignmentList');assignmentList.replaceChildren();
 if(!assignments.length){const empty=document.createElement('p');empty.className='meta';empty.textContent='No assignments added yet.';assignmentList.appendChild(empty)}
 assignments.slice().sort((a,b)=>a.due.localeCompare(b.due)).forEach(assignment=>{
  const item=document.createElement('article');item.className=`notificationItem${assignment.completed?' assignmentComplete':''}`;
  const heading=document.createElement('b');heading.textContent=assignment.title;
  const meta=document.createElement('span');meta.className='meta';meta.textContent=[assignment.subject,dateLabel(assignment.due),assignment.completed?'Completed':dueLabel(days(assignment.due))].filter(Boolean).join(' · ');
  const action=document.createElement('button');action.className='act';action.type='button';action.dataset.completeAssignment=assignment.id;action.textContent=assignment.completed?'Reopen':'Mark done';
  item.append(heading,meta,action);assignmentList.appendChild(item);
 });
}
function persistAssignments(next){
 try{localStorage.setItem(ASSIGNMENTS_KEY,JSON.stringify(next));assignments=next;renderNotificationCenter();checkBrowserReminders();return true}
 catch(error){console.error('Could not save assignments:',error);$('notificationStatus').textContent='Could not save assignments in this browser. Check available storage and try again.';return false}
}
function persistQuickNotes(next){
 try{localStorage.setItem(NOTES_KEY,JSON.stringify(next));quickNotes=next;renderQuickNotes();refreshAssistantScope();return true}
 catch(error){console.error('Could not save quick notes:',error);$('quickNoteStatus').textContent='Could not save this note in your browser. Check available storage and try again.';return false}
}
function renderQuickNotes(){
 const list=$('quickNoteList');list.replaceChildren();
 if(!quickNotes.length){const empty=document.createElement('p');empty.className='meta';empty.textContent='No saved quick notes yet.';list.appendChild(empty);return}
 quickNotes.slice().reverse().forEach(note=>{
  const item=document.createElement('article');item.className='registeredReport';
  const heading=document.createElement('b');heading.textContent=note.title;
  const meta=document.createElement('span');meta.className='meta';meta.textContent=note.subject||'Quick note';
  const text=document.createElement('p');text.textContent=note.text;
  const actions=document.createElement('div');actions.className='quickNoteActions';
  const ask=document.createElement('button');ask.type='button';ask.className='act';ask.dataset.askNote=note.id;ask.textContent='Ask AI about this note';
  const remove=document.createElement('button');remove.type='button';remove.className='act danger';remove.dataset.removeNote=note.id;remove.textContent='Delete';
  actions.append(ask,remove);item.append(heading,meta,text,actions);list.appendChild(item);
 });
}
$('notificationsOpen').addEventListener('click',()=>{
 $('notificationStatus').textContent=typeof Notification==='undefined'?'Browser notifications are not supported here. In-app reminders are still available.':Notification.permission==='granted'?'Browser notifications are enabled while this dashboard is open.':Notification.permission==='denied'?'Browser notifications are blocked in browser settings. In-app reminders are still available.':'Enable optional browser notifications for reminders while this dashboard is open.';
 $('enableNotifications').hidden=typeof Notification==='undefined'||Notification.permission==='denied';
 $('enableNotifications').textContent=typeof Notification!=='undefined'&&Notification.permission==='granted'?'Browser notifications enabled':'Enable browser notifications';
 $('assignmentDue').min=TODAY;
 renderNotificationCenter();$('notificationsDialog').showModal();
});
$('notificationsClose').addEventListener('click',()=>$('notificationsDialog').close());
$('notificationsDialog').addEventListener('click',e=>{if(e.target===$('notificationsDialog'))$('notificationsDialog').close()});
$('enableNotifications').addEventListener('click',async()=>{
 if(typeof Notification==='undefined'){$('notificationStatus').textContent='Browser notifications are not supported here. In-app reminders are still available.';return}
 try{
  const permission=Notification.permission==='default'?await Notification.requestPermission():Notification.permission;
  if(permission==='granted'){$('notificationStatus').textContent='Browser notifications enabled. Upcoming reminders will appear while this dashboard is open.';checkBrowserReminders()}
  else{$('notificationStatus').textContent=permission==='denied'?'Permission was denied. Allow notifications in your browser settings to enable browser alerts.':'Notification permission was not granted. In-app reminders are still available.'}
  $('enableNotifications').hidden=permission==='denied';$('enableNotifications').textContent=permission==='granted'?'Browser notifications enabled':'Enable browser notifications';
 }catch(error){console.error('Could not request notification permission:',error);$('notificationStatus').textContent='Could not enable browser notifications. In-app reminders are still available.'}
});
$('assignmentForm').addEventListener('submit',e=>{
 e.preventDefault();
 const title=$('assignmentTitle').value.trim(),subject=$('assignmentSubject').value.trim(),due=$('assignmentDue').value;
 if(!title||!due){$('notificationStatus').textContent='Enter an assignment name and due date.';return}
 if(due<TODAY){$('notificationStatus').textContent='Choose today or a future due date.';return}
 const assignment={id:`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`,title,subject,due,completed:false};
 if(persistAssignments([...assignments,assignment])){$('assignmentForm').reset();$('assignmentDue').min=TODAY;$('notificationStatus').textContent=`${title} added. You’ll see reminders here as the due date approaches.`}
});
$('assignmentList').addEventListener('click',e=>{
 const button=e.target.closest('[data-complete-assignment]');if(!button)return;
 const assignment=assignments.find(a=>a.id===button.dataset.completeAssignment);if(!assignment)return;
 const completed=!assignment.completed;
 if(persistAssignments(assignments.map(a=>a.id===assignment.id?{...a,completed}:a)))$('notificationStatus').textContent=completed?'Assignment marked complete.':'Assignment reopened.';
});
$('quickNoteOpen').addEventListener('click',()=>{$('quickNoteStatus').textContent='';renderQuickNotes();$('quickNotesDialog').showModal()});
$('quickNotesClose').addEventListener('click',()=>$('quickNotesDialog').close());
$('quickNotesDialog').addEventListener('click',e=>{if(e.target===$('quickNotesDialog'))$('quickNotesDialog').close()});
$('quickNoteForm').addEventListener('submit',e=>{
 e.preventDefault();
 const title=$('quickNoteTitle').value.trim(),subject=$('quickNoteSubject').value.trim(),text=$('quickNoteText').value.trim();
 if(!title||!text){$('quickNoteStatus').textContent='Enter a title and note text before saving.';return}
 const note={id:`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`,title,subject,text,createdAt:new Date().toISOString()};
 if(persistQuickNotes([...quickNotes,note])){$('quickNoteForm').reset();$('quickNoteStatus').textContent='Quick note saved on this device and added to the AI assistant’s materials.'}
});
$('quickNoteList').addEventListener('click',e=>{
 const ask=e.target.closest('[data-ask-note]');
 if(ask){$('quickNotesDialog').close();setAssistantOpen(true);$('assistantScope').value=`note:${ask.dataset.askNote}`;$('assistantQuestion').placeholder='Ask about this quick note…';$('assistantQuestion').focus();return}
 const remove=e.target.closest('[data-remove-note]');if(!remove)return;
 const note=quickNotes.find(n=>n.id===remove.dataset.removeNote);if(!note)return;
 if(!window.confirm(`Delete the quick note “${note.title}”?`))return;
 if(persistQuickNotes(quickNotes.filter(n=>n.id!==note.id)))$('quickNoteStatus').textContent='Quick note deleted.';
});
function checkBrowserReminders(){
 updateNotificationBadge();
 if(!dashboardUnlocked)return;
 if(typeof Notification==='undefined'||Notification.permission!=='granted')return;
 for(const event of studyEvents().filter(item=>item.offset<=3)){
  const key=`${event.id}:${TODAY}`;
  if(notificationLog.includes(key))continue;
  try{
   const when=event.offset<0?dueLabel(event.offset):event.offset===0?'Due today':`Due in ${event.offset} day${event.offset===1?'':'s'}`;
   new Notification(event.kind==='exam'?'Upcoming exam':'Assignment reminder',{body:`${event.title}${event.subject?` · ${event.subject}`:''} — ${when}`,tag:key});
   notificationLog.push(key);notificationLog=notificationLog.slice(-500);
   localStorage.setItem(NOTIFICATION_LOG_KEY,JSON.stringify(notificationLog));
  }catch(error){console.error('Could not display or save a browser reminder:',error);$('notificationStatus').textContent='A browser reminder could not be displayed. In-app reminders are still available.';break}
 }
}
renderNotificationCenter();
checkBrowserReminders();
setInterval(()=>{
 const now=new Date(),today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
 if(today!==TODAY){TODAY=today;all();$('assignmentDue').min=TODAY;renderNotificationCenter()}
 checkBrowserReminders();
},60*1000);
renderQuickNotes();
let profile={name:'',roll:'',registrationNo:'',phone:'',dept:'',year:'',email:'',photo:''};
try{const s=JSON.parse(localStorage.getItem('sv-profile'));if(s&&typeof s==='object')profile={...profile,...s,dept:validBranch(s.dept||'')}}catch(error){console.error('Could not read student profile:',error)}
const saveP=()=>{try{localStorage.setItem('sv-profile',JSON.stringify(profile));return true}catch(error){console.error('Could not save student profile:',error);toast('Could not save profile changes in this browser.');return false}};
function showProfile(){
 $('pName').textContent=profile.name||'Add your name';
 $('pRoll').textContent=profile.roll||'Not added';
 $('pRegistration').textContent=profile.registrationNo||'Not added';
 $('pPhone').textContent=profile.phone||'Not added';
 $('pDept').textContent=profile.dept||'Not added';
 $('pYear').textContent=profile.year||'Not added';
 $('pEmail').textContent=profile.email||'Not added';
 const ini=(profile.name||'?').split(' ').filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join('')||'?';
 $('avatar').innerHTML=(profile.photo?`<img src="${profile.photo}" alt="Profile photo">`:ini)+'<span>Change</span>';
}
function toggleForm(open){
 $('pform').classList.toggle('open',open);$('pEdit').setAttribute('aria-expanded',open);
 $('pEdit').textContent=open?'Close':'Edit profile';
 if(open){$('fName').value=profile.name;$('fRoll').value=profile.roll;$('fRegistration').value=profile.registrationNo;$('fPhone').value=profile.phone;$('fDept').value=validBranch(profile.dept);$('fYear').value=profile.year;$('fEmail').value=profile.email;$('pErr').textContent='';setTimeout(()=>$('fName').focus(),350)}
}
$('pEdit').onclick=()=>toggleForm(!$('pform').classList.contains('open'));
$('pCancel').onclick=()=>toggleForm(false);
$('pSave').onclick=()=>{
 const n=$('fName').value.trim(),r=$('fRoll').value.trim(),registrationNo=$('fRegistration').value.trim(),p=$('fPhone').value.trim(),d=$('fDept').value.trim(),y=$('fYear').value,m=$('fEmail').value.trim();
 ['fName','fRoll','fRegistration','fDept','fPhone','fEmail'].forEach(i=>$(i).classList.remove('bad'));
 if(!n){$('fName').classList.add('bad');$('pErr').textContent='Please enter your name.';return}
 if(!r){$('fRoll').classList.add('bad');$('pErr').textContent='Please enter your roll number.';return}
 if(!registrationNo){$('fRegistration').classList.add('bad');$('pErr').textContent='Please enter your registration number.';return}
 if(!validBranch(d)){$('fDept').classList.add('bad');$('pErr').textContent='Please select a branch.';return}
 if(p&&!/^[+]?[0-9 ()-]{7,16}$/.test(p)){$('fPhone').classList.add('bad');$('pErr').textContent='Enter a valid phone number, for example +91 98765 43210.';return}
 if(m&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)){$('fEmail').classList.add('bad');$('pErr').textContent='Enter a valid email, for example name@college.edu.';return}
 profile={...profile,name:n,roll:r,registrationNo,phone:p,dept:validBranch(d),year:y,email:m};saveP();showProfile();toggleForm(false);summary();toast('Profile saved');
};
$('avatar').onclick=()=>$('photo').click();
$('photo').onchange=e=>{
 const f=e.target.files[0];e.target.value='';if(!f)return;
 const img=new Image(),url=URL.createObjectURL(f);
 img.onload=()=>{const c=document.createElement('canvas'),z=200,m=Math.min(img.width,img.height);c.width=c.height=z;
  c.getContext('2d').drawImage(img,(img.width-m)/2,(img.height-m)/2,m,m,0,0,z,z);
  profile.photo=c.toDataURL('image/jpeg',.85);URL.revokeObjectURL(url);saveP();showProfile();toast('Photo updated')};
 img.onerror=()=>toast('That file is not an image');img.src=url;
};
showProfile();
refreshAssistantScope();
all();
function fillLoginForm(){
 $('loginName').value=profile.name||'';
 $('loginRoll').value=profile.roll||'';
 $('loginBranch').value=validBranch(profile.dept);
 $('loginRegistration').value=profile.registrationNo||'';
}
function enterDashboard(){
 $('introScreen').hidden=true;
 $('loginScreen').hidden=true;
 $('appShell').hidden=false;
 showProfile();
 all();
 dashboardUnlocked=true;
 checkBrowserReminders();
}
function showLogin(){
 $('introScreen').hidden=true;
 $('appShell').hidden=true;
 $('loginScreen').hidden=false;
 $('loginError').textContent='';
 $('loginName').focus();
}
function showIntroduction(){
 $('appShell').hidden=true;
 $('loginScreen').hidden=true;
 $('introScreen').hidden=false;
}
function beginLogin(){showLogin()}
 $('introGetStarted').addEventListener('click',beginLogin);
 $('introLoginTop').addEventListener('click',beginLogin);
 $('introLoginMain').addEventListener('click',beginLogin);
 $('introLoginBottom').addEventListener('click',beginLogin);
 $('loginBack').addEventListener('click',showIntroduction);
fillLoginForm();
$('switchStudent').addEventListener('click',()=>{
 try{localStorage.removeItem('sv-student-session');sessionStorage.removeItem('sv-student-session')}
 catch(error){console.error('Could not clear the saved student session:',error);toast('Could not clear the saved student session in this browser.');return}
 dashboardUnlocked=false;
 fillLoginForm();
 showLogin();
});
$('logoutBtn').addEventListener('click',()=>{
 try{localStorage.removeItem('sv-student-session');sessionStorage.removeItem('sv-student-session')}
 catch(error){console.error('Could not end the student session:',error);toast('Could not end the saved session in this browser.');return}
 dashboardUnlocked=false;
 $('loginForm').reset();
 showIntroduction();
});
try{
 if((localStorage.getItem('sv-student-session')==='active'||sessionStorage.getItem('sv-student-session')==='active')&&profile.name&&profile.roll&&profile.dept&&profile.registrationNo){
  enterDashboard();
 }
}catch(error){console.error('Could not restore student session:',error)}
$('loginForm').addEventListener('submit',e=>{
 e.preventDefault();
 const name=$('loginName').value.trim(),roll=$('loginRoll').value.trim(),branch=validBranch($('loginBranch').value),registrationNo=$('loginRegistration').value.trim();
 if(!name||!roll||!branch||!registrationNo){$('loginError').textContent='Please complete all four student details and select a valid branch.';return}
 profile={...profile,name,roll,dept:branch,registrationNo};
 showProfile();
 let saved=false;
 try{
  localStorage.setItem('sv-profile',JSON.stringify(profile));
  localStorage.setItem('sv-student-session','active');
  saved=true;
 }catch(error){
  console.error('Could not persist student sign-in:',error);
  try{sessionStorage.setItem('sv-student-session','active');saved=true}
  catch(sessionError){console.error('Could not preserve the active student session:',sessionError)}
 }
 if(!saved){$('loginError').textContent='Could not save your student details. Enable browser storage and try again.';return}
 enterDashboard();
});
