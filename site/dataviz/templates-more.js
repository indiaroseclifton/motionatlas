'use strict';
/* More starter processes for the flowchart studio, added to window.FlowTemplates (dataviz/templates.js).
   Each is a real, complete process with its decisions, loops and owners, written so it can be used as is. */
(window.FlowTemplates=window.FlowTemplates||[]).push(
 {id:'t-incident',cat:'Engineering',name:'Incident response',type:'flow',title:'Incident response',subtitle:'From alert to post-incident review',src:`flowchart TD
  alert([Alert fires or customer reports]) --> ack[On-call acknowledges | within 5 minutes]
  ack --> real{Real incident?}
  real -->|No| tune[Tune the alert]:::none.doc
  tune --> close([Closed])
  real -->|Yes| sev{Severity?}
  sev -->|SEV1 or SEV2| ic[Name an incident commander]:::accent
  sev -->|SEV3| ticket[Fix in working hours]
  ic --> room[Open channel + status page]:::none.system
  room --> mitigate[Mitigate | roll back, fail over, scale]
  mitigate --> ok{Customers back to normal?}
  ok -->|No| escalate[Pull in more help]:::none.person
  escalate --> mitigate
  ok -->|Yes| monitor[Watch for 30 minutes]:::none.delay
  monitor --> resolve[Resolve + update status page]
  ticket --> resolve
  resolve --> review[Blameless review | within 5 days]:::none.doc
  review --> actions[(Action items)]
  actions --> done([Done])`},
 {id:'t-refund',cat:'Commerce',name:'Refund handling',type:'flow',title:'Refund handling',subtitle:'One rule set, so every customer gets the same answer',src:`flowchart TD
  req([Refund request]) --> find[Find the order]
  find --> found{Order found?}
  found -->|No| ask[Ask for order number or email]:::none.manual
  ask --> find
  found -->|Yes| window{Within 30 days?}
  window -->|No| policy[Explain policy, offer store credit]
  window -->|Yes| used{Used or damaged by customer?}
  used -->|Yes| partial[Partial refund | 50%]:::partial
  used -->|No| full[Full refund]:::have
  partial --> pay[Refund to original payment]:::none.system
  full --> pay
  pay --> wait[Bank processing | 3 to 5 days]:::none.delay
  wait --> tell[Email confirmation]:::none.doc
  policy --> tell
  tell --> done([Closed])`},
 {id:'t-purchase',cat:'Finance',name:'Purchase approval',type:'swimlanes',title:'Purchase approval',subtitle:'Who signs off at each amount',src:`flowchart LR
  subgraph req [Requester]
    need([Need something])
    form[Purchase request form]:::none.minput
    order[Place the order]
  end
  subgraph mgr [Manager]
    check{Under £1,000?}
    approve{Approve?}
  end
  subgraph fin [Finance]
    budget{In budget?}
    po[Raise purchase order]:::none.doc
  end
  subgraph cfo [Finance director]
    sign{Sign off?}
  end
  rejected([Declined, with reason])
  need --> form --> approve
  approve -->|No| rejected
  approve -->|Yes| check
  check -->|Yes| budget
  check -->|No| sign
  sign -->|Yes| budget
  sign -->|No| rejected
  budget -->|Yes| po
  budget -->|No| rejected
  po --> order`},
 {id:'t-leads',cat:'Sales',name:'Lead qualification',type:'tree',title:'Lead qualification',subtitle:'Budget, authority, need, timing',src:`flowchart LR
  lead([New lead]) --> fit{Fits our customer profile?}
  fit -->|No| nurture[Newsletter nurture]:::none.system
  fit -->|Yes| need{Clear need?}
  need -->|No| educate[Send a case study]:::none.doc
  need -->|Yes| budget{Budget this year?}
  budget -->|No| later[Follow up next quarter]:::none.delay
  budget -->|Yes| who{Talking to the decision maker?}
  who -->|No| intro[Ask for an introduction]:::none.person
  who -->|Yes| sql([Sales-qualified: book a demo]):::accent`},
 {id:'t-offboard',cat:'Team',name:'Employee offboarding',type:'stages',title:'Employee offboarding',subtitle:'Two weeks from notice to last day, nothing left open',src:`flowchart TD
  subgraph notice [Notice]
    resign([Notice received])
    confirm[Confirm last day in writing]:::none.doc
    tell[Tell the team + clients]
  end
  subgraph handover [Handover]
    list[List open work + owners]
    docs[Write handover notes]:::none.doc
    shadow[Shadow sessions]:::none.person
  end
  subgraph access [Access]
    accounts[Remove app access]:::none.system
    kit[Collect laptop + badge]:::none.manual
    shared[Transfer shared files]
  end
  subgraph close [Close out]
    pay[Final pay + holiday balance]
    exit[Exit interview]
    alumni([Alumni list])
  end
  resign --> confirm --> tell --> list --> docs --> shadow --> accounts --> kit --> shared --> pay --> exit --> alumni`},
 {id:'t-abtest',cat:'Product',name:'A/B test lifecycle',type:'flow',title:'A/B test lifecycle',subtitle:'Decide what would change your mind before you look',src:`flowchart TD
  idea([Idea]) --> hyp[Write the hypothesis | change, metric, expected lift]:::none.doc
  hyp --> size[Work out sample size + run time]
  size --> worth{Can we reach it in 4 weeks?}
  worth -->|No| bigger[Test a bolder change]
  bigger --> hyp
  worth -->|Yes| build[Build both variants]
  build --> qa{Both variants tracked correctly?}
  qa -->|No| build
  qa -->|Yes| run[Run to the planned end]:::none.delay
  run --> read{Clear winner?}
  read -->|B wins| ship[Ship B to everyone]:::have
  read -->|No difference| keep[Keep A, note the learning]
  read -->|A wins| keep
  ship --> log[(Experiment log)]
  keep --> log
  log --> done([Next test])`},
 {id:'t-pipeline',cat:'Engineering',name:'Data pipeline',type:'flow',title:'Nightly data pipeline',subtitle:'Extract, check, load, publish',src:`flowchart LR
  start([02:00 schedule]) --> extract[Extract from sources]:::none.system
  extract --> land[(Raw landing zone)]
  land --> checks{Row counts + schema OK?}
  checks -->|No| quarantine[Quarantine the batch]:::dont
  quarantine --> page[Page the data on-call]:::none.person
  checks -->|Yes| transform[Transform + join]
  transform --> tests{Data tests pass?}
  tests -->|No| quarantine
  tests -->|Yes| load[(Warehouse)]
  load --> refresh[Refresh dashboards]:::none.display
  refresh --> done([Ready by 07:00])`},
 {id:'t-password',cat:'Product',name:'Password reset',type:'flow',title:'Password reset',subtitle:'Safe by default: never say whether an email exists',src:`flowchart TD
  forgot([Forgot password]) --> email[Enter email]:::none.minput
  email --> same[Show the same message either way]
  same --> exists{Account exists?}
  exists -->|No| stop([Nothing sent])
  exists -->|Yes| token[Create one-time link | 30 minutes]
  token --> send[Send reset email]:::none.doc
  send --> click{Link used in time?}
  click -->|No| expired[Link expired, start again]
  expired --> email
  click -->|Yes| newpw[Choose new password]:::none.minput
  newpw --> strong{Strong enough?}
  strong -->|No| newpw
  strong -->|Yes| signout[Sign out other sessions]:::none.system
  signout --> notify[Email: your password changed]:::none.doc
  notify --> done([Signed in])`},
 {id:'t-rma',cat:'Commerce',name:'Returns (RMA)',type:'swimlanes',title:'Returns and RMA',subtitle:'Customer, support and warehouse',src:`flowchart LR
  subgraph cust [Customer]
    ask([Start a return])
    ship[Post the item]:::none.manual
  end
  subgraph sup [Support]
    eligible{Eligible?}
    rma[Issue RMA number + label]:::none.doc
    decline[Explain why not]
  end
  subgraph wh [Warehouse]
    receive[Receive + inspect]
    cond{Resellable?}
    restock[(Back to stock)]
    scrap[Write off]
  end
  subgraph fin [Finance]
    refund([Refund issued])
  end
  ask --> eligible
  eligible -->|No| decline
  eligible -->|Yes| rma --> ship --> receive --> cond
  cond -->|Yes| restock --> refund
  cond -->|No| scrap --> refund`},
 {id:'t-invoice',cat:'Finance',name:'Invoice approval',type:'flow',title:'Invoice approval',subtitle:'Three-way match before anything is paid',src:`flowchart TD
  inbox([Invoice arrives]) --> capture[Capture details | supplier, amount, PO]:::none.minput
  capture --> po{Has a purchase order?}
  po -->|No| owner[Ask the budget owner to approve]:::none.person
  owner --> okd{Approved?}
  okd -->|No| reject([Rejected, supplier told])
  okd -->|Yes| schedule
  po -->|Yes| match{Matches PO and goods received?}
  match -->|No| query[Query the supplier]:::none.doc
  query --> capture
  match -->|Yes| schedule[Schedule payment | next run]:::none.delay
  schedule --> pay[Pay]:::none.system
  pay --> file[(Accounts)]
  file --> done([Paid])`},
 {id:'t-social',cat:'Marketing',name:'Social post scheduling',type:'stepper',title:'Social post scheduling',subtitle:'One post, every channel, one approval',src:`flowchart TD
  brief([Post idea in the calendar]) --> copy[Write the copy | hook, body, call to action]
  copy --> asset[Make the visual | per platform size]
  asset --> review{Brand + legal OK?}
  review -->|Changes| copy
  review -->|Yes| schedule[Schedule in the tool]:::none.system
  schedule --> wait[Goes live at the planned time]:::none.delay
  wait --> engage[Reply to comments | first 2 hours]:::none.person
  engage --> report[Log results after 7 days]:::none.doc
  report --> done([Into the monthly report])`},
 {id:'t-escalation',cat:'Support',name:'Support escalation',type:'swimlanes',title:'Support escalation',subtitle:'Tier 1 to engineering, with clear hand-offs',src:`flowchart LR
  subgraph t1 [Tier 1 support]
    ticket([Ticket opened])
    kb{Answer in help centre?}
    reply[Reply with the article]
  end
  subgraph t2 [Tier 2 specialists]
    investigate[Investigate + reproduce]
    fixable{Fix without code?}
    workaround[Apply fix or workaround]
  end
  subgraph eng [Engineering]
    bug[Log bug with steps]:::none.doc
    patch[Ship the fix]
  end
  subgraph cs [Customer]
    solved([Customer confirms solved])
  end
  ticket --> kb
  kb -->|Yes| reply --> solved
  kb -->|No| investigate --> fixable
  fixable -->|Yes| workaround --> solved
  fixable -->|No| bug --> patch --> solved`}
);
