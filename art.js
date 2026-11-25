/* Qafee art: hand-coded tapered ink strokes (Don't Starve direction, see design/art/art-bible.md) */
(function(){
const NS='http://www.w3.org/2000/svg';
const mk=(t,a={})=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);return e};
const rng=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const C={INK:'#2a2119',DARK:'#1a140f',PARCH:'#e8ddc4',PARCH2:'#d6c6a2',CREAM:'#f3ead5',SKIN:'#efe0c4',RED:'#9a3b2c',GREEN:'#5f6b44',BLUE:'#4a5a6a',MUST:'#b8903e',BROWN:'#6b4a2f',WOOD:'#8a6240',PLUM:'#6e5a72'};
let uid=0;

/* catmull-rom resample */
function cr(pts,closed,step=2.6){if(pts.length<2)return pts.slice();
  const P=closed?[pts[pts.length-1],...pts,pts[0],pts[1]]:[pts[0],...pts,pts[pts.length-1]],out=[];
  for(let i=1;i<P.length-2;i++){const p0=P[i-1],p1=P[i],p2=P[i+1],p3=P[i+2],n=Math.max(2,Math.ceil(Math.hypot(p2[0]-p1[0],p2[1]-p1[1])/step));
    for(let k=0;k<n;k++){const t=k/n,t2=t*t,t3=t2*t,f=j=>.5*(2*p1[j]+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3);out.push([f(0),f(1)])}}
  if(!closed)out.push(pts[pts.length-1]);return out}
const jit=(pts,R,j)=>pts.map(p=>[p[0]+(R()-.5)*2*j,p[1]+(R()-.5)*2*j]);
const D=p=>'M'+p.map(q=>q[0].toFixed(1)+' '+q[1].toFixed(1)).join('L')+'Z';
/* tapered ink stroke as a filled outline */
function strokeD(pts,o,R){const w=o.w??2.4,closed=!!o.closed;let s=cr(jit(pts,R,o.j??.6),closed);
  if(closed)s=s.concat(s.slice(1,Math.max(4,s.length*.1|0)));
  const n=s.length,L=[],Rt=[],ph=R()*6,tip=o.tip??.12;
  for(let i=0;i<n;i++){const a=s[Math.max(0,i-1)],b=s[Math.min(n-1,i+1)];let dx=b[0]-a[0],dy=b[1]-a[1];const l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;
    const t=i/(n-1),tp=closed?Math.min(1,Math.min(t,1-t)*9+.3):Math.pow(Math.sin(Math.PI*t),.5);
    const ww=w*(tip+(1-tip)*tp)*(1+.28*Math.sin(i*.31+ph))/2;
    L.push([s[i][0]-dy*ww,s[i][1]+dx*ww]);Rt.push([s[i][0]+dy*ww,s[i][1]-dx*ww])}
  return D([...L,...Rt.reverse()])}
/* point helpers */
function ell(cx,cy,rx,ry,n=16,f){const p=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2-Math.PI/2,k=f?f(a):1;p.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k])}return p}
function arc(cx,cy,rx,ry,a0,a1,n=10){const p=[];for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;p.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry])}return p}
function line(x1,y1,x2,y2,n=3){const p=[];for(let i=0;i<=n;i++)p.push([x1+(x2-x1)*i/n,y1+(y2-y1)*i/n]);return p}

/* drawing api: art(viewBox, build) -> svg with 2 boil frames */
function art(vb,build,opt={}){const svg=mk('svg',{viewBox:vb,class:'d','aria-hidden':'true'});const base=(opt.seed??Math.random()*1e9)|0;
  const frames=opt.frames??2;
  for(let f=0;f<frames;f++){const R=rng(base+f*7919),root=mk('g',{class:'v v'+f});let tgt=root;const defs=mk('defs');root.append(defs);
    const A={C,R,
      ink:(pts,o={})=>{tgt.append(mk('path',{d:strokeD(pts,o,R),fill:o.c||C.INK}));},
      fill:(pts,c,o={})=>{tgt.append(mk('path',{d:D(cr(jit(pts,R,o.j??.5),true)),fill:c,opacity:o.op??1}))},
      shape:(pts,c,o={})=>{A.fill(pts,c,o);if(o.hatch)A.hatch(pts,o.hatch);A.ink(pts,{closed:true,w:o.w??2.4,c:o.ic})},
      hatch:(pts,o={})=>{const id='q'+(++uid),cp=mk('clipPath',{id});cp.append(mk('path',{d:D(cr(pts,true))}));defs.append(cp);
        const g=mk('g',{'clip-path':`url(#${id})`});const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
        let x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);if(o.side==='r')x0=x0+(x1-x0)*(o.from??.55);if(o.side==='l')x1=x0+(x1-x0)*(o.from??.45);if(o.side==='b')y0=y0+(y1-y0)*(o.from??.55);
        const gap=o.gap??5,ang=(o.a??60)*Math.PI/180,dx=Math.cos(ang),dy=Math.sin(ang),len=Math.hypot(x1-x0,y1-y0)+20;
        const id2='q'+(++uid),cp2=mk('clipPath',{id:id2});cp2.append(mk('path',{d:D([[x0,y0-2],[x1+2,y0-2],[x1+2,y1+2],[x0,y1+2]].map((q,i)=>[q[0]+(i%3?0:(R()-.5)*6),q[1]]))}));defs.append(cp2);
        const g2=mk('g',{'clip-path':`url(#${id2})`});g.append(g2);
        const save=tgt;tgt=g2;for(let s=-len;s<len;s+=gap){const cx=(x0+x1)/2+(-dy)*s,cy=(y0+y1)/2+dx*s;A.ink([[cx-dx*len/2,cy-dy*len/2],[cx+dx*len/2,cy+dy*len/2]],{w:o.w??1,j:.8,c:o.c})}tgt=save;tgt.append(g)},
      dot:(x,y,r,c)=>A.fill(ell(x,y,r,r,8),c||C.INK,{j:.25}),
      sub:(cls,fn)=>{const g=mk('g',{class:cls}),save=tgt;tgt=g;fn();tgt=save;tgt.append(g)}};
    build(A,f);svg.append(root)}
  return svg}

/* ---------------- characters ---------------- */
const pickR=(P,a)=>a[P()*a.length|0];
function person(seed,ov={}){const P=rng(seed),rr=(a,b)=>a+P()*(b-a),pick=a=>pickR(P,a);
  const isCat=ov.cat??(P()<.1);if(isCat)return cat(seed);
  const p={head:pick(['round','tall','square','pear','round']),hr:rr(33,40),hy:rr(66,78),
    body:pick(['coat','vest','dress','sweater']),col:pick([C.RED,C.GREEN,C.BLUE,C.MUST,C.BROWN,C.PLUM]),
    hair:pick(['spiky','slick','bun','curly','bald','tophat','beret','long','braids','pigtails']),hairC:pick([C.DARK,C.DARK,C.BROWN,'#8a5a2b','#cdb68a']),
    eyes:pick(['dots','sockets','tired','wide','dots']),mouth:pick(['line','smile','smirk','o','smile']),held:pick(['cup','umbrella','cane','flower','none','none','popsicle']),
    brows:P()<.4,nose:P()<.5,tw:rr(24,34),tb:rr(186,204),...ov};
  const hx=100,hr=p.hr,hw=p.head==='tall'?hr*.8:p.head==='square'?hr*.95:hr,hh=p.head==='tall'?hr*1.2:hr,hy=p.hy;
  const headF=a=>p.head==='pear'?1+.13*Math.sin(a):p.head==='square'?1+.12*Math.pow(Math.abs(Math.sin(2*a)),2):1;
  const neck=hy+hh*.92,tt=neck+8,tb=p.tb,tw=p.tw;
  return art('0 0 200 300',A=>{const{ink,fill,shape,hatch,dot,sub}=A;
    // long hair behind
    if(p.hair==='long')shape([[hx-hw-6,hy-10],[hx+hw+6,hy-10],[hx+hw+10,hy+hh+34],[hx-hw-10,hy+hh+34]],p.hairC,{w:2});
    // legs (3 poses)
    const lx=[hx-8,hx+8],ly=tb-4,foot=284;
    const leg=(x,dx)=>{ink([[x,ly],[x+dx*.5,(ly+foot)/2],[x+dx,foot]],{w:2.6});shape(ell(x+dx+4,foot+1,9,5,10),C.DARK,{w:1.6})};
    sub('ls',()=>{leg(lx[0],-2);leg(lx[1],2)});
    sub('la',()=>{leg(lx[0],-14);leg(lx[1],10)});
    sub('lb',()=>{leg(lx[0],8);leg(lx[1],-12)});
    // torso
    let tor;
    if(p.body==='dress')tor=[[hx-tw*.45,tt],[hx+tw*.45,tt],[hx+tw*1.05,tb+12],[hx-tw*1.05,tb+12]];
    else if(p.body==='sweater')tor=[[hx-tw*.6,tt+4],[hx-tw*.4,tt],[hx+tw*.4,tt],[hx+tw*.6,tt+4],[hx+tw*.62,tb],[hx-tw*.62,tb]];
    else tor=[[hx-tw*.55,tt],[hx+tw*.55,tt],[hx+tw*.7,tb],[hx-tw*.7,tb]];
    shape(tor,p.col,{hatch:{side:'r',gap:4.5,a:58,from:.5}});
    if(p.body==='coat'){ink([[hx-6,tt],[hx-2,tt+26],[hx,tb]],{w:1.6});ink([[hx+6,tt],[hx+2,tt+26]],{w:1.6});dot(hx+5,tt+44,2.2);dot(hx+5,tt+62,2.2)}
    if(p.body==='vest'){fill([[hx-7,tt],[hx+7,tt],[hx,tt+30]],C.CREAM);ink([[hx-7,tt],[hx,tt+30],[hx+7,tt]],{w:1.4});dot(hx,tt+42,2);dot(hx,tt+58,2)}
    if(p.body==='sweater')for(let y=tt+18;y<tb-6;y+=14)ink([[hx-tw*.6,y],[hx+tw*.6,y+1]],{w:1.2});
    if(p.body==='dress')ink([[hx-tw*1.0,tb+4],[hx,tb+8],[hx+tw*1.0,tb+4]],{w:1.3});
    // arms
    const sh=[[hx-tw*.5,tt+6],[hx+tw*.5,tt+6]],hl=[hx-tw-14,tt+58],hrt=[hx+tw+10,tt+66];
    ink([sh[0],[hx-tw*.9,tt+30],hl],{w:2.4});ink([sh[1],[hx+tw*.85,tt+34],hrt],{w:2.4});
    for(const [x,y,s] of [[...hl,-1],[...hrt,1]]){ink([[x,y],[x+s*5,y+6]],{w:1.4});ink([[x,y],[x+s*1,y+8]],{w:1.4});ink([[x,y],[x-s*3,y+7]],{w:1.4})}
    // held item (left hand)
    const [x,y]=hl;
    if(p.held==='cup'){shape([[x-9,y-6],[x+7,y-6],[x+5,y+8],[x-7,y+8]],C.CREAM,{w:1.8});ink(arc(x+8,y+1,5,5,-1.4,1.4,6),{w:1.4});ink([[x-3,y-10],[x-6,y-16],[x-2,y-22]],{w:1.1})}
    if(p.held==='umbrella'){ink([[x,y-60],[x,y+26],[x+6,y+30]],{w:2});shape([[x,y-62],[x+7,y-30],[x+3,y-4],[x-3,y-4],[x-7,y-30]],C.DARK,{w:1.6})}
    if(p.held==='cane'){ink([[x,y-8],[x+1,y+90]],{w:2.2});ink(arc(x+7,y-8,7,7,Math.PI,2*Math.PI,6),{w:2.2})}
    if(p.held==='flower'){ink([[x,y+4],[x+2,y-30]],{w:1.6});for(let i=0;i<5;i++){const a=i/5*6.28;shape(ell(x+2+Math.cos(a)*7,y-36+Math.sin(a)*7,5,5,8),C.RED,{w:1.2})}dot(x+2,y-36,3,C.MUST)}
    if(p.held==='popsicle'){shape(ell(x-2,y-30,11,24,12),C.RED,{hatch:{side:'r',gap:4,a:50},w:2});ink([[x-1,y-8],[x+1,y+12]],{w:2.4,c:C.BROWN})}
    // neck + head
    ink([[hx,neck-4],[hx,tt+2]],{w:2.2});
    const head=ell(hx,hy,hw,hh,18,headF);
    if(['curly'].includes(p.hair))for(let i=0;i<9;i++){const a=Math.PI*(1.0+i/8),r=hr+4;shape(ell(hx+Math.cos(a)*r*(hw/hr),hy+Math.sin(a)*r*.95,11,11,10),p.hairC,{w:1.4})}
    shape(head,C.SKIN,{hatch:{side:'r',gap:5,a:65,from:.68,w:.8},w:2.6});
    // face
    const ey=hy-hh*.08,ex=hw*.36;
    for(const s of [-1,1]){const cx=hx+s*ex;
      if(p.eyes==='dots')dot(cx,ey,3.4);
      if(p.eyes==='sockets'){fill(ell(cx,ey,7,9,10),C.DARK,{j:.3});dot(cx+s*1.5,ey-2,1.6,C.CREAM)}
      if(p.eyes==='tired'){ink(arc(cx,ey-1,6,4,Math.PI*.1,Math.PI*.9,5),{w:1.8});dot(cx,ey+2,2.4)}
      if(p.eyes==='wide'){shape(ell(cx,ey,7.5,8,10),C.CREAM,{w:1.6});dot(cx+s*1.2,ey+1,2.8)}
      if(p.brows)ink([[cx-6*s,ey-14],[cx+5*s,ey-11-(s>0?2:0)]],{w:2})}
    if(p.nose)ink([[hx+2,ey+4],[hx+5,ey+12],[hx+1,ey+14]],{w:1.5});
    const my=hy+hh*.48;
    if(p.mouth==='line')ink([[hx-8,my],[hx,my+1],[hx+8,my-1]],{w:1.8});
    if(p.mouth==='smile')ink(arc(hx,my-6,11,8,.35,Math.PI-.35,7),{w:2});
    if(p.mouth==='smirk')ink([[hx-9,my],[hx+2,my+1],[hx+9,my-5]],{w:1.8});
    if(p.mouth==='o')shape(ell(hx,my,4,5,8),C.DARK,{w:1.2});
    // hair front
    const capPts=k=>{const p=[];for(let i=0;i<=12;i++){const a=Math.PI*(1.02+i/12*.96);p.push([hx+Math.cos(a)*(hw+k),hy+Math.sin(a)*(hh+k)])}p.push([hx+hw*.7,hy-hh*.32],[hx,hy-hh*.5],[hx-hw*.7,hy-hh*.3]);return p};
    if(p.hair==='spiky'){const s=[];for(let i=0;i<=14;i++){const a=Math.PI*(1.0+i/14),r=(i%2?hr+18:hr+2);s.push([hx+Math.cos(a)*r*(hw/hr),hy+Math.sin(a)*r])}s.push([hx+hw*.8,hy-hh*.25],[hx+hw*.2,hy-hh*.5],[hx-hw*.3,hy-hh*.38],[hx-hw*.85,hy-hh*.2]);shape(s,p.hairC,{w:2})}
    if(['slick','bun','long','braids','pigtails'].includes(p.hair)){shape(capPts(4),p.hairC,{w:2});ink([[hx-6,hy-hh-2],[hx-10,hy-hh*.5]],{w:1.2,c:C.PARCH2})}
    if(p.hair==='bun')shape(ell(hx+4,hy-hh-14,15,13,12),p.hairC,{w:2});
    if(p.hair==='braids')for(const s of [-1,1])for(let i=0;i<4;i++)shape(ell(hx+s*(hw+3),hy+6+i*13,6,7,8),p.hairC,{w:1.4});
    if(p.hair==='pigtails')for(const s of [-1,1]){const bx=hx+s*(hw+14),by=hy-hh*.35,t=[];for(let i=0;i<9;i++){const a=(s>0?-0.9:Math.PI+0.9)+(i/8-.5)*2.2*s,r=i%2?22:10;t.push([bx+Math.cos(a)*r,by+Math.sin(a)*r])}t.push([bx-s*8,by+4]);shape(t,p.hairC,{w:1.8})}
    if(p.hair==='bald')for(const d of [-8,0,7])ink([[hx+d,hy-hh-1],[hx+d+3,hy-hh-9]],{w:1.4});
    if(p.hair==='tophat'){shape([[hx-hw*.62,hy-hh*.72],[hx+hw*.62,hy-hh*.72],[hx+hw*.55,hy-hh-46],[hx-hw*.55,hy-hh-46]],C.DARK,{w:2});fill([[hx-hw*.6,hy-hh*.9],[hx+hw*.6,hy-hh*.9],[hx+hw*.6,hy-hh*.8],[hx-hw*.6,hy-hh*.8]],C.RED);ink([[hx-hw-12,hy-hh*.72],[hx,hy-hh*.68],[hx+hw+12,hy-hh*.74]],{w:3.4})}
    if(p.hair==='beret'){shape(ell(hx-4,hy-hh*.82,hw+8,13,14),p.col===C.RED?C.BLUE:C.RED,{w:2,hatch:{side:'r',gap:4,a:50}});ink([[hx-4,hy-hh-12],[hx-2,hy-hh-20]],{w:2})}
  },{seed})}
function cat(seed){return art('0 0 200 300',A=>{const{ink,shape,dot,sub,fill}=A,hx=100;
  ink([[140,262],[170,240],[166,206],[180,196]],{w:3.2});
  sub('ls',()=>{});sub('la',()=>{});sub('lb',()=>{});
  shape(ell(hx,228,40,58,16,a=>1+.15*Math.sin(a)),C.DARK,{w:2});
  shape(ell(hx,150,34,30,16),C.DARK,{w:2});
  shape([[hx-30,140],[hx-26,104],[hx-10,126]],C.DARK,{w:2});shape([[hx+30,140],[hx+26,104],[hx+10,126]],C.DARK,{w:2});
  for(const s of [-1,1]){shape(ell(hx+s*12,148,7,6,10),C.MUST,{w:1});fill(ell(hx+s*12,148,1.6,5,6),C.DARK)}
  dot(hx,162,2.4,C.RED);for(const s of [-1,1])for(const d of [-3,3])ink([[hx+s*10,164],[hx+s*34,163+d*2]],{w:.9,c:C.PARCH2});
  for(const s of [-1,1])shape(ell(hx+s*14,284,10,6,10),C.DARK,{w:1.4})},{seed})}
function heroGirl(){return person(42,{cat:false,head:'round',hr:38,hy:74,body:'dress',col:C.RED,hair:'pigtails',hairC:'#8a5a2b',eyes:'dots',mouth:'smile',held:'popsicle',brows:false,nose:false,tw:28,tb:196})}

/* ---------------- food ---------------- */
const FOODART={
 toast:A=>{const{shape,ink}=A;shape([[18,82],[18,46],[12,36],[20,22],[36,18],[50,24],[64,18],[82,22],[88,36],[82,46],[82,82]],'#c98f4a',{w:2.4});shape([[25,76],[25,48],[20,38],[28,28],[40,26],[50,31],[62,26],[74,29],[79,38],[75,48],[75,76]],'#e7c487',{w:1.4});shape([[38,46],[56,44],[58,58],[40,60]],C.CREAM,{w:1.4})},
 cereal:A=>{const{shape,ink,dot}=A;shape([[24,24],[72,18],[80,88],[30,94]],C.RED,{w:2.4,hatch:{side:'r',gap:4,a:60,from:.6}});shape([[24,24],[34,10],[66,6],[72,18]],'#7a2e22',{w:1.6});shape([[36,46],[64,42],[66,66],[38,70]],C.CREAM,{w:1.4});for(const [x,y] of [[44,52],[52,50],[58,58],[48,60]])dot(x,y,3,C.MUST)},
 yogurt:A=>{const{shape,ink}=A;shape([[24,34],[76,34],[68,90],[32,90]],C.CREAM,{w:2.4,hatch:{side:'r',gap:4,a:60,from:.65}});shape([[22,28],[78,28],[78,36],[22,36]],C.BLUE,{w:2});shape([[30,54],[72,54],[70,68],[30,68]],C.BLUE,{w:1.2,op:.8});ink([[62,10],[56,40]],{w:2.6,c:C.BROWN})},
 juice:A=>{const{shape,ink,fill}=A;fill([[31,46],[69,46],[66,88],[34,88]],'#c9802f');ink([[28,22],[34,90],[66,90],[72,22]],{w:2.4});ink([[28,22],[72,22]],{w:1.4});ink([[58,6],[50,70]],{w:2.8,c:C.RED});shape([[70,16],[86,12],[90,26],[76,32]],'#e0a040',{w:1.6})},
 waffle:A=>{const{shape,ink}=A;shape([[16,22],[84,20],[86,82],[14,84]],'#c99a4a',{w:2.4});for(let i=1;i<4;i++){ink([[16+i*17,22],[15+i*17,83]],{w:1.4});ink([[15,21+i*15.5],[85,20+i*15.5]],{w:1.4})}},
 pancake:A=>{const{shape,ink}=A;for(const y of [78,66,54])shape([[12,y],[30,y-9],[70,y-9],[88,y],[70,y+8],[30,y+8]],'#d2a35a',{w:2});shape([[42,36],[58,36],[58,46],[42,46]],C.CREAM,{w:1.4});ink([[30,52],[29,62],[31,70]],{w:3,c:C.BROWN})},
 omelette:A=>{const{shape}=A;shape([[8,58],[30,44],[70,44],[92,58],[70,72],[30,72]],C.CREAM,{w:2});shape([[24,58],[34,38],[60,34],[78,50],[70,60]],'#d8b54a',{w:2,hatch:{side:'b',gap:4,a:20,from:.6}})},
 croissant:A=>{const{shape,ink}=A;shape([[8,66],[16,44],[34,32],[50,30],[66,32],[84,44],[92,66],[78,58],[64,58],[50,54],[36,58],[22,58]],'#c8893f',{w:2.4,hatch:{side:'b',gap:4,a:70,from:.65}});for(const x of [32,44,56,68])ink([[x,34+Math.abs(x-50)/4],[x+(x<50?4:-4),58]],{w:1.4})}};
const food=id=>art('0 0 100 100',FOODART[id]);
const ICONART={
 coin:A=>{A.shape(ell(50,50,34,34,16),C.MUST,{w:2.6,hatch:{side:'r',gap:4,a:60,from:.6}});A.ink(ell(50,50,22,22,12),{closed:true,w:1.4});A.ink([[50,34],[50,66]],{w:2})},
 cafe:A=>{A.shape([[22,40],[70,40],[64,80],[28,80]],C.CREAM,{w:2.6});A.ink(arc(72,56,12,12,-1.5,1.5,8),{w:2.4});for(const x of [36,48,60])A.ink([[x,32],[x-4,22],[x+1,12]],{w:1.6})},
 stock:A=>{A.shape([[16,36],[84,36],[80,86],[20,86]],C.WOOD,{w:2.6,hatch:{side:'r',gap:4,a:60,from:.6}});A.ink([[18,54],[82,54]],{w:1.6});A.ink([[18,70],[82,70]],{w:1.6});A.shape([[30,22],[46,22],[46,36],[30,36]],C.CREAM,{w:1.6});A.shape(ell(62,28,9,9,10),C.RED,{w:1.6})},
 shop:A=>{A.shape([[22,14],[78,18],[74,88],[18,84]],C.CREAM,{w:2.6});for(const y of [34,48,62])A.ink([[30,y],[62,y+1]],{w:1.4});A.ink([[30,74],[48,74]],{w:1.4})},
 tables:A=>{A.shape(ell(50,36,40,10,14),C.WOOD,{w:2.4});A.ink([[50,44],[50,84]],{w:3});A.ink([[34,86],[66,86]],{w:2.6})},
 restock:A=>{FOODART.yogurt(A)},
 patience:A=>{A.shape([[30,14],[66,14],[66,52],[30,52]],C.RED,{w:2.4,hatch:{side:'r',gap:4,a:60}});A.ink([[26,56],[72,56]],{w:3});A.ink([[30,56],[28,90]],{w:2.4});A.ink([[68,56],[70,90]],{w:2.4})},
 traffic:A=>{A.shape([[16,40],[66,16],[66,84],[16,62]],C.MUST,{w:2.4,hatch:{side:'r',gap:4,a:60}});A.ink(arc(74,50,10,18,-1,1,6),{w:2});A.ink(arc(80,50,18,28,-1,1,6),{w:2})},
 happy:A=>{A.shape(ell(50,52,34,34,16),C.CREAM,{w:2.6});A.ink([[50,52],[50,30]],{w:2.6});A.ink([[50,52],[66,60]],{w:2.6});A.ink([[42,12],[58,12]],{w:3})},
 fill:A=>{A.shape([[22,34],[78,34],[74,88],[26,88]],C.WOOD,{w:2.6,hatch:{side:'r',gap:4,a:60}});A.ink(arc(50,34,16,16,Math.PI,2*Math.PI,8),{w:2.6})},
 freeze:A=>{for(let i=0;i<3;i++){const a=i/3*Math.PI;A.ink([[50-Math.cos(a)*36,50-Math.sin(a)*36],[50+Math.cos(a)*36,50+Math.sin(a)*36]],{w:3,c:C.BLUE})}A.shape(ell(50,50,9,9,8),C.CREAM,{w:1.6})},
 lock:A=>{A.ink(arc(50,46,16,22,Math.PI,2*Math.PI,8),{w:3});A.shape([[26,44],[74,44],[72,88],[28,88]],C.DARK,{w:2});A.dot(50,62,4,C.MUST)}};
const icon=id=>art('0 0 100 100',ICONART[id]);
function table(){return art('0 0 200 130',A=>{const{shape,ink}=A;
  shape(ell(100,32,94,16,18),C.WOOD,{w:2.6,hatch:{side:'b',gap:5,a:8,from:.55}});
  ink([[20,40],[100,50],[180,40]],{w:1.4});ink([[96,48],[95,112]],{w:4});ink([[104,48],[105,112]],{w:4});
  shape(ell(100,116,34,7,12),C.DARK,{w:2})})}

/* ---------------- ui ink: frames, underline, circle, strike ---------------- */
function frameSvg(w,h,seed,o={}){const R=rng(seed),svg=mk('svg',{width:w,height:h,viewBox:`0 0 ${w} ${h}`,class:'ifr','aria-hidden':'true'});
  const m=3,c=[[m+(R()-.5)*3,m+(R()-.5)*3],[w-m+(R()-.5)*3,m+(R()-.5)*3],[w-m+(R()-.5)*3,h-m+(R()-.5)*3],[m+(R()-.5)*3,h-m+(R()-.5)*3]];
  if(o.fill)svg.append(mk('path',{d:D(c),fill:o.fill}));
  const ink=o.ink||C.INK,wd=o.w??2.4;
  if(o.under){svg.append(mk('path',{d:strokeD([[2,h-3],[w*.5,h-2+(R()-.5)*3],[w-2,h-4]],{w:wd},R),fill:ink}));return svg}
  for(let i=0;i<4;i++){const a=c[i],b=c[(i+1)%4],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l,ov=3+R()*5;
    svg.append(mk('path',{d:strokeD([[a[0]-ux*ov,a[1]-uy*ov],[a[0]+dx*.5+(R()-.5)*2,a[1]+dy*.5+(R()-.5)*2],[b[0]+ux*ov,b[1]+uy*ov]],{w:wd,j:.4},R),fill:ink}))}
  return svg}
function circleSvg(w,h,seed,color=C.RED){const R=rng(seed),svg=mk('svg',{viewBox:`0 0 ${w} ${h}`,width:w,height:h,class:'mk','aria-hidden':'true'});
  const p=[];const n=18,a0=-2.2+R()*.4;for(let i=0;i<=n+3;i++){const a=a0+i/n*Math.PI*2,k=1+(R()-.5)*.06+i*.006;p.push([w/2+Math.cos(a)*(w/2-4)*k,h/2+Math.sin(a)*(h/2-4)*k])}
  svg.append(mk('path',{d:strokeD(p,{w:2.6,j:.6},R),fill:color}));return svg}
function strikeSvg(w,h,seed){const R=rng(seed),svg=mk('svg',{viewBox:`0 0 ${w} ${h}`,width:w,height:h,class:'mk','aria-hidden':'true'});
  svg.append(mk('path',{d:strokeD([[4,h*.6],[w*.5,h*.48],[w-4,h*.42]],{w:2.8},R),fill:C.INK}));svg.append(mk('path',{d:strokeD([[8,h*.42],[w*.5,h*.52],[w-8,h*.6]],{w:2.2},R),fill:C.INK}));return svg}
function checkSvg(seed){const R=rng(seed),svg=mk('svg',{viewBox:'0 0 40 40',class:'ck','aria-hidden':'true'});svg.append(mk('path',{d:strokeD([[6,22],[15,32],[35,6]],{w:4},R),fill:C.RED}));return svg}

/* ---------------- café background, drawn at real size ---------------- */
function sceneBg(W,H,floorY,seed=7){const R=rng(seed),svg=mk('svg',{width:W,height:H,viewBox:`0 0 ${W} ${H}`,class:'bg','aria-hidden':'true'});
  const S=(pts,o)=>svg.append(mk('path',{d:strokeD(pts,o,R),fill:o.c||C.INK,opacity:o.op??1}));
  svg.append(mk('rect',{x:0,y:0,width:W,height:floorY,fill:'#d8c7a0'}));
  for(let x=12;x<W;x+=22)S([[x,0],[x+(R()-.5)*3,floorY*.5],[x+(R()-.5)*3,floorY]],{w:1.1,op:.18,j:.5});
  svg.append(mk('rect',{x:0,y:floorY-26,width:W,height:26,fill:'#b49a6c'}));S([[0,floorY-26],[W/2,floorY-25],[W,floorY-27]],{w:2,op:.8});
  svg.append(mk('rect',{x:0,y:floorY,width:W,height:H-floorY,fill:'#8a6240'}));
  for(let y=floorY+14;y<H;y+=16+R()*6)S([[-4,y],[W/2,y+(R()-.5)*3],[W+4,y]],{w:1.4,op:.55});
  for(let i=0;i<W/40;i++){const x=R()*W,y=floorY+R()*(H-floorY);S([[x,y],[x+6+R()*10,y+(R()-.5)*2]],{w:1,op:.35})}
  S([[0,floorY],[W*.3,floorY+1],[W*.7,floorY-1],[W,floorY]],{w:2.6});
  // lamps + frame on the wall
  for(const fx of [.28,.72]){const x=W*fx;S([[x,0],[x+(R()-.5)*2,floorY*.18]],{w:1.4});
    svg.append(mk('ellipse',{cx:x,cy:floorY*.18+40,rx:W*.16,ry:floorY*.32,fill:'#f3d58a',opacity:.25}));
    const sy=floorY*.18;svg.append(mk('path',{d:D([[x-18,sy+20],[x-8,sy],[x+8,sy],[x+18,sy+20]]),fill:C.DARK}));S([[x-19,sy+20],[x+19,sy+21]],{w:2})}
  const px=W*.5-22,py=floorY*.2;svg.append(mk('rect',{x:px,y:py,width:44,height:54,fill:'#c9b285'}));
  for(const [a,b] of [[[px,py],[px+44,py]],[[px+44,py],[px+44,py+54]],[[px+44,py+54],[px,py+54]],[[px,py+54],[px,py]]])S([[a[0]-2,a[1]],[b[0]+1,b[1]]],{w:2.4});
  S([[px+10,py+40],[px+20,py+26],[px+28,py+34],[px+36,py+18]],{w:1.6});
  return svg}

window.QA={C,mk,art,person,heroGirl,food,icon,table,frameSvg,circleSvg,strikeSvg,checkSvg,sceneBg,rng};
})();
