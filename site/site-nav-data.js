'use strict';
/* The atlas navigation: groups, items, one-line purposes and the film that previews each. Single source for the top bar
   (site-bar.js), the library drawer (atlas-nav.js) and the home page. Item: [href, name, note, film].
   Every page has one home. Library is what you copy, Styles is what you brief from, Make is the tools, Your studio is
   what you saved. Pages that duplicated another (Atlas overview, Icon families beside Icons, Vase studies, Extracted
   assets) are no longer listed; their addresses still work. */
window.ATLAS_NAV_GROUPS=[
  {name:'Library',items:[
   ['interactions.html','UI interactions','Animated pieces to drop into a site or app. Tune them, then copy.','golden-dove'],
   ['app-interfaces.html','App templates','Twenty-two finished screens to copy, light and dark.','light-mesh'],
   ['#ux','UI components','Seventy components with every state, in any style.','light-mesh'],
   ['#icons','Icons','6,468 icons in fifteen looks. Recolour, copy or download.','sketchbook-horse'],
   ['#systems','Design systems','Forty-eight complete looks: colours, type and components.','game-of-life'],
   ['theme-kits.html','Theme kits','Forty-eight ready kits to download and build on.','game-of-life'],
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
   ['chart-studio.html','Charts','Paste your data, get a chart.','pigment-bloom'],
   ['diagram-studio.html','Diagrams','Roadmaps, org charts, timelines and more.','swan-construction'],
   ['flowchart-studio.html','Flowcharts','Draw, animate and export a flowchart.','light-mesh'],
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
   ['#tours','Guided tours','Short routes through the atlas for a brief or a mood.','golden-dove'],
   ['chart-styles.html','Chart style guides','Chart colours and rules for every style.','game-of-life'],
   ['#references','Sources & credits','Original works, research, licences and credits.','smoke-plume']]}
];

/* The four menus in the bar. Each is one short list. */
window.ATLAS_NAV_MENUS=[
 {id:'lib',name:'Library',groups:[{name:'',items:['interactions.html','app-interfaces.html','#ux','#icons','#systems','theme-kits.html','#backgrounds']}]},
 {id:'styles',name:'Styles',groups:[{name:'',items:['#browse','#art','#cinema','#typography','#compare','#pairings']}]},
 {id:'make',name:'Make',groups:[{name:'',items:['page-builder.html','brand-generator.html','motion-graphics.html','chart-studio.html','diagram-studio.html','flowchart-studio.html','mockup-studio.html']}]},
 {id:'studio',name:'Yours',groups:[{name:'',items:['#projects','moodboard.html','#inspiration','#creations','my-fonts.html','account.html']}]}
];
