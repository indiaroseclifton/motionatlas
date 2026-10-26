'use strict';
/* Page builder, multi-page site templates. Each entry returns a whole site (pages, shared header and footer, menu, settings)
   built from library sections with real copy. A block is [sectionId, fieldValues, {anchorIndex: link}].
   Links are 'page:<page id>' so buttons open the other pages of the template. */
(()=>{
const PB=window.PB=window.PB||{};
const H=(k,h,i)=>['page-head',{kicker:k,heading:h,intro:i}];
const CTA=(h,b,to)=>['cta-band',{heading:h,button:b},{0:to}];
const NEWS=(h,i,b)=>['newsletter',{kicker:'Newsletter',heading:h,intro:i,button:b||'Subscribe',small:'One email a month. Unsubscribe whenever you like.'}];
const FOOT=(line,c1,l1,c2,l2,c3,l3,legal)=>['footer-columns',{line,c1,links1:l1,c2,links2:l2,c3,links3:l3,legal}];
const ENDS=new Set(['cta-band','newsletter','contact-form','donate','app-download','sec-cta','footer-columns']);
const finish=(o,p)=>{const last=p.blocks[p.blocks.length-1];if(p.id===o.cta[1]||ENDS.has(last[0]))return p.blocks;return [...p.blocks,CTA(o.ctaLine||'Let’s get started.',o.cta[0],'page:'+o.cta[1])]};
const site=(o)=>()=>({name:o.name,brand:o.brand,style:o.style,desc:o.desc,pages:o.pages.map(p=>({id:p.id,name:p.name,title:p.title||'',desc:p.desc||'',blocks:finish(o,p).map(b=>({id:b[0],vals:b[1]||{},...(b[2]?{links:b[2]}:{})}))})),
 header:o.header===null?[]:[{id:'nav',vals:{cta:o.cta[0],ctaHref:'page:'+o.cta[1]}}],
 footer:[{id:'footer-columns',vals:o.footer[1]}],navAuto:true,settings:{description:o.siteDesc,lang:'en'},fresh:true,home:o.pages[0].id,tplId:o.id,pageCount:o.pages.length});

const T=[];
const add=o=>{T.push({id:o.id,name:o.name,desc:o.desc,style:o.style,pages:o.pages.length,cat:o.cat||'',make:site(o)})};

/* 1 portfolio */
add({id:'portfolio',ctaLine:'Have a project in mind?',name:'Portfolio',desc:'A designer’s work, a case study, about and contact.',brand:'Ines Duarte',style:'studio',cta:['Say hello','contact'],siteDesc:'Ines Duarte is an independent brand and interface designer in Lisbon.',footer:[0,{line:'Brand and interface design, Lisbon.',c1:'Pages',links1:'Home\nWork\nAbout\nContact',c2:'Elsewhere',links2:'Instagram\nDribbble\nLinkedIn',c3:'Say hello',links3:'ines@example.com\nBook a call',legal:'© 2027 Ines Duarte'}],
 pages:[
 {id:'home',name:'Home',title:'Ines Duarte · Brand and interface designer',desc:'Independent designer making calm brands and clear interfaces for small companies.',blocks:[
  ['hero-image',{kicker:'Independent designer, Lisbon',heading:'Calm brands for busy small companies.',intro:'I help founders say what they do in one look: identity, interface and the first thousand words.',b1:'See the work',b2:'Say hello',img:'shelf/origami.webp',alt:'A folded paper crane lit from the side'},{0:'page:work',1:'page:contact'}],
  ['sec-logos',{kicker:'Recently with',heading:'Bakeries, studios and software teams.'}],
  ['case-study',{client:'Case study · Larder & Co',heading:'A new look that sold out the first batch.',img:'films/paper-bird.jpg',alt:'A paper bird mid-flight',results:'+64% | online orders in the first quarter\n3 | new stockists in London\n12 days | from brief to launch',challenge:'Larder had great bread and a shopfront nobody could find online. The brand looked like three different shops.',approach:'One wordmark, one warm palette and a website that sells a loaf in three taps.'}],
  ['quote',{quote:'Ines turned a pile of opinions into one clear idea, and then made it beautiful.',name:'Hannah Cole',role:'Founder, Larder & Co',initials:'HC'}],
  CTA('Have a project in mind?','Start a conversation','page:contact')]},
 {id:'work',name:'Work',title:'Work · Ines Duarte',desc:'Selected brand and interface projects.',blocks:[
  H('Selected work','Six projects I’m proud of.','Brand identities, websites and product interfaces, 2022 to now.'),
  ['gallery',{kicker:'Gallery',heading:'A few frames.',images:'shelf/amber.webp | Amber glaze, packaging study\nshelf/owl.webp | Owl, poster series\nshelf/sumi.webp | Ink wordmark exploration\nshelf/threads.webp | Textile pattern for a studio\nshelf/embroidery.webp | Embroidered identity\nshelf/dove.webp | Dove mark, final'}],
  ['feature-rows',{kicker:'How I work',heading:'Slow where it matters.',rows:'Listen first | A week of interviews and quiet looking before any pencil moves. | shelf/sand.webp\nDraw by hand | Every identity starts on paper, then moves to screen once it holds. | shelf/sumi.webp\nShip small | A tested first version in weeks, then improved in the open. | shelf/threads.webp'}],
  CTA('Like what you see?','Get in touch','page:contact')]},
 {id:'about',name:'About',title:'About · Ines Duarte',desc:'Ten years of brand and interface design.',blocks:[
  H('About','Ten years of making things clearer.','Trained in print, now mostly screens, still sketching on paper.'),
  ['rich-text',{kicker:'Hello',heading:'I like small companies with big ideas.',paras:'I started in a print shop in Porto, setting type by hand, and learned that every mark is a decision.\nSince then I have worked in-house at two software companies and run my own studio for five years.\nI take on four projects a year so each one gets my full attention.'}],
  ['timeline',{kicker:'Path',heading:'Where I’ve been.',events:'2014 | Print shop, Porto | Learned to set type, mix ink and care about the last millimetre.\n2017 | Product designer | Joined a Lisbon software team and shipped three apps.\n2022 | Own studio | Left to focus on brands and interfaces for small companies.'}],
  ['stats',{label:'In numbers',stats:'10 | years designing\n42 | projects shipped\n4 | projects a year\n1 | designer, answering every email'}]]},
 {id:'contact',name:'Contact',title:'Contact · Ines Duarte',desc:'Start a project or just say hello.',blocks:[
  H('Contact','Tell me about the project.','A few lines is plenty. I reply within two working days.'),
  ['contact-form',{kicker:'Write',heading:'Say hello.',intro:'Tell me what you’re making, who it is for and when you need it.',button:'Send message',thanks:'I’ll reply within two working days.'}],
  ['contact-cards',{kicker:'Or',heading:'Reach me directly.',ways:'mail | Email | The quickest way to reach me. | ines@example.com\nphone | Call | Tuesdays and Thursdays, 10 to 4. | +351 21 000 0000\npin | Studio | By appointment, in Alfama. | Rua das Flores 12, Lisbon'}]]}]});

/* 2 agency */
add({id:'agency',ctaLine:'Got something worth building?',name:'Agency',desc:'Services, case studies, the team and a contact page.',brand:'Northfield',style:'kit:swiss',cta:['Start a project','contact'],siteDesc:'Northfield is a digital product agency for ambitious companies.',footer:[0,{line:'Digital product agency.',c1:'Agency',links1:'Home\nServices\nWork\nTeam\nContact',c2:'Follow',links2:'LinkedIn\nInstagram',c3:'Contact',links3:'hello@northfield.example',legal:'© 2027 Northfield Ltd'}],
 pages:[
 {id:'home',name:'Home',title:'Northfield · Digital product agency',desc:'We design and build websites and apps for ambitious companies.',blocks:[
  ['hero-3d',{kicker:'Digital product agency · Leeds',heading:'We build products people keep.',intro:'Strategy, design and engineering in one small team, from the first sketch to the thousandth release.',b1:'See our work',b2:'Our services',img1:'shelf/threads.webp',img2:'shelf/nebula.webp',img3:'shelf/ferro.webp'},{0:'page:work',1:'page:services'}],
  ['sec-logos',{kicker:'Clients',heading:'Product teams in 14 countries.'}],
  ['stats',{label:'Since 2016',stats:'140 | products shipped\n96% | clients who come back\n14 | countries\n38 | people'}],
  ['feature-grid',{kicker:'What we do',heading:'One team, the whole journey.',intro:'You talk to the people who build it.',items:'search | Research | Interviews, audits and prototypes that settle arguments early.\nspark | Design | Brand, interface and motion that feel like one thing.\ncode | Engineering | Fast, accessible web and mobile apps that last.\nchart | Growth | Measured launches and the improvements that follow.'}],
  CTA('Got something worth building?','Talk to us','page:contact')]},
 {id:'services',name:'Services',title:'Services · Northfield',desc:'Research, design, engineering and growth.',blocks:[
  H('Services','Four things, done properly.','We take on fewer projects so every one gets a senior team.'),
  ['feature-rows',{kicker:'Capabilities',heading:'From idea to release.',rows:'Product strategy | Workshops and research that turn a hunch into a roadmap you can defend. | shelf/nebula.webp\nDesign systems | Components, tokens and docs your whole team can use. | shelf/threads.webp\nWeb and app engineering | Typed, tested and fast, with accessibility built in. | shelf/ferro.webp'}],
  ['steps',{kicker:'Process',heading:'How a project runs.',steps:'Discover | Two weeks of research and a shared brief.\nShape | Prototypes tested with real users.\nBuild | Weekly releases you can click.\nGrow | Measure, learn and improve together.'}],
  ['pricing-tiers',{kicker:'Ways to work',heading:'Pick the shape that fits.',intro:'Every engagement starts with a free call.',plans:'Sprint | £18k | 4 weeks | A focused answer to one question. | Research; Prototype; Report | Book a sprint\nBuild | £60k | typical | A new product from brief to launch. | Strategy; Design; Engineering; Launch | Plan a build\nPartner | £14k | a month | A team on call for continuous work. | Design; Engineering; Support | Talk to us'}]]},
 {id:'work',name:'Work',title:'Work · Northfield',desc:'Selected case studies.',blocks:[
  H('Work','Selected projects.','A few of the products we’ve helped launch.'),
  ['case-study',{client:'Case study · Tidewater Bank',heading:'A banking app that people open on purpose.',img:'films/light-mesh.jpg',alt:'Light mesh pattern',results:'+38% | weekly active users\n4.8 | app store rating\n9 weeks | brief to launch',challenge:'A trusted bank with an app customers only opened to check a balance.',approach:'Rebuilt around goals, with plain words and one clear next step on every screen.'}],
  ['case-study',{client:'Case study · Halden Health',heading:'Booking a doctor in three taps.',img:'films/jellyfish.jpg',alt:'A jellyfish drifting',results:'−52% | missed appointments\n3 taps | to book\n20k | patients in month one',challenge:'Phone queues and a clunky portal.',approach:'A calm booking flow tested with patients of every age.'}],
  ['quote',{quote:'They behave like part of our team, not a supplier.',name:'Aisha Rahman',role:'CPO, Tidewater Bank',initials:'AR'}]]},
 {id:'team',name:'Team',title:'Team · Northfield',desc:'The people at Northfield.',blocks:[
  H('Team','Thirty-eight people, mostly in aprons of paper.','Designers, engineers and strategists who like finishing things.'),
  ['team',{kicker:'Leadership',heading:'Who you’ll talk to.',intro:'Partners lead every project themselves.',people:'Rosa Whitlock | Founder, strategy | Started Northfield at her kitchen table in 2016.\nDev Patel | Engineering | Writes less code than he deletes.\nMarta Lopes | Design | Keeps the details honest.\nJames Oyelaran | Delivery | Makes deadlines feel calm.'}],
  ['timeline',{kicker:'History',heading:'Ten years in four lines.',events:'2016 | Kitchen table | Two people and one very large whiteboard.\n2019 | First office | A room above a bakery in Leeds.\n2023 | Thirty people | Hired carefully, kept the same habits.\n2026 | Ten years | Still answering the phone ourselves.'}]]},
 {id:'contact',name:'Contact',title:'Contact · Northfield',desc:'Start a project with Northfield.',blocks:[
  H('Contact','Let’s talk.','Tell us about the product and we’ll reply within a working day.'),
  ['contact-form',{kicker:'Brief',heading:'Start a project.',intro:'A few lines about what you’re building and when.',button:'Send brief',thanks:'We’ll reply within a working day.'}],
  ['map-embed',{kicker:'Visit',heading:'Come for coffee.',address:'2 Mill Yard, Leeds LS1 4AB',hours:'Monday to Friday | 9am to 6pm\nSaturday | By appointment',button:'Get directions',maplink:'https://www.openstreetmap.org/search?query=Leeds%20LS1'}]]}]});

/* 3 SaaS */
add({id:'saas',ctaLine:'Hear it before it’s loud.',name:'SaaS product',desc:'Product, pricing, customers and docs links.',brand:'Signal',style:'signal',cta:['Start free','pricing'],siteDesc:'Signal turns customer calls into a roadmap.',footer:[0,{line:'Find the signal in every call.',c1:'Product',links1:'Home\nFeatures\nPricing\nCustomers',c2:'Company',links2:'About\nCareers\nPress',c3:'Help',links3:'Docs\nStatus\nPrivacy',legal:'© 2027 Signal Labs'}],
 pages:[
 {id:'home',name:'Home',title:'Signal · Find the signal in every call',desc:'Signal listens to customer calls and threads what people ask for into your roadmap.',blocks:[
  ['hero-film',{film:'light-threads',kicker:'Version 3 · themes that grow on their own',heading:'Find the signal in every call.',intro:'Signal transcribes your customer calls, pulls out what people asked for and threads it into your roadmap.',b1:'Start free',b2:'See features'},{0:'page:pricing',1:'page:features'}],
  ['sec-logos',{kicker:'Trusted by',heading:'Product teams in 31 countries.'}],
  ['feature-grid',{kicker:'Product',heading:'Every conversation, untangled.',intro:'Transcripts, themes and quotes in one place.',items:'chat | Every call, transcribed | Zoom, Meet and phone calls become searchable text in minutes.\nspark | Themes that grow | Requests branch into themes as calls come in.\nusers | Quotes with context | Every quote links to the second it was said.\nchart | Weekly digest | A Friday summary for the whole team.\nlock | Private by default | Recordings stay in your region.\nbolt | Roadmap sync | Push themes to Linear or Jira with evidence attached.'}],
  ['stats',{label:'Results',stats:'3.2x | faster customer research\n68% | fewer “what did they say?” meetings\n2,300 | teams\n31 | countries'}],
  CTA('Hear it before it’s loud.','Start free','page:pricing')]},
 {id:'features',name:'Features',title:'Features · Signal',desc:'What Signal does, in detail.',blocks:[
  H('Features','Everything between the call and the roadmap.','Built for product managers, researchers and founders.'),
  ['tabs',{kicker:'A closer look',heading:'Pick a job.',tabs:'Listen | Calls, transcribed | Connect Zoom or Meet and every call is searchable within minutes. | shelf/threads.webp\nGroup | Themes that grow | Requests are clustered and named as they arrive. | shelf/nebula.webp\nShare | A digest your team reads | One Friday email with what changed and why. | shelf/sand.webp'}],
  ['compare',{kicker:'Compare',heading:'Why teams switch from spreadsheets.',them:'Spreadsheet',rows:'Calls transcribed automatically | yes | no\nThemes grouped as they appear | yes | no\nQuotes linked to the moment | yes | no\nShared with the whole team | yes | yes'}],
  ['integrations',{kicker:'Integrations',heading:'Works where you work.',intro:'Connect in a few clicks.',tools:'Zoom | Import every recorded call\nGoogle Meet | Join and transcribe live\nLinear | Push themes with evidence\nSlack | Weekly digests in a channel'}]]},
 {id:'pricing',name:'Pricing',title:'Pricing · Signal',desc:'Simple pricing for teams of every size.',blocks:[
  H('Pricing','Start small. Listen more.','Every plan includes transcripts and quotes. Cancel any time.'),
  ['pricing-tiers',{kicker:'Plans',heading:'Pick a plan.',intro:'Annual billing saves two months.',plans:'Starter | £0 | free forever | For trying Signal on a few calls. | 10 calls a month; Transcripts; Quotes | Start free\nTeam | £29 | per seat, a month | For product teams. | Unlimited calls; Themes; Weekly digest; Linear sync | Choose Team\nEnterprise | Custom | talk to us | For large organisations. | SSO; Data residency; Priority support | Talk to us'}],
  ['sec-faq',{kicker:'Questions',heading:'Before you start listening.',intro:'Can’t find it? A real person answers within a working day.',button:'Talk to us',qa:'Do you record my calls? | Only the calls you connect. We transcribe them and you choose what stays.\nWhere is my data stored? | In your region. Recordings never train anyone else’s model.\nCan I cancel? | Any time, from settings. Transcripts stay downloadable for 90 days.'}]]},
 {id:'customers',name:'Customers',title:'Customers · Signal',desc:'How teams use Signal.',blocks:[
  H('Customers','Teams who listen better.','Three stories from product teams.'),
  ['case-study',{client:'Case study · Larder & Co',heading:'From gut feel to a shared list of what customers want.',img:'films/light-threads.jpg',alt:'Threads of light',results:'−68% | research meetings\n2x | features shipped from real requests\n1 week | to set up',challenge:'Research lived in one person’s notes.',approach:'Every call now lands in Signal and themes update overnight.'}],
  ['press',{label:'In the press',quotes:'The research tool I wish I’d had years ago. | Product Weekly\nA calm way to hear your customers. | The Maker’s Journal'}],
  ['quote',{quote:'We stopped arguing about what customers said and started deciding.',name:'Priya Nair',role:'Head of Product, Halden',initials:'PN'}]]}]});

/* 4 restaurant */
add({id:'restaurant',ctaLine:'Come hungry.',name:'Restaurant',desc:'Menu, story, bookings and a find-us page.',brand:'Saffron & Salt',style:'kit:bistro',cta:['Book a table','visit'],siteDesc:'A neighbourhood restaurant cooking over fire in East London.',footer:[0,{line:'Cooked over fire, shared at the table.',c1:'Restaurant',links1:'Home\nMenu\nStory\nVisit',c2:'Follow',links2:'Instagram\nTikTok',c3:'Book',links3:'020 7946 0321\nhello@saffronandsalt.example',legal:'© 2027 Saffron & Salt Ltd'}],
 pages:[
 {id:'home',name:'Home',title:'Saffron & Salt · Fire-cooked food in East London',desc:'A neighbourhood restaurant cooking over fire. Book a table.',blocks:[
  ['hero-film',{film:'smoke-plume',kicker:'Tuesday to Sunday',heading:'Cooked over fire, shared at the table.',intro:'Seasonal plates from a wood-burning kitchen in Hackney. Good wine, no fuss.',b1:'Book a table',b2:'See the menu'},{0:'page:visit',1:'page:menu'}],
  ['statement',{kicker:'Our idea',text:'We cook what the market has on the day, over embers, and put it in the middle of the table so everyone can reach it.'}],
  ['feature-rows',{kicker:'The kitchen',heading:'Simple, then smoky.',rows:'Fire first | Everything touches the embers: bread, fish, vegetables and the occasional pudding. | shelf/amber.webp\nMarket led | We buy from three farms and one fishmonger, and print the menu each morning. | shelf/bloom.webp\nPour well | A short list of small growers, natural where it’s good and classic where it’s better. | shelf/smoke.webp'}],
  ['press',{label:'Said about us',quotes:'The best bread basket in Hackney. | London Eats\nFire, salt and nothing to hide behind. | The Weekend Paper'}],
  CTA('Come hungry.','Book a table','page:visit')]},
 {id:'menu',name:'Menu',title:'Menu · Saffron & Salt',desc:'This week’s menu.',blocks:[
  H('Menu','Cooked on the day.','Printed every morning. Ask us about the specials.'),
  ['menu-list',{kicker:'Dinner',heading:'Plates to share.',h1:'To start',col1:'Burnt aubergine | Tahini, pomegranate, warm flatbread | £9\nWhipped ricotta | Honey, thyme, charred sourdough | £8\nSmoked mackerel | Pickled cucumber, horseradish | £10\nBeef tartare | Egg yolk, capers, crisp potato | £13',h2:'To follow',col2:'Slow lamb shoulder | Flageolet beans, salsa verde | £22\nRoast cauliflower | Almond, golden raisin, saffron | £17\nSea bream | Fennel, blood orange, olive oil | £24\nPicanha | Chimichurri, charred onion | £26',note:'Please tell us about allergies when you book. A discretionary 12.5% service charge is added.'}],
  ['menu-list',{kicker:'Sweet',heading:'To finish.',h1:'Puddings',col1:'Burnt Basque cheesecake | Poached rhubarb | £8\nChocolate and olive oil | Sea salt, crème fraîche | £8',h2:'Drinks',col2:'House red or white | By the glass | £7\nNatural orange | Glass | £9\nCold brew | With a biscuit | £4',note:'Vegan menu available. Corkage £15.'}]]},
 {id:'story',name:'Story',title:'Our story · Saffron & Salt',desc:'Who we are and how we cook.',blocks:[
  H('Our story','Two cooks, one fire.','We opened in 2022 in a former bakery.'),
  ['rich-text',{kicker:'Hello',heading:'Food is better when it is shared.',paras:'Saffron & Salt began as a supper club in our flat. When the neighbours kept asking for seconds we found a bakery with a big old oven and moved in.\nWe still cook for friends: no tasting menus, no tweezers, just good ingredients and a lot of fire.\nWe pay the people who cook and serve properly, and we compost, recycle and buy local wherever we can.'}],
  ['team',{kicker:'The team',heading:'Who is in the kitchen.',intro:'Eleven people, mostly in aprons.',people:'Maya Okafor | Head chef | Ran a supper club for six years.\nTom Becker | Sous chef | Keeps the embers honest.\nInês Duarte | Front of house | Remembers everyone’s name.\nSam Whitlock | Wine | Pours with opinions.'}]]},
 {id:'visit',name:'Visit',title:'Visit and book · Saffron & Salt',desc:'Find us and book a table.',blocks:[
  H('Visit','Find us, book a table.','We hold half the tables for walk-ins.'),
  ['map-embed',{kicker:'Where',heading:'Come and see us.',address:'14 Market Row, London E8 4RT',hours:'Tuesday to Friday | 5pm to 11pm\nSaturday | 12pm to 11pm\nSunday | 12pm to 8pm\nMonday | Closed',button:'Get directions',maplink:'https://www.openstreetmap.org/search?query=London%20E8'}],
  ['contact-form',{kicker:'Book',heading:'Request a table.',intro:'Tell us the date, time and how many of you. We confirm by email.',button:'Request booking',thanks:'We’ll confirm by email within a day.'}]]}]});

/* 5 photographer */
add({id:'photographer',ctaLine:'Let’s make something.',name:'Photographer',desc:'Full-screen gallery, series, about and bookings.',brand:'Elio Marsh',style:'kit:graphite',cta:['Book a shoot','contact'],siteDesc:'Elio Marsh is a documentary and portrait photographer.',footer:[0,{line:'Documentary and portrait photography.',c1:'Pages',links1:'Home\nPortfolio\nAbout\nContact',c2:'Follow',links2:'Instagram\nBehance',c3:'Bookings',links3:'elio@example.com',legal:'© 2027 Elio Marsh'}],
 pages:[
 {id:'home',name:'Home',title:'Elio Marsh · Documentary and portrait photographer',desc:'Photographs of people, places and quiet moments.',blocks:[
  ['hero-film',{film:'suminagashi',kicker:'Documentary and portrait',heading:'Pictures that wait for the moment.',intro:'Commissions, editorial and long-form projects across Europe.',b1:'View portfolio',b2:'Book a shoot'},{0:'page:portfolio',1:'page:contact'}],
  ['gallery',{kicker:'Recent',heading:'Latest frames.',images:'shelf/lighthouse.webp | Lighthouse at dusk\nshelf/statue.webp | Marble, morning\nshelf/tree.webp | The old oak\nshelf/lion.webp | Gate, Lisbon\nshelf/jellyfish.webp | Aquarium, night\nshelf/biolum.webp | Bioluminescence'}],
  ['press',{label:'Published in',quotes:'Quietly devastating. | The Weekend Paper\nA photographer with patience. | Frame Monthly'}],
  CTA('Let’s make something.','Book a shoot','page:contact')]},
 {id:'portfolio',name:'Portfolio',title:'Portfolio · Elio Marsh',desc:'Series and commissions.',blocks:[
  H('Portfolio','Series and commissions.','Long projects first, then single assignments.'),
  ['case-study',{client:'Series · The last ferry',heading:'Six months on the Douro.',img:'films/golden-dove.jpg',alt:'A golden dove in flight',results:'62 | frames in the book\n3 | countries exhibited\n1 | cover story',challenge:'Documenting a river crossing that was about to end.',approach:'Riding the ferry every week and learning the names of regulars.'}],
  ['image-full',{img:'films/pigment-bloom.jpg',alt:'Pigment blooming in water',caption:'Pigment study, from the Douro series.'}],
  ['gallery',{kicker:'More',heading:'Selected portraits.',images:'shelf/embroidery.webp | The seamstress\nshelf/owl.webp | Owl\nshelf/dove.webp | Dove\nshelf/amber.webp | Amber'}]]},
 {id:'about',name:'About',title:'About · Elio Marsh',desc:'About Elio.',blocks:[
  H('About','I photograph what people don’t notice.','Based in Porto, working everywhere.'),
  ['rich-text',{kicker:'Biography',heading:'Fifteen years, one camera at a time.',paras:'I studied documentary photography in Newcastle and have worked for magazines, charities and small companies ever since.\nI believe the best photographs are patient ones. I spend time with people before I lift the camera.\nMy work has been exhibited in Porto, Berlin and Arles.'}],
  ['timeline',{kicker:'Exhibitions',heading:'On the wall.',events:'2021 | Arles | Group show, Rencontres.\n2023 | Berlin | The last ferry, solo.\n2025 | Porto | Retrospective.'}]]},
 {id:'contact',name:'Contact',title:'Book a shoot · Elio Marsh',desc:'Commission Elio.',blocks:[
  H('Contact','Book a shoot.','Portraits, editorial and long projects.'),
  ['contact-form',{kicker:'Enquire',heading:'Tell me about it.',intro:'Who it is for, where and when. I reply within two days.',button:'Send enquiry',thanks:'I’ll reply within two days.'}],
  ['faq-none',{}]].filter(b=>b[0]!=='faq-none')}]});

/* 6 event */
add({id:'event',ctaLine:'Come for the day.',name:'Event',desc:'Countdown, schedule, speakers and tickets.',brand:'Paper Weight',style:'kit:kinetic',cta:['Get tickets','tickets'],siteDesc:'Paper Weight is a one-day festival of printmakers and paper artists.',footer:[0,{line:'A day of paper, print and pattern.',c1:'Festival',links1:'Home\nSchedule\nSpeakers\nTickets',c2:'Follow',links2:'Instagram\nNewsletter',c3:'Help',links3:'Accessibility\nContact',legal:'© 2027 Paper Weight'}],
 pages:[
 {id:'home',name:'Home',title:'Paper Weight · A day of paper, print and pattern',desc:'A festival of printmakers and paper artists, 14 June 2027, Leeds.',blocks:[
  ['hero-kinetic',{kicker:'14 June 2027 · Leeds',lead:'A day of',words:'paper\nprint\npattern\nplay',intro:'Talks, workshops and a market of over sixty makers in the old mill.',b1:'Get tickets',b2:'See the schedule'},{0:'page:tickets',1:'page:schedule'}],
  ['x-film',{film:'paper-bird',caption:'A paper bird, mid-flight: one of this year’s commissions.'}],
  ['countdown',{kicker:'Save the date',heading:'The doors open soon.',intro:'Two days of making in the old mill.',date:'2027-06-14',button:'Get tickets'},{0:'page:tickets'}],
  ['stats',{label:'Last year',stats:'2,400 | visitors\n62 | makers\n18 | workshops\n1 | very good canteen'}],
  ['sec-logos',{kicker:'With',heading:'Supported by print studios and paper mills.'}]]},
 {id:'schedule',name:'Schedule',title:'Schedule · Paper Weight',desc:'The day’s sessions.',blocks:[
  H('Schedule','One day, five sessions.','Doors at 9:30. Workshops are first come, first served.'),
  ['schedule',{kicker:'Saturday 14 June',heading:'The programme.',rows:'09:30 | Doors and coffee | The team | Foyer\n10:15 | Opening talk: small tools | Priya Nair | Main hall\n11:45 | Workshop: print and paper | Tom Becker | Studio 2\n14:00 | Panel: making a living | Four makers | Main hall\n16:30 | Drinks and demos | Everyone | Courtyard'}]]},
 {id:'speakers',name:'Speakers',title:'Speakers · Paper Weight',desc:'Who is speaking.',blocks:[
  H('Speakers','Eight makers, no slides.','Mostly demonstrations, with questions welcome.'),
  ['team',{kicker:'Speakers',heading:'On stage.',intro:'Printmakers, binders and paper engineers.',people:'Priya Nair | Printmaker | Silkscreen posters for music venues.\nTom Becker | Paper engineer | Pop-ups for museums.\nIna Costa | Bookbinder | Hand-bound editions.\nSam Whitlock | Letterpress | Types set one letter at a time.'}]]},
 {id:'tickets',name:'Tickets',title:'Tickets · Paper Weight',desc:'Buy tickets.',blocks:[
  H('Tickets','Come for the day.','Under-16s go free with an adult.'),
  ['pricing-tiers',{kicker:'Tickets',heading:'Pick yours.',intro:'All tickets include the market and talks.',plans:'Day | £22 | per person | The whole day. | Talks; Market; Canteen discount | Buy a day ticket\nWorkshop | £48 | per person | The day plus one workshop. | Talks; Market; One workshop | Buy workshop ticket\nFriend | £90 | per person | Priority entry and a print. | Everything; Priority entry; A signed print | Buy friend ticket'}],
  ['map-embed',{kicker:'Venue',heading:'The old mill.',address:'Mill Lane, Leeds LS2 7AA',hours:'Saturday 14 June | 9:30 to 6pm',button:'Get directions',maplink:'https://www.openstreetmap.org/search?query=Leeds%20LS2'}]]}]});

/* 7 personal blog */
add({id:'blog',ctaLine:'Never miss a note.',name:'Personal blog',desc:'Index, an article, about and a newsletter.',brand:'Field Notes',style:'kit:gazette',cta:['Subscribe','about'],siteDesc:'Field Notes is a blog about slow cooking, small gardens and long walks.',footer:[0,{line:'Slow cooking, small gardens, long walks.',c1:'Blog',links1:'Home\nArticles\nAbout',c2:'Follow',links2:'RSS\nInstagram',c3:'Contact',links3:'hello@fieldnotes.example',legal:'© 2027 Field Notes'}],
 pages:[
 {id:'home',name:'Home',title:'Field Notes · Slow cooking, small gardens, long walks',desc:'A blog about the small things.',blocks:[
  H('Field Notes','Slow cooking, small gardens, long walks.','Notes from a kitchen in the north of England. New posts most weeks.'),
  ['blog',{kicker:'Latest',heading:'New this month.',button:'All articles',posts:'Technique | 12 March | Why we rest every steak for exactly as long as it cooked | films/smoke-plume.jpg\nSeasonal | 4 March | Forced rhubarb, and four things to do with it | films/pigment-bloom.jpg\nGarden | 26 February | A small garden in a very large wind | films/petal-swirl.jpg'},{0:'page:articles',1:'page:post',2:'page:post',3:'page:post'}],
  NEWS('Notes in your inbox.','One email a month with the best of the blog.')]},
 {id:'articles',name:'Articles',title:'Articles · Field Notes',desc:'Every post.',blocks:[
  H('Archive','All articles.','Everything, newest first.'),
  ['blog',{kicker:'2027',heading:'This year.',button:'Subscribe',posts:'Technique | 12 March | Why we rest every steak for exactly as long as it cooked | films/smoke-plume.jpg\nSeasonal | 4 March | Forced rhubarb, and four things to do with it | films/pigment-bloom.jpg\nGarden | 26 February | A small garden in a very large wind | films/petal-swirl.jpg'},{0:'page:about',1:'page:post',2:'page:post',3:'page:post'}],
  ['blog',{kicker:'2026',heading:'Last year.',button:'Subscribe',posts:'Walks | 14 December | Eleven miles to a good pie | films/light-mesh.jpg\nBaking | 2 November | The one-bowl loaf | films/sand-drawing.jpg\nHome | 9 October | A kitchen that fits one person and a dog | films/suminagashi.jpg'},{0:'page:about'}]]},
 {id:'post',name:'Why we rest steak',title:'Why we rest every steak · Field Notes',desc:'On resting meat.',blocks:[
  ['blog-post',{}],
  NEWS('Liked this?','The next one lands next month.')]},
 {id:'about',name:'About',title:'About · Field Notes',desc:'About the blog.',blocks:[
  H('About','Hello, I’m Maya.','I write about the small things that make a day better.'),
  ['rich-text',{kicker:'About',heading:'A kitchen, a garden and a lot of walking.',paras:'Field Notes started as a notebook on the kitchen table. It still is, only now other people read it.\nI cook slowly, grow badly and walk often. Everything here is something I have tried and would try again.\nIf you want to say hello, my inbox is always open.'}],
  ['contact-form',{kicker:'Write',heading:'Say hello.',intro:'Questions, recipes or just a note.',button:'Send',thanks:'I read everything.'}]]}]});

/* 8 shop */
add({id:'shop',ctaLine:'Find something small and good.',name:'Shop / product launch',desc:'Product grid, story, shipping and contact.',brand:'Small Weather',style:'kit:pastel',cta:['Shop now','shop'],siteDesc:'Small Weather makes paper and textile objects in small batches.',footer:[0,{line:'Made slowly, shipped carefully.',c1:'Shop',links1:'Home\nShop\nStory\nHelp',c2:'Follow',links2:'Instagram\nPinterest',c3:'Contact',links3:'hello@smallweather.example',legal:'© 2027 Small Weather'}],
 pages:[
 {id:'home',name:'Home',title:'Small Weather · Paper and textile objects',desc:'Small-batch paper and textile objects.',blocks:[
  ['hero-image',{kicker:'New spring collection',heading:'Objects with a little weather in them.',intro:'Paper birds, embroidered leaves and prints made in small batches in Bristol.',b1:'Shop the collection',b2:'Our story',img:'shelf/dove.webp',alt:'A golden paper dove'},{0:'page:shop',1:'page:story'}],
  ['product-grid',{kicker:'Bestsellers',heading:'Loved this season.',items:'Paper bird, small | £48 | New | shelf/dove.webp\nOrigami fox | £62 |  | shelf/origami.webp\nNight owl print | £35 | Last few | shelf/owl.webp\nEmbroidered leaf | £54 |  | shelf/embroidery.webp'},{0:'page:shop',1:'page:shop',2:'page:shop',3:'page:shop',4:'page:shop'}],
  ['feature-grid',{kicker:'Why Small Weather',heading:'Made to keep.',intro:'',items:'heart | Handmade | Every piece is cut, folded or stitched by a person.\nleaf | Low waste | Offcuts become gift tags and the box is paper.\ngift | Gift ready | Wrapped in tissue, with a handwritten note on request.\nglobe | Shipped worldwide | Tracked, and insured to your door.'}],
  NEWS('First to hear.','New pieces, once a month.','Join')]},
 {id:'shop',name:'Shop',title:'Shop · Small Weather',desc:'All products.',blocks:[
  H('Shop','Everything, small batch.','Each piece is numbered and signed.'),
  ['product-grid',{kicker:'All pieces',heading:'The collection.',items:'Paper bird, small | £48 | New | shelf/dove.webp\nOrigami fox | £62 |  | shelf/origami.webp\nNight owl print | £35 | Last few | shelf/owl.webp\nEmbroidered leaf | £54 |  | shelf/embroidery.webp\nSand drawing | £120 | Limited | shelf/sand.webp\nSoap film study | £40 |  | shelf/soap.webp\nAmber glaze dish | £28 |  | shelf/amber.webp\nBloom print | £32 |  | shelf/bloom.webp'}],
  ['sec-faq',{kicker:'Questions',heading:'Orders and shipping.',intro:'Still stuck? We answer within a day.',button:'Ask us',qa:'How long does delivery take? | UK orders arrive in 2 to 4 working days, worldwide in 5 to 10.\nCan I return something? | Yes, within 30 days in its original packaging.\nDo you gift wrap? | Always, in tissue. Add a note at checkout.'}]]},
 {id:'story',name:'Story',title:'Our story · Small Weather',desc:'How Small Weather began.',blocks:[
  H('Our story','Two people and a very patient guillotine.','We started in a spare room in 2021.'),
  ['feature-rows',{kicker:'How it’s made',heading:'From sketch to your shelf.',rows:'Drawn by hand | Every piece starts as a pencil drawing at full size. | shelf/sumi.webp\nCut and folded | We cut, score and fold by hand, then light it like a film set. | shelf/origami.webp\nPacked with care | Wrapped in tissue and sent in a recycled box. | shelf/sand.webp'}],
  ['team',{kicker:'Makers',heading:'Who makes them.',intro:'A small studio in Bristol.',people:'Ana Pires | Founder | Cuts every bird herself.\nLuca Bell | Embroidery | Thread, mostly.\nSophie Tran | Packing and post | Knows every postcode.'}]]},
 {id:'help',name:'Help',title:'Help and contact · Small Weather',desc:'Shipping, returns and contact.',blocks:[
  H('Help','Orders, shipping and returns.','Free UK delivery over £50. Returns within 30 days.'),
  ['contact-form',{kicker:'Contact',heading:'Ask us anything.',intro:'Order numbers help. We reply within a day.',button:'Send',thanks:'We’ll reply within a day.'}]]}]});

/* 9 nonprofit */
add({id:'nonprofit',ctaLine:'Help us keep the door open.',name:'Nonprofit',desc:'Mission, programmes, donate and get involved.',brand:'Open Door',style:'kit:civic',cta:['Donate','donate'],siteDesc:'Open Door provides warm meals, a quiet room and someone to talk to.',footer:[0,{line:'Warm meals and someone to talk to.',c1:'About',links1:'Home\nProgrammes\nGet involved\nDonate',c2:'Follow',links2:'Facebook\nInstagram',c3:'Contact',links3:'hello@opendoor.example\n020 7946 0000',legal:'Registered charity 000000'}],
 pages:[
 {id:'home',name:'Home',title:'Open Door · Warm meals and someone to talk to',desc:'A neighbourhood charity for people who are lonely, hungry or in between homes.',blocks:[
  ['hero-image',{kicker:'Spring appeal · £36,400 raised so far',heading:'Warm meals, and someone to talk to.',intro:'Open Door has been a neighbourhood table for 18 years. Everyone is welcome and nobody is asked why.',b1:'Donate',b2:'Our programmes',img:'shelf/dove.webp',alt:'A white dove in soft light, a symbol of welcome'},{0:'page:donate',1:'page:programmes'}],
  ['stats',{label:'Last year',stats:'12,000 | hot meals\n420 | people welcomed\n86 | volunteers\n18 | years open'}],
  ['feature-grid',{kicker:'What we do',heading:'Three ways we help.',intro:'',items:'home | A warm place | A quiet room open six days a week.\nheart | A hot meal | Cooked fresh, every lunchtime.\nchat | Someone to talk to | Trained volunteers and a friendly ear.'}],
  ['quote',{quote:'I walked in for soup and left with a friend.',name:'Gerry',role:'Guest since 2021',initials:'G'}],
  CTA('Help us keep the door open.','Donate','page:donate')]},
 {id:'programmes',name:'Programmes',title:'Programmes · Open Door',desc:'What we run each week.',blocks:[
  H('Programmes','What happens at Open Door.','Free, drop-in and open to everyone.'),
  ['schedule',{kicker:'Every week',heading:'The week at a glance.',rows:'Mon | Lunch and chat | Volunteers | Hall\nWed | Advice drop-in | Citizens Advice | Room 2\nThu | Choir | Open to all | Hall\nSat | Big breakfast | Everyone | Hall'}],
  ['feature-rows',{kicker:'Stories',heading:'What it looks like.',rows:'Lunch for everyone | Hot, fresh and served at tables with real plates. | shelf/amber.webp\nA quiet room | Books, tea and time. | shelf/sumi.webp'}]]},
 {id:'involved',name:'Get involved',title:'Get involved · Open Door',desc:'Volunteer or fundraise.',blocks:[
  H('Get involved','Give an afternoon.','Volunteers are the heart of Open Door.'),
  ['steps',{kicker:'Volunteer',heading:'How it works.',steps:'Say hello | Fill in a short form or drop in on a Monday.\nGet to know us | A chat and a shadowing shift.\nJoin the rota | Pick a regular slot that suits you.'}],
  ['contact-form',{kicker:'Volunteer',heading:'Tell us about you.',intro:'Anything you’d like us to know.',button:'Send',thanks:'We’ll be in touch this week.'}]]},
 {id:'donate',name:'Donate',title:'Donate · Open Door',desc:'Give to Open Door.',blocks:[
  H('Donate','Every pound is a meal.','Thank you for helping.'),
  ['donate',{kicker:'Spring appeal',heading:'Help us keep the doors open.',intro:'Every pound pays for warm meals, a quiet room and someone to talk to.',raised:'£36,400',goal:'of £50,000',pct:'73',amounts:'£10\n£25\n£50\n£100',button:'Donate now',fine:'Registered charity 000000. Gift Aid adds 25% at no cost to you.'}]]}]});

/* 10 course */
add({id:'course',ctaLine:'Your first cylinder awaits.',name:'Online course',desc:'Landing, curriculum, instructor and enrol.',brand:'Clay School',style:'kit:lab',cta:['Enrol','enrol'],siteDesc:'Clay School teaches pottery online, at your own pace.',footer:[0,{line:'Pottery, taught slowly.',c1:'Course',links1:'Home\nCurriculum\nInstructor\nEnrol',c2:'Follow',links2:'YouTube\nInstagram',c3:'Help',links3:'Support\nRefunds',legal:'© 2027 Clay School'}],
 pages:[
 {id:'home',name:'Home',title:'Clay School · Learn pottery at your own pace',desc:'A six-module online pottery course with a real teacher.',blocks:[
  ['hero-split',{film:'sand-drawing',kicker:'Six modules, your pace',heading:'Learn to throw, from your kitchen table.',intro:'Short, calm lessons that take you from your first cylinder to a glazed set.',b1:'Enrol now',b2:'See the curriculum',note:'Starts every month'},{0:'page:enrol',1:'page:curriculum'}],
  ['steps',{kicker:'How it works',heading:'Three steps.',steps:'Watch | Short filmed lessons, close to the hands.\nMake | A small project each week.\nShare | Post it and get feedback from Ana.'}],
  ['stats',{label:'Students',stats:'6,000 | students\n4.9 | average rating\n36 | lessons\n1 | teacher, replying herself'}],
  ['quote',{quote:'I made a mug I actually use every morning. Three months ago I had never touched clay.',name:'Chris M.',role:'Student',initials:'CM'}],
  CTA('Your first cylinder awaits.','Enrol now','page:enrol')]},
 {id:'curriculum',name:'Curriculum',title:'Curriculum · Clay School',desc:'The six modules.',blocks:[
  H('Curriculum','Six modules, thirty-six lessons.','Everything you need from clay to kiln.'),
  ['curriculum',{}],
  ['feature-grid',{kicker:'Included',heading:'What comes with it.',intro:'',items:'film | 36 filmed lessons | Close to the hands, no rushing.\nusers | A friendly community | Share your work and get kind feedback.\ncheck | A certificate | When you finish module six.\nclock | Lifetime access | Come back whenever.'}]]},
 {id:'instructor',name:'Instructor',title:'Instructor · Clay School',desc:'Meet Ana.',blocks:[
  H('Instructor','Hi, I’m Ana.','Potter for fifteen years, teacher for ten.'),
  ['rich-text',{kicker:'About',heading:'I teach the way I wish I’d been taught.',paras:'I learned to throw in a cold garage with a library book. It took me three years to centre properly.\nThe course is what I wish I’d had: slow, close to the hands and honest about mistakes.\nI reply to every question myself.'}],
  ['quote',{quote:'Ana explains things in a way my hands actually understand.',name:'Chris M.',role:'Student, module 4',initials:'CM'}]]},
 {id:'enrol',name:'Enrol',title:'Enrol · Clay School',desc:'Join the course.',blocks:[
  H('Enrol','Start this month.','30-day money-back promise.'),
  ['pricing-tiers',{kicker:'Plans',heading:'Choose how to learn.',intro:'Pay once, keep it forever.',plans:'Self-paced | £129 | one payment | All 36 lessons. | Filmed lessons; Community; Certificate | Enrol self-paced\nWith feedback | £249 | one payment | Plus personal feedback from Ana. | Everything; 6 reviews; Live Q&A | Enrol with feedback'}],
  ['sec-faq',{kicker:'Questions',heading:'Before you start.',intro:'Ask us if yours is not here.',button:'Ask us',qa:'Do I need a wheel? | Module one works with a basic wheel; we list kit that costs under £250.\nHow long do I have access? | For life, including updates.\nWhat if it is not for me? | Ask within 30 days for a full refund.'}]]}]});

/* 11 app landing */
add({id:'app',ctaLine:'Take it with you.',name:'App landing',desc:'Hero, features, pricing and download.',brand:'Ledger',style:'ds:D46',cta:['Get the app','download'],siteDesc:'Ledger sorts every payment and shows what is safe to spend.',footer:[0,{line:'Calm personal finance.',c1:'App',links1:'Home\nFeatures\nPricing\nDownload',c2:'Company',links2:'About\nCareers\nPress',c3:'Legal',links3:'Privacy\nTerms\nSecurity',legal:'© 2027 Ledger Ltd. Authorised by the FCA.'}],
 pages:[
 {id:'home',name:'Home',title:'Ledger · Calm personal finance',desc:'Ledger sorts every payment and shows what is safe to spend.',blocks:[
  ['hero-image',{kicker:'New · shared budgets for couples',heading:'Money, without the knot in your stomach.',intro:'Ledger sorts every payment, shows what’s safe to spend and nudges you before bills land. Rated 4.8 by 22,000 people.',b1:'Get the app',b2:'See features',img:'shelf/bloom.webp',alt:'Soft colour blooming outwards, calm and unhurried'},{0:'page:download',1:'page:features'}],
  ['stats',{label:'Results',stats:'£412 | saved in the first three months, on average\n22,000 | people budgeting with Ledger\n0 | adverts, ever\n4.8 | average rating'}],
  ['quote',{quote:'For the first time I know what I can spend on a Thursday without opening four apps.',name:'Hannah Cole',role:'Teacher, Manchester',initials:'HC'}],
  ['app-download',{film:'light-threads',kicker:'On your phone',heading:'Take it with you.',intro:'Free on iPhone and Android.'}]]},
 {id:'features',name:'Features',title:'Features · Ledger',desc:'Everything Ledger does.',blocks:[
  H('Features','The quiet details.','Built to be opened for ten seconds, not ten minutes.'),
  ['feature-grid',{kicker:'Features',heading:'Everything in its place.',intro:'',items:'chart | Safe to spend | One number for the rest of the month.\nbell | Bill nudges | A gentle note before the money leaves.\nusers | Shared budgets | One view for two people.\nlock | Bank-grade security | Read-only access and nothing stored you didn’t choose.'}],
  ['tabs',{kicker:'A closer look',heading:'Pick a view.',tabs:'Today | Safe to spend | One number for what you can spend today. | shelf/threads.webp\nMonth | The month at a glance | Income, bills and savings on one screen. | shelf/sand.webp\nGoals | Goals that fill | Set a goal and watch it grow. | shelf/bloom.webp'}]]},
 {id:'pricing',name:'Pricing',title:'Pricing · Ledger',desc:'Free to start.',blocks:[
  H('Pricing','Free to start. Fair after that.','No ads, no selling your data.'),
  ['pricing-tiers',{kicker:'Plans',heading:'Pick a plan.',intro:'Cancel any time.',plans:'Free | £0 | forever | Everything you need to start. | Safe to spend; Bill nudges; One account | Get Free\nPlus | £3 | a month | For couples and goals. | Shared budgets; Goals; Unlimited accounts | Get Plus'}],
  ['compare',{kicker:'Compare',heading:'Ledger and a spreadsheet.',them:'Spreadsheet',rows:'Automatic categories | yes | no\nSafe to spend | yes | no\nBill nudges | yes | no'}]]},
 {id:'download',name:'Download',title:'Download · Ledger',desc:'Get the Ledger app.',blocks:[
  H('Download','Get Ledger.','Free on iPhone and Android.'),
  ['app-download',{film:'pigment-bloom',kicker:'On your phone',heading:'Get Ledger today.',intro:'Scan the code or search for Ledger in your store.'}],
  ['sec-faq',{kicker:'Questions',heading:'Before you download.',intro:'Ask us anything.',button:'Talk to us',qa:'Is my data safe? | Ledger has read-only access and never stores your bank credentials.\nIs it free? | The free plan is free forever. Plus adds shared budgets and goals.\nWhich banks work? | Over 2,000 UK and EU banks.'}]]}]});

/* 12 studio */
add({id:'studio',ctaLine:'Commission a piece.',name:'Creative studio',desc:'A small studio: work, process, journal and contact.',brand:'Fold',style:'paper',cta:['Commission a piece','contact'],siteDesc:'Fold is a paper sculpture studio in Bristol.',footer:[0,{line:'Paper sculpture, made slowly.',c1:'Studio',links1:'Home\nWork\nJournal\nContact',c2:'Follow',links2:'Instagram\nVimeo',c3:'Commission',links3:'studio@fold.example',legal:'© 2027 Fold Studio'}],
 pages:[
 {id:'home',name:'Home',title:'Fold · Paper sculpture studio',desc:'A paper sculpture studio making work for shop windows, book covers and film.',blocks:[
  ['hero-3d',{kicker:'Paper, light and patience',heading:'Objects made slowly, filmed carefully.',intro:'A small studio making paper sculpture for shop windows, book covers and film.',b1:'See the work',b2:'Commission a piece',img1:'shelf/origami.webp',img2:'shelf/owl.webp',img3:'shelf/dove.webp'},{0:'page:work',1:'page:contact'}],
  ['statement',{kicker:'How we work',text:'Every piece starts as a single sheet. We cut, score and fold by hand, then light it like a film set, so the shadows do half the work.'}],
  ['case-study',{client:'Case study · Larder & Co',heading:'A window display that stopped traffic on Regent Street.',img:'films/paper-bird.jpg',alt:'A paper bird mid-flight',results:'40k | passers-by a day\n3 weeks | in the window\n1 | very large bird',challenge:'A shop window that had to compete with a street of lights.',approach:'A single huge bird lit from below, with every fold cut by hand.'}],
  ['sec-logos',{kicker:'Made for',heading:'Shop windows, book covers and film titles.'}],
  CTA('Have a window to fill?','Commission a piece','page:contact')]},
 {id:'work',name:'Work',title:'Work · Fold',desc:'Selected commissions.',blocks:[
  H('Work','A few commissions.','Windows, covers and titles, 2021 to now.'),
  ['gallery',{kicker:'Gallery',heading:'Recent pieces.',images:'shelf/origami.webp | Crane, hand-folded\nshelf/owl.webp | Owl, cut from one sheet\nshelf/dove.webp | Dove, gold leaf\nshelf/lion.webp | Lion, book cover\nshelf/sumi.webp | Ink and paper\nshelf/threads.webp | Thread study'}],
  ['feature-rows',{kicker:'The making',heading:'From sketch to window.',rows:'Drawn | A full-size pencil drawing pinned to the wall. | shelf/sumi.webp\nCut | Scalpel and steel rule, one sheet at a time. | shelf/sand.webp\nFolded | Scored and creased by hand, then lit. | shelf/origami.webp'}]]},
 {id:'journal',name:'Journal',title:'Journal · Fold',desc:'Notes from the studio.',blocks:[
  H('Journal','Notes from the studio.','Process, tests and the occasional disaster.'),
  ['blog',{kicker:'Journal',heading:'Latest.',button:'Subscribe',posts:'Process | 12 March | How to fold a bird that can stand up on its own | films/paper-bird.jpg\nTests | 4 March | Twelve papers, one question | films/pigment-bloom.jpg\nStudio | 26 February | Moving into a mill | films/suminagashi.jpg'},{0:'page:contact'}]]},
 {id:'contact',name:'Contact',title:'Commission · Fold',desc:'Commission a piece.',blocks:[
  H('Commission','Tell us about the piece.','A short note is plenty. We reply within two working days.'),
  ['contact-form',{kicker:'Commission',heading:'Tell us about it.',intro:'What is it for, how big and when?',button:'Send',thanks:'We’ll reply within two working days.'}],
  ['map-embed',{kicker:'Studio',heading:'Visit by appointment.',address:'Unit 4, Mill Yard, Bristol BS1 4AA',hours:'Weekdays | By appointment',button:'Get directions',maplink:'https://www.openstreetmap.org/search?query=Bristol%20BS1'}]]}]});

PB.tplKit={H,CTA,NEWS,FOOT,add,finish};
PB.templates=T;
})();
