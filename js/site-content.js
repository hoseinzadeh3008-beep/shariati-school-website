(async function(){
  const base=location.pathname.includes('/pages/')?'../':'./';
  const text=(el,value)=>{if(el&&value!==undefined)el.textContent=value};
  const make=(tag,cls,value)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(value!==undefined)el.textContent=value;return el};
  try{
    const response=await fetch(base+'data/site.json',{cache:'no-store'});if(!response.ok)throw new Error('site content unavailable');
    const data=await response.json();
    const isHome=!location.pathname.includes('/pages/');
    if(isHome){
      const h=document.querySelector('.hero h1');if(h){h.replaceChildren(document.createTextNode(data.home.heroTitle+' '),Object.assign(make('span','',data.home.heroHighlight),{}));}
      text(document.querySelector('.hero .eyebrow'),data.home.heroEyebrow);text(document.querySelector('.hero p'),data.home.heroText);
      const heroImg=document.querySelector('.hero-photo');if(heroImg){heroImg.src=data.home.heroImage;heroImg.alt=data.home.heroImageAlt||'';}text(document.querySelector('.hero-photo-caption'),data.home.heroImageCaption);
      const about=document.querySelector('.about-copy');if(about){text(about.querySelector('.kicker'),data.home.aboutKicker);text(about.querySelector('h3'),data.home.aboutTitle);text(about.querySelector('p'),data.home.aboutText);const list=about.querySelector('.feature-list');if(list){list.replaceChildren(...(data.home.aboutFeatures||[]).map(v=>{const d=make('div','feature');d.append(make('b','','✓'),document.createTextNode(' '+v));return d;}));}}
      const org=document.querySelector('.org-wrap');if(org){const manager=org.querySelector('.org-manager');if(manager){text(manager.querySelector('h3'),data.home.managerName);const roles=manager.querySelectorAll('.org-role');text(roles[0],'مدیریت هنرستان');text(roles[1],data.home.managerRole);}
        const groups=org.querySelectorAll('.org-deputies,.org-fields');const titleNodes=org.querySelectorAll('.org-branch-title');if(titleNodes[0])text(titleNodes[0],'معاونت‌ها');if(titleNodes[1])text(titleNodes[1],'سرپرستان رشته‌های آموزشی');
        if(groups[0])groups[0].replaceChildren(...(data.home.deputies||[]).map(x=>{const n=make('div','org-node');n.append(make('strong','',x.role),make('small','',x.names));return n;}));
        if(groups[1])groups[1].replaceChildren(...(data.home.departments||[]).map(x=>{const n=make('div','org-node');n.append(make('strong','',x.title),make('small','', 'سرپرست: '+x.supervisor));return n;}));
        const heads=org.parentElement.querySelectorAll('.section-head');if(heads[0]){text(heads[0].querySelector('h2'),data.home.organizationTitle);text(heads[0].querySelector('p'),data.home.organizationSubtitle);}
      }
      const fields=document.querySelector('#fields');if(fields){const head=fields.querySelector('.section-head');if(head){text(head.querySelector('h2'),data.home.fieldsTitle);text(head.querySelector('p'),data.home.fieldsIntro);}const cards=fields.querySelector('.cards');if(cards)cards.replaceChildren(...(data.fields||[]).map(f=>{const a=make('a','field-card');a.href='/pages/'+f.slug;a.append(make('div','field-icon',f.icon),make('h3','',f.name),make('p','',f.description),make('span','field-label','آموزش فنی و مهارتی'));return a;}));}
      const news=document.querySelector('#news .section-head');if(news){text(news.querySelector('h2'),data.home.newsTitle);text(news.querySelector('p'),data.home.newsIntro);}
      const contact=document.querySelector('#contact');if(contact){const head=contact.querySelector('.section-head');text(head?.querySelector('h2'),data.home.contactTitle);text(head?.querySelector('p'),data.home.contactIntro);const box=contact.querySelectorAll('.contact-box');if(box[1]){text(box[1].querySelector('h3'),data.home.contactMessageTitle);text(box[1].querySelector('p'),data.home.contactMessage);}}
    }else{
      const path=location.pathname.split('/').pop();
      if(path==='about.html'){
        text(document.querySelector('.hero h1'),data.about.title);text(document.querySelector('.hero p'),data.about.subtitle);
        const main=document.querySelector('main.content');if(main){const photo=main.querySelector('.photo-grid');main.replaceChildren();if(photo)main.append(photo);main.append(make('h2','',data.about.introTitle),make('p','',data.about.introText),make('h2','',data.about.approachTitle));const grid=make('div','grid');(data.about.approach||[]).forEach(x=>{const card=make('article','card');card.append(make('span','tag',x.tag),make('h3','',x.title),make('p','',x.description));grid.append(card);});main.append(grid);const link=make('a','btn','مشاهده رشته‌های هنرستان');link.href='fields.html';const p=make('p');p.append(link);main.append(p);}
      }
      if(path==='fields.html'){
        text(document.querySelector('.hero h1'),data.fieldsPage.title);text(document.querySelector('.hero p'),data.fieldsPage.subtitle);
        const grid=document.querySelector('main.content .grid');if(grid)grid.replaceChildren(...(data.fields||[]).map((f,i)=>{const a=make('a','card');a.href=f.slug;a.append(make('span','tag',String(i+1)),make('h3','',f.name),make('p','',f.description));return a;}));
      }
      if(path==='contact.html'){
        text(document.querySelector('.hero h1'),data.contact.title);text(document.querySelector('.hero p'),data.contact.subtitle);
        const main=document.querySelector('main.content');if(main){main.replaceChildren(make('h2','','اطلاعات تماس'));const card=make('div','card');const row=make('div','contact-row');row.append(make('b','', 'نشانی هنرستان'),make('span','',data.contact.address));card.append(row);(data.contact.contacts||[]).forEach(c=>{const r=make('div','contact-row');r.append(make('b','',c.label));const a=make('a','',c.display);a.href='tel:'+c.phone;a.dir='ltr';r.append(a);card.append(r);});main.append(card);const msg=make('div','card');msg.style.marginTop='18px';msg.append(make('h3','',data.contact.messageTitle),make('p','',data.contact.message));main.append(msg);}
      }
    }
    document.querySelectorAll('footer .container span,footer .footer-inner span').forEach((el,i)=>{if(i===1)text(el,data.brand.tagline);});
  }catch(e){console.warn('Editable school content could not be loaded',e);}
})();