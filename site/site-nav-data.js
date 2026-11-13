'use strict';
/* The atlas navigation: groups, items, one-line purposes and the film that previews each. Single source for atlas-nav.js
   (atlas.html) and site-bar.js (every other page). Item: [href, name, note, film]. */
window.ATLAS_NAV_GROUPS=[
  {name:'Browse',items:[
   ['interactions.html','UI interactions','Modern interactions to embed in sites and apps, with live sliders.','golden-dove'],
   ['app-interfaces.html','App templates','Dashboards, apps and pages: twenty-two finished screens to copy, light and dark.','light-mesh'],
   ['#ux','UI components','Seventy components, every state, in every style.','light-mesh'],
   ['#systems','Design systems','Forty-eight complete visual worlds and real open-source systems.','game-of-life'],
   ['theme-kits.html','Theme kits','Forty-eight kits: tokens, components, backgrounds and assets.','game-of-life'],
   ['icons.html','Icons','3,768 searchable icons in 13 families.','sketchbook-horse']]},
  {name:'Styles',items:[
   ['#browse','Style catalogue','Every visual style in one searchable sheet.','hydraulic-erosion'],
   ['#art','Art styles','Sixty art styles, from museum references to specimen films.','suminagashi'],
   ['#cinema','Film looks','Cinematic directions translated into original scenes.','pixel-sorting'],
   ['#backgrounds','Backgrounds','Generate gradients, light and grain; export 4K or a loop.','petal-swirl'],
   ['#typography','Fonts & type','Type pairings and scales, ready to use.','light-threads']]},
  {name:'Make',items:[
   ['page-builder.html','Site builder','Multi-page sites from templates, sections and photographs.','paper-bird'],
   ['brand-generator.html','Brand kit','Palette, fonts, logo lockups and tokens from a name and a feel.','game-of-life'],
   ['motion-graphics.html','Motion graphics','Titles, lower thirds and logo stings as video, GIF or HTML.','light-ribbons'],
   ['chart-studio.html','Charts','Your data as a chart: 26 forms, any style.','pigment-bloom'],
   ['diagram-studio.html','Diagrams','Eighteen diagram types: roadmaps to sequence and ER.','swan-construction'],
   ['flowchart-studio.html','Flowcharts','Draw, animate and export flowcharts.','light-mesh'],
   ['mockup-studio.html','Mockups','Frame a screenshot in a device and export every social size.','paper-bird']]},
  {name:'Your studio',items:[
   ['#projects','My projects','Save things into boards for a client or idea.','particle-tree'],
   ['moodboard.html','Moodboards','Pin styles, kits, colours and pictures.','embroidery'],
   ['my-fonts.html','My fonts','Fonts you own, kept in this browser.','embroidery'],
   ['account.html','Account','Sign in, and keep your projects on every device.','particle-tree']]},
  {name:'More',items:[
   ['#home','Atlas overview','The style atlas at a glance.','jellyfish'],
   ['tools.html','All tools','Every tool in one place.','paper-bird'],
   ['#tours','Guided tours','Short routes through the atlas for a brief or a mood.','golden-dove'],
   ['#compare','Compare styles','Two styles side by side on the same subject.','ferrofluid'],
   ['#pairings','Style pairings','Styles that work together, and why.','lion-phoenix'],
   ['#vases','Vase studies','One vase, forty treatments.','sand-drawing'],
   ['#icons','Icon families','Outline, solid, pixel, colour and 3D icon sets.','sketchbook-horse'],
   ['#assets','Extracted assets','Fragments cut from our original mock-ups.','paper-bird'],
   ['chart-styles.html','Chart style guides','Chart palettes and rules for every style.','game-of-life'],
   ['#inspiration','Inspiration','Your own uploads and references.','embroidery'],
   ['#creations','Your creations','Things you have made and exported here.','pigment-bloom'],
   ['#references','Sources & credits','Original works, research, licences and credits.','smoke-plume']]}
];

/* The three menus in the bar. Each is one short list; rarer pages sit in a {more} row that expands in place. */
window.ATLAS_NAV_MENUS=[
 {id:'lib',name:'Browse',groups:[{name:'',items:['interactions.html','app-interfaces.html','#ux','#systems','theme-kits.html','icons.html',{more:'Styles and inspiration',items:['#browse','#art','#cinema','#backgrounds','#typography']}]}]},
 {id:'make',name:'Make',groups:[{name:'',items:['page-builder.html','brand-generator.html','motion-graphics.html','chart-studio.html','diagram-studio.html','flowchart-studio.html','mockup-studio.html']}]},
 {id:'studio',name:'Yours',groups:[{name:'',items:['#projects','moodboard.html','my-fonts.html','account.html']}]}
];
