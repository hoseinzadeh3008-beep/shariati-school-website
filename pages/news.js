(async()=>{
  const root=document.getElementById('newsList');
  if(!root)return;
  try{
    const res=await fetch('../data/news.json',{cache:'no-store'});
    if(!res.ok)throw Error('news unavailable');
    const data=await res.json();
    const items=Array.isArray(data)?data.filter(x=>x&&x.published===true):[];
    root.replaceChildren();
    if(!items.length){root.textContent='در حال حاضر خبر یا اطلاعیه‌ای برای نمایش ثبت نشده است.';return;}
    items.sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
    for(const item of items){
      const article=document.createElement('article');article.className='notice';
      if(item.image){
        const image=document.createElement('img');
        image.src=item.image.startsWith('/')?'..'+item.image:item.image;
        image.alt=item.title||'تصویر خبر';image.loading='lazy';
        image.style.cssText='display:block;width:100%;max-height:340px;object-fit:cover;border-radius:12px;margin:0 0 14px';
        article.append(image);
      }
      const top=document.createElement('div');top.className='notice-top';
      const category=document.createElement('span');category.textContent=item.category||'اطلاعیه';
      const date=document.createElement('small');date.textContent=item.date||'';
      top.append(category,date);
      const title=document.createElement('h3');title.textContent=item.title||'بدون عنوان';
      const summary=document.createElement('p');summary.textContent=item.summary||'';
      summary.style.whiteSpace='pre-line';
      article.append(top,title,summary);
      if(item.body){
        const body=document.createElement('div');body.className='notice-body';
        body.textContent=item.body;body.style.cssText='white-space:pre-line;color:var(--muted);font-size:14px;line-height:2;margin-top:10px';
        article.append(body);
      }
      root.append(article);
    }
  }catch(e){root.textContent='دریافت اخبار در حال حاضر امکان‌پذیر نیست. لطفاً بعداً دوباره مراجعه کنید.';}
})();