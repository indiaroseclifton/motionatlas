'use strict';
/* The atlas navigation: groups, items, one-line purposes and the film that previews each. Single source for the top bar
   (site-bar.js), the library drawer (atlas-nav.js) and the home page. Item: [href, name, note, film].
   Every page has one home. Interactions comes first because it is what the atlas is for: motion you can copy.
   Library is the other things you copy, Styles is what you brief from, Make is the tools, Your studio is what you saved.
   Pages that duplicated another are not listed and their addresses still work: Atlas overview, Vase studies, Extracted
   assets, Guided tours, Theme kits (the Kits view of Design systems), Chart style guides (linked from the chart studio),
   and the separate Diagrams and Flowcharts entries (modes of Charts & diagrams, switched in the studio header). */
window.ATLAS_NAV_GROUPS=[
  {name:'Interactions',items:[
   ['interactions.html','UI interactions','114 animated pieces for a site or app. Tune one, then copy it.','golden-dove'],
   ['#effects','Landing effects','Forty-one scroll, reveal and pointer techniques, running live.','light-ribbons'],
   ['#motion','Animation studio','Live particle studies, steerable simulations and an easing lab.','petal-swirl']]},
  {name:'Library',items:[
   ['app-interfaces.html','App templates','Twenty-two finished screens to copy, light and dark.','light-mesh'],
   ['#ux','UI components','Seventy components with every state, in any style.','light-mesh'],
   ['#icons','Icons','6,468 icons in fifteen looks. Recolour, copy or download.','sketchbook-horse'],
   ['#systems','Design systems','Forty-eight complete looks, each with a kit to download.','game-of-life'],
   ['#backgrounds','Backgrounds','Gradients, light and grain. Export a picture or a loop.','petal-swirl']]},
  {name:'Styles',items:[
   ['#browse','Style catalogue','Every visual style in one searchable list.','hydraulic-erosion'],
   ['#art','Art styles','Sixty art styles, from gouache to risograph.','suminagashi'],
   ['#cinema','Film looks','Film-inspired looks and colour grades.','pixel-sorting'],
   ['#typography','Fonts & type','Font pairings to try with your own words.','light-threads'],
   ['#compare','Compare styles','Two styles side by side on the same subject.','ferrofluid'],
   ['#pairings','Style pairings','Styles that work together, and why.','lion-phoenix']]},
  {name:'Make',items:[
   ['page-builder.html','Site builder','Build a multi-page website from a template.','paper-bird'],
   ['brand-generator.html','Brand kit','Colours, fonts and a logo from a name and a feel.','game-of-life'],
   ['motion-graphics.html','Motion graphics','Titles and logo stings as video, GIF or HTML.','light-ribbons'],
   ['infographic-studio.html','Infographics','Numbers, steps and comparisons as one picture to post.','pigment-bloom'],
   ['chart-studio.html','Charts & diagrams','Charts from your data, plus diagrams and flowcharts.','pigment-bloom'],
   ['mockup-studio.html','Mockups','Frame a screenshot and export every social size.','paper-bird']]},
  {name:'Your studio',items:[
   ['#projects','My projects','Everything you saved for a client or an idea.','particle-tree'],
   ['moodboard.html','Moodboards','Pin styles, colours and pictures on a board.','embroidery'],
   ['#inspiration','Inspiration','Your own uploads and saved links.','embroidery'],
   ['#creations','Your creations','Things you made and exported here.','pigment-bloom'],
   ['my-fonts.html','My fonts','Fonts you own, kept in this browser.','embroidery'],
   ['account.html','Account','Sign in to keep your projects on every device.','particle-tree']]},
  {name:'More',items:[
   ['tools.html','All tools','Every tool on one page.','paper-bird'],
   ['#references','Sources & credits','Original works, research, licences and credits.','smoke-plume']]}
];

/* The five menus in the bar. Each is one short list. */
window.ATLAS_NAV_MENUS=[
 {id:'ix',name:'Interactions',groups:[{name:'',items:['interactions.html','#effects','#motion']}]},
 {id:'lib',name:'Library',groups:[{name:'',items:['app-interfaces.html','#ux','#icons','#systems','#backgrounds']}]},
 {id:'styles',name:'Styles',groups:[{name:'',items:['#browse','#art','#cinema','#typography','#compare','#pairings']}]},
 {id:'make',name:'Make',groups:[{name:'',items:['page-builder.html','brand-generator.html','motion-graphics.html','infographic-studio.html','chart-studio.html','mockup-studio.html']}]},
 {id:'studio',name:'Yours',groups:[{name:'',items:['#projects','moodboard.html','#inspiration','#creations','my-fonts.html','account.html']}]}
];
