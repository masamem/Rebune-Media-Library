import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import './grill-story.css';

const $ = id => document.getElementById(id);
const clamp = (n, a=0, b=1) => Math.min(b,Math.max(a,n));
const smooth = n => {n=clamp(n);return n*n*(3-2*n)};
const lerp = THREE.MathUtils.lerp;
let reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let current=0, target=0, chapter=-1, alive=true, last=0;
const chapters = [
 ['شواية ريبون','أكثر من مجرد شواية.','مرّر لتكتشف'],
 ['01 / التصميم','مصمّمة لتمنحك<br>المزيد.','أسود مطفي. وحضور مميّز.'],
 ['02 / الفتح الكامل','تفتح أكثر.<br>لتشوي أكثر.','تصميم يفتح بالكامل بزاوية 180°'],
 ['03 / مساحة الشواء','<bdi>270 × 220</bdi><span class="unit"> مم</span>','مساحة شواء واسعة · مقاس كل لوح'],
 ['04 / القوة','<bdi>1800–2000</bdi><span class="unit"> واط</span>','قوة تمنحك الحرارة التي تحتاجها.'],
 ['05 / التحكم','أدِر.<br>اضبط.<br>واشوِ.','تحكّم بالحرارة بين يديك.'],
 ['06 / لحظة التذوّق','اضغط.<br>اشوِ.<br>واستمتع.',''],
 ['07 / خيارات أكثر','شواية واحدة.<br>إمكانيات أكثر.',''],
 ['08 / استخدام يومي','تفاصيل عملية.<br>لكل يوم.','مصمّمة لسهولة الاستخدام اليومي.'],
 ['09 / الأجزاء','كل جزء.<br>في مكانه.','اكتشف المكوّنات الظاهرة للشواية.'],
 ['10 / إعادة التجميع','تعود الأجزاء.<br>لتكتمل التجربة.',''],
 ['شواية ريبون RE-5-096','ريبون','أبعد من الخيال'],
];
const nav=document.querySelector('.chapter-nav');
chapters.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`المرحلة ${i}: ${c[1].replace(/<[^>]*>/g,' ')}`);b.addEventListener('click',()=>go(i));nav.appendChild(b)});
function go(i){window.scrollTo({top:(document.documentElement.scrollHeight-innerHeight)*clamp((i===0||i===11?i:i+.2)/11),behavior:reduced?'instant':'smooth'})}
$('next-chapter').onclick=()=>go(Math.min(11,Math.floor(current)+1));
$('replay').onclick=()=>go(0);
$('motion-toggle').onclick=()=>{reduced=!reduced;setMotion()};
function setMotion(){$('motion-toggle').setAttribute('aria-pressed',String(reduced));$('motion-toggle').textContent=reduced?'تفعيل الحركة':'تقليل الحركة'}setMotion();
function onScroll(){target=clamp(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))*11}addEventListener('scroll',onScroll,{passive:true});onScroll();

let renderer;
try { renderer=new THREE.WebGLRenderer({canvas:$('scene'),antialias:true,alpha:true,powerPreference:'high-performance'}); }
catch(e){showFallback()}
function showFallback(){$('loading').style.display='none';$('fallback').hidden=false;document.querySelector('.scene-copy').hidden=true;nav.hidden=true;document.querySelector('.story-footer').hidden=true;$('scroll-track').style.height='100vh';alive=false}
if(renderer) start();
function start(){
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(34,innerWidth/innerHeight,.02,80);
const env=new RoomEnvironment();const pmrem=new THREE.PMREMGenerator(renderer);const envMap=pmrem.fromScene(env,.04);scene.environment=envMap.texture;scene.environmentIntensity=.32;env.dispose();pmrem.dispose();
const matte=new THREE.MeshStandardMaterial({color:0x181b1e,roughness:.47,metalness:.45});
const black=new THREE.MeshStandardMaterial({color:0x080a0c,roughness:.34,metalness:.25});
const plateMat=new THREE.MeshStandardMaterial({color:0x272a2b,roughness:.66,metalness:.4});
const ribMat=new THREE.MeshStandardMaterial({color:0x36393a,roughness:.57,metalness:.38});
const chrome=new THREE.MeshStandardMaterial({color:0xd4d8da,roughness:.21,metalness:.92});
const darkMetal=new THREE.MeshStandardMaterial({color:0x333638,roughness:.26,metalness:.85});
const root=new THREE.Group();scene.add(root);
function box(w,h,d,r,mat,parent,x=0,y=0,z=0){const mesh=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,3,r),mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
function cyl(radius,len,mat,parent,x,y,z,axis='y'){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,len,48),mat);if(axis==='z')mesh.rotation.x=Math.PI/2;if(axis==='x')mesh.rotation.z=Math.PI/2;mesh.position.set(x,y,z);mesh.castShadow=true;parent.add(mesh);return mesh}
const baseGroup=new THREE.Group();root.add(baseGroup);box(3.02,.39,2.54,.12,matte,baseGroup,0,.30,0);
box(2.88,.10,2.44,.06,black,baseGroup,0,.095,0);
for(const x of [-1.15,1.15])for(const z of [-.92,.92])box(.26,.16,.26,.045,black,baseGroup,x,.02,z);
const lowerPlate=new THREE.Group();root.add(lowerPlate);lowerPlate.position.y=.53;
function cookingPlate(parent,upper=false){box(2.7,.105,2.2,.065,plateMat,parent);for(let i=0;i<19;i++){const rib=box(.038,.034,1.97,.015,ribMat,parent,-1.20+i*.133,upper?-.069:.069,0)}
 // A shallow perimeter rim and a visible drainage break, no internal parts.
 for(const x of [-1.31,1.31])box(.036,.048,2.07,.012,plateMat,parent,x,upper?-.04:.04,0);
 for(const z of [-1.065,1.065])box(2.58,.048,.033,.011,plateMat,parent,0,upper?-.04:.04,z);
}cookingPlate(lowerPlate);
const hinge=new THREE.Group();hinge.position.set(0,.66,-1.13);root.add(hinge);
const upperHousing=new THREE.Group();hinge.add(upperHousing);upperHousing.position.z=1.13;
box(2.94,.22,2.48,.10,matte,upperHousing,0,.16,0);box(2.78,.045,2.32,.035,black,upperHousing,0,.023,0);
const upperPlate=new THREE.Group();hinge.add(upperPlate);upperPlate.position.set(0,-.045,1.13);cookingPlate(upperPlate,true);
const arms=new THREE.Group();hinge.add(arms);
for(const x of [-1.48,1.48]){box(.10,.16,2.66,.035,darkMetal,arms,x,.23,1.15);cyl(.105,.15,chrome,arms,x,.06,0,'x');box(.13,.20,.22,.025,black,arms,x,.23,2.50)}
cyl(.082,2.98,black,arms,0,.25,2.52,'x');
// Original visible lettering is a surface decal, not an invented component.
const logoCanvas=document.createElement('canvas');logoCanvas.width=1024;logoCanvas.height=160;
const lc=logoCanvas.getContext('2d');lc.fillStyle='#d4d5d4';lc.font='bold 108px Georgia';lc.textAlign='center';lc.fillText('REBUNE',512,120);
const logoMap=new THREE.CanvasTexture(logoCanvas);logoMap.colorSpace=THREE.SRGBColorSpace;
const logo=new THREE.Mesh(new THREE.PlaneGeometry(.72,.113),new THREE.MeshStandardMaterial({map:logoMap,transparent:true,roughness:.35,metalness:.65,depthWrite:false}));logo.rotation.x=-Math.PI/2;logo.position.set(0,.275,-.10);upperHousing.add(logo);
const front=new THREE.Group();root.add(front);front.position.set(0,.31,1.26);
box(2.84,.28,.05,.035,matte,front);
const knob=new THREE.Group();front.add(knob);knob.position.set(-.30,0,.095);
cyl(.185,.075,black,knob,0,0,0,'z');cyl(.154,.082,chrome,knob,0,0,.024,'z');
const knobDot=new THREE.Mesh(new THREE.SphereGeometry(.016,12,8),black);knobDot.position.set(0,-.11,.07);knob.add(knobDot);
const redMat=new THREE.MeshStandardMaterial({color:0x701e17,emissive:0xff4822,emissiveIntensity:0,roughness:.3});
const greenMat=new THREE.MeshStandardMaterial({color:0x16573e,emissive:0x4fd499,emissiveIntensity:0,roughness:.3});
cyl(.074,.027,darkMetal,front,.09,0,.04,'z');cyl(.059,.03,redMat,front,.09,0,.06,'z');cyl(.074,.027,darkMetal,front,.30,0,.04,'z');cyl(.059,.03,greenMat,front,.30,0,.06,'z');
const tray=new THREE.Group();root.add(tray);tray.position.set(1.16,.08,-.28);
box(.57,.045,.69,.022,black,tray);for(const x of [-.27,.27])box(.035,.12,.69,.014,black,tray,x,.065,0);for(const z of [-.327,.327])box(.54,.12,.035,.014,black,tray,0,.065,z);
const knobRing=new THREE.Group();front.add(knobRing);knobRing.position.copy(knob.position);knobRing.position.z+=.10;
const ringMat=new THREE.LineBasicMaterial({color:0xe8601c,transparent:true,opacity:0});const ringPoints=[];for(let i=0;i<=60;i++){const a=(-.8+ i/60*1.6)*Math.PI;ringPoints.push(new THREE.Vector3(Math.sin(a)*.28,Math.cos(a)*.28,0))}knobRing.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPoints),ringMat));
for(let i=0;i<17;i++){const a=(-.8+i/16*1.6)*Math.PI;const points=[.30,.325].map(r=>new THREE.Vector3(Math.sin(a)*r,Math.cos(a)*r,0));knobRing.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),ringMat))}
// Per-plate measurements in world coordinates, visible only in the macro chapter.
const measurement=new THREE.Group();lowerPlate.add(measurement);const measureMat=new THREE.LineBasicMaterial({color:0xe8601c,transparent:true,opacity:0});
const segments=[[-1.35,.14,1.27,1.35,.14,1.27],[-1.35,.14,1.19,-1.35,.14,1.35],[1.35,.14,1.19,1.35,.14,1.35],[1.50,.14,-1.10,1.50,.14,1.10],[1.42,.14,-1.10,1.58,.14,-1.10],[1.42,.14,1.10,1.58,.14,1.10]];
const coords=segments.flat();const mg=new THREE.BufferGeometry();mg.setAttribute('position',new THREE.Float32BufferAttribute(coords,3));measurement.add(new THREE.LineSegments(mg,measureMat));
// Deterministic procedural surface texture: pores and toast marks follow plate grooves.
function surfaceTexture(kind,cooked=false){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;const ctx=canvas.getContext('2d');const colors={bread:'#efd1a0',chicken:'#ca8b4b',steak:'#754229',vegetables:'#699346'};ctx.fillStyle=colors[kind];ctx.fillRect(0,0,512,512);let seed=42;const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};for(let i=0;i<9000;i++){const n=rand();ctx.fillStyle=`rgba(${n>.5?'255,230,177':'78,42,16'},${rand()*.16})`;ctx.beginPath();ctx.arc(rand()*512,rand()*512,rand()*3+.3,0,Math.PI*2);ctx.fill()}if(cooked||kind!=='bread'){ctx.fillStyle=kind==='bread'?'#805020':'#30251bbb';for(let i=0;i<7;i++){ctx.fillRect(30+i*76,0,13,512)}}const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t}
const rawBread=surfaceTexture('bread');const toastedBread=surfaceTexture('bread',true);
const foodRoot=new THREE.Group();root.add(foodRoot);foodRoot.position.set(0,.69,0);
const foods=[];const breadMats=[];
function foodGroup(){const g=new THREE.Group();foodRoot.add(g);foods.push(g);return g}
const sandwich=foodGroup();
for(const x of [-.68,.68]){const bread=new THREE.MeshStandardMaterial({color:0xf3ca89,map:rawBread,roughness:.95,transparent:true});breadMats.push(bread);box(1.05,.13,1.10,.14,bread,sandwich,x,.04,.07);box(1.07,.035,1.08,.04,new THREE.MeshStandardMaterial({color:0xe6bd51,roughness:.8,transparent:true}),sandwich,x,.13,.07);box(.99,.052,1.03,.11,new THREE.MeshStandardMaterial({color:0x7b983a,roughness:.9,transparent:true}),sandwich,x,.17,.07);box(1.06,.13,1.10,.14,bread,sandwich,x,.245,.07)}
const chicken=foodGroup();const chickenMat=new THREE.MeshStandardMaterial({map:surfaceTexture('chicken'),color:0xf3d1a2,roughness:.65,transparent:true});
for(const x of [-.69,.59]){const m=new THREE.Mesh(new THREE.SphereGeometry(1,36,24),chickenMat);m.scale.set(.48,.15,.77);m.rotation.y=x*.2;m.position.set(x,.14,0);m.castShadow=true;chicken.add(m)}
const steak=foodGroup();const steakMat=new THREE.MeshStandardMaterial({map:surfaceTexture('steak'),color:0xe2bd9b,roughness:.56,transparent:true});for(const x of [-.65,.65]){const m=new THREE.Mesh(new THREE.SphereGeometry(1,40,24),steakMat);m.scale.set(.50,.16,.76);m.rotation.y=x*.3;m.position.set(x,.16,0);m.castShadow=true;steak.add(m)}
const veg=foodGroup();for(let i=0;i<10;i++){const mat=new THREE.MeshStandardMaterial({color:[0x679c3b,0xaac677,0xd54822,0xe8b949][i%4],roughness:.6,transparent:true});const m=box(.19,.16,.9,.075,mat,veg,(i%5-.2)*.48-1.10,.12,Math.floor(i/5)*.93-.5);m.rotation.y=.2*Math.sin(i)}
function foodOpacity(group,alpha){group.visible=alpha>.001;group.traverse(m=>{if(m.isMesh){m.material.opacity=alpha;m.material.depthWrite=alpha>.9}})}
// Light steam, never red-hot plate metal.
const steamCanvas=document.createElement('canvas');steamCanvas.width=64;steamCanvas.height=64;const sc=steamCanvas.getContext('2d');const grad=sc.createRadialGradient(32,32,0,32,32,32);grad.addColorStop(0,'rgba(225,230,232,.34)');grad.addColorStop(.45,'rgba(210,218,224,.14)');grad.addColorStop(1,'rgba(210,218,224,0)');sc.fillStyle=grad;sc.fillRect(0,0,64,64);const steamMap=new THREE.CanvasTexture(steamCanvas);const steam=[];
for(let i=0;i<17;i++){const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:steamMap,transparent:true,opacity:0,depthWrite:false}));root.add(sprite);steam.push(sprite)}
const hazeMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,uniforms:{uTime:{value:0},uStrength:{value:0}},vertexShader:`varying vec2 vUv; uniform float uTime; void main(){vUv=uv;vec3 p=position;p.x+=sin(p.y*11.0+uTime*1.7)*0.018;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,fragmentShader:`varying vec2 vUv;uniform float uTime;uniform float uStrength;void main(){float band=pow(max(0.0,sin(vUv.x*52.0+sin(vUv.y*13.0-uTime)*1.5)),12.0);float fade=sin(vUv.x*3.14159)*pow(1.0-vUv.y,2.0);gl_FragColor=vec4(.8,.82,.84,band*fade*uStrength*.045);}`});
const haze=new THREE.Mesh(new THREE.PlaneGeometry(2.5,.75,24,20),hazeMat);haze.position.set(0,1.0,.2);root.add(haze);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.18}));floor.rotation.x=-Math.PI/2;floor.position.y=-.15;floor.receiveShadow=true;scene.add(floor);
const ambient=new THREE.HemisphereLight(0xc7d9f0,0x21140b,1);scene.add(ambient);
const key=new THREE.SpotLight(0xfff4e7,70,30,.50,.7,1.5);key.position.set(-3,6,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.bias=-.0005;scene.add(key);scene.add(key.target);
const rim=new THREE.DirectionalLight(0xb7cee9,3);rim.position.set(2,3,-4);scene.add(rim);
const orange=new THREE.PointLight(0xe8601c,12,12);orange.position.set(-2,1.5,-3);scene.add(orange);
const fill=new THREE.DirectionalLight(0xe3e6e9,.6);fill.position.set(0,2,5);scene.add(fill);
const warm=new THREE.PointLight(0xff9c51,0,4);warm.position.set(0,1,0);root.add(warm);
const labels=[['الهيكل العلوي',upperHousing,[0,.35,0]],['لوح الشواء العلوي',upperPlate,[-.9,0,0]],['الأذرع والمفصلة',arms,[1.5,.2,1.7]],['لوح الشواء السفلي',lowerPlate,[-1.35,.1,0]],['الهيكل السفلي',baseGroup,[-1.45,.2,0]],['التحكم الأمامي',front,[-.35,0,.15]],['صينية التجميع',tray,[.3,0,.3]]].map(([text,obj,offset])=>{const el=document.createElement('span');el.className='part-label';el.textContent=text;$('part-labels').appendChild(el);return {el,obj,offset:new THREE.Vector3(...offset)}});
// Keyframed camera positions are interpolated continuously; animation is reversible.
const frames=[
 {cam:[4.8,3.9,6.2],look:[0,.5,0],open:0,rot:-.25},
 {cam:[4.4,3.7,6.2],look:[-.85,.55,0],open:0,rot:.15},
 {cam:[4.9,6.3,7.8],look:[-.75,.6,-.6],open:Math.PI,rot:.15},
 {cam:[1.8,2.8,2.8],look:[-.60,.48,.0],open:Math.PI,rot:0},
 {cam:[1.7,2.7,3.0],look:[-.6,.5,0],open:Math.PI,rot:0},
 {cam:[.4,1.10,3.9],look:[-.70,.31,1.2],open:Math.PI,rot:0},
 {cam:[4.7,4.9,6.7],look:[-.70,.6,-.25],open:1.70,rot:.15},
 {cam:[4.7,4.9,6.7],look:[-.70,.6,-.25],open:1.70,rot:.15},
 {cam:[4.0,1.8,5.5],look:[-.50,.15,0],open:1.70,rot:-.25},
 {cam:[5.8,6.9,8.7],look:[-.7,.8,-.9],open:Math.PI,rot:0},
 {cam:[5.0,4.4,7.6],look:[-.7,.8,0],open:0,rot:.4},
 {cam:[4.7,3.7,6.2],look:[0,.5,0],open:0,rot:.0},
];
const bgDark=new THREE.Color('#08090b'),bgLight=new THREE.Color('#fbf6ee'),bg=new THREE.Color();
const look=new THREE.Vector3(),v=new THREE.Vector3();
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));onScroll()}addEventListener('resize',resize);
$('scene').addEventListener('webglcontextlost',event=>{event.preventDefault();showFallback()});
document.addEventListener('visibilitychange',()=>{last=performance.now()});
let loadingDone=false;let running=true;addEventListener('pagehide',()=>{running=false;renderer.dispose();envMap.dispose()},{once:true});
function update(now){if(!running||!alive)return;requestAnimationFrame(update);if(document.hidden)return;const dt=Math.min((now-last)/1000,.05)||.016;last=now;current=reduced?target:lerp(current,target,1-Math.exp(-dt*9));if(Math.abs(current-target)<.0001)current=target;
 const p=clamp(current,0,11),idx=Math.min(11,Math.floor(p)),f=p-idx;
 // Each new chapter begins with a short camera transition, then holds its scene.
 const t=p>=11?1:smooth(clamp(f/.40));const prev=frames[Math.max(0,idx-1)],next=frames[idx];
 const chapterIndex=Math.min(11,Math.floor(p+.00001));
 let camFrame=prev,camNext=next,camT=t;
 // Chapters 6 and 7 share one camera; no camera jump between foods.
 const mobile=innerWidth<700;
 camera.position.set(...prev.cam).lerp(v.set(...next.cam),camT);look.set(...prev.look).lerp(v.set(...next.look),camT);
 let open=lerp(prev.open,next.open,camT);
 root.rotation.y=lerp(prev.rot,next.rot,camT);
 // Opening is mechanically driven at the rear hinge over the whole second chapter.
 if(p>=2&&p<3){open=Math.PI*smooth((p-2)/.80)}
 // Food is introduced only after an empty-plate pause.
 let sandwichAlpha=0,cook=0;
 if(p>=6&&p<7){const q=p-6;sandwichAlpha=smooth((q-.15)/.10);open=q<.3?1.70:q<.48?lerp(1.70,.10,smooth((q-.3)/.18)):q<.65?.10:lerp(.10,1.70,smooth((q-.65)/.20));cook=smooth((q-.5)/.20);}
 const foodProgress=clamp(p-7)*3;foods.forEach(g=>foodOpacity(g,0));if(p>=6&&p<7)foodOpacity(sandwich,sandwichAlpha);
 if(p>=7&&p<8){foods.forEach((g,i)=>foodOpacity(g,clamp(1-Math.abs(foodProgress-i))));open=1.70;}
 for(const mat of breadMats){mat.map=cook>.5||p>=7?toastedBread:rawBread;mat.color.setRGB(1,lerp(.94,.75,cook),lerp(.8,.48,cook))}
 // Tray extension, followed by a controlled seven-component exploded view.
 let traySlide=p>=8&&p<9?Math.sin(clamp((p-8)/.85)*Math.PI)*1.10:0;
 let explode=p>=9&&p<10?smooth((p-9)/.7):p>=10&&p<10.65?1-smooth((p-10)/.65):0;
 if(p>=9&&p<10.65)open=Math.PI;
 if(p>=10.65&&p<11)open=lerp(Math.PI,0,smooth((p-10.65)/.35));
 hinge.rotation.x=-open;
 upperHousing.position.y=explode*1.0;upperPlate.position.y=-.045-explode*.45;arms.position.x=explode*.32;
 lowerPlate.position.y=.53+explode*.55;baseGroup.position.y=-explode*.30;front.position.z=1.26+explode*.80;tray.position.x=1.16+traySlide+explode*1.0;tray.position.y=.08-explode*.20;
 knob.rotation.z=p>=5&&p<6?lerp(-.7,1.2,smooth((p-5)/.8)):.1;
 const controlOpacity=p>=5&&p<6?smooth((p-5)*4)*(1-smooth((p-5.75)*4)):0;ringMat.opacity=controlOpacity*.7;
 const power=p>=5.3&&p<8?1:0,ready=p>=5.6&&p<8?1:0;redMat.emissiveIntensity=power*1.0;greenMat.emissiveIntensity=ready*.8;
 $('controls').style.opacity=controlOpacity;$('power-lamp').classList.toggle('on',power>0);$('ready-lamp').classList.toggle('on',ready>0);
 const heat=(p>=4&&p<5?Math.sin(clamp((p-4)/1)*Math.PI):0)+(p>=6.4&&p<6.9?Math.sin(clamp((p-6.4)/.5)*Math.PI):0);warm.intensity=heat*.7;
 const time=reduced?0:now/1000;hazeMat.uniforms.uTime.value=time;hazeMat.uniforms.uStrength.value=reduced?0:heat;
 steam.forEach((sp,i)=>{const phase=(time*.20+i/17)%1;sp.position.set(Math.sin(i*2.4+phase*.8)*1.1,.72+phase*1.1,Math.cos(i*1.7)*.8);sp.scale.set(.27+phase*.42,.4+phase*.65,1);sp.material.opacity=reduced?0:heat*.17*Math.sin(phase*Math.PI)});
 measureMat.opacity=p>=3&&p<4?Math.sin(clamp((p-3)/1)*Math.PI)*.75:0;
 const bright=smooth((p-10.25)/.75);bg.copy(bgDark).lerp(bgLight,bright);$('stage').style.backgroundColor='#'+bg.getHexString();document.body.classList.toggle('light',bright>.6);
 scene.environmentIntensity=lerp(.28,.8,bright);ambient.intensity=lerp(.5,1.8,bright);rim.intensity=lerp(2.8,2.0,bright);floor.material.opacity=lerp(.10,.16,bright);
 const emergence=lerp(.055,1,smooth(p/.75));key.intensity=70*emergence;fill.intensity=.7*emergence;key.position.x=lerp(-5,3,smooth(p/.9));orange.intensity=lerp(3,14,bright);orange.position.set(-2,1.5,-3);
 if(!reduced&&p>10.95){camera.position.x+=Math.sin(time*.3)*.08;camera.position.y+=Math.sin(time*.4)*.04;orange.intensity+=Math.sin(time*.5)}
 if(p>=10.65&&p<11){const endT=smooth((p-10.65)/.35);camera.position.set(...frames[10].cam).lerp(v.set(...frames[11].cam),endT);look.set(...frames[10].look).lerp(v.set(...frames[11].look),endT);root.rotation.y=lerp(frames[10].rot,Math.PI*2,endT);}
 if(mobile){camera.position.multiplyScalar(1.34);look.x=0;look.y+=.55;camera.fov=40}else{camera.fov=34}
 camera.lookAt(look);camera.updateProjectionMatrix();root.updateMatrixWorld(true);
 if(chapter!==chapterIndex){chapter=chapterIndex;const c=chapters[chapter];$('eyebrow').textContent=c[0];$('headline').innerHTML=c[1];$('subline').textContent=c[2];$('copy').className='scene-copy'+(chapter===0?' opening':chapter===11?' final':'');$('chapter-count').textContent=String(chapter).padStart(2,'0')+' / 11';[...nav.children].forEach((b,i)=>b.setAttribute('aria-current',String(i===chapter)));$('next-chapter').style.visibility=chapter===11?'hidden':'visible'}
 const frac=p-Math.floor(p);let copyOpacity=chapter===0||chapter===11?1:smooth(frac/.15)*(1-smooth((frac-.86)/.14));if(chapter===6)copyOpacity*=smooth((p-6.83)/.08);
 $('copy').style.opacity=copyOpacity;$('copy').style.transform=`translateY(${(1-copyOpacity)*12}px)`;
 $('angle').style.opacity=p>=2&&p<3?smooth((p-2)*4)*(1-smooth((p-2.9)*10)):0;$('angle-number').textContent=Math.round(open/Math.PI*180)+'°';
 $('food-label').textContent=p>=7&&p<8?['بانيني','دجاج','ستيك','خضروات'][Math.round(foodProgress)]:'';
 $('final-actions').hidden=p<10.98;$('progress-bar').style.transform=`scaleX(${p/11})`;
 labels.forEach(({el,obj,offset})=>{el.style.display=explode>.35?'block':'none';if(explode>.35){v.copy(offset);obj.localToWorld(v);v.project(camera);el.style.left=(v.x*.5+.5)*innerWidth+'px';el.style.top=(-v.y*.5+.5)*innerHeight+'px';el.style.opacity=smooth((explode-.35)/.5)}});
 renderer.render(scene,camera);
 if(!loadingDone){loadingDone=true;$('loading').style.opacity='0';setTimeout(()=>{$('loading').style.display='none'},500)}
}
requestAnimationFrame(update);
}
