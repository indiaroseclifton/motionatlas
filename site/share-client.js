'use strict';
/* Talks to /api/share and uploads files. In production files go straight to Vercel Blob with a
   short-lived token from /api/upload; the local test server takes them at /api/upload-local. */
window.ShareClient=(()=>{
 const MAX=100*1024*1024;
 const TYPES=['image/jpeg','image/png','image/webp','image/gif','image/avif','image/svg+xml','video/mp4','video/webm','video/quicktime','application/pdf','font/woff2','font/ttf','font/otf','application/zip','text/plain'];
 let statusP=null;
 async function call(method,qs,body,key){const r=await fetch('/api/share'+(qs?'?'+qs:''),{method,headers:{'Content-Type':'application/json',...(key?{'x-edit-key':key}:{})},body:body?JSON.stringify(body):undefined});let j={};try{j=await r.json()}catch(e){}if(!r.ok)throw Object.assign(new Error(j.error||'The share service did not answer. Try again in a moment.'),{status:r.status});return j}
 function status(){return statusP||(statusP=fetch('/api/share?status').then(r=>r.ok?r.json():{enabled:false}).catch(()=>({enabled:false})))}
 const projectData=p=>({name:p.name,brief:p.brief,platform:p.platform,stage:p.stage,decisions:p.decisions,entries:p.entries,icons:p.icons,notes:p.notes});
 const safe=n=>String(n||'file').normalize('NFKD').replace(/[^\w.-]+/g,'-').replace(/^-+|-+$/g,'').slice(-80)||'file';
 function check(file){if(file.size>MAX)return `${file.name} is larger than 100 MB.`;if(file.type&&!TYPES.includes(file.type))return `${file.name} isn't a supported file type (images, video, PDF, fonts, zip or text).`;return ''}
 let blobLib=null;
 function loadBlob(){return blobLib||(blobLib=new Promise((res,rej)=>{const s=document.createElement('script');s.src='vendor/blob-client.js';s.onload=()=>res(window.BlobClient);s.onerror=()=>rej(new Error('Could not load the uploader.'));document.head.append(s)}))}
 async function uploadFile(id,key,file,onProgress=()=>{}){const bad=check(file);if(bad)throw new Error(bad);const st=await status();const type=file.type||'text/plain';
  if(st.mode==='local'){const r=await fetch(`/api/upload-local?id=${encodeURIComponent(id)}&name=${encodeURIComponent(safe(file.name))}`,{method:'PUT',headers:{'x-edit-key':key},body:file});if(!r.ok)throw new Error('Upload failed');const j=await r.json();onProgress(100);return {url:j.url,pathname:j.pathname,name:file.name,type,size:file.size,added:Date.now()}}
  const B=await loadBlob();const r=await B.upload(`shares/${id}/files/${safe(file.name)}`,file,{access:'public',handleUploadUrl:'/api/upload',clientPayload:JSON.stringify({id,key}),multipart:file.size>8*1024*1024,contentType:type,onUploadProgress:e=>onProgress(Math.round(e.percentage))});
  return {url:r.url,pathname:r.pathname,name:file.name,type,size:file.size,added:Date.now()}}
 const links=(id,key)=>{const base=new URL('shared',location.href.replace(/[#?].*$/,'').replace(/[^/]*$/,'')).href;return {view:`${base}#v/${id}`,edit:key?`${base}#e/${id}/${key}`:''}};
 return {status,check,uploadFile,links,projectData,MAX,
  create:p=>call('POST','',{project:projectData(p)}),
  get:id=>call('GET','id='+encodeURIComponent(id)),
  update:(id,key,body)=>call('PUT','id='+encodeURIComponent(id),body,key),
  stop:(id,key)=>call('DELETE','id='+encodeURIComponent(id),null,key)};
})();
