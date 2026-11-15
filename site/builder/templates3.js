'use strict';
/* Page builder, home-page compositions (15 November 2026).
   The templates in templates.js and templates2.js were all built on one run: hero, stats, feature cards, quote, call to action.
   This file re-composes each home page so the templates differ: heroes led by type or by one wide photograph, numbered
   hairline lists in place of boxed cards, staggered work grids, and pictures that match the subject (no generated films in
   a hero). It only rearranges and re-dresses what a template already says; the words stay as they were written.
   Each entry gets the home page's blocks ([{id, vals, links}]) and edits the array in place. */
(()=>{
const PB=window.PB;if(!PB||!PB.templates)return;
const rowsOf=s=>String(s||'').split('\n').filter(Boolean).map(r=>r.split('|').map(c=>c.trim()));
const noIcon=s=>rowsOf(s).map(c=>c.slice(1).join(' | ')).join('\n');            /* "icon | title | text" -> "title | text" */
const firstThree=s=>rowsOf(s).slice(0,3).map(c=>c.join(' | ')).join('\n');
const at=(B,id)=>B.findIndex(b=>b.id===id);
const clean=o=>{Object.keys(o).forEach(k=>o[k]==null&&delete o[k]);return o};
/* swap the first block (the hero) for another hero, keeping its words and button links */
const hero=(B,to,extra)=>{const h=B[0],v=h.vals;B[0]={id:to,vals:clean({kicker:v.kicker||v.badge,heading:v.heading,intro:v.intro,b1:v.b1,b2:v.b2,...extra}),links:h.links}};
/* a hero with three facts: the facts come from the page's stats band, which is then dropped */
const typeHero=(B,extra)=>{const i=at(B,'stats');const facts=i>=0?firstThree(B[i].vals.stats):null;hero(B,'hero-type',{facts,...extra});if(i>=0)B.splice(i,1)};
const cardsToList=B=>{const i=at(B,'feature-grid');if(i>=0){const v=B[i].vals;B[i]={id:'list-rows',vals:clean({kicker:v.kicker,heading:v.heading,items:noIcon(v.items)})}}};
const cardsToSplit=(B,button,link)=>{const i=at(B,'feature-grid');if(i>=0){const v=B[i].vals;B[i]={id:'split-sticky',vals:clean({kicker:v.kicker,heading:v.heading,intro:v.intro,button,items:noIcon(v.items)}),links:link?{0:link}:undefined}}};
const photo=(B,img,alt)=>{B[0].vals.img=img;B[0].vals.alt=alt};
const work=(B,after,vals,to)=>{const n=rowsOf(vals.items).length,links={};for(let k=0;k<=n;k++)links[k]=to;B.splice(after,0,{id:'work-grid',vals,links})};
const P='photos/';
const R={
 portfolio(B){hero(B,'hero-big',{note:'Lisbon · Independent',img:P+'workspace-laptop-and-books.webp',alt:'A laptop and a stack of books on a desk'});
  work(B,2,{kicker:'Selected work',heading:'Recent projects.',button:'All work',items:'shelf/amber.webp | Larder & Co | Identity and packaging\nshelf/sumi.webp | Tinta | Website\nshelf/lighthouse.webp | Farol | Brand refresh\nshelf/bloom.webp | Flor | Illustration system'},'page:work')},
 agency(B){typeHero(B);
  work(B,2,{kicker:'Selected work',heading:'Products in the wild.',button:'All work',items:P+'workspace-laptop-on-a-desk.webp | Kettle & Co | Ordering app\n'+P+'tech-statistics-on-a-laptop.webp | Ember | Analytics dashboard\n'+P+'office-on-the-shelf.webp | Olive Row | Brand and website\n'+P+'workspace-desktop-after-work.webp | Brine Bros | Design system'},'page:work');
  cardsToList(B)},
 saas(B){typeHero(B)},
 restaurant(B){hero(B,'hero-big',{note:'Hackney · Wednesday to Sunday',img:P+'food-bread-on-the-table.webp',alt:'Bread and plates on a shared table'})},
 photographer(B){hero(B,'hero-big',{note:'Documentary and portrait',img:P+'nature-mountain-lake-in-the-summer.webp',alt:'A mountain lake in summer light'})},
 event(B){const i=at(B,'x-film');if(i>=0)B[i]={id:'image-full',vals:{img:P+'event-your-stage.webp',alt:'A lit stage seen from the crowd',caption:'Last year in the old mill.'}}},
 nonprofit(B){photo(B,P+'food-bread-on-the-table.webp','Bread and plates on a shared table');cardsToList(B)},
 course(B){hero(B,'hero-image',{img:P+'hands-pottery-wheel.webp',alt:'Hands shaping clay on a pottery wheel'})},
 app(B){photo(B,P+'tech-statistics-on-a-laptop.webp','Spending charts on a laptop screen')},
 'lp-app'(B){photo(B,P+'tech-statistics-on-a-laptop.webp','Spending charts on a laptop screen')},
 coffee(B){cardsToList(B)},
 fitness(B){const to=(B[0].links||{})[0];hero(B,'hero-big',{note:'Bristol · Classes of eight',img:P+'fitness-starting-line.webp',alt:'Runners set at a starting line'});cardsToSplit(B,B[0].vals.b1||'Book a free class',to)},
 law(B){cardsToList(B)},
 podcast(B){hero(B,'hero-image',{img:P+'podcast-microphone.webp',alt:'A studio microphone'})},
 conference(B){typeHero(B)},
 'lp-launch'(B){const i=at(B,'hero-film');if(i>=0){const h=B[i],v=h.vals;B[i]={id:'hero-type',vals:clean({kicker:v.kicker,heading:v.heading,intro:v.intro,b1:v.b1,b2:v.b2,facts:'3 | new themes in this release\n38 min | saved on each call write-up\n4.8 / 5 | average rating'}),links:h.links}}}
};
PB.templates.forEach(t=>{const fn=R[t.id];if(!fn)return;const make=t.make;t.make=()=>{const s=make();const p=s.pages.find(x=>x.id===s.home)||s.pages[0];try{fn(p.blocks,s)}catch(e){console.warn('template remix failed for',t.id,e)}return s}});
})();
