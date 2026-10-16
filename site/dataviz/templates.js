'use strict';
/* starter templates for the flowchart studio: real processes, each paired with the layout that reads best */
window.FlowTemplates=[
 {id:'t-content',cat:'Content',name:'Content production pipeline',type:'stages',title:'Content production pipeline',subtitle:'Idea to published post, with one review gate',src:`flowchart TD
  subgraph plan [Plan]
    idea([Idea backlog])
    pick{Worth making?}
    brief[Write brief | angle, audience, format]
  end
  subgraph make [Make]
    script[Script or outline]
    shoot[Shoot or design]
    edit[Edit | cut, captions, music]
  end
  subgraph review [Review]
    check{Approved?}
    fix[Revisions]
  end
  subgraph ship [Publish]
    schedule[Schedule | per platform]
    post([Post])
  end
  subgraph learn [Learn]
    stats[Check results | 48 h and 7 days]
    notes[(Learnings log)]
  end
  idea --> pick
  pick -->|Yes| brief
  pick -->|Not now| idea
  brief --> script --> shoot --> edit --> check
  check -->|Changes| fix --> check
  check -->|Yes| schedule --> post --> stats --> notes
  notes -.->|feeds| idea`},
 {id:'t-onboard',cat:'Clients',name:'Client onboarding',type:'stepper',title:'Client onboarding',subtitle:'From signed proposal to first delivery',src:`flowchart TD
  subgraph sign [Sign]
    won([Proposal accepted])
    contract[Send contract + invoice]
    paid{Deposit paid?}
    chase[Friendly reminder | after 3 days]
  end
  subgraph setup [Set up]
    folder[Create shared folder + channel]
    intake[Intake form | brand, goals, contacts]
    kickoff[Kick-off call]
  end
  subgraph start [Start work]
    plan[Project plan + dates]
    first[First delivery]
    feedback{Happy with direction?}
    adjust[Adjust brief]
  end
  done([Into regular delivery])
  won --> contract --> paid
  paid -->|No| chase --> paid
  paid -->|Yes| folder --> intake --> kickoff --> plan --> first --> feedback
  feedback -->|Not yet| adjust --> first
  feedback -->|Yes| done`},
 {id:'t-approval',cat:'Creative',name:'Creative approval',type:'flow',title:'Creative approval',subtitle:'Two rounds, then escalate',src:`flowchart TD
  draft([Draft ready]) --> internal{Internal review OK?}
  internal -->|No| revise[Revise]
  revise --> internal
  internal -->|Yes| client{Client approves?}
  client -->|Changes| round{Round 3 or more?}
  round -->|No| revise
  round -->|Yes| call[Call to agree scope]:::accent
  call --> revise
  client -->|Yes| final[Export finals]
  final --> archive[(Archive + credits)]
  archive --> done([Delivered])`},
 {id:'t-hiring',cat:'Team',name:'Hiring pipeline',type:'swimlanes',title:'Hiring pipeline',subtitle:'Who does what at each stage',src:`flowchart LR
  subgraph hm [Hiring manager]
    need([Role approved])
    spec[Write role spec]
    interview[Interview]
    decide{Hire?}
  end
  subgraph tal [Recruiter]
    post[Post role]
    screen[Screen CVs]
    phone[Phone screen]
    offer[Make offer]
  end
  subgraph cand [Candidate]
    apply[Applies]
    task[Take-home task]
    accept{Accepts?}
    start([Starts])
  end
  need --> spec --> post --> apply --> screen --> phone --> task --> interview --> decide
  decide -->|Yes| offer --> accept
  decide -->|No| screen
  accept -->|Yes| start
  accept -->|No| screen`},
 {id:'t-launch',cat:'Product',name:'Launch checklist',type:'capability',title:'Launch readiness',subtitle:'Green = done, red = still open',src:`flowchart TD
  subgraph product [Product]
    feat[Core features]:::have
    qa[QA pass]:::have
    perf[Performance check]:::dont
    a11y[Accessibility check]:::dont
  end
  subgraph content [Content]
    site[Landing page]:::have
    docs[Help docs]:::partial
    video[Launch video]:::dont
  end
  subgraph market [Marketing]
    email[Email to list]:::have
    social[Social posts]:::partial
    press[Press kit]:::dont
  end
  subgraph ops [Operations]
    pricing[Pricing live]:::have
    support[Support inbox + macros]:::dont
    analytics[Analytics events]:::have
  end
  feat --> qa --> perf --> a11y
  site --> docs --> video
  email --> social --> press
  pricing --> support --> analytics`},
 {id:'t-support',cat:'Support',name:'Support triage',type:'tree',title:'Support triage',subtitle:'Route every ticket in under a minute',src:`flowchart TD
  ticket([New ticket]) --> urgent{Service down?}
  urgent -->|Yes| page[Page on-call]:::accent
  urgent -->|No| billing{About billing?}
  billing -->|Yes| refund{Refund under 50?}
  refund -->|Yes| auto[Refund + close]
  refund -->|No| finance[Send to finance]
  billing -->|No| bug{Looks like a bug?}
  bug -->|Yes| repro[Reproduce + log issue]
  bug -->|No| how{How-to question?}
  how -->|Yes| article[Reply with help article]
  how -->|No| human[Personal reply]`},
 {id:'t-sprint',cat:'Product',name:'Two-week sprint',type:'cycle',title:'Two-week sprint',subtitle:'Plan, build, show, learn, repeat',src:`flowchart TD
  subgraph planning [Plan]
    backlog[Groom backlog]
    commit[Commit to sprint goal]
  end
  subgraph build [Build]
    dev[Design + build]
    standup[Daily stand-up]
  end
  subgraph test [Test]
    review[Code + design review]
    qa[QA]
  end
  subgraph demo [Show]
    showcase[Sprint demo]
  end
  subgraph retro [Learn]
    retrospective[Retro | keep, drop, try]
    actions[(Action items)]
  end
  backlog --> commit --> dev --> standup --> review --> qa --> showcase --> retrospective --> actions
  actions -.->|next sprint| backlog`},
 {id:'t-orders',cat:'Commerce',name:'Order fulfilment',type:'swimlanes',title:'Order fulfilment',subtitle:'Shop, warehouse and courier',src:`flowchart LR
  subgraph shop [Shop]
    order([Order placed])
    pay{Payment OK?}
    cancel[Cancel + notify]
    confirm[Confirmation email]
  end
  subgraph wh [Warehouse]
    pick[Pick items]
    stock{All in stock?}
    split[Split shipment]
    pack[Pack + label]
  end
  subgraph courier [Courier]
    collect[Collect]
    deliver([Delivered])
  end
  order --> pay
  pay -->|No| cancel
  pay -->|Yes| confirm --> pick --> stock
  stock -->|No| split --> pack
  stock -->|Yes| pack
  pack --> collect --> deliver`},
 {id:'t-campaign',cat:'Marketing',name:'Campaign plan',type:'stages',title:'Campaign plan',subtitle:'Six weeks from brief to report',src:`flowchart TD
  subgraph w1 [Week 1 · Brief]
    goal[Goal + KPI]
    audience[Audience]
    message[Key message]
  end
  subgraph w2 [Weeks 2–3 · Create]
    concepts[Three concepts]
    choose{Pick one}
    assets[Produce assets]
  end
  subgraph w4 [Week 4 · Launch]
    paid[Paid social]
    organic[Organic posts]
    email[Email]
  end
  subgraph w5 [Weeks 5–6 · Optimise]
    test[A/B test creative]
    shift[Shift budget to winners]
  end
  subgraph report [Report]
    results[Results vs KPI]
  end
  goal --> audience --> message --> concepts --> choose --> assets
  assets --> paid --> organic --> email
  email --> test --> shift --> results`},
 {id:'t-newsletter',cat:'Content',name:'Weekly newsletter',type:'stepper',title:'Weekly newsletter',subtitle:'Monday to Thursday send',src:`flowchart TD
  subgraph mon [Monday · Collect]
    links[Save links all week]
    pick[Pick 5 stories]
  end
  subgraph tue [Tuesday · Write]
    draft[Draft intro + blurbs]
    subject[Three subject lines]
  end
  subgraph wed [Wednesday · Check]
    proof{Proofread OK?}
    fix[Fix]
    test[Test send]
  end
  subgraph thu [Thursday · Send]
    send([Send 8:00])
    stats[Open + click rates]
  end
  links --> pick --> draft --> subject --> proof
  proof -->|No| fix --> proof
  proof -->|Yes| test --> send --> stats`},
 {id:'t-bug',cat:'Product',name:'Bug lifecycle',type:'flow',title:'Bug lifecycle',subtitle:'Report to release',src:`flowchart TD
  report([Bug reported]) --> repro{Can reproduce?}
  repro -->|No| ask[Ask for steps + screenshots]
  ask --> repro
  repro -->|Yes| sev{Severity}
  sev -->|Critical| hotfix[Hotfix now]:::accent
  sev -->|Normal| backlog[(Backlog)]
  backlog --> fix[Fix + test]
  hotfix --> fix
  fix --> verify{Verified?}
  verify -->|No| fix
  verify -->|Yes| release([Released])`},
 {id:'t-brand',cat:'Creative',name:'Brand identity project',type:'mindmap',title:'Brand identity project',subtitle:'Everything in scope',src:`flowchart TD
  subgraph strategy [Strategy]
    research[Audience research]
    position[Positioning]
    voice[Tone of voice]
  end
  subgraph identity [Identity]
    logo[Logo + marks]
    colour[Colour]
    type[Typography]
    imagery[Imagery style]
  end
  subgraph system [System]
    tokens[Design tokens]
    components[UI components]
    templates[Templates]
  end
  subgraph rollout [Rollout]
    site[Website]
    social[Social kit]
    guide[Brand guidelines]
  end
  research --> position --> voice --> logo --> colour --> type --> imagery --> tokens --> components --> templates --> site --> social --> guide`}
];
