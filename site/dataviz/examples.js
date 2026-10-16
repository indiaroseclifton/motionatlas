'use strict';
/* starter charts for the flowchart studio (Mermaid flowchart syntax) */
window.FlowExamples=[
 {id:'review',name:'Creative review',src:`flowchart TD
  start([Brief received]) --> research[Research references | moodboard, competitors]
  research --> concept{Concept approved?}
  concept -->|Yes| produce[Produce assets]
  concept -->|No| research
  produce --> qa{Passes QA?}
  qa -->|Yes| ship([Publish])
  qa -->|No| produce`},
 {id:'channel',name:'AI cooking channel',title:'Premium AI cooking channel',subtitle:'One connected loop · green = have, red = don’t have',src:`flowchart TD
  subgraph research [0 · Research]
    feeds[Top-views data feeds | no analytics or trend API]:::dont
    lessons[Jean Phil lessons | one iconic repeatable character]:::have
    scan[Research top channels, cuts, formats | web + X search]:::have
  end
  subgraph roster [1–2 · Chef roster]
    identity[Photoreal identity | ref sheets, face lock]:::dont
    chefs[Chef roster | 4 chefs: look, cuisine, voice]:::have
  end
  subgraph recipe [3 · Recipe → episode]
    original[a · Chef's original recipe | LLM via router]:::have
    famous[b · Famous recipe | found by web search]:::have
    rights[Attribution + rights check]:::dont
    assign[Assign chef from roster | manual today]:::dont
    episode[Episode recipe | prompt, shot, style spec]:::dont
    styling[Food styling + plating spec]:::dont
  end
  subgraph make [4 · Make the video]
    shots[Shot list / storyboard]:::dont
    camera[Cinematic camera + lighting]:::dont
    model[Top-tier video model]:::dont
    upscale[Upscaler]:::dont
    grade[Colour grade]:::dont
    voice[Voice · ElevenLabs]:::have
    sound[Sound design + music]:::dont
    render[Render · ffmpeg, MediaOS]:::have
  end
  gate{Human approval?}:::dont
  subgraph publish [5–7 · Package and post]
    thumbs[Thumbnails, titles, captions]:::dont
    reformat[Reformat 9:16 / 16:9]:::dont
    accounts[Choose accounts]:::dont
    schedule[Scheduler]:::dont
    post[Post · YouTube, TikTok, IG]:::dont
  end
  subgraph learn [8–12 · Money and feedback]
    money[Monetisation | YPP, Creator Rewards, brands]:::dont
    replies[Community replies]:::dont
    analytics[Analytics: what lands]:::dont
    feedback[Feedback into next episode]:::dont
  end
  memory[(What-worked memory | per chef, format, cut)]:::dont
  feeds -->|view counts| scan
  lessons --> scan
  scan -->|emulate| chefs
  identity --> chefs
  scan -->|top recipes| famous
  chefs --> original
  famous --> rights
  original --> assign
  rights -->|cleared| assign
  assign --> episode --> styling --> shots --> camera --> model --> upscale --> grade --> sound
  voice --> sound
  sound --> render --> gate
  gate -->|Pass| thumbs
  gate -->|Fail: remake| shots
  thumbs --> reformat --> accounts --> schedule --> post
  post --> money
  post --> replies --> analytics --> feedback
  feedback -->|save| memory
  memory -.->|what worked| episode
  feedback -->|re-research| scan`},
 {id:'signup',name:'Sign-up with checks',src:`flowchart LR
  a([Visitor]) --> b[Enter email]
  b --> c{Valid email?}
  c -->|No| b
  c -->|Yes| d[(Users DB)]
  d --> e{Existing account?}
  e -->|Yes| f[Send sign-in link]
  e -->|No| g[Create account]:::accent
  g --> h[Send welcome email]
  f --> i([Done])
  h --> i`},
 {id:'release',name:'Release pipeline',src:`flowchart TD
  subgraph build [Build]
    pr([Pull request]) --> lint[Lint + typecheck]:::have
    lint --> test[Unit tests]:::have
  end
  subgraph verify [Verify]
    test --> preview[Preview deploy]:::have
    preview --> e2e[End-to-end tests]:::partial
    e2e --> review{Review approved?}
  end
  review -->|Changes requested| pr
  review -->|Approved| merge[Merge to main]
  merge ==> prod([Production])
  prod -.-> monitor[[Monitoring]]:::dont`}
];
