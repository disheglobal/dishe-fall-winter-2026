const app=document.getElementById('app');
let db={products:[]};
const ASSET_VERSION=Date.now();

let MENU_ITEMS=[
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

MENU_ITEMS=[
  ['SUIT','Suits','Костюмы'],['VEST','Vests','Жилетки'],['SHIRT','Shirts','Рубашки'],
  ['PANTS','Jeans','Джинсы'],['JACKET','Jackets','Жакеты'],['SKIRT','Skirts','Юбки'],
  ['OUTFIT','Outerwear','Верхняя одежда'],['LEATHER','Leather','Кожа'],['KNITWEAR','Knitwear','Трикотаж'],
  ['BAG','Bags','Сумки и аксессуары'],['BIG_SIZE','Plus Size','Большие размеры'],['DRESS','Dresses','Платья']
];

const clickIcon=()=>`<span class="click-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M13.2 15.4V6.9a2.2 2.2 0 0 1 4.4 0v7.2-2.1a2.1 2.1 0 0 1 4.2 0v1.1a2.1 2.1 0 0 1 4.2 0v1.4a2.1 2.1 0 0 1 4.2 0v5.4c0 5.4-3.2 8.4-8.1 8.4h-2.4c-3.1 0-5.4-1.4-7-3.9l-4.1-6.5a2.3 2.3 0 0 1 3.6-2.8l1 1.3Z"/><path d="M7 5.8 4.8 3.6M11.3 3.9V1M6 10H2.8"/></svg></span>`;

const menuButton=(key,en,ru)=>`<button class="lux-button menu-category" data-c="${key}" aria-label="${en}"><span class="lux-copy"><span class="lux-en">${en}</span><span class="lux-ru">${ru}</span></span>${clickIcon()}</button>`;
const categoriesButton=()=>`<button class="lux-button categories-button" aria-label="Categories"><span class="lux-copy"><span class="lux-en">Categories</span></span>${clickIcon()}</button>`;

const CATEGORY_ICONS={
  BIG_SIZE:'<path d="M28 17h24l11 17-10 11-4-7v46H31V38l-4 7-10-11 11-17ZM40 17v67"/>',
  DRESS:'<path d="M35 17 25 32l8 10-16 42h46L47 42l8-10-10-15M29 43h22"/>',
  JACKET:'<path d="M30 18h20l13 18-9 11-5 37H31l-5-37-9-11 13-18ZM40 18v66M31 37l9 9 9-9"/>',
  PANTS:'<path d="M25 16h30l-3 68H41l-1-38-1 38H28l-3-68ZM25 29h30"/>',
  KNITWEAR:'<path d="M29 19 18 34l10 10 3-7v47h18V37l3 7 10-10-11-15-11 8-11-8Z"/><path d="M31 52h18M31 63h18M31 74h18"/>',
  SHIRT:'<path d="m31 17 9 8 9-8 13 16-9 10-4-6v47H31V37l-4 6-9-10 13-16ZM40 25v59M34 42h12"/>',
  SKIRT:'<path d="M29 19h22l11 65H18l11-65ZM29 19h22M26 42h28"/>',
  SUIT:'<path d="M28 18h24l12 18-10 10-5-8v46H31V38l-5 8-10-10 12-18ZM40 18v66"/><path d="M33 35h14"/>',
  LEATHER:'<path d="M30 18h20l13 19-10 10-4-8v45H31V39l-4 8-10-10 13-19ZM40 18v66"/><path d="m31 39 9 8 9-8"/>',
  OUTFIT:'<path d="M31 17h18l12 18-9 10-4-7v23H32V38l-4 7-9-10 12-18Z"/><path d="M31 61h18l5 23H26l5-23Z"/>',
  VEST:'<path d="M31 17h18l11 18-9 10-4-7v46H33V38l-4 7-9-10 11-18ZM40 17v67"/>',
  BAG:'<path d="M19 37h42v40H19V37ZM29 37v-7c0-12 22-12 22 0v7M19 49h42"/>'
};
const CATEGORY_COVER_EXT={DRESS:'png',JACKET:'png',VEST:'jpg',OUTFIT:'jpg',SHIRT:'png',KNITWEAR:'jpg',SUIT:'png',SKIRT:'jpg',PANTS:'png',LEATHER:'png',BAG:'png',BIG_SIZE:'jpg'};
const categoryTile=([key,en,ru])=>`<button class="category-tile" data-c="${key}" aria-label="${en}"><span class="category-visual"><img class="category-cover-image" src="assets/categories/${key}.${CATEGORY_COVER_EXT[key]||'jpg'}?v=${ASSET_VERSION}" alt=""><svg class="category-icon" viewBox="0 0 80 100" aria-hidden="true">${CATEGORY_ICONS[key]||CATEGORY_ICONS.JACKET}</svg></span><span class="category-copy"><span class="category-name">${en}</span><span class="category-name-ru">${ru}</span></span></button>`;
const capsuleTile=(name,klass)=>`<article class="capsule-tile ${klass}"><span>CAPSULE</span><b>${name}</b><small>COMING SOON</small></article>`;
const categoryMenuMarkup=(extraClass='')=>`<div class="category-home ${extraClass}"><section class="category-hero"><img src="assets/category-hero.jpg?v=${ASSET_VERSION}" alt="D.SHE Fall Winter 2026"></section><section class="category-section"><header class="section-heading"><h2>Categories</h2><p>SHOP BY CATEGORY</p></header><div class="category-grid">${MENU_ITEMS.map(categoryTile).join('')}</div></section><section class="capsules-section"><header class="section-heading"><h2>Capsules</h2><p>CURATED EDITS</p></header><div class="capsule-grid">${capsuleTile('DENIM EDIT','capsule-large capsule-denim')}${capsuleTile('LEATHER LINE','capsule-leather')}${capsuleTile('RED EDIT','capsule-red')}${capsuleTile('EVENING','capsule-evening')}</div></section></div>`;
const bindCategoryTiles=(scope=document)=>scope.querySelectorAll('.category-tile').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openCategory(b.dataset.c)}));

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

async function legacyHome(){
  const has=await exists('assets/menu.jpg');
  if(!has){app.innerHTML='<div class="empty">MENU.JPG NOT FOUND</div>';return;}
  const buttons=MENU_ITEMS.map(item=>menuButton(...item)).join('');
  app.innerHTML=`<section class="screen home"><div class="menu-stage"><img class="menu-image" src="assets/menu.jpg?v=${Date.now()}" alt="D.SHE categories"><header class="brand-hero"><img class="brand-logo" src="assets/dishe-logo.png?v=${Date.now()}" alt="D•she"><div class="season-kicker"><span></span><b>NEW SEASON</b><span></span></div><div class="season-title">FALL / WINTER 2026</div></header><div class="menu-buttons">${buttons}</div></div></section>`;
  document.querySelectorAll('.menu-category').forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();
    openCategory(b.dataset.c);
  }));
}

async function home(){
  app.innerHTML=`<section class="screen home">${categoryMenuMarkup()}</section>`;
  bindCategoryTiles();
}

async function openCategory(cat){
  const slides=[];
  let startIndex=1;

  slides.push(`<article class="slide menu-return-slide">${categoryMenuMarkup('category-return-stage')}</article>`);

  MENU_ITEMS.forEach(([key,en,ru])=>{
    if(key===cat)startIndex=slides.length;
    slides.push(`<article class="slide cover" data-category="${key}"><div class="cover-stage"><img src="assets/menu.jpg?v=${ASSET_VERSION}" alt="${en}"><div class="cover-copy"><img class="cover-logo" src="assets/dishe-logo.png?v=${ASSET_VERSION}" alt="D.SHE"><div class="cover-new-season">NEW SEASON</div><div class="cover-season">FALL / WINTER 2026</div><div class="cover-title">${en}</div>${ru?`<div class="cover-subtitle">${ru}</div>`:''}<div class="cover-divider"><span></span><svg class="cover-diamond" viewBox="0 0 64 48" aria-hidden="true"><path d="M12 5h40l9 13-29 27L3 18 12 5Z"/><path d="m12 5 8 13 12-13 12 13 8-13M3 18h58M20 18l12 27 12-27"/></svg><span></span></div><button class="cover-swipe" type="button" aria-label="Categories">${clickIcon()}</button></div></div></article>`);

    db.products
      .filter(p=>p.category===key)
      .forEach(p=>slides.push(`<article class="slide product-slide"><div class="product-stage"><img data-src="${p.image}?v=${ASSET_VERSION}" alt="${p.title||p.code}" loading="lazy" decoding="async">${categoriesButton()}</div></article>`));
  });

  slides.push(`<article class="slide final-contact-slide"><div class="cover-stage"><img src="assets/menu.jpg?v=${ASSET_VERSION}" alt="D.SHE Contact Us"><div class="cover-copy end-copy"><img class="cover-logo" src="assets/dishe-logo.png?v=${ASSET_VERSION}" alt="D.SHE"><div class="cover-new-season">NEW SEASON</div><div class="cover-season">FALL / WINTER 2026</div><div class="cover-divider"><span></span><svg class="cover-diamond" viewBox="0 0 64 48" aria-hidden="true"><path d="M12 5h40l9 13-29 27L3 18 12 5Z"/><path d="m12 5 8 13 12-13 12 13 8-13M3 18h58M20 18l12 27 12-27"/></svg><span></span></div><button class="contact-button" type="button"><span class="lux-copy"><span class="lux-en">CONTACT US</span><span class="lux-ru">СВЯЖИТЕСЬ С НАМИ</span></span>${clickIcon()}</button></div></div></article>`);

  app.innerHTML=`<section class="screen viewer"><div class="slides">${slides.join('')}</div><div class="hint"></div></section>`;

  document.querySelectorAll('.categories-button').forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();
    e.stopPropagation();
    home();
  }));

  document.querySelectorAll('.cover-swipe').forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();
    e.stopPropagation();
    home();
  }));

  bindCategoryTiles(document.querySelector('.menu-return-slide'));

  const el=document.querySelector('.slides');
  const loadSlideImages=(center,radius=2)=>{
    const first=Math.max(0,center-radius);
    const last=Math.min(el.children.length-1,center+radius);
    for(let i=first;i<=last;i++){
      el.children[i].querySelectorAll('img[data-src]').forEach(img=>{
        img.src=img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  };
  const showSelectedCover=()=>{el.scrollLeft=startIndex*el.clientWidth};
  loadSlideImages(startIndex);
  showSelectedCover();
  requestAnimationFrame(showSelectedCover);

  let returnTimer;
  el.addEventListener('scroll',()=>{
    loadSlideImages(Math.round(el.scrollLeft/el.clientWidth));
    clearTimeout(returnTimer);
    returnTimer=setTimeout(()=>{
      if(el.scrollLeft<el.clientWidth*.12)home();
    },120);
  },{passive:true});
}
