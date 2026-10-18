'use strict';
/* Theme kits 25-48: industries (fintech, health, civic, food, travel, fashion, science, law), music and gaming,
   retro eras and print traditions. Same shape and contract as kits-a.js. */
(()=>{
const TK=window.ThemeKits;
const F=(h,b,css)=>({head:h,body:b,css});
const sans=n=>`'${n}',system-ui,sans-serif`,serif=n=>`'${n}',Georgia,serif`,mono=n=>`'${n}',ui-monospace,monospace`;
const K=[
 {id:'ledger',no:'25',name:'Ledger',tagline:'Crisp numbers, honest charts, one trusted blue.',mood:'Fintech, banking, payments, accounting, investing',feel:'serious',wf:.6,hw:700,scale:1.2,role:'Head of finance',
  fonts:F(sans('Schibsted Grotesk'),sans('Onest'),'family=Schibsted+Grotesk:wght@500;700&family=Onest:wght@400;500;600'),
  t:{bg:'#F5F7FA',surface:'#FFFFFF',ink:'#0B1B33',mute:'#4F5D73',line:'#DCE2EA',accent:'#0B5FFF',onAccent:'#FFFFFF',accent2:'#0E8F6B',accent3:'#D93F45',radius:'8px',shadow:'0 1px 2px rgba(11,27,51,.06), 0 8px 24px -12px rgba(11,27,51,.16)',glow:'0 0 0 3px rgba(11,95,255,.3)'},
  bg:'ledger',stroke:{w:1.75,cap:'round'},case:'none',bgDesc:'a live price chart that scrolls across a fine grid, with faint candlesticks and a ticking price label',
  voice:['Your money, clearly.','No hidden fees. No surprises.','Every cent, accounted for.'],
  dos:['Use tabular figures and align numbers right.','Green and red only for gains and losses.','Show the number first, the explanation second.'],
  donts:['Decorative charts without data.','Red for anything but a loss or an error.','Jargon in headlines.']},
 {id:'clinic',no:'26',name:'Clinic Calm',tagline:'A steady pulse, soft teal, nothing alarming.',mood:'Healthcare, telehealth, pharmacies, insurance, wellbeing',feel:'serious',wf:.62,hw:600,scale:1.2,role:'Family doctor',
  fonts:F(sans('Lexend'),sans('Atkinson Hyperlegible'),'family=Lexend:wght@400;600&family=Atkinson+Hyperlegible:wght@400;700'),
  t:{bg:'#F3F8F8',surface:'#FFFFFF',ink:'#12313A',mute:'#4B6670',line:'#D5E5E6',accent:'#0E7C86',onAccent:'#FFFFFF',accent2:'#E07856',radius:'14px',shadow:'0 6px 24px -14px rgba(18,49,58,.3)',glow:'0 0 0 3px rgba(14,124,134,.3)'},
  bg:'clinic',stroke:{w:1.75,cap:'round'},case:'none',bgDesc:'soft rings that breathe in and out above a calm heartbeat trace',
  voice:['Care that comes to you.','You’re in good hands.','Feel better, sooner.'],
  dos:['Use the hyperlegible body face at 17px or larger.','Write in plain words a patient would use.','Keep coral for gentle highlights only.'],
  donts:['Alarm red unless it is a real warning.','Stock-photo clichés.','Medical jargon without explanation.']},
 {id:'arcade',no:'27',name:'Pixel Arcade',tagline:'Insert coin. Pixels, parallax and a high score.',mood:'Games, esports, streaming, toys, hackathons',feel:'playful',wf:1,hw:400,scale:1.2,role:'Level designer',
  fonts:F(mono('Press Start 2P'),sans('Exo 2'),'family=Press+Start+2P&family=Exo+2:wght@400;600;700'),
  t:{bg:'#0C0920',surface:'#171236',ink:'#F2EEFF',mute:'#A9A1D6',line:'#2E2763',accent:'#FF3EA5',onAccent:'#0C0920',accent2:'#3EF0FF',accent3:'#FFE14D',radius:'0px',shadow:'4px 4px 0 #2E2763',glow:'0 0 0 3px #3EF0FF'},
  bg:'arcade',stroke:{w:2,cap:'square'},case:'upper',bgDesc:'a pixel-art night with parallax stars and stepped mountains while little pixel creatures hop across',
  voice:['Press start.','Player one, ready.','New high score!'],
  dos:['Snap everything to a pixel grid.','Use the pixel face for short labels only.','Hard, stepped shadows.'],
  donts:['Anti-aliased curves in illustrations.','Pixel font for paragraphs.','Gradients on UI.']},
 {id:'vinyl',no:'28',name:'Vinyl Lounge',tagline:'Warm grooves, orange glow, a turning record.',mood:'Music labels, venues, podcasts, record shops, audio gear',feel:'playful',wf:.45,hw:800,scale:1.333,role:'Selector',
  fonts:F(sans('Big Shoulders Display'),sans('Barlow'),'family=Big+Shoulders+Display:wght@600;800&family=Barlow:wght@400;500;600'),
  t:{bg:'#15110E',surface:'#211B16',ink:'#F6EBDD',mute:'#BBA892',line:'#3A3029',accent:'#FF7A3D',onAccent:'#15110E',accent2:'#3FB8AF',radius:'6px',shadow:'0 24px 48px -24px rgba(0,0,0,.8)',glow:'0 0 0 3px rgba(255,122,61,.45)'},
  bg:'vinyl',stroke:{w:2,cap:'round'},case:'upper',bgDesc:'a record spinning under a tonearm with light catching the grooves, and an equaliser bouncing below',
  voice:['Drop the needle.','Side A. Play it loud.','Music sounds better with you.'],
  dos:['Use circles and grooves as framing devices.','Set headlines tall and condensed.','Warm orange for play and buy actions.'],
  donts:['Cold blue-grey palettes.','Tiny type on album art.','Clip-art music notes.']},
 {id:'gazette',no:'29',name:'Gazette',tagline:'Newsprint columns, serif headlines, red ink.',mood:'News, magazines, newsletters, journalism, long reads',feel:'serious',wf:.58,hw:800,scale:1.333,role:'Managing editor',
  fonts:F(serif('Playfair Display'),serif('Source Serif 4'),'family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Source+Serif+4:wght@400;600'),
  t:{bg:'#F3EFE6',surface:'#FBF9F4',ink:'#1A1714',mute:'#57514A',line:'#D6CFC2',accent:'#9E1B1B',onAccent:'#FFFFFF',accent2:'#1E4D7A',radius:'0px',shadow:'none',glow:'0 0 0 3px rgba(158,27,27,.3)'},
  bg:'gazette',stroke:{w:1.5,cap:'butt'},case:'none',bgDesc:'a newspaper page that sets itself: columns of text lines, headline bars and a halftone photo appearing line by line',
  voice:['All the news that matters.','Read it first. Read it right.','The story behind the story.'],
  dos:['Use columns, rules and datelines.','Serif for reading, at 18px or more.','Red only for breaking news and the masthead rule.'],
  donts:['Rounded corners and shadows.','Sans-serif paragraphs.','Clickbait headlines.']},
 {id:'civic',no:'30',name:'Civic',tagline:'Plain language, contour maps, public blue.',mood:'Government, councils, NGOs, public services, elections',feel:'serious',wf:.6,hw:700,scale:1.2,role:'Public servant',
  fonts:F(sans('Public Sans'),sans('Public Sans'),'family=Public+Sans:wght@400;500;600;700'),
  t:{bg:'#F6F7F9',surface:'#FFFFFF',ink:'#14213D',mute:'#4C5874',line:'#D8DDE6',accent:'#1F4FBF',onAccent:'#FFFFFF',accent2:'#B07F00',accent3:'#2E8540',radius:'4px',shadow:'0 1px 0 #D8DDE6',glow:'0 0 0 3px #FFBE2E'},
  bg:'civic',stroke:{w:2,cap:'round'},case:'none',bgDesc:'topographic contour lines that slowly shift like a living map, with location pins pulsing',
  voice:['Services for everyone.','Find what you need, fast.','Your city. Your say.'],
  dos:['Write at a reading age of nine.','Make focus states thick and yellow.','One task per page.'],
  donts:['Marketing slogans.','Colour as the only signal.','Hidden or unlabelled controls.']},
 {id:'bistro',no:'31',name:'Bistro',tagline:'Gingham, tomato red, something simmering.',mood:'Restaurants, food brands, recipes, delis, markets',feel:'playful',wf:.66,hw:400,scale:1.25,role:'Head chef',
  fonts:F(serif('Yeseva One'),sans('Lato'),'family=Yeseva+One&family=Lato:wght@400;700'),
  t:{bg:'#FBF4E8',surface:'#FFFFFF',ink:'#2B1B14',mute:'#6A5446',line:'#EAD9C2',accent:'#C0352B',onAccent:'#FFFFFF',accent2:'#4C7A3A',accent3:'#F2B544',radius:'10px',shadow:'0 10px 24px -16px rgba(43,27,20,.45)',glow:'0 0 0 3px rgba(242,181,68,.6)'},
  bg:'bistro',stroke:{w:1.75,cap:'round'},case:'none',bgDesc:'a red gingham tablecloth rippling gently while steam curls rise from a warm bowl',
  voice:['Made fresh, every morning.','Pull up a chair.','Good food takes time.'],
  dos:['Use warm, appetising colour: tomato, basil, butter.','Handwritten-feeling serif for menus and headings.','Show the food big.'],
  donts:['Cold blue tones.','Tiny menus in light grey.','Stock cutlery icons everywhere.']},
 {id:'voyage',no:'32',name:'Voyage',tagline:'A travel poster: sea, sun and a small white sail.',mood:'Travel, tourism, airlines, hotels, ferries, maps',feel:'playful',wf:.62,hw:400,scale:1.25,role:'Tour guide',
  fonts:F(serif('Abril Fatface'),sans('Raleway'),'family=Abril+Fatface&family=Raleway:wght@400;500;600;700'),
  t:{bg:'#F5EBDD',surface:'#FFFAF2',ink:'#17324D',mute:'#4E6176',line:'#E3D2BC',accent:'#C9432B',onAccent:'#FFFFFF',accent2:'#1F7A8C',accent3:'#F2B04A',radius:'6px',shadow:'0 14px 30px -20px rgba(23,50,77,.5)',glow:'0 0 0 3px rgba(31,122,140,.35)'},
  bg:'voyage',stroke:{w:1.75,cap:'round'},case:'none',bgDesc:'a flat-colour travel poster: striped sky and sun, rolling waves, a bobbing sailboat and gulls',
  voice:['The world is waiting.','Pack light. Stay longer.','Wish you were here.'],
  dos:['Use flat, poster-style colour fields.','Tall display serif for destinations.','Coral for booking, sea-teal for exploring.'],
  donts:['Photographic gradients in illustrations.','Crowded itineraries.','Generic plane icons as decoration.']},
 {id:'atelier',no:'33',name:'Atelier',tagline:'Ivory, ink and a single blush thread.',mood:'Fashion, jewellery, bridal, galleries, beauty houses',feel:'serious',wf:.5,hw:400,scale:1.333,role:'Couturier',
  fonts:F(serif('Italiana'),sans('Red Hat Display'),'family=Italiana&family=Red+Hat+Display:wght@400;500;600'),
  t:{bg:'#F7F3EE',surface:'#FFFFFF',ink:'#0E0E0E',mute:'#57524C',line:'#E2DBD2',accent:'#0E0E0E',onAccent:'#F7F3EE',accent2:'#C98A84',radius:'0px',shadow:'none',glow:'0 0 0 2px #C98A84'},
  bg:'atelier',stroke:{w:1,cap:'butt'},case:'upper',bgDesc:'fine silk threads in ink and blush that drift through a slow flow field on ivory',
  voice:['Made to measure.','The new collection.','Quiet, considered, couture.'],
  dos:['Huge whitespace and one image per view.','Thin, widely tracked capitals.','Black buttons, blush details.'],
  donts:['Bright colour or gradients.','Busy grids of products.','Exclamation marks.']},
 {id:'tide',no:'34',name:'Deep Tide',tagline:'Caustic light, kelp and rising bubbles.',mood:'Ocean conservation, marine science, swimwear, aquariums, eco',feel:'serious',wf:.6,hw:600,scale:1.25,role:'Marine biologist',
  fonts:F(sans('Outfit'),sans('Red Hat Text'),'family=Outfit:wght@400;600;700&family=Red+Hat+Text:wght@400;500;600'),
  t:{bg:'#04151F',surface:'#0A2230',ink:'#E3F6F5',mute:'#8DB3B8',line:'#173847',accent:'#3FE0C5',onAccent:'#04151F',accent2:'#FF8A5B',radius:'14px',shadow:'0 20px 40px -24px rgba(0,0,0,.8)',glow:'0 0 0 3px rgba(63,224,197,.4)'},
  bg:'tide',stroke:{w:1.75,cap:'round'},case:'none',bgDesc:'underwater light: rippling caustics and sun rays over swaying kelp with bubbles rising',
  voice:['Protect what lies beneath.','Dive deeper.','The ocean is calling.'],
  dos:['Use depth: lighter at the top, darker below.','Sea-glass teal for actions, coral for urgency.','Let shapes flow and curve.'],
  donts:['Hard, boxy grids.','Plastic-bright colours.','Dense text over the background.']},
 {id:'lab',no:'35',name:'Lab Notebook',tagline:'Graph paper, molecules and careful notes.',mood:'Science, biotech, research, edtech, data tools',feel:'serious',wf:.62,hw:600,scale:1.2,role:'Principal investigator',
  fonts:F(mono('Spline Sans Mono'),sans('Spline Sans'),'family=Spline+Sans+Mono:wght@400;600&family=Spline+Sans:wght@400;500;600'),
  t:{bg:'#F7F8F4',surface:'#FFFFFF',ink:'#1B2430',mute:'#536070',line:'#D9E0E4',accent:'#3B47D6',onAccent:'#FFFFFF',accent2:'#00876F',accent3:'#E0525B',radius:'6px',shadow:'0 1px 0 #D9E0E4',glow:'0 0 0 3px rgba(59,71,214,.3)'},
  bg:'lab',stroke:{w:1.5,cap:'round'},case:'none',bgDesc:'a ball-and-stick molecule rotating in 3D over graph paper with annotation leaders',
  voice:['Curiosity, measured.','Show your working.','Results you can reproduce.'],
  dos:['Annotate figures with units and sources.','Monospace for headings, data and labels.','Blue for actions, teal and red for data series.'],
  donts:['Decorative 3D charts.','Unlabelled axes.','Hype words like “revolutionary”.']},
 {id:'observatory',no:'36',name:'Observatory',tagline:'A slow sky, star charts and starlight gold.',mood:'Astronomy, education, planetariums, deep tech, research',feel:'serious',wf:.82,hw:600,scale:1.25,role:'Astronomer',
  fonts:F(serif('Cinzel'),serif('Crimson Pro'),'family=Cinzel:wght@500;600;700&family=Crimson+Pro:wght@400;500;600'),
  t:{bg:'#070B1A',surface:'#0F1530',ink:'#EEF0FF',mute:'#9AA3C7',line:'#232B52',accent:'#FFD27A',onAccent:'#070B1A',accent2:'#8FA8FF',radius:'4px',shadow:'0 0 0 1px #232B52',glow:'0 0 0 3px rgba(255,210,122,.4)'},
  bg:'observatory',stroke:{w:1.25,cap:'round'},case:'upper',bgDesc:'a star field turning about the pole, with a coordinate grid and constellation lines drawing themselves',
  voice:['Look up.','Mapped by starlight.','The universe, explained.'],
  dos:['Use thin lines and dots like a star chart.','Gold for one highlight, periwinkle for data.','Serif body at generous sizes.'],
  donts:['Cartoon planets.','Bright, saturated backgrounds.','Crowding the sky with UI.']},
 {id:'groove',no:'37',name:'Groove',tagline:'Rainbow stripes, mustard and burnt orange.',mood:'Retro 70s, cafés, festivals, apparel, music',feel:'playful',wf:.72,hw:400,scale:1.25,role:'Record store owner',
  fonts:F(serif('Shrikhand'),sans('Cabin'),'family=Shrikhand&family=Cabin:wght@400;500;600;700'),
  t:{bg:'#F6E7C8',surface:'#FFF6E3',ink:'#3B1F0E',mute:'#6E4A30',line:'#E5C99A',accent:'#B9471A',onAccent:'#FFFFFF',accent2:'#E9A21F',accent3:'#6B8E23',radius:'28px',shadow:'0 6px 0 #E5C99A',glow:'0 0 0 3px rgba(233,162,31,.6)'},
  bg:'groove',stroke:{w:2.25,cap:'round'},case:'none',bgDesc:'thick rainbow stripes in orange, mustard and brown flowing in waves over a sunburst',
  voice:['Stay groovy.','Good vibes only.','Far out, and right on time.'],
  dos:['Round everything; pill buttons.','Stack stripes in orange, mustard and avocado.','Chunky italic display type.'],
  donts:['Cold or neon colour.','Thin, technical lines.','Sharp corners.']},
 {id:'atomic',no:'38',name:'Atomic Diner',tagline:'Starbursts, boomerangs, cherry and teal.',mood:'Retro 50s, diners, barbers, homeware, vintage shops',feel:'playful',wf:.55,hw:700,scale:1.25,role:'Soda jerk',
  fonts:F("'Lobster Two',Georgia,cursive",sans('Quicksand'),'family=Lobster+Two:wght@400;700&family=Quicksand:wght@500;600;700'),
  t:{bg:'#F4EEDF',surface:'#FFFDF6',ink:'#1F2A2E',mute:'#4F5A5C',line:'#DCD3BD',accent:'#137371',onAccent:'#FFFFFF',accent2:'#D93A30',accent3:'#F2C14E',radius:'12px',shadow:'0 4px 0 #DCD3BD',glow:'0 0 0 3px rgba(217,58,48,.4)'},
  bg:'atomic',stroke:{w:2,cap:'round'},case:'none',bgDesc:'twinkling atomic starbursts, drifting boomerangs and orbiting atoms on a cream diamond field',
  voice:['Come on in, we’re open!','Fresh pie, hot coffee.','Atomic age, modern taste.'],
  dos:['Script for the name, rounded sans for the rest.','Cherry for specials, teal for actions.','Sprinkle starbursts in corners.'],
  donts:['Script for body text.','Flat, corporate tone.','Dark mode.']},
 {id:'teletext',no:'39',name:'Teletext',tagline:'Page 100. Block graphics in seven colours.',mood:'Retro broadcast, news tickers, game shows, data art',feel:'playful',wf:.92,hw:400,scale:1.2,role:'Page editor',
  fonts:F(mono('Silkscreen'),mono('Azeret Mono'),'family=Silkscreen:wght@400;700&family=Azeret+Mono:wght@400;500;600'),
  t:{bg:'#000000',surface:'#0B0B14',ink:'#FFFFFF',mute:'#C9C9D6',line:'#2A2A3A',accent:'#FFFF00',onAccent:'#000000',accent2:'#00FFFF',accent3:'#FF00FF',radius:'0px',shadow:'none',glow:'0 0 0 3px #00FFFF'},
  bg:'teletext',stroke:{w:2,cap:'square'},case:'upper',bgDesc:'a teletext page loading row by row: mosaic block graphics, colour bars and a ticking clock header',
  voice:['P100  NEWS  WEATHER  SPORT','Press the red button.','Page loading…'],
  dos:['Seven flat colours on black.','Mosaic blocks for graphics.','Monospace grid for all text.'],
  donts:['Gradients, curves or shadows.','More than 40 characters per line in headings.','Muted colours.']},
 {id:'loom',no:'40',name:'Loom',tagline:'Strip-woven bands of gold, red and green.',mood:'Textile studios, cultural festivals, craft markets, fashion, heritage',feel:'serious',wf:.78,hw:400,scale:1.25,role:'Weaver',
  fonts:F(sans('Dela Gothic One'),sans('Hind'),'family=Dela+Gothic+One&family=Hind:wght@400;500;600'),
  t:{bg:'#1D1410',surface:'#2A1E18',ink:'#F7EBDD',mute:'#C7B19B',line:'#4A372C',accent:'#E8B321',onAccent:'#1D1410',accent2:'#D0482F',accent3:'#3E9A6F',radius:'2px',shadow:'0 0 0 1px #4A372C',glow:'0 0 0 3px rgba(232,179,33,.45)'},
  bg:'loom',stroke:{w:2,cap:'square'},case:'upper',bgDesc:'strip-weaving in progress: bands of geometric blocks, zigzags and diamonds woven row by row over warp threads',
  voice:['Woven with meaning.','Every thread tells a story.','Made by many hands.'],
  dos:['Build patterns from narrow vertical strips.','Use gold, red and green on deep brown.','Credit makers and origins by name.'],
  donts:['Copying a specific sacred or named pattern.','Random colour outside the palette.','Thin, delicate type.']},
 {id:'azulejo',no:'41',name:'Azulejo',tagline:'Cobalt on white glaze, tile by tile.',mood:'Hospitality, ceramics, Mediterranean food, tourism, homeware',feel:'serious',wf:.62,hw:400,scale:1.25,role:'Ceramic painter',
  fonts:F(serif('Marcellus'),sans('Rethink Sans'),'family=Marcellus&family=Rethink+Sans:wght@400;500;600'),
  t:{bg:'#F5F7FB',surface:'#FFFFFF',ink:'#0F2547',mute:'#4A5B78',line:'#CFD9EA',accent:'#1E4FA3',onAccent:'#FFFFFF',accent2:'#C98A12',radius:'4px',shadow:'inset 0 1px 0 #fff, 0 6px 16px -10px rgba(15,37,71,.35)',glow:'0 0 0 3px rgba(30,79,163,.3)'},
  bg:'azulejo',stroke:{w:1.5,cap:'round'},case:'none',bgDesc:'a wall of glazed tiles with cobalt rosettes that turn over one at a time to reveal new motifs',
  voice:['Painted by hand, fired by fire.','A welcome in blue and white.','Tile by tile, story by story.'],
  dos:['Build layouts from square modules.','Cobalt line-work on white, ochre as a rare accent.','Symmetrical motifs inside each tile.'],
  donts:['Heavy shadows or chrome.','More than two colours plus white.','Photographic textures behind text.']},
 {id:'papel',no:'42',name:'Papel',tagline:'Cut-paper flags, bright and swinging.',mood:'Celebrations, food trucks, music festivals, community events',feel:'playful',wf:.6,hw:400,scale:1.25,role:'Festival host',
  fonts:F(sans('Lilita One'),sans('Asap'),'family=Lilita+One&family=Asap:wght@400;500;600;700'),
  t:{bg:'#FFF8EF',surface:'#FFFFFF',ink:'#2A1636',mute:'#5E4A6A',line:'#F1DCC8',accent:'#C81E6E',onAccent:'#FFFFFF',accent2:'#13A39A',accent3:'#FFB000',radius:'10px',shadow:'0 8px 20px -14px rgba(42,22,54,.45)',glow:'0 0 0 3px rgba(255,176,0,.6)'},
  bg:'papel',stroke:{w:2,cap:'round'},case:'none',bgDesc:'strings of perforated paper flags swinging in the breeze while confetti drifts down',
  voice:['¡Vamos! The party starts here.','Everyone is invited.','Bright colours, full hearts.'],
  dos:['String flags along the top edge of hero areas.','Use magenta, teal and marigold together.','Round, friendly display type.'],
  donts:['Muted, beige palettes.','Thin hairlines.','Solemn tone.']},
 {id:'shibori',no:'43',name:'Shibori',tagline:'Indigo dye, resist rings and folded light.',mood:'Textiles, slow fashion, ceramics, spas, artisan brands',feel:'serious',wf:.6,hw:400,scale:1.25,role:'Dyer',
  fonts:F(serif('Gloock'),sans('Commissioner'),'family=Gloock&family=Commissioner:wght@400;500;600'),
  t:{bg:'#0F1F3D',surface:'#162A50',ink:'#EEF3FB',mute:'#A9B7D3',line:'#2A4170',accent:'#F2E8D5',onAccent:'#0F1F3D',accent2:'#7C9BE0',radius:'4px',shadow:'0 18px 40px -24px rgba(0,0,0,.7)',glow:'0 0 0 3px rgba(242,232,213,.4)'},
  bg:'shibori',stroke:{w:1.5,cap:'round'},case:'none',bgDesc:'pale resist-dye rings blooming slowly across folded indigo cloth',
  voice:['Dipped, folded, unfolded.','Every piece, one of a kind.','Indigo, slowly.'],
  dos:['Indigo grounds with undyed-cotton highlights.','Soft, feathered edges.','Calm, sparse layouts.'],
  donts:['Hard neon colour.','Perfectly crisp repeats.','Busy UI chrome.']},
 {id:'marmo',no:'44',name:'Marmo',tagline:'Veined marble, brass and green stone.',mood:'Luxury interiors, real estate, jewellery, hotels, spas',feel:'serious',wf:.66,hw:400,scale:1.25,role:'Interior architect',
  fonts:F(sans('Tenor Sans'),serif('Lora'),'family=Tenor+Sans&family=Lora:ital,wght@0,400;0,500;1,400'),
  t:{bg:'#F4F2EF',surface:'#FFFFFF',ink:'#1C1B19',mute:'#5B5853',line:'#DEDAD3',accent:'#2F4A3F',onAccent:'#FFFFFF',accent2:'#A07F48',radius:'2px',shadow:'0 20px 40px -28px rgba(28,27,25,.45)',glow:'0 0 0 2px #A07F48'},
  bg:'marmo',stroke:{w:1,cap:'butt'},case:'upper',bgDesc:'white marble with grey veins that drift slowly while a thin brass vein catches the light',
  voice:['Crafted to endure.','Stone, light and silence.','Private viewings by appointment.'],
  dos:['Widely tracked capitals and serif body.','Brass hairlines as dividers.','Large, calm imagery.'],
  donts:['Bright colour.','Rounded, bubbly shapes.','Discounts and urgency.']},
 {id:'comic',no:'45',name:'Comic Pop',tagline:'Action lines, dots and a big KAPOW.',mood:'Entertainment, kids’ media, games, snack brands, campaigns',feel:'playful',wf:.48,hw:400,scale:1.333,role:'Story artist',
  fonts:F(sans('Bangers'),sans('Comic Neue'),'family=Bangers&family=Comic+Neue:wght@400;700'),
  t:{bg:'#FFFDF2',surface:'#FFFFFF',ink:'#111111',mute:'#444444',line:'#111111',accent:'#D41A24',onAccent:'#FFFFFF',accent2:'#FFD400',accent3:'#1E88E5',radius:'2px',shadow:'4px 4px 0 #111111',glow:'0 0 0 3px #FFD400'},
  bg:'comic',stroke:{w:2.5,cap:'round'},case:'upper',bgDesc:'radial action lines and dot-screen shading around a burst that punches in and out',
  voice:['KAPOW! It’s here.','Meanwhile, back at the shop…','To be continued!'],
  dos:['Thick black outlines and panel borders.','Dot screens for shading.','Speech bubbles for short copy.'],
  donts:['Long paragraphs.','Soft gradients.','Thin, quiet type.']},
 {id:'bloom',no:'46',name:'Bloom',tagline:'Soft iridescent gradients, plum and petal.',mood:'Beauty, skincare, wellness apps, femtech, lifestyle',feel:'playful',wf:.62,hw:400,scale:1.25,role:'Formulator',
  fonts:F(serif('Young Serif'),sans('Figtree'),'family=Young+Serif&family=Figtree:wght@400;500;600'),
  t:{bg:'#FBF5F7',surface:'#FFFFFF',ink:'#2A1E2C',mute:'#665669',line:'#EDDDE5',accent:'#8E3B78',onAccent:'#FFFFFF',accent2:'#F3B6C9',accent3:'#B9D7F0',radius:'999px',shadow:'0 18px 40px -24px rgba(142,59,120,.45)',glow:'0 0 0 3px rgba(142,59,120,.3)'},
  bg:'bloom',stroke:{w:1.5,cap:'round'},case:'none',bgDesc:'soft blobs of petal pink, sky blue and plum light that drift and blend like a living gradient',
  voice:['Glow from within.','Gentle, effective, yours.','Skin first.'],
  dos:['Pill-shaped buttons and soft gradients.','Plum for actions; pastels for atmosphere.','Generous, airy spacing.'],
  donts:['Pastel text.','Hard black outlines.','Clinical, cold language.']},
 {id:'rain',no:'47',name:'Night Rain',tagline:'Rain on glass, neon bokeh, a city after midnight.',mood:'Film, streaming, nightlife, fiction, mobility',feel:'serious',wf:.42,hw:400,scale:1.333,role:'Director',
  fonts:F(sans('Bebas Neue'),sans('Instrument Sans'),'family=Bebas+Neue&family=Instrument+Sans:wght@400;500;600'),
  t:{bg:'#0A0D14',surface:'#121722',ink:'#E6E9F0',mute:'#9AA3B5',line:'#252C3B',accent:'#FF4F6D',onAccent:'#0A0D14',accent2:'#4FC3FF',radius:'4px',shadow:'0 24px 48px -24px rgba(0,0,0,.85)',glow:'0 0 16px rgba(255,79,109,.55)'},
  bg:'rain',stroke:{w:1.5,cap:'round'},case:'upper',bgDesc:'out-of-focus city lights behind a window, with rain streaking down and droplets sliding on the glass',
  voice:['The city never sleeps.','Now streaming.','Some stories only happen at night.'],
  dos:['Tall condensed capitals over dark imagery.','One neon accent per view.','Let the background breathe; keep panels translucent.'],
  donts:['Daylight palettes.','Many neon colours at once.','Small text on busy images.']},
 {id:'chambers',no:'48',name:'Chambers',tagline:'Green leather, brass tooling, a fine flourish.',mood:'Law firms, private banks, universities, publishers, heritage',feel:'serious',wf:.6,hw:400,scale:1.25,role:'Senior partner',
  fonts:F(serif('Libre Caslon Display'),serif('Libre Caslon Text'),'family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400'),
  t:{bg:'#0F1F18',surface:'#172A21',ink:'#F1EAD8',mute:'#B8AE95',line:'#2D4237',accent:'#C9A44C',onAccent:'#0F1F18',accent2:'#B04A3E',radius:'2px',shadow:'0 0 0 1px #2D4237, inset 0 0 0 3px #172A21, inset 0 0 0 4px #2D4237',glow:'0 0 0 2px #C9A44C'},
  bg:'chambers',stroke:{w:1.25,cap:'butt'},case:'none',bgDesc:'grained green leather with brass-tooled frames and a calligraphic flourish that draws itself',
  voice:['Counsel you can trust.','Established, independent, discreet.','Since the first page.'],
  dos:['Double rules and tooled corners for framing.','Old-style serif throughout.','Brass for the one action per page.'],
  donts:['Bright, playful colour.','Casual slang.','Rounded, bubbly UI.']}
];

const BG={
ledger(c,t,still){const x=c.getContext('2d');let W,H,d,raf,pts=[],off=0,v=100;
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;if(!pts.length){for(let i=0;i<200;i++){v+=(Math.random()-.47)*2.2;pts.push(v)}}}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);x.strokeStyle=t.line;x.lineWidth=d;const gs=40*d;for(let X=W-(off%gs);X>0;X-=gs){x.beginPath();x.moveTo(X,0);x.lineTo(X,H);x.stroke()}for(let Y=gs;Y<H;Y+=gs){x.beginPath();x.moveTo(0,Y);x.lineTo(W,Y);x.stroke()}
  const n=pts.length,mn=Math.min(...pts),mx=Math.max(...pts),sx=W/(n-12),Y=p=>H*.78-(p-mn)/(mx-mn||1)*H*.5,X=i=>i*sx-(off%sx);
  for(let i=4;i<n;i+=4){const o=pts[i-4],cl=pts[i],hi=Math.max(o,cl)+1,lo=Math.min(o,cl)-1;x.globalAlpha=.22;x.strokeStyle=x.fillStyle=cl>=o?t.accent2:t.accent3;x.beginPath();x.moveTo(X(i)-sx*2,Y(hi));x.lineTo(X(i)-sx*2,Y(lo));x.stroke();x.fillRect(X(i)-sx*3,Math.min(Y(o),Y(cl)),sx*2,Math.abs(Y(o)-Y(cl))+d)}x.globalAlpha=1;
  const g=x.createLinearGradient(0,H*.2,0,H);g.addColorStop(0,'rgba(11,95,255,.22)');g.addColorStop(1,'rgba(11,95,255,0)');x.beginPath();pts.forEach((p,i)=>i?x.lineTo(X(i),Y(p)):x.moveTo(X(i),Y(p)));x.lineTo(X(n-1),H);x.lineTo(X(0),H);x.fillStyle=g;x.fill();
  x.beginPath();pts.forEach((p,i)=>i?x.lineTo(X(i),Y(p)):x.moveTo(X(i),Y(p)));x.strokeStyle=t.accent;x.lineWidth=2.5*d;x.stroke();
  const lx=X(n-1),ly=Y(pts[n-1]);x.fillStyle=t.accent;x.beginPath();x.arc(lx,ly,5*d,0,Math.PI*2);x.fill();x.setLineDash([4*d,4*d]);x.strokeStyle=t.accent;x.lineWidth=d;x.beginPath();x.moveTo(0,ly);x.lineTo(W,ly);x.stroke();x.setLineDash([]);
  const lab=pts[n-1].toFixed(2);x.font=`600 ${13*d}px Onest, system-ui, sans-serif`;const tw=x.measureText(lab).width+16*d;x.fillRect(W-tw-8*d,ly-12*d,tw,24*d);x.fillStyle=t.onAccent;x.fillText(lab,W-tw,ly+5*d)}
 size();if(still){draw();return()=>{}}let last=performance.now();const loop=n=>{raf=requestAnimationFrame(loop);const dt=Math.min(.05,(n-last)/1000);last=n;off+=dt*30*d;const sx=W/(pts.length-12);if(off>=sx){off-=sx;pts.shift();v=pts[pts.length-1]+(Math.random()-.47)*2.2;pts.push(v)}draw()};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
clinic(c,t,still){const x=c.getContext('2d');let W,H,d,raf,T=0;
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d}
 const ecg=u=>{u=((u%1)+1)%1;if(u<.08)return Math.sin(u/.08*Math.PI)*.08;if(u<.14)return 0;if(u<.16)return -(u-.14)/.02*.15;if(u<.19)return -.15+(u-.16)/.03*1.15;if(u<.22)return 1-(u-.19)/.03*1.3;if(u<.25)return -.3+(u-.22)/.03*.3;if(u<.4)return 0;if(u<.52)return Math.sin((u-.4)/.12*Math.PI)*.22;return 0};
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);const cx=W*.7,cy=H*.4,R=Math.min(W,H)*.22,br=.5+.5*Math.sin(T*Math.PI*2/8);
  for(let i=4;i>=0;i--){const r=R*(.6+i*.28)*(.9+.12*br);x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.fillStyle=`rgba(14,124,134,${.05+.03*(4-i)})`;x.fill()}
  x.beginPath();x.arc(cx,cy,R*.5*(.9+.15*br),0,Math.PI*2);x.fillStyle='rgba(224,120,86,.22)';x.fill();
  const by=H*.8,amp=H*.12,span=W*1.0,head=(T*.35)%1;x.lineWidth=2.5*d;x.lineCap='round';x.lineJoin='round';
  for(let i=0;i<W;i+=3*d){const u=i/span,age=((head-u)%1+1)%1;x.globalAlpha=Math.max(0,1-age*1.6);x.strokeStyle=t.accent;x.beginPath();x.moveTo(i,by-ecg(u*2.2)*amp);x.lineTo(i+3*d,by-ecg((i+3*d)/span*2.2)*amp);x.stroke()}x.globalAlpha=1;
  const hx=head*span;if(hx<W){x.fillStyle=t.accent;x.beginPath();x.arc(hx,by-ecg(head*2.2)*amp,4*d,0,Math.PI*2);x.fill()}}
 size();if(still){T=2.4;draw();return()=>{}}let last=performance.now();const loop=n=>{raf=requestAnimationFrame(loop);T+=Math.min(.05,(n-last)/1000);last=n;draw()};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
arcade(c,t,still){const x=c.getContext('2d');let W,H,d,p,raf,T=0,St=[];
 const SPR=['00111100','01111110','11011011','11111111','01100110','11000011','01100110','00000000'],SPR2=['00100100','00011000','00111100','01011010','11111111','10111101','10100101','00100100'];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;p=Math.max(3,Math.round(5*d));St=Array.from({length:90},()=>[Math.random()*W,Math.random()*H*.7,1+(Math.random()*3|0)])}
 function spr(m,X,Y,col){x.fillStyle=col;m.forEach((row,j)=>{for(let i=0;i<8;i++)if(row[i]==='1')x.fillRect(Math.round(X)+i*p,Math.round(Y)+j*p,p,p)})}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);St.forEach(s=>{const X=((s[0]-T*s[2]*10*d)%W+W)%W;x.fillStyle=s[2]===3?t.accent2:'#FFFFFF';x.globalAlpha=.4+s[2]*.2;x.fillRect(Math.round(X/p)*p,Math.round(s[1]/p)*p,p*(s[2]===3?1:.6),p*(s[2]===3?1:.6))});x.globalAlpha=1;
  [[.62,'#2A2160',18],[.72,'#3B2E86',34]].forEach(([b,col,sp],k)=>{x.fillStyle=col;const step=p*4;for(let X=-step;X<W+step;X+=step){const wx=X+((T*sp*d)%step),u=(X+T*sp*d)/W;const h=Math.round((Math.sin(u*5+k*2)*.5+.5)*H*.16/p)*p;x.fillRect(wx-step,H*b-h,step,H-H*b+h)}});
  x.fillStyle=t.line;x.fillRect(0,H*.88,W,H*.12);x.fillStyle=t.accent;for(let X=-(T*60*d)%(p*8);X<W;X+=p*8)x.fillRect(X,H*.88,p*4,p);
  for(let k=0;k<4;k++){const X=((T*40*d+k*W*.3)%(W+120*d))-60*d,hop=Math.abs(Math.sin(T*4+k))*p*5;spr(k%2?SPR2:SPR,X,H*.88-8*p-hop,[t.accent,t.accent2,t.accent3,t.accent][k])}
  x.font=`${p*3}px "Press Start 2P", monospace`;x.fillStyle=t.accent3;x.fillText('HI '+String(Math.floor(T*137)%1e6).padStart(6,'0'),W-p*42,p*7)}
 size();if(still){T=3;draw();return()=>{}}let last=performance.now();const loop=n=>{raf=requestAnimationFrame(loop);T+=Math.min(.05,(n-last)/1000);last=n;draw()};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
vinyl(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0,eq=[];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;eq=Array.from({length:Math.ceil(W/(14*d))},()=>Math.random())}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);const cx=W*.68,cy=H*.46,R=Math.min(W,H)*.38;
  const gl=x.createRadialGradient(cx,cy,R*.6,cx,cy,R*1.6);gl.addColorStop(0,'rgba(255,122,61,.18)');gl.addColorStop(1,'rgba(255,122,61,0)');x.fillStyle=gl;x.fillRect(0,0,W,H);
  x.fillStyle='#0B0908';x.beginPath();x.arc(cx,cy,R,0,Math.PI*2);x.fill();x.lineWidth=d;for(let r=R*.36;r<R*.98;r+=2.4*d){x.strokeStyle=`rgba(255,255,255,${.03+.03*Math.sin(r*.7)})`;x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.stroke()}
  x.save();x.translate(cx,cy);x.rotate(a);[0,Math.PI].forEach(o=>{const g=x.createLinearGradient(0,0,R,0);x.fillStyle='rgba(255,236,214,.09)';x.beginPath();x.moveTo(0,0);x.arc(0,0,R*.98,o-.25,o+.25);x.closePath();x.fill()});
  x.fillStyle=t.accent;x.beginPath();x.arc(0,0,R*.32,0,Math.PI*2);x.fill();x.fillStyle=t.bg;x.font=`700 ${R*.07}px "Big Shoulders Display", sans-serif`;x.textAlign='center';x.fillText('SIDE A',0,-R*.12);x.fillRect(-R*.18,R*.1,R*.36,R*.02);x.textAlign='start';x.fillStyle='#15110E';x.beginPath();x.arc(0,0,R*.03,0,Math.PI*2);x.fill();x.restore();
  x.strokeStyle='#D9CBB8';x.lineWidth=5*d;x.lineCap='round';x.beginPath();x.moveTo(cx+R*1.05,cy-R*.95);x.lineTo(cx+R*1.02,cy-R*.1);x.lineTo(cx+R*.55,cy+R*.3);x.stroke();x.fillStyle='#D9CBB8';x.fillRect(cx+R*.48,cy+R*.26,R*.12,R*.08);x.beginPath();x.arc(cx+R*1.05,cy-R*.95,R*.08,0,Math.PI*2);x.fill();
  const bw=14*d;eq.forEach((v,i)=>{const h=(H*.16)*v;x.fillStyle=i%7===0?t.accent2:t.accent;x.globalAlpha=.55;x.fillRect(i*bw,H-h,bw-4*d,h)});x.globalAlpha=1}
 size();if(still){draw();return()=>{}}let k=0;const loop=()=>{a+=.035;if(++k%3===0)eq=eq.map((v,i)=>Math.max(.05,Math.min(1,v*.6+.4*Math.abs(Math.sin(a*2+i*.4))*Math.random()*1.3)));draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
gazette(c,t,still){const x=c.getContext('2d');let W,H,d,raf,T=0,L=[];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;build()}
 function build(){L=[];const m=W*.05,top=H*.2,cols=5,gw=(W-m*2)/cols,lh=9*d;for(let ci=0;ci<cols;ci++){let y=top+(ci===2?H*.28:0);const x0=m+ci*gw+8*d,w=gw-16*d;if(ci===0){L.push({k:'h',x:x0,y,w:w*.9,h:16*d});y+=30*d}while(y<H-m){const para=Math.random()<.12;L.push({k:'l',x:x0+(para?12*d:0),y,w:para?w-12*d:(Math.random()<.15?w*(.3+Math.random()*.5):w),h:3*d});y+=para?lh*1.8:lh}}L.sort((a,b)=>a.y-b.y||a.x-b.x)}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);const m=W*.05;x.fillStyle=t.ink;x.font=`800 ${Math.min(W*.07,H*.09)}px "Playfair Display", Georgia, serif`;x.globalAlpha=.12;x.fillText('The Daily Gazette',m,H*.12);x.globalAlpha=1;x.fillStyle=t.accent;x.fillRect(m,H*.15,W-m*2,3*d);x.fillStyle=t.ink;x.fillRect(m,H*.15+7*d,W-m*2,d);
  const gw=(W-m*2)/5,px=m+2*gw+8*d,py=H*.2,pw=gw-16*d,ph=H*.25,show=Math.min(L.length,still?L.length:Math.floor(T*60));
  x.fillStyle='rgba(26,23,20,.12)';x.fillRect(px,py,pw,ph);x.fillStyle='rgba(26,23,20,.35)';const s=6*d;for(let yy=py+s/2;yy<py+ph;yy+=s)for(let xx=px+s/2;xx<px+pw;xx+=s){const v=.5+.5*Math.sin((xx-px)/pw*3+(yy-py)/ph*2);x.beginPath();x.arc(xx,yy,s*.45*v,0,Math.PI*2);x.fill()}
  for(let i=0;i<show;i++){const l=L[i];x.fillStyle=l.k==='h'?t.ink:'rgba(26,23,20,.28)';x.fillRect(l.x,l.y,l.w,l.h)}
  for(let ci=1;ci<5;ci++){x.fillStyle=t.line;x.fillRect(m+ci*gw,H*.2,d,H*.75)}if(!still&&show>=L.length&&T*60>L.length+180){T=0;build()}}
 size();if(still){draw();return()=>{}}let last=performance.now();const loop=n=>{raf=requestAnimationFrame(loop);T+=Math.min(.05,(n-last)/1000);last=n;draw()};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
civic(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0,pins=[];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;pins=[[.62,.32],[.78,.6],[.48,.7],[.88,.22]]}
 const f=(u,v)=>Math.sin(u*3.1+a)*Math.cos(v*2.7-a*.6)+.6*Math.sin(u*5.3-v*4.1+a*.4)+.4*Math.cos(u*1.7+v*6.2-a*.3);
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);const cs=18*d,nx=Math.ceil(W/cs)+1,ny=Math.ceil(H/cs)+1,G=[];for(let j=0;j<ny;j++){G.push([]);for(let i=0;i<nx;i++)G[j].push(f(i*cs/W*2,j*cs/H*2))}
  for(let lv=-1.6;lv<=1.6;lv+=.32){x.strokeStyle=Math.abs(lv)<.01?t.accent:'rgba(31,79,191,.28)';x.lineWidth=(Math.abs(lv-0.96)<.01?1.6:1)*d;x.beginPath();
   for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){const q=[G[j][i],G[j][i+1],G[j+1][i+1],G[j+1][i]],P=[[i,j],[i+1,j],[i+1,j+1],[i,j+1]],e=[];for(let k=0;k<4;k++){const A=q[k],B=q[(k+1)%4];if((A<lv)!==(B<lv)){const s=(lv-A)/(B-A),p0=P[k],p1=P[(k+1)%4];e.push([(p0[0]+(p1[0]-p0[0])*s)*cs,(p0[1]+(p1[1]-p0[1])*s)*cs])}}if(e.length>=2){x.moveTo(e[0][0],e[0][1]);x.lineTo(e[1][0],e[1][1])}if(e.length===4){x.moveTo(e[2][0],e[2][1]);x.lineTo(e[3][0],e[3][1])}}x.stroke()}
  pins.forEach(([u,v],i)=>{const X=u*W,Y=v*H,ph=((a*2+i*.7)%2)/2;x.strokeStyle=t.accent;x.globalAlpha=1-ph;x.lineWidth=2*d;x.beginPath();x.arc(X,Y,6*d+ph*30*d,0,Math.PI*2);x.stroke();x.globalAlpha=1;x.fillStyle=i===1?t.accent3:t.accent;x.beginPath();x.arc(X,Y-14*d,9*d,Math.PI,0);x.lineTo(X,Y);x.closePath();x.fill();x.fillStyle='#FFFFFF';x.beginPath();x.arc(X,Y-14*d,3.5*d,0,Math.PI*2);x.fill()})}
 size();if(still){draw();return()=>{}}let last=0;const loop=n=>{raf=requestAnimationFrame(loop);if(n-last<40)return;last=n;a+=.012;draw()};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
bistro(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0;
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);const s=34*d,top=H*.55;x.fillStyle='rgba(192,53,43,.28)';
  for(let i=-2;i<W/s+2;i++){const off=Math.sin(a+i*.3)*4*d;x.beginPath();x.moveTo(i*s+off,top);for(let Y=top;Y<=H;Y+=8*d)x.lineTo(i*s+off+Math.sin(Y*.01/d+a+i*.2)*5*d,Y);for(let Y=H;Y>=top;Y-=8*d)x.lineTo(i*s+s/2+off+Math.sin(Y*.01/d+a+i*.2)*5*d,Y);x.fill()}
  for(let j=0;j*s<H-top;j++){const Y=top+j*s+Math.sin(a*1.2+j)*3*d;x.fillRect(0,Y,W,s/2)}
  const g=x.createLinearGradient(0,top-30*d,0,top+40*d);g.addColorStop(0,t.bg);g.addColorStop(1,'rgba(251,244,232,0)');x.fillStyle=g;x.fillRect(0,top-30*d,W,70*d);
  const bx=W*.7,by=top+H*.1,br=Math.min(W,H)*.16;x.fillStyle='rgba(43,27,20,.12)';x.beginPath();x.ellipse(bx,by+br*.55,br*1.25,br*.25,0,0,Math.PI*2);x.fill();x.fillStyle='#FFFFFF';x.beginPath();x.ellipse(bx,by,br*1.2,br*.3,0,0,Math.PI*2);x.fill();
  x.fillStyle=t.accent;x.beginPath();x.moveTo(bx-br,by);x.quadraticCurveTo(bx-br,by+br*.9,bx,by+br*.9);x.quadraticCurveTo(bx+br,by+br*.9,bx+br,by);x.fill();x.fillStyle='#E06A3A';x.beginPath();x.ellipse(bx,by,br,br*.22,0,0,Math.PI*2);x.fill();x.fillStyle=t.accent2;[[-.3,0],[.2,-.05],[.45,.04]].forEach(([u,v])=>{x.beginPath();x.ellipse(bx+u*br,by+v*br,br*.1,br*.045,u,0,Math.PI*2);x.fill()});
  x.strokeStyle='rgba(43,27,20,.35)';x.lineWidth=3*d;x.lineCap='round';for(let k=0;k<3;k++){const ph=((a*.25+k/3)%1);x.globalAlpha=Math.sin(ph*Math.PI)*.8;x.beginPath();for(let i=0;i<=30;i++){const u=i/30,Y=by-br*.3-u*br*1.8-ph*br*.6,X=bx+(k-1)*br*.4+Math.sin(u*6+a*2+k)*br*.12*(1+u);i?x.lineTo(X,Y):x.moveTo(X,Y)}x.stroke()}x.globalAlpha=1}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.02;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
voyage(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0;
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d}
 function draw(){const hz=H*.58,sky=['#F7D9B0','#F5C79A','#F2B486','#EE9F74'];sky.forEach((col,i)=>{x.fillStyle=col;x.fillRect(0,i*hz/4,W,hz/4+1)});
  const sr=Math.min(W,H)*.15;x.fillStyle=t.accent;x.beginPath();x.arc(W*.7,hz-sr*.15,sr,0,Math.PI*2);x.fill();x.fillStyle=t.accent3;x.globalAlpha=.6;[[.2,.18],[.5,.1]].forEach(([u,v],i)=>{const X=((u*W+a*20*d*(i+1))%(W+300*d))-150*d;x.fillRect(X,v*H,180*d,10*d);x.fillRect(X+40*d,v*H+16*d,120*d,8*d)});x.globalAlpha=1;
  const cols=['#2C8C9C',t.accent2,'#17607A',t.ink];cols.forEach((col,i)=>{x.fillStyle=col;x.beginPath();x.moveTo(0,H);for(let X=0;X<=W;X+=6*d)x.lineTo(X,hz+i*H*.1+Math.sin(X/W*12+a*(1+i*.4)+i)*5*d*(i+1));x.lineTo(W,H);x.fill();
   if(i===1){const bx=W*.32+Math.sin(a*.3)*W*.04,by=hz+H*.1+Math.sin(bx/W*12+a*1.4+1)*10*d,s=Math.min(W,H)*.09;x.save();x.translate(bx,by);x.rotate(Math.sin(a*1.5)*.06);x.fillStyle=t.ink;x.beginPath();x.moveTo(-s,0);x.lineTo(s,0);x.lineTo(s*.7,s*.3);x.lineTo(-s*.7,s*.3);x.fill();x.fillStyle='#FFFFFF';x.beginPath();x.moveTo(0,-s*1.6);x.lineTo(s*.8,-s*.1);x.lineTo(0,-s*.1);x.fill();x.fillStyle='#FFF4E2';x.beginPath();x.moveTo(-s*.1,-s*1.3);x.lineTo(-s*.1,-s*.1);x.lineTo(-s*.8,-s*.1);x.fill();x.restore()}});
  x.strokeStyle=t.ink;x.lineWidth=2*d;x.lineCap='round';for(let k=0;k<3;k++){const X=((W*.15+k*W*.12+a*30*d)%(W+80*d))-40*d,Y=H*(.2+k*.06),fl=Math.sin(a*6+k)*5*d,s=10*d;x.beginPath();x.moveTo(X-s,Y-fl);x.quadraticCurveTo(X-s*.4,Y-s*.4,X,Y);x.quadraticCurveTo(X+s*.4,Y-s*.4,X+s,Y-fl);x.stroke()}}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.012;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
atelier(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0,P=[];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;P=Array.from({length:120},(_,i)=>({x:Math.random()*W,y:Math.random()*H,c:i%9===0?t.accent2:t.ink}));x.fillStyle=t.bg;x.fillRect(0,0,W,H)}
 const ang=(X,Y)=>Math.sin(X/W*3+a)*1.4+Math.cos(Y/H*4-a*.7)*1.2+Math.sin((X+Y)/W*2+a*.3);
 function step(){x.fillStyle='rgba(247,243,238,.035)';x.fillRect(0,0,W,H);x.lineWidth=.7*d;P.forEach(p=>{const an=ang(p.x,p.y),nx=p.x+Math.cos(an)*1.6*d,ny=p.y+Math.sin(an)*1.6*d;x.strokeStyle=p.c;x.globalAlpha=p.c===t.ink?.18:.55;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(nx,ny);x.stroke();p.x=nx;p.y=ny;if(p.x<0||p.x>W||p.y<0||p.y>H||Math.random()<.004){p.x=Math.random()*W;p.y=Math.random()*H}});x.globalAlpha=1}
 size();if(still){for(let i=0;i<260;i++)step();return()=>{}}const loop=()=>{a+=.002;step();step();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
tide(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0,Bb=[],Kp=[];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;Bb=Array.from({length:40},()=>[Math.random()*W,Math.random()*H,(1.5+Math.random()*4)*d,.4+Math.random()]);Kp=Array.from({length:9},(_,i)=>[(i+.3+Math.random()*.4)/9*W,H*(.35+Math.random()*.35),Math.random()*6])}
 function draw(){let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0C3A4E');g.addColorStop(1,t.bg);x.fillStyle=g;x.fillRect(0,0,W,H);
  x.globalCompositeOperation='lighter';for(let k=0;k<5;k++){const X0=W*(.1+k*.22)+Math.sin(a*.3+k)*W*.03;g=x.createLinearGradient(X0,0,X0+W*.15,H);g.addColorStop(0,'rgba(120,230,220,.12)');g.addColorStop(1,'rgba(120,230,220,0)');x.fillStyle=g;x.beginPath();x.moveTo(X0,0);x.lineTo(X0+W*.06,0);x.lineTo(X0+W*.25,H);x.lineTo(X0+W*.12,H);x.fill()}
  x.strokeStyle='rgba(160,245,235,.22)';x.lineWidth=1.4*d;for(let j=0;j<10;j++){x.beginPath();for(let X=0;X<=W;X+=10*d){const Y=H*.03+j*H*.028+Math.sin(X/W*14+a*2+j*1.7)*6*d+Math.sin(X/W*31-a*3+j)*3*d;X?x.lineTo(X,Y):x.moveTo(X,Y)}x.stroke()}x.globalCompositeOperation='source-over';
  Kp.forEach(([X,h,p],i)=>{x.strokeStyle=i%3?'#1C6B4F':'#2C8A5E';x.lineWidth=(6+i%3*2)*d;x.lineCap='round';x.beginPath();x.moveTo(X,H);for(let u=0;u<=1;u+=.05){const sw=Math.sin(a*1.2+p+u*3)*u*30*d;x.lineTo(X+sw,H-u*h)}x.stroke();x.fillStyle=x.strokeStyle;for(let u=.15;u<1;u+=.17){const sw=Math.sin(a*1.2+p+u*3)*u*30*d;x.beginPath();x.ellipse(X+sw+8*d,H-u*h,10*d,3.5*d,-.6,0,Math.PI*2);x.fill()}});
  Bb.forEach(b=>{b[1]-=b[3]*d;b[0]+=Math.sin(a*3+b[1]*.02)*.4*d;if(b[1]<-10){b[1]=H+10;b[0]=Math.random()*W}x.strokeStyle='rgba(227,246,245,.55)';x.lineWidth=d;x.beginPath();x.arc(b[0],b[1],b[2],0,Math.PI*2);x.stroke()})}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.012;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
lab(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0;const A=[[0,0,0,0],[1.4,0,0,1],[-.7,1.2,0,1],[-.7,-1.2,0,2],[2.1,1.2,.3,0],[2.1,-1.2,-.3,3],[-1.4,2.4,.2,0],[3.5,1.2,.5,1],[-1.4,-2.4,-.4,1],[0,0,1.5,3]],Bd=[[0,1],[0,2],[0,3],[1,4],[1,5],[2,6],[4,7],[3,8],[0,9]];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);const g=12*d;x.lineWidth=d;for(let X=0;X<W;X+=g){x.strokeStyle=(X/g)%5?'rgba(59,71,214,.07)':'rgba(59,71,214,.16)';x.beginPath();x.moveTo(X,0);x.lineTo(X,H);x.stroke()}for(let Y=0;Y<H;Y+=g){x.strokeStyle=(Y/g)%5?'rgba(59,71,214,.07)':'rgba(59,71,214,.16)';x.beginPath();x.moveTo(0,Y);x.lineTo(W,Y);x.stroke()}
  const cx=W*.68,cy=H*.45,S=Math.min(W,H)*.09,ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(a*.6),sb=Math.sin(a*.6);const P=A.map(([X,Y,Z,k])=>{let x1=X*ca+Z*sa,z1=-X*sa+Z*ca,y1=Y*cb-z1*sb,z2=Y*sb+z1*cb;const s=1+z2*.08;return[cx+x1*S*s,cy+y1*S*s,z2,k]});
  x.strokeStyle=t.mute;x.lineWidth=4*d;x.lineCap='round';Bd.forEach(([i,j])=>{x.beginPath();x.moveTo(P[i][0],P[i][1]);x.lineTo(P[j][0],P[j][1]);x.stroke()});
  const col=[t.ink,t.accent,t.accent2,t.accent3];[...P].sort((p,q)=>p[2]-q[2]).forEach(p=>{const r=(p[3]===0?.42:.32)*S*(1+p[2]*.08),gr=x.createRadialGradient(p[0]-r*.35,p[1]-r*.35,r*.1,p[0],p[1],r);gr.addColorStop(0,'#FFFFFF');gr.addColorStop(.35,col[p[3]]);gr.addColorStop(1,col[p[3]]);x.fillStyle=gr;x.beginPath();x.arc(p[0],p[1],r,0,Math.PI*2);x.fill()});
  const tp=P[7];x.strokeStyle=t.accent;x.lineWidth=1.2*d;x.beginPath();x.moveTo(tp[0],tp[1]);x.lineTo(tp[0]+40*d,tp[1]-40*d);x.lineTo(tp[0]+110*d,tp[1]-40*d);x.stroke();x.fillStyle=t.accent;x.font=`${12*d}px "Spline Sans Mono", monospace`;x.fillText('N–H  1.01 Å',tp[0]+44*d,tp[1]-46*d)}
 size();if(still){a=.7;draw();return()=>{}}const loop=()=>{a+=.008;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
observatory(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0,T=0,St=[];const CON=[[[.2,.3],[.28,.22],[.36,.26],[.42,.18],[.5,.24]],[[.6,.5],[.66,.42],[.74,.46],[.7,.56],[.6,.5]],[[.3,.62],[.38,.7],[.46,.66],[.52,.74]]];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;St=Array.from({length:420},()=>[Math.random()*Math.max(W,H)*1.3,Math.random()*Math.PI*2,Math.random()])}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);const px=W*.85,py=-H*.1;x.strokeStyle=t.line;x.lineWidth=d;for(let r=H*.3;r<Math.max(W,H)*1.4;r+=H*.22){x.beginPath();x.arc(px,py,r,0,Math.PI*2);x.stroke()}for(let k=0;k<12;k++){const an=a+k*Math.PI/6;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(an)*W*2,py+Math.sin(an)*W*2);x.stroke()}
  St.forEach(([r,th,b])=>{const X=px+Math.cos(th+a)*r,Y=py+Math.sin(th+a)*r;if(X<0||X>W||Y<0||Y>H)return;x.fillStyle=b>.97?t.accent:'#EEF0FF';x.globalAlpha=.3+.7*b*(.8+.2*Math.sin(T*3+r));x.beginPath();x.arc(X,Y,(b>.9?1.6:.9)*d,0,Math.PI*2);x.fill()});x.globalAlpha=1;
  CON.forEach((cn,ci)=>{const prog=still?1:Math.min(1,Math.max(0,(T*.25-ci*.6)%5));const pts=cn.map(([u,v])=>{const dx=u*W-px,dy=v*H-py,r=Math.hypot(dx,dy),th=Math.atan2(dy,dx)+a;return[px+Math.cos(th)*r,py+Math.sin(th)*r]});const segs=(pts.length-1)*Math.min(1,prog);x.strokeStyle=t.accent2;x.globalAlpha=.7;x.lineWidth=1.2*d;x.beginPath();x.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<=Math.ceil(segs);i++){const f=Math.min(1,segs-(i-1)),p0=pts[i-1],p1=pts[i];x.lineTo(p0[0]+(p1[0]-p0[0])*f,p0[1]+(p1[1]-p0[1])*f)}x.stroke();x.globalAlpha=1;pts.forEach(p=>{x.fillStyle=t.accent;x.beginPath();x.arc(p[0],p[1],2.6*d,0,Math.PI*2);x.fill()})})}
 size();if(still){T=20;draw();return()=>{}}let last=performance.now();const loop=n=>{raf=requestAnimationFrame(loop);const dt=Math.min(.05,(n-last)/1000);last=n;T+=dt;a+=dt*.02;draw()};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
groove(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0;const cols=['#6E3B1C',t.accent,'#DE7A27',t.accent2,t.accent3||'#6B8E23'];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);const sx=W*.78,sy=H*.32;x.save();x.translate(sx,sy);x.rotate(a*.05);x.fillStyle='rgba(233,162,31,.18)';for(let i=0;i<24;i++){x.rotate(Math.PI/12);x.beginPath();x.moveTo(0,0);x.lineTo(W,-W*.06);x.lineTo(W,W*.06);x.fill()}x.restore();
  const bw=Math.min(W,H)*.06;cols.forEach((col,i)=>{x.strokeStyle=col;x.lineWidth=bw+1;x.lineCap='butt';x.beginPath();for(let X=-20*d;X<=W+20*d;X+=6*d){const u=X/W,Y=H*.6+(i-2)*bw+Math.sin(u*Math.PI*2.2+a)*H*.12+Math.sin(u*Math.PI*5-a*.7)*H*.02;X<=-20*d?x.moveTo(X,Y):x.lineTo(X,Y)}x.stroke()})}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.012;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
atomic(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0,O=[];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;O=Array.from({length:18},(_,i)=>({x:Math.random()*W,y:Math.random()*H,k:i%3,s:(18+Math.random()*30)*d,r:Math.random()*6,v:(Math.random()-.5)*.012,p:Math.random()*6,c:[t.accent,t.accent2,t.accent3||t.accent,t.ink][i%4]}))}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);x.strokeStyle='rgba(31,42,46,.07)';x.lineWidth=d;const g=46*d;for(let i=-H/g;i<W/g+H/g;i++){x.beginPath();x.moveTo(i*g,0);x.lineTo(i*g+H,H);x.stroke();x.beginPath();x.moveTo(i*g,0);x.lineTo(i*g-H,H);x.stroke()}
  O.forEach(o=>{o.r+=o.v;x.save();x.translate(o.x+Math.sin(a+o.p)*10*d,o.y+Math.cos(a*.8+o.p)*8*d);x.rotate(o.r);x.strokeStyle=x.fillStyle=o.c;x.lineCap='round';
   if(o.k===0){const tw=.75+.25*Math.sin(a*3+o.p);x.lineWidth=2.5*d;for(let i=0;i<8;i++){x.rotate(Math.PI/4);x.beginPath();x.moveTo(0,o.s*.15);x.lineTo(0,o.s*(i%2?.6:1)*tw);x.stroke()}x.beginPath();x.arc(0,0,o.s*.12,0,Math.PI*2);x.fill()}
   else if(o.k===1){x.beginPath();x.moveTo(-o.s,o.s*.2);x.quadraticCurveTo(0,-o.s*.9,o.s,o.s*.2);x.quadraticCurveTo(0,-o.s*.3,-o.s,o.s*.2);x.fill()}
   else{x.lineWidth=1.8*d;for(let i=0;i<3;i++){x.beginPath();x.ellipse(0,0,o.s,o.s*.32,i*Math.PI/3,0,Math.PI*2);x.stroke()}x.beginPath();x.arc(0,0,o.s*.14,0,Math.PI*2);x.fill();const an=a*3+o.p;x.beginPath();x.arc(Math.cos(an)*o.s,Math.sin(an)*o.s*.32,o.s*.08,0,Math.PI*2);x.fill()}x.restore()})}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.016;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
teletext(c,t,still){const x=c.getContext('2d');let W,H,d,raf,T=0,cw,ch,cols=40,rows=24,grid=[];const PAL=['#FF0000','#00FF00','#FFFF00','#0000FF','#FF00FF','#00FFFF','#FFFFFF'];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;cols=Math.max(20,Math.round(W/(22*d)));cw=W/cols;ch=H/rows;build()}
 function build(){grid=[];for(let r=0;r<rows;r++){const row=[];for(let i=0;i<cols;i++){let v=null;if(r>=3&&r<9){const band=PAL[(i/Math.ceil(cols/7)|0)%7];v={c:band,m:63}}else if(r>=11&&r<19){const u=i/cols,h=.5+.5*Math.sin(u*Math.PI*3+r*.4);if(h>.55)v={c:r<14?'#00FFFF':r<17?'#00FF00':'#FFFF00',m:1+(Math.random()*62|0)}}else if(r>=20&&r<22&&i>1&&i<cols-2&&Math.random()<.5)v={c:'#FF00FF',m:Math.random()*63|0}row.push(v)}grid.push(row)}}
 function cell(X,Y,m){const sw=cw/2,sh=ch/3;for(let b=0;b<6;b++)if(m&(1<<b))x.fillRect(X+(b%2)*sw,Y+(b/2|0)*sh,sw+.5,sh+.5)}
 function draw(){x.fillStyle='#000';x.fillRect(0,0,W,H);const shown=still?rows:Math.min(rows,Math.floor(T*6)%(rows+14));
  x.font=`${ch*.8}px Silkscreen, "Azeret Mono", monospace`;x.fillStyle='#FFFFFF';x.fillText('P100',cw,ch*.85);x.fillStyle='#FFFF00';x.fillText('ATLAS',cw*7,ch*.85);const s=Math.floor(T)+43200;x.fillStyle='#FFFFFF';x.fillText([s/3600%24|0,(s/60|0)%60,s%60].map(v=>String(v).padStart(2,'0')).join(':'),W-cw*9,ch*.85);
  x.fillStyle='#0000FF';x.fillRect(0,ch*1.2,W,ch*1.3);x.fillStyle='#FFFF00';x.fillText('NEWS  WEATHER  SPORT  TV',cw,ch*2.2);
  for(let r=3;r<shown;r++)grid[r].forEach((v,i)=>{if(v){x.fillStyle=v.c;cell(i*cw,r*ch,v.m)}});
  if(!still&&Math.floor(T*2)%2)return;x.fillStyle='#FFFFFF';x.fillRect(cw,ch*22.3,cw*.8,ch*.7)}
 size();if(still){draw();return()=>{}}let last=performance.now(),prev=0;const loop=n=>{raf=requestAnimationFrame(loop);T+=Math.min(.05,(n-last)/1000);last=n;const cyc=Math.floor(T*6/(rows+14));if(cyc!==prev){prev=cyc;build()}draw()};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
loom(c,t,still){const x=c.getContext('2d');let W,H,d,raf,T=0,sw,rh,bands=[];const C=[t.accent,t.accent2,t.accent3||t.accent,'#F7EBDD','#1D1410'];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;sw=Math.max(60*d,W/9);rh=8*d;bands=Array.from({length:Math.ceil(W/sw)+1},(_,i)=>({k:i%4,a:C[i%3],b:C[(i+1)%3],ground:i%2?'#3A2A20':C[3]}))}
 function row(r){return bands.map(b=>{const q=r%24;let v;if(b.k===0)v=q<6?b.a:q<12?b.ground:q<18?b.b:b.ground;else if(b.k===1)v=(q<12)?b.ground:b.a;else if(b.k===2)v=q%8<4?b.b:b.a;else v=b.ground;return v})}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);const rowsN=Math.ceil(H/rh)+1,woven=still?rowsN:Math.min(rowsN,Math.floor(T*14)),scroll=still?0:(T*14>rowsN?(T*14-rowsN)*rh:0);
  for(let r=0;r<woven;r++){const gr=r+Math.floor(scroll/rh),Y=H-(r+1)*rh+(scroll%rh),cs=row(gr);bands.forEach((b,i)=>{const X=i*sw;x.fillStyle=cs[i];x.fillRect(X+2*d,Y,sw-4*d,rh);
   if(b.k===1){const q=gr%24;if(q<12){x.fillStyle=b.a;const m=Math.abs(6-q%12)/6;x.fillRect(X+sw*.5-sw*.4*(1-m),Y,sw*.8*(1-m),rh)}}
   if(b.k===3){const q=gr%16;x.fillStyle=b.a;for(let s=0;s<4;s++){const zx=((q+s*4)%16<8?(q+s*4)%16:16-(q+s*4)%16)/8;x.fillRect(X+4*d+zx*(sw-16*d),Y,8*d,rh)}}});x.fillStyle='rgba(0,0,0,.18)';x.fillRect(0,Y+rh-d,W,d)}
  x.strokeStyle='rgba(247,235,221,.18)';x.lineWidth=d;for(let X=0;X<W;X+=6*d){x.beginPath();x.moveTo(X,0);x.lineTo(X,H-woven*rh+(scroll%rh));x.stroke()}
  if(!still&&woven<rowsN){const Y=H-woven*rh;x.fillStyle='#C7B19B';x.fillRect(0,Y-6*d,W,4*d)}}
 size();if(still){draw();return()=>{}}let last=performance.now();const loop=n=>{raf=requestAnimationFrame(loop);T+=Math.min(.05,(n-last)/1000);last=n;draw()};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
azulejo(c,t,still){const x=c.getContext('2d');let W,H,d,raf,T=0,s,tiles=[],flip=null;
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;s=Math.max(70*d,Math.min(W,H)/5);tiles=[];for(let j=0;j<Math.ceil(H/s);j++)for(let i=0;i<Math.ceil(W/s);i++)tiles.push({i,j,m:(i+j)%3,r:(i*3+j)%4})}
 function motif(m,r){const h=s/2;x.save();x.rotate(r*Math.PI/2);x.strokeStyle=t.accent;x.fillStyle=t.accent;x.lineWidth=2.2*d;
  if(m===0){for(let k=0;k<4;k++){x.rotate(Math.PI/2);x.beginPath();x.ellipse(0,-h*.42,h*.16,h*.36,0,0,Math.PI*2);x.stroke();x.beginPath();x.arc(h,h,h*.5,Math.PI,Math.PI*1.5);x.stroke()}x.beginPath();x.arc(0,0,h*.12,0,Math.PI*2);x.fill()}
  else if(m===1){x.beginPath();x.arc(-h,-h,h,0,Math.PI/2);x.stroke();x.beginPath();x.arc(h,h,h,Math.PI,Math.PI*1.5);x.stroke();x.beginPath();x.arc(-h,-h,h*.6,0,Math.PI/2);x.lineTo(-h,-h);x.fill();x.beginPath();x.arc(h,h,h*.6,Math.PI,Math.PI*1.5);x.lineTo(h,h);x.fill();x.fillStyle=t.accent2;x.beginPath();x.arc(0,0,h*.14,0,Math.PI*2);x.fill()}
  else{x.beginPath();x.moveTo(0,-h*.8);x.lineTo(h*.8,0);x.lineTo(0,h*.8);x.lineTo(-h*.8,0);x.closePath();x.stroke();x.beginPath();x.moveTo(0,-h*.45);x.lineTo(h*.45,0);x.lineTo(0,h*.45);x.lineTo(-h*.45,0);x.closePath();x.fill();for(let k=0;k<4;k++){x.rotate(Math.PI/2);x.beginPath();x.arc(h,h,h*.22,0,Math.PI*2);x.fill()}}x.restore()}
 function draw(){x.fillStyle=t.line;x.fillRect(0,0,W,H);tiles.forEach(tl=>{let sc=1;if(flip&&flip.t===tl){const p=flip.p;sc=Math.abs(Math.cos(p*Math.PI));if(p>.5&&!flip.sw){tl.m=(tl.m+1)%3;tl.r=(tl.r+1)%4;flip.sw=1}}x.save();x.translate(tl.i*s+s/2,tl.j*s+s/2);x.scale(sc,1);x.fillStyle='#FFFFFF';x.fillRect(-s/2+1.5*d,-s/2+1.5*d,s-3*d,s-3*d);x.beginPath();x.rect(-s/2+1.5*d,-s/2+1.5*d,s-3*d,s-3*d);x.clip();motif(tl.m,tl.r);const g=x.createLinearGradient(-s/2,-s/2,s/2,s/2);g.addColorStop(0,'rgba(255,255,255,.35)');g.addColorStop(.5,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(-s/2,-s/2,s,s);x.restore()})}
 size();if(still){draw();return()=>{}}let last=performance.now(),wait=0;const loop=n=>{raf=requestAnimationFrame(loop);const dt=Math.min(.05,(n-last)/1000);last=n;if(flip){flip.p+=dt*1.4;if(flip.p>=1)flip=null}else{wait-=dt;if(wait<0){flip={t:tiles[Math.random()*tiles.length|0],p:0};wait=.3}}draw()};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
papel(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0,Cf=[];const cols=[t.accent,t.accent2,t.accent3||t.accent,'#7A3FD1','#FF6B3D'];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;Cf=Array.from({length:60},()=>[Math.random()*W,Math.random()*H,(3+Math.random()*5)*d,Math.random()*6,cols[Math.random()*cols.length|0],.5+Math.random()])}
 function flag(X,Y,w,h,col,sw){x.save();x.translate(X,Y);x.rotate(sw);x.beginPath();x.rect(-w/2,0,w,h*.82);for(let i=0;i<5;i++){x.lineTo(-w/2+(i+.5)*w/5,h);x.lineTo(-w/2+(i+1)*w/5,h*.82)}x.lineTo(-w/2,h*.82);
  x.moveTo(0,h*.2);x.arc(0,h*.4,h*.16,-Math.PI/2,Math.PI*1.5);for(let k=0;k<6;k++){const an=k/6*Math.PI*2,px=Math.cos(an)*h*.27,py=h*.4+Math.sin(an)*h*.27;x.moveTo(px+h*.05,py);x.arc(px,py,h*.05,0,Math.PI*2)}[[-.32,.12],[.32,.12],[-.32,.66],[.32,.66]].forEach(([u,v])=>{const px=u*w,py=v*h;x.moveTo(px,py-h*.07);x.lineTo(px+h*.06,py);x.lineTo(px,py+h*.07);x.lineTo(px-h*.06,py);x.closePath()});
  x.fillStyle=col;x.fill('evenodd');x.restore()}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);[[.06,.0],[.24,1.2],[.42,2.1]].forEach(([yy,ph],ri)=>{const Y0=H*yy,w=Math.max(70*d,W/11),h=w*1.15,n=Math.ceil(W/w)+1;x.strokeStyle=t.ink;x.lineWidth=1.5*d;x.globalAlpha=.6;x.beginPath();for(let i=0;i<=n;i++){const X=i*w,Y=Y0+Math.sin(i/n*Math.PI)*h*.25;i?x.lineTo(X,Y):x.moveTo(X,Y)}x.stroke();x.globalAlpha=ri===2?.85:1;for(let i=0;i<n;i++){const X=i*w+w/2,Y=Y0+Math.sin((i+.5)/n*Math.PI)*h*.25;flag(X,Y,w*.9,h,cols[(i+ri*2)%cols.length],Math.sin(a*1.6+i*.6+ph)*.12)}x.globalAlpha=1});
  Cf.forEach(p=>{p[1]+=p[5]*.8*d;p[0]+=Math.sin(a*2+p[3])*.5*d;if(p[1]>H)p[1]=-10;x.save();x.translate(p[0],p[1]);x.rotate(a*2+p[3]);x.fillStyle=p[4];x.fillRect(-p[2]/2,-p[2]/4,p[2],p[2]/2);x.restore()})}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.016;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
shibori(c,t,still){const x=c.getContext('2d');let W,H,d,raf,T=0,B=[],tex;
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;const s=Math.min(W,H)*.34;B=[];for(let j=0;j<4;j++)for(let i=0;i<6;i++)if((i+j)%2===0)B.push({x:(i+.5)*W/5.4,y:(j+.5)*H/3.2,s,p:Math.random()*4});tex=document.createElement('canvas');tex.width=W;tex.height=H;const q=tex.getContext('2d');q.strokeStyle='rgba(255,255,255,.035)';for(let i=0;i<W*H/1400;i++){const X=Math.random()*W,Y=Math.random()*H;q.beginPath();q.moveTo(X,Y);q.lineTo(X+(Math.random()-.5)*20*d,Y+(Math.random()-.5)*4*d);q.stroke()}}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);x.strokeStyle='rgba(124,155,224,.16)';x.lineWidth=2*d;for(let X=W/5.4;X<W;X+=W/5.4){x.beginPath();x.moveTo(X,0);x.lineTo(X,H);x.stroke()}for(let Y=H/3.2;Y<H;Y+=H/3.2){x.beginPath();x.moveTo(0,Y);x.lineTo(W,Y);x.stroke()}
  B.forEach(b=>{const gr=still?1:.75+.25*Math.sin(T*.4+b.p);for(let k=7;k>=1;k--){const r=b.s*k/7*gr;x.lineWidth=(k%2?7:3)*d;x.strokeStyle=`rgba(242,232,213,${.05+.06*(7-k)/7})`;x.beginPath();for(let i=0;i<=72;i++){const an=i/72*Math.PI*2,rr=r*(1+.04*Math.sin(an*7+k+T*.3)+.03*Math.sin(an*13-k));const X=b.x+Math.cos(an)*rr,Y=b.y+Math.sin(an)*rr;i?x.lineTo(X,Y):x.moveTo(X,Y)}x.stroke()}x.fillStyle='rgba(242,232,213,.35)';x.beginPath();x.arc(b.x,b.y,b.s*.06*gr,0,Math.PI*2);x.fill()});x.drawImage(tex,0,0)}
 size();if(still){draw();return()=>{}}let last=0;const loop=n=>{raf=requestAnimationFrame(loop);if(n-last<33)return;T+=(n-last)/1000||0;last=n;draw()};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
marmo(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0,V,gold=[];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;V=document.createElement('canvas');V.width=Math.ceil(W*1.2);V.height=Math.ceil(H*1.2);const q=V.getContext('2d');
  const fld=(X,Y)=>Math.sin(X*.004/d+Math.sin(Y*.006/d)*2)*1.2+Math.cos(Y*.003/d+Math.sin(X*.005/d)*1.5);
  for(let k=0;k<70;k++){let X=Math.random()*V.width,Y=Math.random()*V.height;const w=Math.random();q.strokeStyle=`rgba(90,88,83,${.05+w*.22})`;q.lineWidth=(.4+w*1.6)*d;q.beginPath();q.moveTo(X,Y);for(let s=0;s<220;s++){const an=fld(X,Y)+.6;X+=Math.cos(an)*4*d;Y+=Math.sin(an)*4*d;q.lineTo(X,Y)}q.stroke()}
  gold=[];let X=V.width*.1,Y=V.height*.85;for(let s=0;s<260;s++){const an=fld(X,Y)-.9;X+=Math.cos(an)*5*d;Y+=Math.sin(an)*5*d;gold.push([X,Y])}}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);const ox=-W*.1+Math.sin(a*.3)*W*.04,oy=-H*.1+Math.cos(a*.2)*H*.04;x.drawImage(V,ox,oy);
  x.lineWidth=1.6*d;x.lineCap='round';for(let i=1;i<gold.length;i++){const ph=Math.sin(i*.05-a*2);x.strokeStyle=`rgba(160,127,72,${.35+.45*Math.max(0,ph)})`;x.beginPath();x.moveTo(gold[i-1][0]+ox,gold[i-1][1]+oy);x.lineTo(gold[i][0]+ox,gold[i][1]+oy);x.stroke()}
  const g=x.createRadialGradient(W*.3,H*.2,0,W*.3,H*.2,W*.8);g.addColorStop(0,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,W,H)}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.008;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
comic(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0;
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);const s=12*d;x.fillStyle=t.accent2;for(let Y=0;Y<H;Y+=s)for(let X=(Y/s%2)*s/2;X<W;X+=s){const r=s*.42*(X/W);if(r>.5){x.beginPath();x.arc(X,Y,r,0,Math.PI*2);x.fill()}}
  const cx=W*.7,cy=H*.45;x.fillStyle=t.ink;for(let i=0;i<72;i++){const an=i/72*Math.PI*2+Math.sin(a*.5)*.02,w=(i%3?.006:.014);x.beginPath();x.moveTo(cx+Math.cos(an)*Math.min(W,H)*.28,cy+Math.sin(an)*Math.min(W,H)*.28);x.lineTo(cx+Math.cos(an-w)*W*1.2,cy+Math.sin(an-w)*W*1.2);x.lineTo(cx+Math.cos(an+w)*W*1.2,cy+Math.sin(an+w)*W*1.2);x.fill()}
  const pul=1+.08*Math.sin(a*4),R=Math.min(W,H)*.26*pul;x.beginPath();for(let i=0;i<=24;i++){const an=i/24*Math.PI*2,r=i%2?R*.62:R*(1+.08*Math.sin(i*2.3));x.lineTo(cx+Math.cos(an)*r,cy+Math.sin(an)*r)}x.closePath();x.fillStyle=t.accent;x.fill();x.lineWidth=5*d;x.strokeStyle=t.ink;x.lineJoin='round';x.stroke();
  x.save();x.translate(cx,cy);x.rotate(-.12);x.font=`${R*.42}px Bangers, Impact, sans-serif`;x.textAlign='center';x.textBaseline='middle';x.lineWidth=6*d;x.strokeStyle=t.ink;x.strokeText('POW!',0,0);x.fillStyle=t.accent2;x.fillText('POW!',0,0);x.restore();
  x.strokeStyle=t.ink;x.lineWidth=6*d;x.strokeRect(10*d,10*d,W-20*d,H-20*d)}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.03;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
bloom(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0;const B=[[t.accent2,.3,.3,.5,.7],[t.accent3,.75,.25,.6,1.1],['#E8A6D6',.6,.75,.45,.9],[t.accent,.2,.8,.35,1.3],['#FFE3C7',.85,.8,.4,.6]];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d}
 function rgba(h,al){const n=parseInt(h.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${al})`}
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);B.forEach(([col,u,v,r,sp],i)=>{const X=(u+.12*Math.sin(a*sp+i))*W,Y=(v+.12*Math.cos(a*sp*.8+i*2))*H,R=r*Math.max(W,H)*(.9+.1*Math.sin(a+i));const g=x.createRadialGradient(X,Y,0,X,Y,R);g.addColorStop(0,rgba(col,col===t.accent?.35:.75));g.addColorStop(1,rgba(col,0));x.fillStyle=g;x.fillRect(0,0,W,H)})}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.006;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
rain(c,t,still){const x=c.getContext('2d');let W,H,d,raf,a=0,Bk=[],Dr=[],St=[];
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;const cols=[t.accent,t.accent2,'#FFB547','#FFFFFF','#B48CFF'];Bk=Array.from({length:34},()=>[Math.random()*W,H*(.3+Math.random()*.6),(14+Math.random()*50)*d,cols[Math.random()*cols.length|0],Math.random()*6]);Dr=Array.from({length:26},()=>[Math.random()*W,Math.random()*H,(2+Math.random()*4)*d,Math.random()*.6]);St=Array.from({length:130},()=>[Math.random()*W,Math.random()*H,(10+Math.random()*30)*d,(8+Math.random()*10)*d])}
 function rgba(h,al){const n=parseInt(h.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${al})`}
 function draw(){let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#05070C');g.addColorStop(1,'#141A2A');x.fillStyle=g;x.fillRect(0,0,W,H);x.globalCompositeOperation='lighter';
  Bk.forEach(([X,Y,r,col,p])=>{const al=.16+.1*Math.sin(a*1.2+p);g=x.createRadialGradient(X,Y,0,X,Y,r);g.addColorStop(0,rgba(col,al));g.addColorStop(.7,rgba(col,al*.8));g.addColorStop(1,rgba(col,0));x.fillStyle=g;x.beginPath();x.arc(X,Y,r,0,Math.PI*2);x.fill()});x.globalCompositeOperation='source-over';
  x.strokeStyle='rgba(200,215,240,.22)';x.lineWidth=d;St.forEach(s=>{s[1]+=s[3]*(still?0:1);s[0]-=s[3]*.15*(still?0:1);if(s[1]>H){s[1]=-s[2];s[0]=Math.random()*W*1.1}x.beginPath();x.moveTo(s[0],s[1]);x.lineTo(s[0]-s[2]*.15,s[1]+s[2]);x.stroke()});
  Dr.forEach(dr=>{if(!still){dr[3]+=.004;if(Math.random()<.01)dr[3]+=.3}if(dr[3]>1){dr[1]+=2*d;dr[3]=.9}if(dr[1]>H+10){dr[1]=-10;dr[0]=Math.random()*W}const X=dr[0],Y=dr[1],r=dr[2];x.strokeStyle='rgba(230,233,240,.14)';x.lineWidth=r*.8;x.beginPath();x.moveTo(X,Y-r*6);x.lineTo(X,Y);x.stroke();g=x.createRadialGradient(X-r*.3,Y-r*.3,0,X,Y,r);g.addColorStop(0,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,.08)');x.fillStyle=g;x.beginPath();x.arc(X,Y,r,0,Math.PI*2);x.fill()})}
 size();if(still){draw();return()=>{}}const loop=()=>{a+=.016;draw();raf=requestAnimationFrame(loop)};loop();const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}},
chambers(c,t,still){const x=c.getContext('2d');let W,H,d,raf,T=0,G;
 function size(){d=Math.min(2,devicePixelRatio||1);W=c.width=c.clientWidth*d;H=c.height=c.clientHeight*d;G=document.createElement('canvas');G.width=W;G.height=H;const q=G.getContext('2d');for(let i=0;i<W*H/260;i++){q.fillStyle=Math.random()<.5?'rgba(0,0,0,.12)':'rgba(255,255,255,.025)';q.fillRect(Math.random()*W,Math.random()*H,(1+Math.random()*2)*d,d)}}
 function frame(m,al){x.strokeStyle=`rgba(201,164,76,${al})`;x.lineWidth=1.2*d;x.strokeRect(m,m,W-2*m,H-2*m);x.strokeRect(m+6*d,m+6*d,W-2*m-12*d,H-2*m-12*d);[[m,m,1,1],[W-m,m,-1,1],[m,H-m,1,-1],[W-m,H-m,-1,-1]].forEach(([X,Y,sx,sy])=>{x.beginPath();x.arc(X+sx*18*d,Y+sy*18*d,10*d,0,Math.PI*2);x.stroke();x.beginPath();x.moveTo(X+sx*30*d,Y+sy*6*d);x.quadraticCurveTo(X+sx*50*d,Y+sy*20*d,X+sx*70*d,Y+sy*6*d);x.stroke();x.beginPath();x.moveTo(X+sx*6*d,Y+sy*30*d);x.quadraticCurveTo(X+sx*20*d,Y+sy*50*d,X+sx*6*d,Y+sy*70*d);x.stroke()})}
 const fl=u=>{const X=W*(.42+.42*u)+Math.sin(u*Math.PI*4)*W*.05,Y=H*.62-Math.sin(u*Math.PI)*H*.16+Math.cos(u*Math.PI*6)*H*.06;return[X,Y]};
 function draw(){x.fillStyle=t.bg;x.fillRect(0,0,W,H);const g=x.createRadialGradient(W*.6,H*.4,0,W*.6,H*.4,Math.max(W,H)*.8);g.addColorStop(0,'rgba(40,74,58,.65)');g.addColorStop(1,'rgba(0,0,0,.35)');x.fillStyle=g;x.fillRect(0,0,W,H);x.drawImage(G,0,0);
  frame(22*d,.65);const cyc=T%12,p=still?1:Math.min(1,cyc/5),al=still?1:cyc>9?Math.max(0,1-(cyc-9)/2):1;x.lineCap='round';const N=220;for(let i=1;i<=N*p;i++){const u0=(i-1)/N,u1=i/N,[x0,y0]=fl(u0),[x1,y1]=fl(u1),ang=Math.atan2(y1-y0,x1-x0);x.strokeStyle=`rgba(201,164,76,${al})`;x.lineWidth=(1+5*Math.abs(Math.sin(ang-.6)))*d;x.beginPath();x.moveTo(x0,y0);x.lineTo(x1,y1);x.stroke()}}
 size();if(still){draw();return()=>{}}let last=performance.now();const loop=n=>{raf=requestAnimationFrame(loop);T+=Math.min(.05,(n-last)/1000);last=n;draw()};raf=requestAnimationFrame(loop);const ro=new ResizeObserver(size);ro.observe(c);return()=>{cancelAnimationFrame(raf);ro.disconnect()}}
};

const S='http://www.w3.org/2000/svg',sv=(w,h,body)=>`<svg xmlns="${S}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
const PAT={
 ledger:t=>sv(64,64,`<rect width="64" height="64" fill="${t.bg}"/><path d="M0 .5h64M.5 0v64" stroke="${t.line}"/><path d="M4 48l14-10 12 6 14-18 16 6" fill="none" stroke="${t.accent}" stroke-width="1.5"/>`),
 clinic:t=>sv(56,56,`<rect width="56" height="56" fill="${t.bg}"/><path d="M24 14h8v10h10v8H32v10h-8V32H14v-8h10z" fill="${t.line}"/><circle cx="48" cy="48" r="3" fill="${t.accent2}" fill-opacity=".6"/>`),
 arcade:t=>sv(48,48,`<rect width="48" height="48" fill="${t.bg}"/><g fill="${t.accent}">${['00111100','01111110','11011011','11111111','01100110','11000011'].map((r,j)=>[...r].map((v,i)=>v==='1'?`<rect x="${12+i*3}" y="${14+j*3}" width="3" height="3"/>`:'').join('')).join('')}</g><rect x="2" y="2" width="3" height="3" fill="${t.accent2}"/>`),
 vinyl:t=>sv(64,64,`<rect width="64" height="64" fill="${t.bg}"/><g fill="none" stroke="${t.line}">${[26,22,18,14].map(r=>`<circle cx="32" cy="32" r="${r}"/>`).join('')}</g><circle cx="32" cy="32" r="8" fill="${t.accent}"/><circle cx="32" cy="32" r="1.5" fill="${t.bg}"/>`),
 gazette:t=>sv(80,60,`<rect width="80" height="60" fill="${t.bg}"/><g fill="${t.line}">${[8,14,20,26,32,38,44,50].map(y=>`<rect x="4" y="${y}" width="${y%12?32:26}" height="2"/><rect x="44" y="${y}" width="${y%18?32:20}" height="2"/>`).join('')}</g><rect x="40" y="6" width="1" height="48" fill="${t.mute}" fill-opacity=".4"/>`),
 civic:t=>sv(80,80,`<rect width="80" height="80" fill="${t.bg}"/><g fill="none" stroke="${t.accent}" stroke-opacity=".25"><path d="M0 30c20-10 40 10 80-4M0 50c25-12 45 12 80-2M0 70c30-8 50 8 80 0"/></g><circle cx="58" cy="18" r="4" fill="${t.accent}"/>`),
 bistro:t=>sv(40,40,`<rect width="40" height="40" fill="${t.bg}"/><rect width="20" height="40" fill="${t.accent}" fill-opacity=".25"/><rect width="40" height="20" fill="${t.accent}" fill-opacity=".25"/>`),
 voyage:t=>sv(80,40,`<rect width="80" height="40" fill="${t.bg}"/><path d="M0 26q10-6 20 0t20 0 20 0 20 0" fill="none" stroke="${t.accent2}" stroke-width="2"/><path d="M0 34q10-6 20 0t20 0 20 0 20 0" fill="none" stroke="${t.accent2}" stroke-opacity=".5" stroke-width="2"/><circle cx="62" cy="10" r="5" fill="${t.accent}"/>`),
 atelier:t=>sv(60,60,`<rect width="60" height="60" fill="${t.bg}"/><path d="M0 40C20 30 40 50 60 40" fill="none" stroke="${t.accent2}"/><path d="M0 46C20 36 40 56 60 46" fill="none" stroke="${t.ink}" stroke-opacity=".25"/>`),
 tide:t=>sv(60,60,`<rect width="60" height="60" fill="${t.bg}"/><g fill="none" stroke="${t.accent}" stroke-opacity=".35"><circle cx="18" cy="40" r="5"/><circle cx="40" cy="20" r="3"/><circle cx="46" cy="46" r="2"/></g><path d="M0 10q15-6 30 0t30 0" fill="none" stroke="${t.accent}" stroke-opacity=".2"/>`),
 lab:t=>sv(60,60,`<rect width="60" height="60" fill="${t.bg}"/><path d="M0 .5h60M.5 0v60M0 30.5h60M30.5 0v60" stroke="${t.line}"/><path d="M14 14l12 8M26 22l-2 14" stroke="${t.mute}" stroke-width="2"/><circle cx="14" cy="14" r="4" fill="${t.accent}"/><circle cx="26" cy="22" r="5" fill="${t.ink}"/><circle cx="24" cy="36" r="4" fill="${t.accent2}"/>`),
 observatory:t=>sv(80,80,`<rect width="80" height="80" fill="${t.bg}"/><path d="M12 20l18-6 14 8 20-6" fill="none" stroke="${t.accent2}" stroke-opacity=".5"/>${[[12,20],[30,14],[44,22],[64,16]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="1.6" fill="${t.accent}"/>`).join('')}${[[20,60],[52,48],[70,70],[6,44]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r=".9" fill="${t.ink}"/>`).join('')}`),
 groove:t=>sv(80,40,`<rect width="80" height="40" fill="${t.bg}"/>${[t.accent,t.accent2,t.accent3].map((c,i)=>`<path d="M0 ${12+i*8}q20-10 40 0t40 0" fill="none" stroke="${c}" stroke-width="7"/>`).join('')}`),
 atomic:t=>sv(64,64,`<rect width="64" height="64" fill="${t.bg}"/><g stroke="${t.accent2}" stroke-width="1.5" stroke-linecap="round"><path d="M16 6v20M6 16h20M9 9l14 14M23 9 9 23"/></g><path d="M36 48q12-14 24 0-12-6-24 0z" fill="${t.accent}"/>`),
 teletext:t=>sv(48,48,`<rect width="48" height="48" fill="#000"/><g>${[['#FF0000',0,0],['#00FF00',8,6],['#FFFF00',16,0],['#0000FF',24,6],['#FF00FF',32,0],['#00FFFF',40,6]].map(([c,a,b])=>`<rect x="${a}" y="${b}" width="8" height="6" fill="${c}"/>`).join('')}</g><rect x="8" y="30" width="8" height="12" fill="#FFFF00"/><rect x="24" y="36" width="16" height="6" fill="#00FFFF"/>`),
 loom:t=>sv(48,48,`<rect width="48" height="48" fill="${t.bg}"/><rect x="0" width="12" height="48" fill="${t.accent}"/><rect x="0" y="12" width="12" height="12" fill="${t.accent3}"/><rect x="24" width="12" height="48" fill="${t.accent2}"/><path d="M24 24l6-6 6 6-6 6z" fill="${t.accent}"/>`),
 azulejo:t=>sv(64,64,`<rect width="64" height="64" fill="#FFFFFF"/><g fill="none" stroke="${t.accent}" stroke-width="2"><path d="M32 6l26 26-26 26L6 32z"/><path d="M0 16A16 16 0 0 0 16 0M48 0a16 16 0 0 0 16 16M64 48a16 16 0 0 0-16 16M16 64A16 16 0 0 0 0 48"/></g><circle cx="32" cy="32" r="8" fill="${t.accent}"/><circle cx="32" cy="32" r="3" fill="${t.accent2}"/>`),
 papel:t=>sv(48,60,`<rect width="48" height="60" fill="${t.bg}"/><path d="M4 4h40v40l-5 8-5-8-5 8-5-8-5 8-5-8-5 8-5-8z" fill="${t.accent}" fill-opacity=".85"/><circle cx="24" cy="22" r="7" fill="${t.bg}"/><path d="M12 12l3 3-3 3-3-3zM36 12l3 3-3 3-3-3z" fill="${t.bg}"/>`),
 shibori:t=>sv(64,64,`<rect width="64" height="64" fill="${t.bg}"/><g fill="none" stroke="${t.accent}" stroke-opacity=".35">${[22,16,10,4].map((r,i)=>`<circle cx="32" cy="32" r="${r}" stroke-width="${i%2?1:3}"/>`).join('')}</g><path d="M0 .5h64M.5 0v64" stroke="${t.accent2}" stroke-opacity=".3"/>`),
 marmo:t=>sv(80,80,`<rect width="80" height="80" fill="${t.bg}"/><path d="M-4 20C20 24 30 50 84 44M10 84C24 60 50 66 60 -4" fill="none" stroke="${t.mute}" stroke-opacity=".25"/><path d="M-4 60C30 52 50 74 84 64" fill="none" stroke="${t.accent2}" stroke-opacity=".7"/>`),
 comic:t=>sv(24,24,`<rect width="24" height="24" fill="${t.bg}"/><circle cx="6" cy="6" r="3" fill="${t.accent2}"/><circle cx="18" cy="18" r="3" fill="${t.accent2}"/><circle cx="18" cy="6" r="1.5" fill="${t.accent3}" fill-opacity=".6"/>`),
 bloom:t=>sv(80,80,`<defs><radialGradient id="a"><stop offset="0" stop-color="${t.accent2}"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/></radialGradient><radialGradient id="b"><stop offset="0" stop-color="${t.accent3}"/><stop offset="1" stop-color="${t.accent3}" stop-opacity="0"/></radialGradient></defs><rect width="80" height="80" fill="${t.bg}"/><circle cx="24" cy="24" r="24" fill="url(#a)"/><circle cx="60" cy="56" r="22" fill="url(#b)"/>`),
 rain:t=>sv(40,40,`<rect width="40" height="40" fill="${t.bg}"/><path d="M8 0l-2 12M28 10l-2 12M18 24l-2 12" stroke="${t.mute}" stroke-opacity=".5"/><circle cx="34" cy="32" r="2" fill="${t.accent}" fill-opacity=".8"/>`),
 chambers:t=>sv(60,60,`<rect width="60" height="60" fill="${t.bg}"/><rect x="6" y="6" width="48" height="48" fill="none" stroke="${t.accent}" stroke-opacity=".4"/><path d="M30 18l4 12-4 12-4-12z" fill="${t.accent}" fill-opacity=".6"/>`)
};
const MARK={
 ledger:t=>`<rect x="4" y="4" width="56" height="56" rx="12" fill="${t.accent}"/><path d="M16 42l10-10 8 6 14-16" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="48" cy="22" r="4" fill="#FFFFFF"/>`,
 clinic:t=>`<circle cx="32" cy="32" r="28" fill="${t.accent}"/><path d="M27 18h10v9h9v10h-9v9H27v-9h-9V27h9z" fill="#FFFFFF"/><circle cx="50" cy="14" r="6" fill="${t.accent2}"/>`,
 arcade:t=>`<g fill="${t.accent}">${['00111100','01111110','11011011','11111111','01100110','11000011'].map((r,j)=>[...r].map((v,i)=>v==='1'?`<rect x="${8+i*6}" y="${10+j*6}" width="6" height="6"/>`:'').join('')).join('')}</g><rect x="14" y="52" width="36" height="6" fill="${t.accent2}"/>`,
 vinyl:t=>`<circle cx="32" cy="32" r="28" fill="#0B0908" stroke="${t.line}" stroke-width="2"/><circle cx="32" cy="32" r="21" fill="none" stroke="${t.mute}" stroke-opacity=".35"/><circle cx="32" cy="32" r="11" fill="${t.accent}"/><circle cx="32" cy="32" r="2.5" fill="#0B0908"/><path d="M56 6 46 30" stroke="${t.ink}" stroke-width="3" stroke-linecap="round"/>`,
 gazette:t=>`<rect x="6" y="6" width="52" height="52" fill="${t.surface}" stroke="${t.ink}" stroke-width="3"/><rect x="12" y="13" width="40" height="8" fill="${t.ink}"/><rect x="12" y="25" width="40" height="2" fill="${t.accent}"/><g fill="${t.ink}" fill-opacity=".55"><rect x="12" y="31" width="18" height="2"/><rect x="12" y="36" width="18" height="2"/><rect x="12" y="41" width="18" height="2"/><rect x="12" y="46" width="14" height="2"/></g><rect x="34" y="31" width="18" height="17" fill="${t.ink}" fill-opacity=".3"/>`,
 civic:t=>`<path d="M32 4 58 16H6z" fill="${t.accent}"/><rect x="8" y="18" width="48" height="4" fill="${t.accent}"/><g fill="${t.accent}"><rect x="12" y="26" width="6" height="22"/><rect x="24" y="26" width="6" height="22"/><rect x="36" y="26" width="6" height="22"/><rect x="48" y="26" width="6" height="22"/></g><rect x="6" y="52" width="52" height="6" fill="${t.ink}"/>`,
 bistro:t=>`<circle cx="32" cy="32" r="28" fill="${t.accent}"/><path d="M16 30h32c0 12-7 18-16 18s-16-6-16-18z" fill="#FFFFFF"/><path d="M26 24c-3-4 3-6 0-10M34 24c-3-4 3-6 0-10M42 24c-3-4 3-6 0-10" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>`,
 voyage:t=>`<circle cx="32" cy="32" r="28" fill="${t.accent3}"/><path d="M4 40h56v6a28 28 0 0 1-56 0z" fill="${t.accent2}"/><path d="M32 12v26H18z" fill="#FFFFFF"/><path d="M35 18v20h12z" fill="${t.accent}"/><path d="M16 40h32l-4 5H20z" fill="${t.ink}"/>`,
 atelier:t=>`<circle cx="32" cy="32" r="27" fill="none" stroke="${t.ink}" stroke-width="1.5"/><path d="M22 46 32 14l10 32M26 34h12" fill="none" stroke="${t.ink}" stroke-width="2"/><path d="M8 40c16-10 32 10 48-2" fill="none" stroke="${t.accent2}" stroke-width="2"/>`,
 tide:t=>`<circle cx="32" cy="32" r="28" fill="${t.surface}" stroke="${t.accent}" stroke-width="2"/><path d="M8 36q6-6 12 0t12 0 12 0 12 0" fill="none" stroke="${t.accent}" stroke-width="3" stroke-linecap="round"/><path d="M10 46q6-6 12 0t12 0 12 0 12 0" fill="none" stroke="${t.accent}" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/><circle cx="36" cy="18" r="4" fill="none" stroke="${t.accent2}" stroke-width="2"/><circle cx="26" cy="24" r="2" fill="${t.accent2}"/>`,
 lab:t=>`<path d="M24 6h16M28 6v16L12 52a4 4 0 0 0 4 6h32a4 4 0 0 0 4-6L36 22V6" fill="${t.surface}" stroke="${t.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M17 44h30l5 9a3 3 0 0 1-3 4H15a3 3 0 0 1-3-4z" fill="${t.accent}"/><circle cx="28" cy="36" r="3" fill="${t.accent2}"/><circle cx="36" cy="30" r="2" fill="${t.accent3}"/>`,
 observatory:t=>`<circle cx="32" cy="32" r="28" fill="${t.surface}" stroke="${t.line}" stroke-width="2"/><path d="M14 40l12-14 10 6 14-12" fill="none" stroke="${t.accent2}" stroke-width="1.5"/>${[[14,40],[26,26],[36,32],[50,20]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="2.5" fill="${t.accent}"/>`).join('')}<path d="M44 46l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" fill="${t.ink}"/>`,
 groove:t=>`<path d="M6 54a26 26 0 0 1 52 0" fill="none" stroke="${t.accent}" stroke-width="7"/><path d="M14 54a18 18 0 0 1 36 0" fill="none" stroke="${t.accent2}" stroke-width="7"/><path d="M22 54a10 10 0 0 1 20 0" fill="none" stroke="${t.accent3}" stroke-width="7"/><circle cx="50" cy="12" r="6" fill="${t.accent2}"/>`,
 atomic:t=>`<g fill="none" stroke="${t.accent}" stroke-width="2.5"><ellipse cx="32" cy="32" rx="28" ry="10"/><ellipse cx="32" cy="32" rx="28" ry="10" transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="28" ry="10" transform="rotate(120 32 32)"/></g><circle cx="32" cy="32" r="6" fill="${t.accent2}"/><circle cx="58" cy="30" r="3.5" fill="${t.accent3}" stroke="${t.ink}"/>`,
 teletext:t=>`<rect width="64" height="64" fill="#000"/><rect x="4" y="8" width="8" height="48" fill="#FF0000"/><rect x="12" y="8" width="8" height="48" fill="#00FF00"/><rect x="20" y="8" width="8" height="48" fill="#FFFF00"/><rect x="28" y="8" width="8" height="48" fill="#0000FF"/><rect x="36" y="8" width="8" height="48" fill="#FF00FF"/><rect x="44" y="8" width="8" height="48" fill="#00FFFF"/><rect x="52" y="8" width="8" height="48" fill="#FFFFFF"/>`,
 loom:t=>`<rect x="4" y="4" width="56" height="56" fill="${t.surface}"/><rect x="4" y="4" width="14" height="56" fill="${t.accent}"/><rect x="25" y="4" width="14" height="56" fill="${t.accent2}"/><rect x="46" y="4" width="14" height="56" fill="${t.accent3}"/><g fill="${t.bg}"><rect x="4" y="18" width="14" height="6"/><rect x="4" y="40" width="14" height="6"/><path d="M32 22l7 10-7 10-7-10z"/><rect x="46" y="28" width="14" height="8"/></g>`,
 azulejo:t=>`<rect x="4" y="4" width="56" height="56" fill="#FFFFFF" stroke="${t.accent}" stroke-width="2.5"/><g fill="none" stroke="${t.accent}" stroke-width="2.5"><path d="M32 10l22 22-22 22-22-22z"/><circle cx="32" cy="32" r="9"/></g><circle cx="32" cy="32" r="4" fill="${t.accent2}"/>`,
 papel:t=>`<path d="M6 4h52v40l-6.5 10-6.5-10-6.5 10-6.5-10-6.5 10-6.5-10-6.5 10L6 44z" fill="${t.accent}" fill-rule="evenodd"/><circle cx="32" cy="22" r="8" fill="${t.bg}"/><circle cx="32" cy="22" r="3.5" fill="${t.accent}"/><path d="M15 12l3 3-3 3-3-3zM49 12l3 3-3 3-3-3zM15 32l3 3-3 3-3-3zM49 32l3 3-3 3-3-3z" fill="${t.bg}"/>`,
 shibori:t=>`<circle cx="32" cy="32" r="29" fill="${t.surface}"/><g fill="none" stroke="${t.accent}">${[24,18,12,6].map((r,i)=>`<circle cx="32" cy="32" r="${r}" stroke-width="${i%2?1.5:4}" stroke-opacity="${.9-i*.12}"/>`).join('')}</g>`,
 marmo:t=>`<rect x="6" y="6" width="52" height="52" fill="#FFFFFF" stroke="${t.ink}" stroke-width="1.5"/><path d="M6 24c14 4 18 22 52 14M20 58c4-14 16-18 24-52" fill="none" stroke="${t.mute}" stroke-opacity=".45"/><path d="M6 44c18-6 30 8 52 2" fill="none" stroke="${t.accent2}" stroke-width="1.5"/>`,
 comic:t=>`<path d="M32 2l7 15 16-6-6 16 15 7-15 7 6 16-16-6-7 15-7-15-16 6 6-16-15-7 15-7-6-16 16 6z" fill="${t.accent2}" stroke="${t.ink}" stroke-width="3" stroke-linejoin="round"/><circle cx="32" cy="32" r="11" fill="${t.accent}" stroke="${t.ink}" stroke-width="3"/>`,
 bloom:t=>`<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.accent2}"/><stop offset=".5" stop-color="${t.accent3}"/><stop offset="1" stop-color="${t.accent}"/></linearGradient></defs>${[0,72,144,216,288].map(r=>`<ellipse cx="32" cy="18" rx="9" ry="15" fill="url(#g)" fill-opacity=".85" transform="rotate(${r} 32 32)"/>`).join('')}<circle cx="32" cy="32" r="6" fill="${t.accent}"/>`,
 rain:t=>`<rect x="4" y="4" width="56" height="56" rx="6" fill="${t.surface}"/><circle cx="22" cy="24" r="9" fill="${t.accent}" fill-opacity=".55"/><circle cx="42" cy="34" r="7" fill="${t.accent2}" fill-opacity=".55"/><path d="M16 46l-3 8M30 42l-3 10M44 48l-2 6" stroke="${t.ink}" stroke-width="2" stroke-linecap="round"/>`,
 chambers:t=>`<rect x="6" y="4" width="52" height="56" fill="${t.surface}" stroke="${t.accent}" stroke-width="1.5"/><rect x="11" y="9" width="42" height="46" fill="none" stroke="${t.accent}"/><path d="M20 22h24M32 22v24M24 46h16" stroke="${t.accent}" stroke-width="2"/><path d="M20 22l-4 12h8zM44 22l-4 12h8z" fill="none" stroke="${t.accent}" stroke-width="1.5"/>`
};
const D=(t,center,line=t.accent)=>`<path d="M0 12h180M220 12h180" stroke="${line}" stroke-width="1.5"/>${center}`;
const DIV={
 ledger:t=>`<path d="M0 18l40-6 40 4 40-10 40 6 40-8 40 10 40-4 40-8 40 6" fill="none" stroke="${t.accent}" stroke-width="2"/>`,
 clinic:t=>`<path d="M0 12h150l8-8 8 16 8-20 8 18 6-6h212" fill="none" stroke="${t.accent}" stroke-width="2" stroke-linejoin="round"/>`,
 arcade:t=>`<g fill="${t.accent}">${Array.from({length:50},(_,i)=>`<rect x="${i*8}" y="${i%2?8:12}" width="4" height="4"/>`).join('')}</g>`,
 vinyl:t=>D(t,`<circle cx="200" cy="12" r="10" fill="none" stroke="${t.accent}"/><circle cx="200" cy="12" r="4" fill="${t.accent}"/>`),
 gazette:t=>`<rect y="6" width="400" height="3" fill="${t.ink}"/><rect y="13" width="400" height="1" fill="${t.ink}"/><rect y="17" width="400" height="1" fill="${t.ink}"/>`,
 civic:t=>`<rect y="10" width="400" height="4" fill="${t.accent}"/><rect y="10" width="80" height="4" fill="${t.accent2}"/>`,
 bistro:t=>`<g fill="${t.accent}" fill-opacity=".45">${Array.from({length:25},(_,i)=>`<rect x="${i*16}" y="${i%2?4:12}" width="8" height="8"/>`).join('')}</g>`,
 voyage:t=>`<path d="M0 14q12-8 25 0t25 0 25 0 25 0 25 0 25 0 25 0 25 0 25 0 25 0 25 0 25 0 25 0 25 0 25 0 25 0" fill="none" stroke="${t.accent2}" stroke-width="2.5"/>`,
 atelier:t=>`<path d="M0 12h400" stroke="${t.ink}" stroke-width=".75"/><path d="M0 12c60-10 120 10 200 0s140-10 200 0" fill="none" stroke="${t.accent2}"/>`,
 tide:t=>`<path d="M0 12q25-10 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0" fill="none" stroke="${t.accent}" stroke-width="2"/>`,
 lab:t=>`<path d="M0 12h400" stroke="${t.line}" stroke-width="2"/>${Array.from({length:21},(_,i)=>`<path d="M${i*20} 6v12" stroke="${t.mute}"/>`).join('')}<circle cx="200" cy="12" r="5" fill="${t.accent}"/>`,
 observatory:t=>D(t,`<path d="M200 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="${t.accent}"/>`,t.line),
 groove:t=>`${[t.accent,t.accent2,t.accent3].map((c,i)=>`<rect y="${4+i*6}" width="400" height="5" rx="2.5" fill="${c}"/>`).join('')}`,
 atomic:t=>D(t,`<g stroke="${t.accent2}" stroke-width="2" stroke-linecap="round"><path d="M200 0v24M188 12h24M192 4l16 16M208 4l-16 16"/></g>`),
 teletext:t=>`${['#FF0000','#00FF00','#FFFF00','#0000FF','#FF00FF','#00FFFF','#FFFFFF'].map((c,i)=>`<rect x="${i*57}" y="6" width="57" height="12" fill="${c}"/>`).join('')}`,
 loom:t=>`${Array.from({length:20},(_,i)=>`<rect x="${i*20}" y="4" width="20" height="16" fill="${[t.accent,t.accent2,t.accent3][i%3]}"/>`).join('')}`,
 azulejo:t=>D(t,`<path d="M200 2l10 10-10 10-10-10z" fill="none" stroke="${t.accent}" stroke-width="2"/><circle cx="200" cy="12" r="3" fill="${t.accent2}"/>`),
 papel:t=>`<path d="M0 4h400" stroke="${t.ink}"/>${Array.from({length:16},(_,i)=>`<path d="M${i*25+2} 4h21v12l-5.25 6-5.25-6-5.25 6L2 16z" fill="${[t.accent,t.accent2,t.accent3][i%3]}"/>`).join('')}`,
 shibori:t=>`<path d="M0 12h400" stroke="${t.accent}" stroke-width="4" stroke-dasharray="40 6 4 6" stroke-opacity=".7"/>`,
 marmo:t=>D(t,`<path d="M190 12h20" stroke="${t.accent2}" stroke-width="5"/>`,t.accent2),
 comic:t=>`<path d="M0 6h400v12H0z" fill="${t.accent2}" stroke="${t.ink}" stroke-width="3"/><path d="M190 0l10 24 10-24" fill="${t.accent}" stroke="${t.ink}" stroke-width="2"/>`,
 bloom:t=>`<defs><linearGradient id="dg"><stop offset="0" stop-color="${t.accent2}"/><stop offset=".5" stop-color="${t.accent3}"/><stop offset="1" stop-color="${t.accent}"/></linearGradient></defs><rect y="9" width="400" height="6" rx="3" fill="url(#dg)"/>`,
 rain:t=>`<path d="M0 12h400" stroke="${t.line}" stroke-width="2"/><path d="M0 12h120" stroke="${t.accent}" stroke-width="2"/><circle cx="120" cy="12" r="4" fill="${t.accent}"/>`,
 chambers:t=>`<path d="M0 8h400M0 16h400" stroke="${t.accent}"/><path d="M200 4l8 8-8 8-8-8z" fill="${t.bg}" stroke="${t.accent}"/>`
};
TK.list.push(...K);Object.assign(TK.BG,BG);Object.assign(TK.PAT,PAT);Object.assign(TK.MARK,MARK);Object.assign(TK.DIV,DIV);
})();
