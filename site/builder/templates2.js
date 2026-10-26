'use strict';
/* Page builder, more multi-page site templates and the one-page landing family (same format as templates.js). */
(()=>{
const PB=window.PB,K=PB&&PB.tplKit;if(!K)return;
const {H,CTA,NEWS,add}=K;
const F=(legal,line,c1,l1,c2,l2,c3,l3)=>[0,{line,c1,links1:l1,c2,links2:l2,c3,links3:l3,legal}];

/* coffee shop and bakery */
add({id:'coffee',ctaLine:'Come in, we saved you a seat.',name:'Coffee shop and bakery',desc:'Menu, the bakers, opening hours and a place to find us.',brand:'Rye & Roast',style:'at:S03-light',cta:['Visit us','visit'],siteDesc:'Rye & Roast is a neighbourhood bakery and coffee bar in Manchester with slow-fermented bread.',
 footer:F('© 2027 Rye & Roast','Bread, coffee and not much else.','Pages','Home\nMenu\nOur bakers\nVisit','Follow','Instagram\nNewsletter','Say hello','hello@ryeandroast.example\n0161 000 0000'),
 pages:[
 {id:'home',name:'Home',title:'Rye & Roast · Bakery and coffee bar in Manchester',desc:'Slow-fermented bread, strong coffee and a warm room on Oak Street.',blocks:[
  ['hero-image',{kicker:'Bakery and coffee bar · Manchester',heading:'Slow bread, strong coffee, warm mornings.',intro:'We bake every loaf for 36 hours and roast our coffee the day before it reaches your cup.',b1:'See the menu',b2:'Find us',img:'shelf/amber.webp',alt:'A glowing amber glaze, like a crust straight from the oven'},{0:'page:menu',1:'page:visit'}],
  ['stats',{label:'The numbers',stats:'36 h | for every loaf to prove\n14 | loaves out of the oven by 7am\n6 | beans on rotation\n1 | very patient oven'}],
  ['feature-grid',{kicker:'What we do',heading:'A small menu, done properly.',intro:'Everything is made in the building. Most of it is gone by two.',items:'spark | Sourdough | Rye, spelt and a white loaf with a crackling crust.\nchat | Pastry | Laminated by hand: croissants, kouign-amann and a cardamom bun.\nbolt | Coffee | Espresso and filter from two roasters we visit twice a year.\nusers | Breakfast and lunch | Eggs, toasties and one soup that changes with the week.'}],
  ['quote',{quote:'The only place I will queue in the rain for. Get the cardamom bun.',name:'Priya Shah',role:'Regular, since opening week',initials:'PS'}],
  ['gallery',{kicker:'Out of the oven',heading:'This morning.',images:'shelf/amber.webp | Honey glaze, still warm\nshelf/smoke.webp | Steam off the first batch\nshelf/sand.webp | Flour on the bench\nshelf/bloom.webp | Edible flowers on the tarts\nshelf/embroidery.webp | A scoring pattern, by hand\nshelf/sumi.webp | Rye, cut and dusted'}],
  CTA('Come in, we saved you a seat.','Find us','page:visit')]},
 {id:'menu',name:'Menu',title:'Menu · Rye & Roast',desc:'Bread, pastry, coffee and lunch.',blocks:[
  H('Menu','Baked this morning.','Everything is made here and sold until it runs out.'),
  ['menu-list',{kicker:'Bakery',heading:'Bread and pastry.',h1:'Bread',col1:'Country sourdough | Whole loaf, 36-hour ferment | £5.50\nRye and caraway | Dense, dark, keeps for days | £6\nSeeded spelt | Sunflower, pumpkin, linseed | £6\nBaguette | Crisp outside, open inside | £3',h2:'Pastry',col2:'Butter croissant | Laminated over three days | £3.40\nKouign-amann | Caramelised, shatteringly crisp | £4\nCardamom bun | Brushed with syrup | £3.80\nSeasonal tart | Ask what is in season | £4.50',note:'Gluten-free and vegan options are marked on the counter. Please ask about allergens.'}],
  ['menu-list',{kicker:'Coffee',heading:'Coffee and lunch.',h1:'Coffee',col1:'Espresso | Double, rich and sweet | £2.80\nFlat white | Silky, with a long finish | £3.60\nFilter | Changes weekly, ask for the story | £3.20\nHot chocolate | Single origin, not too sweet | £3.80',h2:'Lunch',col2:'Eggs on toast | Two eggs, any style, sourdough | £7\nCheese toastie | Cheddar, onion jam, rye | £7.50\nSoup of the week | With a hunk of bread | £6.50\nLemon polenta cake | Slice | £4'}],
  ['sec-faq',{kicker:'Good to know',heading:'Before you queue.',intro:'We are small, so a few answers help.',button:'Ask us',qa:'Can I pre-order bread? | Yes, until 5pm the day before. Pick up from 8am.\nDo you do oat milk? | Always, and we steam it properly.\nAre dogs allowed? | Dogs are welcome on the front benches.\nDo you take cards? | Cards and phones only; we are cash-free.'}]]},
 {id:'bakers',name:'Our bakers',title:'Our bakers · Rye & Roast',desc:'Meet the people who make the bread.',blocks:[
  H('Our bakers','Up before the sun.','Four bakers, two baristas and a very old oven.'),
  ['rich-text',{kicker:'The story',heading:'We wanted a bakery we would queue for.',paras:'Rye & Roast started in 2021 in a rented railway arch with one oven and a borrowed mixer.\nWe learned that good bread is mostly patience: cold fermentation, a hot oven and nobody rushing.\nToday we bake for the street, six days a week, and sell out most mornings.'}],
  ['team',{kicker:'The team',heading:'Who is behind the counter.',intro:'You will meet most of us before 9am.',people:'Ana Ferreira | Head baker | Trained in Porto; will talk about rye for as long as you let her.\nMarcus Bell | Pastry | Laminates everything by hand and refuses to use a machine.\nTess Okoye | Coffee | Roasts with two small roasters and tastes every batch twice.\nLeo Marsh | Front of house | Remembers your order after one visit.'}],
  ['timeline',{kicker:'So far',heading:'Four years in four lines.',events:'2021 | The arch | One oven, one mixer, forty loaves a day.\n2022 | The first queue | We started selling out before ten.\n2024 | The corner | Moved to Oak Street with room for tables.\n2027 | Today | Fourteen loaves in the oven by seven.'}]]},
 {id:'visit',name:'Visit',title:'Visit · Rye & Roast',desc:'Opening hours, address and how to pre-order.',blocks:[
  H('Visit','Find us on Oak Street.','Ten minutes from Piccadilly, next to the green door.'),
  ['map-embed',{kicker:'Where',heading:'Come in from the cold.',address:'18 Oak Street, Manchester M4 1AB',hours:'Tuesday to Friday | 7:30am to 3pm\nSaturday | 8am to 4pm\nSunday | 8am to 2pm\nMonday | Closed',button:'Get directions',maplink:'https://www.openstreetmap.org/search?query=Oak%20Street%20Manchester'}],
  ['contact-form',{kicker:'Pre-order',heading:'Reserve your bread.',intro:'Tell us what you want and when you will collect it.',button:'Send order',thanks:'Thank you. We will confirm by email before 5pm.'}]]}]});

/* fitness studio */
add({id:'fitness',ctaLine:'Your first class is on us.',name:'Fitness studio',desc:'Classes, coaches, membership and a free trial.',brand:'Forge',style:'kit:kinetic',cta:['Try a class','join'],siteDesc:'Forge is a strength and conditioning studio in Bristol with small classes and coaches who know your name.',
 footer:F('© 2027 Forge Strength','Small classes. Real coaching.','Studio','Home\nClasses\nCoaches\nJoin','Follow','Instagram\nStrava club','Contact','hello@forge.example\n0117 000 0000'),
 pages:[
 {id:'home',name:'Home',title:'Forge · Strength and conditioning studio in Bristol',desc:'Small group classes, coaches who know your name and a free first session.',blocks:[
  ['hero-film',{film:'hydraulic-erosion',kicker:'Strength and conditioning · Bristol',heading:'Get stronger. Together.',intro:'Small classes of eight, coached properly, for people who want to feel capable again.',b1:'Book a free class',b2:'See the timetable'},{0:'page:join',1:'page:classes'}],
  ['stats',{label:'The studio',stats:'8 | people in every class\n14 | classes a week\n3 | qualified coaches\n94% | members still here after a year'}],
  ['feature-grid',{kicker:'How it works',heading:'Coached, not shouted at.',intro:'Every session is planned, scaled and watched by a human.',items:'bolt | Strength | Barbell, kettlebell and bodyweight work, progressed week by week.\nheart | Conditioning | Intervals that leave you tired, not broken.\nusers | Small groups | Eight people, one coach, no waiting for the rack.\nchart | Progress | Your numbers, tracked and talked about every month.'}],
  ['quote',{quote:'I walked in unable to do a press-up. Six months later I deadlifted my own weight and cried a bit.',name:'Dani Reeves',role:'Member since 2025',initials:'DR'}],
  ['pricing-tiers',{kicker:'Membership',heading:'Pick how often you come.',intro:'Start with a free class. Pause any time.',plans:'Drop in | £14 | per class | Try us without committing. | Any class; Book online | Book a class\nRegular | £69 | a month | Up to 8 classes a month. | 8 classes; Progress tracking; Pause any time | Join Regular\nUnlimited | £99 | a month | Come as often as you like. | Every class; Open gym hours; Guest pass | Join Unlimited'}],
  CTA('Your first class is on us.','Book it','page:join')]},
 {id:'classes',name:'Classes',title:'Classes · Forge',desc:'The weekly timetable and what each class is.',blocks:[
  H('Classes','Find the class that suits you.','Every class is scalable. If you can walk in, you can start.'),
  ['schedule',{kicker:'This week',heading:'The timetable.',rows:'Mon 06:30 | Strength | Jo | Floor 1\nMon 18:30 | Conditioning | Sam | Floor 1\nWed 07:00 | Strength | Jo | Floor 1\nThu 18:30 | Engine | Alex | Floor 2\nSat 09:00 | Everything | Jo and Sam | Floor 1\nSun 10:00 | Mobility | Alex | Studio'}],
  ['feature-rows',{kicker:'The classes',heading:'Four ways to train.',rows:'Strength | Squat, press, pull and hinge with a coach on every set. | shelf/lion.webp\nConditioning | Short, hard, finished in 40 minutes. | shelf/ferro.webp\nEngine | Longer intervals to build the base under everything else. | shelf/threads.webp\nMobility | Slow work for joints, hips and shoulders. | shelf/sand.webp'}],
  ['sec-faq',{kicker:'First time',heading:'Before you come.',intro:'You do not need to be fit already.',button:'Ask a coach',qa:'What do I wear? | Anything you can move in. Trainers or bare feet.\nWhat if I am injured? | Tell the coach. Every movement can be changed.\nCan I bring a friend? | Yes. Members get a free guest pass each month.\nHow do I cancel? | One click in the app, no letters and no fees.'}]]},
 {id:'coaches',name:'Coaches',title:'Coaches · Forge',desc:'Meet the people who coach every class.',blocks:[
  H('Coaches','People who know your name.','Three coaches, one philosophy: do the basics well.'),
  ['team',{kicker:'The coaches',heading:'Who will be watching your squat.',intro:'All are level 3 qualified and first aid trained.',people:'Jo Mercer | Head coach | Former rower. Believes in boring, consistent progress.\nSam Adeyemi | Conditioning | Ran marathons, now prefers short and sharp.\nAlex Novak | Mobility and rehab | Physio background; makes hips behave.'}],
  ['rich-text',{kicker:'Our approach',heading:'Nobody is too old, too new or too tired.',paras:'We built Forge for people who had been put off gyms: too loud, too competitive, too confusing.\nEvery session has a plan on the whiteboard, a coach on the floor and a choice of heavy, medium or light.\nIf you leave feeling a little more capable than you arrived, we did our job.'}]]},
 {id:'join',name:'Join',title:'Join · Forge',desc:'Book a free first class.',blocks:[
  H('Join','Book your free class.','Tell us a little about yourself and we will find you a spot.'),
  ['contact-form',{kicker:'Free trial',heading:'Which class, and when?',intro:'We reply within a working day to confirm.',button:'Request my class',thanks:'Thank you. A coach will confirm your class by email.'}],
  ['map-embed',{kicker:'Find us',heading:'Unit 4, behind the railway arches.',address:'Unit 4, Cargo Yard, Bristol BS1 6AB',hours:'Monday to Friday | 6am to 9pm\nSaturday | 8am to 1pm\nSunday | 9am to 1pm',button:'Get directions',maplink:'https://www.openstreetmap.org/search?query=Bristol%20BS1'}]]}]});

/* law firm and consultancy */
add({id:'law',ctaLine:'Talk to a partner this week.',name:'Law firm',desc:'Practice areas, partners, insights and an enquiry form.',brand:'Hartley & Vane',style:'kit:chambers',cta:['Book a consultation','contact'],siteDesc:'Hartley & Vane is a small commercial law firm in Edinburgh advising founders, landlords and family businesses.',
 footer:F('© 2027 Hartley & Vane LLP. Authorised and regulated by the Law Society of Scotland.','Clear advice for businesses and families.','Firm','Home\nPractice\nPeople\nInsights\nContact','Offices','Edinburgh\nGlasgow','Contact','enquiries@hartleyvane.example\n0131 000 0000'),
 pages:[
 {id:'home',name:'Home',title:'Hartley & Vane · Commercial law in Edinburgh',desc:'Clear, practical legal advice for founders, landlords and family businesses.',blocks:[
  ['hero-center',{badge:'Since 1994',news:'Independent, partner-led',heading:'Advice you can act on.',intro:'We are a small commercial law firm. A partner handles every matter from the first call to the final signature.',b1:'Book a consultation',b2:'Our practice',proof:'Rated excellent by 140 clients'},{1:'page:contact',2:'page:practice'}],
  ['stats',{label:'The firm',stats:'30 | years in practice\n4 | partners, all hands-on\n600+ | companies advised\n24 h | to reply to every enquiry'}],
  ['feature-grid',{kicker:'Practice areas',heading:'Where we are most useful.',intro:'Five areas, done in depth.',items:'briefcase | Company and commercial | Formation, shareholder agreements, contracts and disputes.\nkey | Property | Commercial leases, acquisitions and development.\nusers | Employment | Contracts, restructures and tribunals, for employers.\nheart | Family business | Succession, trusts and wills for owner-managed firms.\nshield | Regulatory | Data protection, advertising and licensing advice.'}],
  ['quote',{quote:'They explained a complicated lease in plain English and saved us £40,000 in the negotiation.',name:'Fiona MacLeod',role:'Director, MacLeod Foods',initials:'FM'}],
  ['logo-grid',{kicker:'Trusted by',logos:'MacLeod Foods\nNorth Sea Labs\nGrange Estates\nOld Town Press\nStonebridge Dental\nCalton Studios'}],
  CTA('Talk to a partner this week.','Book a consultation','page:contact')]},
 {id:'practice',name:'Practice',title:'Practice areas · Hartley & Vane',desc:'What we advise on, and how we charge.',blocks:[
  H('Practice','What we advise on.','Plain advice, clear fees and no surprises.'),
  ['feature-rows',{kicker:'In depth',heading:'Five areas of practice.',rows:'Company and commercial | From the first shareholder agreement to the sale of the business. | shelf/statue.webp\nProperty | Leases, purchases and development for owners and occupiers. | shelf/lighthouse.webp\nEmployment | Practical HR law for growing teams. | shelf/threads.webp'}],
  ['steps',{kicker:'How we work',heading:'From first call to completion.',steps:'Listen | A free 20-minute call to understand the problem.\nAdvise | A written plan with options and fixed fees.\nAct | We draft, negotiate and keep you updated weekly.\nCheck | A review after completion, so nothing is missed.'}],
  ['sec-faq',{kicker:'Fees',heading:'How we charge.',intro:'We prefer fixed fees where we can.',button:'Ask about fees',qa:'Do you offer fixed fees? | Yes, for most standard work. We agree it in writing first.\nIs the first call free? | Yes, twenty minutes, with a partner.\nHow quickly do you reply? | Within one working day, usually the same afternoon.\nDo you work with startups? | Yes, with fixed packages for formation and funding.'}]]},
 {id:'people',name:'People',title:'People · Hartley & Vane',desc:'The partners and team.',blocks:[
  H('People','The partners.','You will always speak to a partner, not a call centre.'),
  ['team',{kicker:'Partners',heading:'Who will act for you.',intro:'Between us we have 90 years of practice.',people:'Eleanor Hartley | Senior partner | Company and commercial. Founded the firm in 1994.\nRaj Vane | Partner | Property and development. Reads every lease twice.\nIsla Buchanan | Partner | Employment. Calm in a crisis.\nWill Drummond | Partner | Family business and trusts. Patient with complicated families.'}],
  ['timeline',{kicker:'History',heading:'Thirty years in four lines.',events:'1994 | Founded | Two partners and one filing cabinet on George Street.\n2005 | Commercial property | Added a property team.\n2014 | Employment | Opened our employment practice.\n2024 | Today | Four partners, one very full diary.'}]]},
 {id:'insights',name:'Insights',title:'Insights · Hartley & Vane',desc:'Short guides for owners and landlords.',blocks:[
  H('Insights','Short guides, written by partners.','No jargon, no sales pitch.'),
  ['blog',{kicker:'Latest',heading:'Recent guides.',button:'All guides',posts:'Property | 12 March | What to check before you sign a commercial lease | shelf/lighthouse.webp\nCompany | 4 March | Five clauses every shareholder agreement needs | shelf/statue.webp\nEmployment | 26 February | Changing a contract without a tribunal | shelf/threads.webp'}],
  NEWS('Guides in your inbox.','One practical email a month, no spam.')]},
 {id:'contact',name:'Contact',title:'Contact · Hartley & Vane',desc:'Book a consultation or call the office.',blocks:[
  H('Contact','Tell us what you need.','A partner will reply within one working day.'),
  ['contact-form',{kicker:'Enquiry',heading:'Book a consultation.',intro:'Do not include confidential details yet; we will arrange a private call.',button:'Send enquiry',thanks:'Thank you. A partner will reply within one working day.'}],
  ['map-embed',{kicker:'Visit',heading:'George Street, Edinburgh.',address:'22 George Street, Edinburgh EH2 2PQ',hours:'Monday to Friday | 9am to 5:30pm\nOut of hours | By appointment',button:'Get directions',maplink:'https://www.openstreetmap.org/search?query=George%20Street%20Edinburgh'}]]}]});

/* real estate agent */
add({id:'realestate',ctaLine:'Curious what your home is worth?',name:'Estate agent',desc:'Featured homes, how we sell, the team and a valuation form.',brand:'Larch & Lane',style:'kit:marmo',cta:['Free valuation','valuation'],siteDesc:'Larch & Lane is an independent estate agency selling and letting homes across south London.',
 footer:F('© 2027 Larch & Lane Ltd','Homes, found and sold with care.','Agency','Home\nHomes\nSelling\nTeam\nValuation','Follow','Instagram\nRightmove','Visit','hello@larchandlane.example\n020 7000 0000'),
 pages:[
 {id:'home',name:'Home',title:'Larch & Lane · Independent estate agents in south London',desc:'Sell or let your home with a local team that picks up the phone.',blocks:[
  ['hero-image',{kicker:'Independent estate agents · South London',heading:'Selling homes the way neighbours would.',intro:'Honest valuations, beautiful photography and one agent from first viewing to completion.',b1:'Free valuation',b2:'See homes',img:'shelf/lighthouse.webp',alt:'A lighthouse standing against the evening sky, a symbol of finding home'},{0:'page:valuation',1:'page:homes'}],
  ['stats',{label:'Our record',stats:'97% | of asking price achieved\n24 days | average time to offer\n480 | homes sold last year\n4.9 | from 310 reviews'}],
  ['product-grid',{kicker:'Featured',heading:'On the market now.',items:'Garden flat, Peckham | £485,000 | New | shelf/bloom.webp\nTerrace, Brockley | £725,000 |  | shelf/amber.webp\nLoft, Bermondsey | £610,000 | Offers | shelf/statue.webp\nCottage, Forest Hill | £895,000 |  | shelf/tree.webp'},{0:'page:homes',1:'page:homes',2:'page:homes',3:'page:homes',4:'page:homes'}],
  ['steps',{kicker:'Selling with us',heading:'Four steps to sold.',steps:'Value | A free, honest valuation with comparable sales.\nPrepare | Photography, floorplan and a listing that tells the story.\nMarket | Online, to our buyers list and in the window.\nComplete | One agent chases every step until the keys change hands.'}],
  ['quote',{quote:'They sold in nine days at above asking, and kept us calm the whole time.',name:'Tom and Lena Hart',role:'Sold in Brockley',initials:'TH'}],
  CTA('Curious what your home is worth?','Free valuation','page:valuation')]},
 {id:'homes',name:'Homes',title:'Homes for sale · Larch & Lane',desc:'Current properties for sale and to let.',blocks:[
  H('Homes','Homes for sale and to let.','Updated every morning by the people who show them.'),
  ['product-grid',{kicker:'For sale',heading:'Buying.',items:'Garden flat, Peckham | £485,000 | New | shelf/bloom.webp\nTerrace, Brockley | £725,000 |  | shelf/amber.webp\nLoft, Bermondsey | £610,000 | Offers | shelf/statue.webp\nCottage, Forest Hill | £895,000 |  | shelf/tree.webp\nMews, Dulwich | £1,150,000 | New | shelf/lighthouse.webp\nStudio, New Cross | £310,000 |  | shelf/sand.webp'},{0:'page:valuation',1:'page:valuation',2:'page:valuation',3:'page:valuation',4:'page:valuation',5:'page:valuation',6:'page:valuation'}],
  ['sec-faq',{kicker:'Buying',heading:'Questions from buyers.',intro:'Ask us anything about a home or the process.',button:'Ask a question',qa:'Can I view at the weekend? | Yes, Saturdays and most Sundays.\nDo you help with mortgages? | We introduce trusted independent advisers, with no obligation.\nHow do offers work? | You offer through us, we present it the same day and keep you updated.'}]]},
 {id:'selling',name:'Selling',title:'Selling your home · Larch & Lane',desc:'How we sell, what we charge and what to expect.',blocks:[
  H('Selling','How we sell your home.','A clear plan, a fixed fee and weekly updates.'),
  ['feature-grid',{kicker:'What you get',heading:'Everything included.',intro:'No hidden extras.',items:'camera | Photography | Professional photos, floorplan and a short film.\nchart | Pricing | A valuation backed by recent local sales.\nusers | Viewings | Accompanied, by the agent who knows the house.\nshield | Sales progression | One person chases solicitors until exchange.'}],
  ['pricing-tiers',{kicker:'Fees',heading:'Simple fees.',intro:'No fee if we do not sell.',plans:'Sales | 1.1% | of sale price | Our full service. | Photography; Floorplan; Viewings; Progression | Free valuation\nLettings | 8% | of rent | Find and manage the tenant. | Referencing; Inventory; Monthly statements | Free valuation\nBoth | 1% | of sale price | Sell and let across your portfolio. | Everything above; Account manager | Talk to us'}]]},
 {id:'team',name:'Team',title:'Team · Larch & Lane',desc:'Meet the agents.',blocks:[
  H('Team','Your local agents.','Agents who live where they work.'),
  ['team',{kicker:'Meet us',heading:'Who will sell your home.',intro:'Every agent has sold in this area for at least a decade.',people:'Grace Obi | Director | Started the agency in 2014 after ten years at a big chain.\nMark Ellison | Sales | Knows every street between Peckham and Penge.\nPriya Nair | Lettings | Careful about tenants and landlords alike.\nChris Walsh | Progression | Phones solicitors so you do not have to.'}],
  ['quote',{quote:'Grace answered my message at 9pm on a Sunday. That is when I knew.',name:'Aisha Rahman',role:'Landlord, Camberwell',initials:'AR'}]]},
 {id:'valuation',name:'Valuation',title:'Free valuation · Larch & Lane',desc:'Request a free, no-obligation valuation.',blocks:[
  H('Valuation','What is your home worth?','Free, honest and with no obligation to sell.'),
  ['contact-form',{kicker:'Valuation',heading:'Tell us about the property.',intro:'Address, bedrooms and when you would like to move.',button:'Request a valuation',thanks:'Thank you. An agent will call within a working day.'}],
  ['contact-cards',{kicker:'Or',heading:'Talk to us directly.',ways:'phone | Call | Monday to Saturday, 9 to 6. | 020 7000 0000\nmail | Email | We reply within an hour in office hours. | hello@larchandlane.example\npin | Visit | 12 Lane End, London SE15 | Open Saturdays 10 to 4'}]]}]});

/* wedding */
add({id:'wedding',ctaLine:'Will you join us?',name:'Wedding',desc:'Our story, the day, accommodation and RSVP.',brand:'Ella & Sam',style:'kit:botanical',cta:['RSVP','rsvp'],siteDesc:'The wedding of Ella and Sam, 20 September 2027, in the Cotswolds.',
 footer:F('© 2027 Ella & Sam','We cannot wait to celebrate with you.','Pages','Home\nOur story\nThe day\nStay\nRSVP','Questions','ellaandsam@example.com','Dates','RSVP by 1 August'),
 pages:[
 {id:'home',name:'Home',title:'Ella & Sam · 20 September 2027',desc:'Join us to celebrate our wedding in the Cotswolds.',blocks:[
  ['hero-image',{kicker:'20 September 2027 · The Cotswolds',heading:'Ella and Sam are getting married.',intro:'We would love you to be there. Everything you need is on these pages.',b1:'RSVP',b2:'The day',img:'shelf/dove.webp',alt:'A white dove in flight in soft light'},{0:'page:rsvp',1:'page:day'}],
  ['countdown',{kicker:'Save the date',heading:'Not long now.',intro:'Please reply by 1 August so we can plan the long table.',date:'2027-09-20',button:'RSVP'},{0:'page:rsvp'}],
  ['feature-grid',{kicker:'At a glance',heading:'What to know.',intro:'The essentials, in short.',items:'calendar | When | Saturday 20 September 2027, ceremony at 2pm.\npin | Where | Hallow Barn, Burford, Oxfordshire.\nheart | Dress | Garden party: colour welcome, flat shoes advised.\nusers | Children | Very welcome, with a play corner and a sitter.'}],
  ['quote',{quote:'We met in a queue for coffee. We have been in each other’s line ever since.',name:'Ella and Sam',role:'Our story, short version',initials:'ES'}],
  CTA('Will you join us?','RSVP','page:rsvp')]},
 {id:'story',name:'Our story',title:'Our story · Ella & Sam',desc:'How we met and how Sam proposed.',blocks:[
  H('Our story','How it began.','Seven years, two cities, one very patient dog.'),
  ['timeline',{kicker:'Timeline',heading:'Seven years in five moments.',events:'2020 | The queue | A coffee shop in Bristol, a wrong order and a long chat.\n2021 | First trip | A rainy weekend in Cornwall, still our favourite.\n2023 | Together | Moved in, adopted Biscuit the dog.\n2026 | The question | A proposal on the cliffs, with the dog as witness.\n2027 | The day | Surrounded by everyone we love.'}],
  ['gallery',{kicker:'Photos',heading:'A few favourites.',images:'shelf/bloom.webp | Flowers from the first date\nshelf/embroidery.webp | A hand-stitched gift\nshelf/dove.webp | The dove that visited our proposal\nshelf/origami.webp | A crane from Sam’s grandmother'}]]},
 {id:'day',name:'The day',title:'The day · Ella & Sam',desc:'Timings, venue and travel.',blocks:[
  H('The day','What happens when.','A relaxed day with plenty of time to talk.'),
  ['schedule',{kicker:'Saturday 20 September',heading:'The plan.',rows:'13:30 | Arrival and welcome drinks | Everyone | The orchard\n14:00 | Ceremony | Ella and Sam | The barn\n15:00 | Drinks and photographs | Everyone | The lawn\n17:30 | Wedding breakfast | Long table | The barn\n20:00 | Dancing | Everyone | The barn\n23:30 | Last song | Everyone | The barn'}],
  ['map-embed',{kicker:'Venue',heading:'Hallow Barn.',address:'Hallow Barn, Burford, Oxfordshire OX18 4AA',hours:'Parking | On site, free\nTaxis | We have booked shuttles after dinner',button:'Get directions',maplink:'https://www.openstreetmap.org/search?query=Burford%20Oxfordshire'}]]},
 {id:'stay',name:'Stay',title:'Stay · Ella & Sam',desc:'Where to stay and how to get there.',blocks:[
  H('Stay','Where to stay.','A few places nearby that we love.'),
  ['feature-rows',{kicker:'Nearby',heading:'Our suggestions.',rows:'The Swan Inn | Ten minutes’ walk, a block of rooms held in our name until 1 July. | shelf/amber.webp\nBurford Cottages | Self-catering for families, a short drive. | shelf/tree.webp\nThe Old Mill | A quieter stay by the river, twenty minutes by car. | shelf/sand.webp'}],
  ['sec-faq',{kicker:'Travel',heading:'Getting there.',intro:'Short answers to the usual questions.',button:'Email us',qa:'How do I get there by train? | Charlbury is the nearest station; shuttles run from 1pm.\nIs there parking? | Yes, free on site.\nWhat if it rains? | The barn has room for everyone. Bring a coat anyway.'}]]},
 {id:'rsvp',name:'RSVP',title:'RSVP · Ella & Sam',desc:'Let us know if you can come.',blocks:[
  H('RSVP','Will you be there?','Please reply by 1 August.'),
  ['contact-form',{kicker:'RSVP',heading:'Tell us your answer.',intro:'Names, dietary needs and any song you will request.',button:'Send RSVP',thanks:'Thank you. We have your reply.'}]]}]});

/* podcast and creator */
add({id:'podcast',ctaLine:'Press play on something slow.',name:'Podcast or creator',desc:'Latest episodes, about the host, sponsors and a newsletter.',brand:'Slow Radio',style:'kit:vinyl',cta:['Listen now','episodes'],siteDesc:'Slow Radio is a weekly podcast about people who make things carefully.',
 footer:F('© 2027 Slow Radio','Conversations at walking pace.','Show','Home\nEpisodes\nAbout\nSponsor','Listen','Apple Podcasts\nSpotify\nRSS','Contact','hello@slowradio.example'),
 pages:[
 {id:'home',name:'Home',title:'Slow Radio · A weekly podcast about careful making',desc:'Conversations at walking pace with potters, bakers, printers and other people who take their time.',blocks:[
  ['hero-split',{film:'lissajous-drawing',kicker:'A weekly podcast',heading:'Conversations at walking pace.',intro:'Every Thursday, one maker, one hour and no rush. Listen to potters, printers, bakers and people who take their time.',b1:'Latest episode',b2:'All episodes',note:'New episode every Thursday'},{0:'page:episodes',1:'page:episodes'}],
  ['stats',{label:'The show',stats:'112 | episodes so far\n48,000 | listeners a month\n4.9 | rating on Apple Podcasts\n1 | very good microphone'}],
  ['blog',{kicker:'Latest',heading:'Recent episodes.',button:'All episodes',posts:'Episode 112 | 4 March | The potter who fires only once a year | shelf/amber.webp\nEpisode 111 | 25 February | Why a printer kept her father’s press | shelf/threads.webp\nEpisode 110 | 18 February | Baking for a village of 400 | shelf/smoke.webp'},{0:'page:episodes'}],
  ['press',{label:'What people say',quotes:'The calmest hour of my week. | The Maker’s Journal\nProof that slow radio is good radio. | Culture Weekly'}],
  NEWS('Notes from the studio.','One short email a week, with the episode and what we are reading.','Join')]},
 {id:'episodes',name:'Episodes',title:'Episodes · Slow Radio',desc:'Every episode of Slow Radio.',blocks:[
  H('Episodes','Every episode.','Newest first. Listen here or wherever you get podcasts.'),
  ['blog',{kicker:'2027',heading:'This year.',button:'Subscribe',posts:'Episode 112 | 4 March | The potter who fires only once a year | shelf/amber.webp\nEpisode 111 | 25 February | Why a printer kept her father’s press | shelf/threads.webp\nEpisode 110 | 18 February | Baking for a village of 400 | shelf/smoke.webp\nEpisode 109 | 11 February | Fixing furniture for a living | shelf/sand.webp\nEpisode 108 | 4 February | The last hand-tuned piano in Leeds | shelf/sumi.webp\nEpisode 107 | 28 January | A year of mending everything | shelf/embroidery.webp'}],
  ['integrations',{kicker:'Listen',heading:'Wherever you listen.',intro:'Subscribe and never miss an episode.',tools:'Apple Podcasts | Follow and rate us\nSpotify | Listen on your commute\nOvercast | For the long walk\nRSS | Use any player'}]]},
 {id:'about',name:'About',title:'About · Slow Radio',desc:'About the host and the show.',blocks:[
  H('About','Hello, I’m Mira.','I make a podcast about people who take their time.'),
  ['rich-text',{kicker:'The show',heading:'Why slow radio?',paras:'I started Slow Radio in 2021 in a cupboard, with a borrowed microphone and a list of makers I admired.\nEvery week I visit one person where they work and ask how they got good at something. We take as long as it takes.\nThe show is independent, funded by listeners and a small number of sponsors we actually use.'}],
  ['team',{kicker:'The team',heading:'Who makes the show.',intro:'Three people and a very patient dog.',people:'Mira Castellanos | Host and producer | Records every conversation in person.\nTheo Grant | Editor | Cuts the silence, but never the pauses.\nNadia Rao | Sound and music | Writes the theme tune on a toy piano.'}]]},
 {id:'sponsor',name:'Sponsor',title:'Sponsor · Slow Radio',desc:'Work with Slow Radio.',blocks:[
  H('Sponsor','Reach people who listen carefully.','A small, engaged audience that buys from makers.'),
  ['pricing-tiers',{kicker:'Sponsorship',heading:'Three ways to work together.',intro:'We only work with products we would use.',plans:'Mention | £400 | per episode | A host-read mention of 30 seconds. | Host-read; Show notes link | Ask about Mention\nSeries | £1,500 | four episodes | A sponsored month with a longer read. | Four episodes; Newsletter feature | Ask about Series\nPartner | £4,000 | quarter | A season of episodes and live events. | Everything above; Live event slot | Ask about Partner'}],
  ['contact-form',{kicker:'Get in touch',heading:'Tell us about your product.',intro:'We reply to every message within a week.',button:'Send',thanks:'Thank you. We will reply within a week.'}]]}]});

/* documentation and help centre */
add({id:'docs',ctaLine:'Draw your first chart in five minutes.',name:'Documentation',desc:'Getting started, guides, reference and a support page.',brand:'Plume Docs',style:'at:S12-light',cta:['Get started','start'],siteDesc:'Documentation for Plume, a small open-source library for drawing charts in the browser.',
 footer:F('© 2027 Plume. MIT licensed.','Charts that load in a blink.','Docs','Home\nGet started\nGuides\nReference\nSupport','Community','GitHub\nDiscord\nMastodon','Project','Changelog\nRoadmap\nLicence'),
 pages:[
 {id:'home',name:'Home',title:'Plume · Documentation',desc:'Everything you need to draw fast, accessible charts with Plume.',blocks:[
  ['hero-center',{badge:'v2.4',news:'Faster rendering, smaller bundles',heading:'Charts that load in a blink.',intro:'Plume is a 6 KB library for drawing accessible charts in the browser. These docs take you from install to production.',b1:'Get started',b2:'Reference',proof:'Used by 4,000 projects'},{1:'page:start',2:'page:reference'}],
  ['feature-grid',{kicker:'Why Plume',heading:'Small, fast, accessible.',intro:'Built for people who care about the details.',items:'bolt | Fast | Draws 10,000 points in under 16 ms on a mid-range phone.\nshield | Accessible | Keyboard navigation, screen reader summaries and colour-safe palettes by default.\nspark | Tiny | 6 KB gzipped, no dependencies, tree-shakeable.\ncode | Friendly | A small API with TypeScript types and plenty of examples.'}],
  ['tabs',{kicker:'Quick look',heading:'Three lines to a chart.',tabs:'Install | npm install plume | Add Plume with your package manager, or load it from a CDN. | shelf/threads.webp\nDraw | plume.line(el, data) | Pass an element and an array of numbers or dates. | shelf/nebula.webp\nStyle | plume.theme(\'calm\') | Pick a theme or set your own colours and fonts. | shelf/sand.webp'}],
  ['integrations',{kicker:'Works with',heading:'Fits your stack.',intro:'Official adapters for popular frameworks.',tools:'React | A hook and a component\nVue | A composable\nSvelte | An action\nPlain HTML | One script tag'}],
  CTA('Draw your first chart in five minutes.','Get started','page:start')]},
 {id:'start',name:'Get started',title:'Get started · Plume',desc:'Install Plume and draw your first chart.',blocks:[
  H('Get started','Your first chart in five minutes.','Install, draw, style.'),
  ['steps',{kicker:'Quick start',heading:'Three steps.',steps:'Install | Run npm install plume, or add the script tag from the CDN.\nDraw | Pass an element and your data to plume.line().\nStyle | Pick a theme and tweak colours, fonts and axes.'}],
  ['rich-text',{kicker:'Requirements',heading:'What you need.',paras:'Plume runs in any modern browser: Chrome, Edge, Firefox and Safari from the last two years.\nIt has no dependencies, and works with or without a bundler.\nTypeScript types are included; no extra packages are needed.'}],
  ['sec-faq',{kicker:'Common questions',heading:'Stuck?',intro:'The five questions people ask first.',button:'Ask on Discord',qa:'Can I use it with React? | Yes. Install plume-react for a hook and a component.\nDoes it work server side? | Plume renders SVG, so it works with server rendering.\nHow do I make it accessible? | Pass a summary and Plume handles keyboard and screen readers.\nHow big is it? | 6 KB gzipped, tree-shakeable.'}]]},
 {id:'guides',name:'Guides',title:'Guides · Plume',desc:'Task-based guides.',blocks:[
  H('Guides','Guides for common jobs.','Short, task-based walkthroughs.'),
  ['feature-grid',{kicker:'Browse',heading:'Pick a guide.',intro:'Each takes about ten minutes.',items:'chart | Line and area charts | Draw trends, set axes and format dates.\nusers | Bar and column charts | Compare categories, stack and group.\nshield | Accessibility | Summaries, keyboard control and colour-safe palettes.\ncode | Theming | Use CSS variables to match your brand.\nbolt | Performance | Draw tens of thousands of points smoothly.\nspark | Animation | Respect reduced motion and animate on scroll.'}]]},
 {id:'reference',name:'Reference',title:'Reference · Plume',desc:'The Plume API.',blocks:[
  H('Reference','API reference.','Every function, option and type.'),
  ['compare',{kicker:'Chart types',heading:'What each one supports.',them:'Area',rows:'Line | yes | yes\nStacked | yes | yes\nDates on the axis | yes | yes\nAnimation | yes | no\nTooltips | yes | yes'}],
  ['rich-text',{kicker:'API',heading:'plume.line(element, data, options)',paras:'element: an HTML element or a CSS selector. Plume sizes the chart to fit.\ndata: an array of numbers, or of { x, y } objects. Dates are accepted as strings or Date objects.\noptions: theme, axes, animation and an accessible summary. Every option has a sensible default.'}]]},
 {id:'support',name:'Support',title:'Support · Plume',desc:'Get help and report issues.',blocks:[
  H('Support','Need a hand?','The community answers most questions within an hour.'),
  ['contact-cards',{kicker:'Ways to get help',heading:'Pick the quickest.',ways:'chat | Discord | Ask in the community, usually answered within the hour. | discord.gg/plume\ncode | GitHub issues | Report a bug or request a feature. | github.com/plume/plume\nmail | Email | For security reports and anything private. | support@plume.example'}],
  ['contact-form',{kicker:'Write to us',heading:'Send a message.',intro:'Include your version and a small example.',button:'Send',thanks:'Thank you. We will reply by email.'}]]}]});

/* conference */
add({id:'conference',ctaLine:'Join 600 product people in Glasgow.',name:'Conference',desc:'Agenda, speakers, venue, sponsors and tickets.',brand:'Northlight Summit',style:'at:S07-light',cta:['Get tickets','tickets'],siteDesc:'Northlight Summit is a two-day conference for product and design leaders in Glasgow, 7 and 8 November 2027.',
 footer:F('© 2027 Northlight Summit','Two days for people who build products.','Summit','Home\nAgenda\nSpeakers\nVenue\nTickets','Follow','LinkedIn\nBluesky\nNewsletter','Contact','hello@northlight.example\nPress and sponsors'),
 pages:[
 {id:'home',name:'Home',title:'Northlight Summit · Glasgow, 7 and 8 November 2027',desc:'Two days of talks and workshops for product and design leaders.',blocks:[
  ['hero-film',{film:'light-mesh',kicker:'7 and 8 November 2027 · Glasgow',heading:'Two days for people who build products.',intro:'Talks, workshops and honest conversations with 600 product and design leaders.',b1:'Get tickets',b2:'See the agenda'},{0:'page:tickets',1:'page:agenda'}],
  ['countdown',{kicker:'Early bird ends soon',heading:'Doors open in',intro:'Early-bird tickets are £295 until the countdown ends.',date:'2027-11-07',button:'Get tickets'},{0:'page:tickets'}],
  ['stats',{label:'Last year',stats:'600 | attendees\n32 | speakers\n4 | workshop tracks\n96% | would come back'}],
  ['team',{kicker:'Speakers',heading:'Hear from people who ship.',intro:'A few of this year’s speakers.',people:'Amara Obi | VP Product, Tidewater | Rebuilding a bank’s app around goals.\nJonas Weber | Design lead, Halden | Designing healthcare people trust.\nPriya Menon | Founder, Fieldwork | Research that changes roadmaps.\nColm Doherty | CTO, Loom & Co | Small teams, long-term code.'}],
  ['logo-grid',{kicker:'Supported by',logos:'Tidewater\nHalden\nFieldwork\nLoom & Co\nGrange\nNorth Sea Labs'}],
  CTA('Join 600 product people in Glasgow.','Get tickets','page:tickets')]},
 {id:'agenda',name:'Agenda',title:'Agenda · Northlight Summit',desc:'Two days of talks and workshops.',blocks:[
  H('Agenda','Two days, four tracks.','Talks in the morning, workshops in the afternoon.'),
  ['schedule',{kicker:'Day one · Sunday 7 November',heading:'Strategy and craft.',rows:'09:00 | Doors and coffee | Everyone | Foyer\n10:00 | Opening keynote | Amara Obi | Main hall\n11:30 | Research that changes roadmaps | Priya Menon | Hall B\n14:00 | Workshop: product strategy | Jonas Weber | Studio 1\n16:00 | Panel: shipping with small teams | Four speakers | Main hall'}],
  ['schedule',{kicker:'Day two · Monday 8 November',heading:'Teams and leadership.',rows:'09:30 | Coffee | Everyone | Foyer\n10:00 | Small teams, long-term code | Colm Doherty | Main hall\n11:30 | Designing for trust | Jonas Weber | Hall B\n14:00 | Workshop: your first 90 days | Amara Obi | Studio 1\n16:30 | Closing and drinks | Everyone | Foyer'}]]},
 {id:'speakers',name:'Speakers',title:'Speakers · Northlight Summit',desc:'The speakers and what they will cover.',blocks:[
  H('Speakers','Thirty-two speakers.','Practitioners, not professional speakers.'),
  ['team',{kicker:'Headliners',heading:'Meet the speakers.',intro:'Every talk is practical and ends with questions.',people:'Amara Obi | VP Product, Tidewater | Rebuilding a bank’s app around goals.\nJonas Weber | Design lead, Halden | Designing healthcare people trust.\nPriya Menon | Founder, Fieldwork | Research that changes roadmaps.\nColm Doherty | CTO, Loom & Co | Small teams, long-term code.\nSofia Rossi | Head of design, Grange | Systems that survive growth.\nKwame Mensah | Product director, North Sea Labs | Saying no, kindly.'}]]},
 {id:'venue',name:'Venue',title:'Venue · Northlight Summit',desc:'Where it is and how to get there.',blocks:[
  H('Venue','The Engine Shed, Glasgow.','Ten minutes from Central Station.'),
  ['map-embed',{kicker:'Where',heading:'In the heart of Glasgow.',address:'The Engine Shed, 40 Clyde Street, Glasgow G1 4LH',hours:'Day one | Doors 9am\nDay two | Doors 9:30am',button:'Get directions',maplink:'https://www.openstreetmap.org/search?query=Clyde%20Street%20Glasgow'}],
  ['sec-faq',{kicker:'Practical',heading:'Getting there.',intro:'Everything you need before you travel.',button:'Email us',qa:'Where should I stay? | We hold a block at two hotels within five minutes’ walk.\nIs the venue accessible? | Yes, step-free throughout, with a quiet room.\nWill there be food? | Lunch and coffee are included; all dietary needs are covered.'}]]},
 {id:'tickets',name:'Tickets',title:'Tickets · Northlight Summit',desc:'Early-bird and standard tickets.',blocks:[
  H('Tickets','Get your ticket.','Early-bird prices until the countdown ends.'),
  ['pricing-tiers',{kicker:'Tickets',heading:'Pick yours.',intro:'All tickets include lunch and the closing drinks.',plans:'Day pass | £195 | one day | Pick day one or day two. | One day; Lunch; Drinks | Buy a day pass\nFull summit | £295 | two days | Everything, both days. | Both days; Workshops; Lunch; Drinks | Buy full summit\nTeam of 5 | £1,100 | five tickets | Bring your team and save. | 5 full tickets; Team workshop | Buy for a team'}],
  ['sec-faq',{kicker:'Questions',heading:'Before you buy.',intro:'Refunds, transfers and invoices.',button:'Ask us',qa:'Can I get a refund? | Yes, up to 30 days before the event.\nCan I transfer my ticket? | Yes; email us the new name.\nDo you offer invoices? | Yes, for any ticket, at checkout.'}]]}]});

/* ---------- landing pages (one page each) ---------- */
const LF=(brand,line)=>F('© 2027 '+brand,line,'Links','Privacy\nTerms','Contact','hello@example.com','','');
const L=(o,blocks)=>add({cat:'landing',cta:['Join','home'],header:null,pages:[{id:'home',name:'Home',title:o.title||o.brand,desc:o.siteDesc,blocks}],footer:LF(o.brand,o.line||''),...o});

L({id:'lp-waitlist',name:'Landing: waitlist',desc:'One page to collect sign-ups before you launch.',brand:'Orbit',style:'signal',siteDesc:'Orbit is a calendar that plans your week around the work that matters. Join the waitlist.',line:'A calmer calendar.'},[
 ['hero-center',{badge:'Early access',news:'Join 4,200 people on the waitlist',heading:'A calendar that plans around what matters.',intro:'Orbit blocks time for your most important work first, then fits meetings around it. Launching this autumn.',b1:'Join the waitlist',b2:'How it works',proof:'4,200 people are waiting'}],
 ['feature-grid',{kicker:'How it works',heading:'Plan the week in a minute.',intro:'Three ideas, no new habits.',items:'spark | Protects focus | Tell Orbit what matters; it holds the time.\nusers | Fits meetings | Proposes slots that respect everyone’s focus time.\nchart | Shows the week | A calm view of where your time went.'}],
 ['quote',{quote:'I joined the beta for a week and have not opened my old calendar since.',name:'Jamie Cole',role:'Product lead, beta tester',initials:'JC'}],
 NEWS('Be first in line.','Early members get three months free and a say in what we build.','Join the waitlist')]);

L({id:'lp-launch',name:'Landing: product launch',desc:'Announce a product with a film, features and pricing.',brand:'Signal',style:'noir',siteDesc:'Signal turns customer calls into a roadmap. Start free.',line:'Find the signal in every call.'},[
 ['announce',{text:'Version 3 is out: themes that grow on their own.',link:'Read the notes'}],
 ['hero-film',{film:'light-threads',kicker:'Now available',heading:'Find the signal in every call.',intro:'Signal listens to customer calls, pulls out what people asked for and threads it into your roadmap.',b1:'Start free',b2:'Watch the demo'}],
 ['logo-grid',{kicker:'Trusted by product teams',logos:'Kettle & Co\nGrain Lab\nOlive Row\nEmber\nNorthfield\nBrine Bros'}],
 ['feature-grid',{kicker:'Product',heading:'Every conversation, untangled.',intro:'Transcripts, themes and quotes in one place.',items:'chat | Every call, transcribed | Zoom, Meet and the phone arrive as searchable text.\nspark | Themes that grow | Requests branch into themes as calls come in.\nusers | Quotes with context | Every quote links to the moment it was said.'}],
 ['pricing-tiers',{kicker:'Pricing',heading:'Start small. Listen more.',intro:'Every plan includes transcripts and quotes.',plans:'Starter | £0 | forever | For trying Signal on a few calls. | 10 calls a month; Transcripts; Quotes | Start free\nTeam | £29 | per month | For product teams. | Unlimited calls; Themes; Weekly digest | Choose Team\nEnterprise | Custom | annual | For large organisations. | SSO; Data residency; Priority support | Talk to us'}],
 CTA('Hear it before it’s loud.','Start free','#')]);

L({id:'lp-app',name:'Landing: app download',desc:'A phone-first page with store buttons and reasons to download.',brand:'Ledger',style:'ds:D46',siteDesc:'Ledger is a calm personal finance app. Download it free on iPhone and Android.',line:'Calm personal finance.'},[
 ['hero-image',{kicker:'Free on iPhone and Android',heading:'Money, without the knot in your stomach.',intro:'Ledger sorts every payment, shows what is safe to spend and nudges you before bills land.',b1:'Get the app',b2:'See how it works',img:'shelf/bloom.webp',alt:'Soft colour blooming outwards, calm and unhurried'}],
 ['stats',{label:'In numbers',stats:'£356 | saved in three months, on average\n22,000 | people budgeting with Ledger\n0 | adverts, ever\n4.8 | average rating'}],
 ['feature-grid',{kicker:'Features',heading:'The quiet details.',intro:'Built to be opened for ten seconds, not ten minutes.',items:'chart | Safe to spend | One number for the rest of the month.\nbolt | Bill nudges | A gentle note before money leaves.\nusers | Shared budgets | One view for two people.\nlock | Bank-grade security | Read-only access, nothing stored on our side.'}],
 ['app-download',{film:'pigment-bloom',kicker:'On your phone',heading:'Take it with you.',intro:'Free on iPhone and Android.'}],
 ['sec-faq',{kicker:'Questions',heading:'Before you download.',intro:'Short answers.',button:'Ask us',qa:'Is my data safe? | Yes. Ledger has read-only access to your accounts.\nIs it free? | Free to start; Plus is £3 a month.\nWhich banks work? | Over 2,000 across the UK and Europe.'}]]);

L({id:'lp-webinar',name:'Landing: webinar',desc:'Register for a live session with a countdown and agenda.',brand:'Fieldwork',style:'studio',siteDesc:'A free 45-minute webinar on turning customer research into decisions. Thursday 12 June.',line:'Research that changes decisions.'},[
 ['hero-kinetic',{kicker:'Free webinar · Thursday 12 June, 4pm UK',lead:'Turn research into',words:'decisions\nroadmaps\nbuy-in\naction',intro:'Forty-five minutes with Priya Menon on making customer research impossible to ignore.',b1:'Save my seat',b2:'See the agenda'}],
 ['countdown',{kicker:'Starts in',heading:'Live, with questions.',intro:'Recording sent to everyone who registers.',date:'2027-06-12',button:'Save my seat'}],
 ['schedule',{kicker:'Agenda',heading:'What we will cover.',rows:'0:00 | Why research gets ignored | Priya | Live\n0:10 | Three habits of research that lands | Priya | Live\n0:30 | Your research, reviewed | Audience | Live\n0:40 | Questions | Everyone | Live'}],
 ['team',{kicker:'Your host',heading:'Priya Menon.',intro:'Founder of Fieldwork and a researcher for fifteen years.',people:'Priya Menon | Founder, Fieldwork | Has run 900 customer interviews and still takes notes by hand.'}],
 ['contact-form',{kicker:'Register',heading:'Save your seat.',intro:'We will email the link and the recording.',button:'Register',thanks:'You are in. Check your inbox for the link.'}]]);

L({id:'lp-bio',name:'Landing: link in bio',desc:'A narrow page of links for social profiles.',brand:'Mira Castellanos',style:'at:S04-light',siteDesc:'Podcast host and maker. Find my latest episode, newsletter and shop.',line:'Slow Radio host.'},[
 ['page-head',{kicker:'Slow Radio',heading:'Hi, I am Mira.',intro:'I host a weekly podcast about people who take their time. Start with any of these.'}],
 ['contact-cards',{kicker:'Start here',heading:'My links.',ways:'chat | Latest episode | The potter who fires only once a year. | Listen now\nmail | Newsletter | One short note every week. | Subscribe\nheart | Support the show | Help keep it independent. | Become a supporter\ncode | The shop | Prints, notebooks and the theme tune on vinyl. | Visit the shop'}],
 ['quote',{quote:'The calmest hour of my week.',name:'A listener',role:'Apple Podcasts review',initials:'L'}]]);

L({id:'lp-soon',name:'Landing: coming soon',desc:'A single hero and an email box while you build.',brand:'Harbor',style:'kit:nordic',siteDesc:'Harbor is a new studio for slow furniture, launching this spring.',line:'Launching this spring.'},[
 ['hero-center',{badge:'Coming spring 2027',news:'Something slow is on its way',heading:'Furniture made to be repaired.',intro:'Harbor is a new workshop making simple, repairable furniture from local timber. Leave your email and we will tell you first.',b1:'Tell me first',b2:'Why Harbor?',proof:'Made in Aberdeen'}],
 ['countdown',{kicker:'Opening',heading:'Not long now.',intro:'Our first collection is nearly finished.',date:'2027-04-01',button:'Tell me first'}],
 NEWS('Be the first to know.','One email when the workshop opens, and nothing else.','Notify me')]);
})();
