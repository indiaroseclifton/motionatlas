/* Tiny WebGL runner: one full-screen triangle, uniforms R (size), T (time), M (pointer 0-1) plus whatever set() is given.
   Pauses off screen and in background tabs; reduced motion shows one still frame. */
const NOISE='float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return s;}';
const rgb=x=>[1,3,5].map(i=>parseInt(x.slice(i,i+2),16)/255);
function shader(frag){const c=document.createElement('canvas');c.style.cssText='position:fixed;inset:0;width:100%;height:100%;display:block;z-index:-1';c.setAttribute('aria-hidden','true');document.body.prepend(c);
 const gl=c.getContext('webgl',{antialias:false,alpha:false,powerPreference:'low-power'}),vals={};if(!gl){document.body.style.background='linear-gradient(160deg,#1b1f3a,#0b0d14)';return{set(o){Object.assign(vals,o)}}}
 const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(o));return o};
 const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,'precision highp float;uniform vec2 R;uniform float T;uniform vec2 M;'+NOISE+frag));gl.linkProgram(p);gl.useProgram(p);
 gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const a=gl.getAttribLocation(p,'p');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
 const loc={},U=k=>loc[k]||(loc[k]=gl.getUniformLocation(p,k));let mx=.5,my=.5,t=12,last=0,vis=true;
 addEventListener('pointermove',e=>{mx=e.clientX/innerWidth;my=1-e.clientY/innerHeight});new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(c);
 const fit=()=>{const d=Math.min(devicePixelRatio||1,1.5);c.width=Math.round(innerWidth*d);c.height=Math.round(innerHeight*d);gl.viewport(0,0,c.width,c.height)};addEventListener('resize',fit);fit();
 function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(vis&&!document.hidden){t+=calm?0:dt*(vals._speed==null?1:vals._speed);gl.uniform2f(U('R'),c.width,c.height);gl.uniform1f(U('T'),t);gl.uniform2f(U('M'),mx,my);
  for(const k in vals){if(k[0]==='_')continue;const v=vals[k];Array.isArray(v)?gl.uniform3f(U(k),v[0],v[1],v[2]):gl.uniform1f(U(k),v)}gl.drawArrays(gl.TRIANGLES,0,3)}requestAnimationFrame(frame)}
 requestAnimationFrame(frame);return{set(o){Object.assign(vals,o)}}}
