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
  const slides=[];
  const returnButtons=MENU_ITEMS.map(item=>menuButton(...item)).join('');
  let startIndex=1;

  slides.push(`<article class="slide menu-return-slide"><div class="menu-stage"><img class="menu-image" src="assets/menu.jpg?v=${ASSET_VERSION}" alt="D.SHE categories"><header class="brand-hero"><img class="brand-logo" src="assets/dishe-logo.png?v=${ASSET_VERSION}" alt="D.SHE"><div class="season-kicker"><span></span><b>NEW SEASON</b><span></span></div><div class="season-title">FALL / WINTER 2026</div></header><div class="menu-buttons">${returnButtons}</div></div></article>`);

  MENU_ITEMS.forEach(([key,en,ru])=>{
    if(key===cat)startIndex=slides.length;
    slides.push(`<article class="slide cover" data-category="${key}"><div class="cover-stage"><img src="assets/menu.jpg?v=${ASSET_VERSION}" alt="${en}"><div class="cover-copy"><img class="cover-logo" src="assets/dishe-logo.png?v=${ASSET_VERSION}" alt="D.SHE"><div class="cover-new-season">NEW SEASON</div><div class="cover-season">FALL / WINTER 2026</div><div class="cover-title">${en}</div>${ru?`<div class="cover-subtitle">${ru}</div>`:''}<div class="cover-divider"><span></span><svg class="cover-diamond" viewBox="0 0 64 48" aria-hidden="true"><path d="M12 5h40l9 13-29 27L3 18 12 5Z"/><path d="m12 5 8 13 12-13 12 13 8-13M3 18h58M20 18l12 27 12-27"/></svg><span></span></div><div class="cover-swipe" aria-hidden="true">${clickIcon()}</div></div></div></article>`);

    db.products
      .filter(p=>p.category===key)
      .forEach(p=>slides.push(`<article class="slide product-slide"><div class="product-stage"><img src="${p.image}?v=${ASSET_VERSION}" alt="${p.title||p.code}">${categoriesButton()}</div></article>`));
  });

  slides.push(`<article class="slide final-contact-slide"><div class="cover-stage"><img src="assets/menu.jpg?v=${ASSET_VERSION}" alt="D.SHE Contact Us"><div class="cover-copy end-copy"><img class="cover-logo" src="assets/dishe-logo.png?v=${ASSET_VERSION}" alt="D.SHE"><div class="cover-new-season">NEW SEASON</div><div class="cover-season">FALL / WINTER 2026</div><div class="cover-divider"><span></span><svg class="cover-diamond" viewBox="0 0 64 48" aria-hidden="true"><path d="M12 5h40l9 13-29 27L3 18 12 5Z"/><path d="m12 5 8 13 12-13 12 13 8-13M3 18h58M20 18l12 27 12-27"/></svg><span></span></div><button class="contact-button" type="button"><span class="lux-copy"><span class="lux-en">CONTACT US</span><span class="lux-ru">СВЯЖИТЕСЬ С НАМИ</span></span>${clickIcon()}</button></div></div></article>`);

  app.innerHTML=`<section class="screen viewer"><div class="slides">${slides.join('')}</div><div class="hint"></div></section>`;

  document.querySelectorAll('.categories-button').forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();
    e.stopPropagation();
    home();
  }));

  document.querySelectorAll('.menu-return-slide .menu-category').forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();
    openCategory(b.dataset.c);
  }));

  const el=document.querySelector('.slides');
  const showSelectedCover=()=>{el.scrollLeft=startIndex*el.clientWidth};
  showSelectedCover();
  requestAnimationFrame(showSelectedCover);

  let returnTimer;
  el.addEventListener('scroll',()=>{
    clearTimeout(returnTimer);
    returnTimer=setTimeout(()=>{
      if(el.scrollLeft<el.clientWidth*.12)home();
    },120);
  },{passive:true});
}
