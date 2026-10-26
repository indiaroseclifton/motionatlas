'use strict';
/* Page builder, licences and credits. One place that says where every kind of asset in the builder library comes from, whether it may be
   used in a user's exported or published site, and what notice an export must carry. Mirrors docs/image-licences.md.
   PB.credits.build({paths, fonts, icons, photos}) returns the text of assets/CREDITS.txt for one export. */
(()=>{
const PB=window.PB=window.PB||{};
const ATLAS='Generated for the Visual & Motion Atlas (AI image and video generation from the atlas’s own prompts and renders). Original to the atlas, no third-party stock or museum material, and offered for use in sites made with the builder. The generating service’s own terms are not recorded in the repository: confirm them before using these pictures in a commercial product.';
/* groups by asset path (relative to assets/) */
const GROUPS=[
 {id:'shelf',test:p=>/^shelf\//.test(p),name:'Atlas shelf pictures',source:'Atlas generated art',licence:'Original to the atlas',exportOk:true,notice:false,note:ATLAS},
 {id:'films',test:p=>/^films\//.test(p),name:'Atlas films and posters',source:'Atlas generated art (image-to-video loops)',licence:'Original to the atlas',exportOk:true,notice:false,note:ATLAS+' Films stay hosted on the atlas domain unless you copy them next to your site.'},
 {id:'fx',test:p=>/^fx\//.test(p),name:'Atlas landing-effect clips',source:'Atlas generated art',licence:'Original to the atlas',exportOk:true,notice:false,note:ATLAS},
 {id:'photos',test:p=>/^photos\//.test(p),name:'Atlas photo library',source:'Wikimedia Commons and other public-domain sources (see photos.json)',licence:'CC0 or public domain, per photo',exportOk:true,notice:true,note:'Public-domain and CC0 photographs. Attribution is not required but is listed for each photo you use.'},
 {id:'art-refs',test:p=>/^art-refs\//.test(p),name:'Met Open Access artworks',source:'The Metropolitan Museum of Art Open Access',licence:'CC0',exportOk:true,notice:true,note:'Public domain (CC0). Credit: The Metropolitan Museum of Art.'}
];
/* icon families: licence and the notice an export carries */
const ICONS={thin:['Phosphor Icons','MIT','© 2023 Phosphor Icons, https://phosphoricons.com'],light:['Phosphor Icons','MIT','© 2023 Phosphor Icons, https://phosphoricons.com'],regular:['Phosphor Icons','MIT','© 2023 Phosphor Icons, https://phosphoricons.com'],bold:['Phosphor Icons','MIT','© 2023 Phosphor Icons, https://phosphoricons.com'],fill:['Phosphor Icons','MIT','© 2023 Phosphor Icons, https://phosphoricons.com'],duotone:['Phosphor Icons','MIT','© 2023 Phosphor Icons, https://phosphoricons.com'],
 'hero-outline':['Heroicons','MIT','© Tailwind Labs, Inc., https://heroicons.com'],'hero-solid':['Heroicons','MIT','© Tailwind Labs, Inc., https://heroicons.com'],lucide:['Lucide','ISC','© Lucide Icons and Contributors, https://lucide.dev'],tabler:['Tabler Icons','MIT','© Paweł Kuna, https://tabler.io/icons'],pixel:['Pixelarticons','MIT','© Gerrit Halfmann, https://pixelarticons.com'],
 openmoji:['OpenMoji','CC BY-SA 4.0','© OpenMoji contributors, https://openmoji.org. Licensed CC BY-SA 4.0: credit them and share adaptations of the emoji under the same licence.'],'fluent-3d':['Fluent Emoji','MIT','© Microsoft Corporation, https://github.com/microsoft/fluentui-emoji']};
const FONTS='Fonts come from Google Fonts and are open source (SIL Open Font License or Apache 2.0). See https://fonts.google.com/attribution.';
function group(p){return GROUPS.find(g=>g.test(p))||null}
/* may this asset be used in a published or exported site? Unknown paths are treated as not cleared. */
function exportable(p){const g=group(p);return !!(g&&g.exportOk)}
function build(o){const L=[],now=new Date().toISOString().slice(0,10);
 L.push('Credits and licences','====================','','Made with the Visual & Motion Atlas site builder on '+now+'. This file lists the pictures, icons and fonts in this site that come from somewhere else, so you can keep the notices with it.','');
 const paths=[...new Set(o.paths||[])].sort();const by={};paths.forEach(p=>{const g=group(p);const k=g?g.id:'other';(by[k]=by[k]||[]).push(p)});
 GROUPS.forEach(g=>{const ps=by[g.id];if(!ps||!ps.length)return;L.push(g.name,'-'.repeat(g.name.length),'Source:  '+g.source,'Licence: '+g.licence,g.note,'Files:   '+ps.length+' ('+ps.slice(0,6).join(', ')+(ps.length>6?', …':'')+')','')});
 if(by.other&&by.other.length)L.push('Other files','-----------','These files are not part of the atlas library (your own uploads or addresses you typed). Their licences are your responsibility.','Files:   '+by.other.slice(0,6).join(', ')+(by.other.length>6?', …':''),'');
 const ph=(o.photos||[]).slice().sort((a,b)=>a.id.localeCompare(b.id));
 if(ph.length){L.push('Photographs','-----------');ph.forEach(p=>L.push('• '+p.title+' · '+p.author+' · '+p.licence+' · '+p.source));L.push('')}
 const fam={};(o.icons||[]).forEach(f=>{const i=ICONS[f];if(i)fam[i[0]]=i});
 if(Object.keys(fam).length){L.push('Icons','-----');Object.values(fam).forEach(i=>L.push('• '+i[0]+' · '+i[1]+' · '+i[2]));L.push('')}
 if((o.fonts||[]).length)L.push('Fonts','-----',FONTS,'');
 L.push('The builder’s own section layouts, backgrounds, interactions and kits are original to the atlas.','');
 return L.join('\n')}
PB.credits={GROUPS,ICONS,group,exportable,build,ATLAS};
})();
