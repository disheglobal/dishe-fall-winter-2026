// The button belongs to the product stage, so category and search views share it.
(() => {
  const prepare = () => {
    document.querySelectorAll('.product-stage').forEach(stage => {
      if(stage.querySelector('.reversible-button'))return;
      const photo=stage.querySelector('img');
      if(!photo)return;
      const source=(photo.getAttribute('src')||photo.dataset.src||'').split('?')[0];
      const product=db.products.find(p=>p.reversible&&p.reverse_image&&p.image===source);
      if(!product)return;
      const button=document.createElement('button');
      button.type='button';button.className='reversible-button';
      button.setAttribute('aria-label','Показать другую сторону');
      button.setAttribute('aria-pressed','false');
      button.innerHTML='<img src="assets/reversible-arrows.png" alt=""><span>Нажми</span>';
      let reverse=false;
      button.addEventListener('click',event=>{
        event.preventDefault();event.stopPropagation();
        if(button.disabled)return;
        const next=!reverse;
        const target=(next?product.reverse_image:product.image)+'?v='+ASSET_VERSION;
        button.disabled=true;
        const preload=new Image();
        preload.onload=async()=>{
          photo.removeAttribute('data-src');photo.src=target;
          if(photo.decode)await photo.decode().catch(()=>{});
          reverse=next;button.disabled=false;
          button.setAttribute('aria-pressed',String(reverse));
          button.setAttribute('aria-label',reverse?'Показать первую сторону':'Показать другую сторону');
        };
        preload.onerror=()=>{button.disabled=false;button.setAttribute('aria-label','Не удалось загрузить. Нажмите ещё раз');};
        preload.src=target;
      });
      stage.append(button);
    });
  };
  new MutationObserver(prepare).observe(document.getElementById('app'),{childList:true,subtree:true});
  prepare();
})();
