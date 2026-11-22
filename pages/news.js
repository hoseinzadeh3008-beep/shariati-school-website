(async()=>{
  const root=document.getElementById('newsList');
  if(!root)return;
  const make=(tag,cls,value)=>{
    const el=document.createElement(tag);
    if(cls)el.className=cls;
    if(value!==undefined)el.textContent=value;
    return el;
  };
  try{
    const [newsResponse,siteResponse]=await Promise.all([
      fetch('../data/news.json',{cache:'no-store'}),
      fetch('../data/site.json',{cache:'no-store'})
    ]);
    if(!newsResponse.ok)throw Error('news unavailable');
    const data=await newsResponse.json();
    const site=siteResponse.ok?await siteResponse.json():{};
    const page=site.newsPage||{};
    const items=Array.isArray(data)?data.filter(x=>x&&x.published===true):[];
    root.replaceChildren();
    if(!items.length){
      root.textContent=page.emptyText||'در حال حاضر خبر یا اطلاعیه منتشرشده‌ای برای نمایش وجود ندارد.';
      return;
    }
    items.sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
    const categories=[...new Set(items.map(x=>x.category||'اطلاعیه'))];
    const filters=make('div','news-filters');
    const list=make('div','news-results');
    const allLabel=page.allLabel||'همه خبرها';
    const buttons=[];
    function render(selected){
      list.replaceChildren();
      buttons.forEach(button=>{
        const active=button.dataset.category===selected;
        button.classList.toggle('active',active);
        button.setAttribute('aria-pressed',String(active));
      });
      const visible=selected==='*'?items:items.filter(item=>(item.category||'اطلاعیه')===selected);
      visible.forEach(item=>{
        const article=make('article','notice');
        if(item.image){
          const image=make('img');
          image.src=item.image.startsWith('/')?'..'+item.image:item.image;
          image.alt=item.title||'تصویر خبر';
          image.loading='lazy';
          image.style.cssText='display:block;width:100%;max-height:340px;object-fit:cover;border-radius:12px;margin:0 0 14px';
          article.append(image);
        }
        const top=make('div','notice-top');
        top.append(make('span','',item.category||'اطلاعیه'),make('small','',item.date||''));
        article.append(top,make('h3','',item.title||'بدون عنوان'));
        const summary=make('p','',item.summary||'');
        summary.style.whiteSpace='pre-line';
        article.append(summary);
        if(item.body){
          const body=make('div','notice-body',item.body);
          body.style.cssText='white-space:pre-line;color:var(--muted);font-size:14px;line-height:2;margin-top:10px';
          article.append(body);
        }
        list.append(article);
      });
    }
    const choices=[{label:allLabel,value:'*'},...categories.map(category=>({label:category,value:category}))];
    choices.forEach(choice=>{
      const button=make('button','news-filter',choice.label);
      button.type='button';
      button.dataset.category=choice.value;
      button.addEventListener('click',()=>render(choice.value));
      buttons.push(button);
      filters.append(button);
    });
    root.append(filters,list);
    render('*');
  }catch(e){
    root.textContent='دریافت اخبار در حال حاضر امکان‌پذیر نیست. لطفاً بعداً دوباره مراجعه کنید.';
  }
})();