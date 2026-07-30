const app=document.getElementById('app');
let db={products:[]};
const ASSET_VERSION=Date.now();

const MENU_ITEMS=[
  ['BIG_SIZE','BIG SIZE','БОЛЬШИЕ РАЗМЕРЫ'],
  ['DRESS','DRESS','ПЛАТЬЯ'],
  ['JACKET','JACKET','ДЖИНСОВКИ'],
  ['PANTS','PANTS','ДЖИНСЫ'],
  ['KNITWEAR','KNITWEAR','ТРИКОТАЖ'],
  ['SHIRT','SHIRT','РУБАШКИ'],
  ['SKIRT','SKIRT','ЮБКИ'],
  ['SUIT','SUIT','КОМПЛЕКТЫ'],
  ['LEATHER','LEATHER','КОЖА'],
  ['OUTFIT','OUTFIT','ВЕРХНЯЯ ОДЕЖДА'],
  ['BAG','BAG','СУМКИ/АКСЕССУАРЫ']
];

const clickIcon=()=>`<span class="click-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M13.2 15.4V6.9a2.2 2.2 0 0 1 4.4 0v7.2-2.1a2.1 2.1 0 0 1 4.2 0v1.1a2.1 2.1 0 0 1 4.2 0v1.4a2.1 2.1 0 0 1 4.2 0v5.4c0 5.4-3.2 8.4-8.1 8.4h-2.4c-3.1 0-5.4-1.4-7-3.9l-4.1-6.5a2.3 2.3 0 0 1 3.6-2.8l1 1.3Z"/><path d="M7 5.8 4.8 3.6M11.3 3.9V1M6 10H2.8"/></svg></span>`;

const menuButton=(key,en,ru)=>`<button class="lux-button menu-category" data-c="${key}" aria-label="${en}"><span class="lux-copy"><span class="lux-en">${en}</span><span class="lux-ru">${ru}</span></span>${clickIcon()}</button>`;
const categoriesButton=()=>`<button class="lux-button categories-button" aria-label="Categories"><span class="lux-copy"><span class="lux-en">CATEGORIES</span></span>${clickIcon()}</button>`;

fetch('data/catalog.json',{cache:'no-store'})
  .then(r=>r.json())
  .then(j=>{db=j;home()})
  .catch(()=>app.innerHTML='<div class="empty">CATALOG ERROR</div>');

const exists=src=>new Promise(ok=>{
  const i=new Image();
  i.onload=()=>ok(true);
  i.onerror=()=>ok(false);
  i.src=src+'?v='+Date.now();
});

async function home(){
  const has=await exists('assets/menu.jpg');
  if(!has){app.innerHTML='<div class="empty">MENU.JPG NOT FOUND</div>';return;}
  const buttons=MENU_ITEMS.map(item=>menuButton(...item)).join('');
  app.innerHTML=`<section class="screen home"><div class="menu-stage"><img class="menu-image" src="assets/menu.jpg?v=${Date.now()}" alt="D.SHE categories"><header class="brand-hero"><img class="brand-logo" src="assets/dishe-logo.png?v=${Date.now()}" alt="D•she"><div class="season-kicker"><span></span><b>NEW SEASON</b><span></span></div><div class="season-title">FALL / WINTER 2026</div></header><div class="menu-buttons">${buttons}</div></div></section>`;
  document.querySelectorAll('.menu-category').forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();
    openCategory(b.dataset.c);
  }));
}

async function openCategory(cat){
  const products=db.products.filter(p=>p.category===cat);
  const category=MENU_ITEMS.find(item=>item[0]===cat);
  const coverEn=category?.[1]||cat;
  const coverRu=category?.[2]||'';
  const hasEnd=await exists('assets/END.jpg');
  const slides=[];

  slides.push(`<article class="slide cover"><div class="cover-stage"><img src="assets/menu.jpg?v=${ASSET_VERSION}" alt="${coverEn}"><div class="cover-copy"><img class="cover-logo" src="assets/dishe-logo.png?v=${ASSET_VERSION}" alt="D.SHE"><div class="cover-new-season">NEW SEASON</div><div class="cover-season">FALL / WINTER 2026</div><div class="cover-title">${coverEn}</div>${coverRu?`<div class="cover-subtitle">${coverRu}</div>`:''}<div class="cover-divider"><span></span><svg class="cover-diamond" viewBox="0 0 64 48" aria-hidden="true"><path d="M12 5h40l9 13-29 27L3 18 12 5Z"/><path d="m12 5 8 13 12-13 12 13 8-13M3 18h58M20 18l12 27 12-27"/></svg><span></span></div><div class="cover-swipe" aria-hidden="true">${clickIcon()}</div></div></div></article>`);

  products.forEach(p=>slides.push(`<article class="slide product-slide"><div class="product-stage"><img src="${p.image}?v=${ASSET_VERSION}" alt="${p.title||p.code}">${categoriesButton()}</div></article>`));

  if(hasEnd){
    slides.push(`<article class="slide end-slide"><div class="product-stage"><img src="assets/END.jpg?v=${ASSET_VERSION}" alt="End">${categoriesButton()}</div></article>`);
  }

  app.innerHTML=`<section class="screen viewer"><div class="slides">${slides.join('')}</div><div class="hint"></div></section>`;

  document.querySelectorAll('.categories-button').forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();
    e.stopPropagation();
    home();
  }));

  const el=document.querySelector('.slides');
  const coverStage=document.querySelector('.cover-stage');
  let touchStartX=0;
  let touchStartY=0;

  coverStage?.addEventListener('touchstart',e=>{
    const touch=e.changedTouches[0];
    touchStartX=touch.clientX;
    touchStartY=touch.clientY;
  },{passive:true});

  coverStage?.addEventListener('touchend',e=>{
    const touch=e.changedTouches[0];
    const dx=touch.clientX-touchStartX;
    const dy=touch.clientY-touchStartY;
    if(Math.abs(dx)<55||Math.abs(dx)<=Math.abs(dy))return;
    if(dx>0){
      home();
    }else if(el.children.length>1){
      el.scrollTo({left:el.clientWidth,behavior:'smooth'});
    }
  },{passive:true});
}
