const canvas=document.getElementById("game"),ctx=canvas.getContext("2d");
let W,H,dpr,playing=false,keys={},mouse={x:0,y:0,down:false},last=0,spawnTimer=0,zoneTime=30,gameOver=false;
const world={w:2600,h:1800},player={x:1300,y:900,r:18,speed:260,hp:100,maxHp:100,ammo:30,reserve:120,reload:0,cool:0,kills:0};
let bots=[],bullets=[],particles=[],rocks=[],loot=[],camera={x:0,y:0};
function resize(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}addEventListener("resize",resize);resize();
for(let i=0;i<90;i++)rocks.push({x:80+Math.random()*2440,y:80+Math.random()*1640,r:10+Math.random()*30});
function reset(){Object.assign(player,{x:1300,y:900,hp:100,ammo:30,reserve:120,reload:0,cool:0,kills:0});bots=[];bullets=[];particles=[];loot=[];zoneTime=30;gameOver=false;spawnTimer=0;for(let i=0;i<11;i++)spawnBot();updateHud();show("DROP! SURVIVE");}
function spawnBot(){let a=Math.random()*Math.PI*2,d=450+Math.random()*850;bots.push({x:Math.max(40,Math.min(world.w-40,player.x+Math.cos(a)*d)),y:Math.max(40,Math.min(world.h-40,player.y+Math.sin(a)*d)),r:17,hp:45,maxHp:45,speed:65+Math.random()*40,shoot:Math.random()*2,hit:0});}
function show(t){const m=document.getElementById("message");m.textContent=t;m.style.opacity=1;setTimeout(()=>m.style.opacity=0,1000)}
function updateHud(){document.getElementById("alive").textContent=Math.max(1,bots.length+1);document.getElementById("kills").textContent=player.kills;document.getElementById("ammo").textContent=player.ammo+" / "+player.reserve;document.getElementById("hpText").textContent=Math.max(0,Math.ceil(player.hp))+" HP";document.getElementById("hpBar").style.width=Math.max(0,player.hp)+"%";document.getElementById("zoneTimer").textContent=Math.ceil(zoneTime)}
addEventListener("keydown",e=>{keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==="r")reload()});addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);
canvas.addEventListener("mousemove",e=>{mouse.x=e.clientX;mouse.y=e.clientY});canvas.addEventListener("mousedown",()=>mouse.down=true);addEventListener("mouseup",()=>mouse.down=false);
function reload(){if(player.reload<=0&&player.ammo<30&&player.reserve>0)player.reload=1.2}
function shoot(){if(player.reload>0||player.cool>0)return;if(player.ammo<=0)return reload();const wx=mouse.x-W/2+camera.x,wy=mouse.y-H/2+camera.y;const a=Math.atan2(wy-player.y,wx-player.x);player.ammo--;player.cool=.13;bullets.push({x:player.x+Math.cos(a)*24,y:player.y+Math.sin(a)*24,vx:Math.cos(a)*850,vy:Math.sin(a)*850,life:1.1,owner:"p"});for(let i=0;i<4;i++)particles.push({x:player.x+Math.cos(a)*24,y:player.y+Math.sin(a)*24,vx:(Math.random()-.5)*90,vy:(Math.random()-.5)*90,life:.2,size:2+Math.random()*2})}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function update(dt){if(!playing||gameOver)return;
let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),dy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0),len=Math.hypot(dx,dy)||1;
player.x=Math.max(25,Math.min(world.w-25,player.x+dx/len*player.speed*dt));player.y=Math.max(25,Math.min(world.h-25,player.y+dy/len*player.speed*dt));
player.cool=Math.max(0,player.cool-dt);if(mouse.down)shoot();if(player.reload>0){player.reload-=dt;if(player.reload<=0){let n=Math.min(30-player.ammo,player.reserve);player.ammo+=n;player.reserve-=n}}zoneTime-=dt;if(zoneTime<=0){zoneTime=30;show("SAFE ZONE MOVING");}
const zoneR=580+Math.max(0,Math.floor((zoneTime-30)/30))*0;const cx=1300,cy=900; if(Math.hypot(player.x-cx,player.y-cy)>zoneR){player.hp-=8*dt}
for(const b of bots){b.hit=Math.max(0,b.hit-dt);let dx=player.x-b.x,dy=player.y-b.y,d=Math.hypot(dx,dy)||1;if(d>180){b.x+=dx/d*b.speed*dt;b.y+=dy/d*b.speed*dt}else{b.shoot-=dt;if(b.shoot<=0){b.shoot=1.3+Math.random()*1.5;let a=Math.atan2(dy,dx);bullets.push({x:b.x,y:b.y,vx:Math.cos(a)*360,vy:Math.sin(a)*360,life:2,owner:"b"})}}}
for(const q of bullets){q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt;if(q.owner==="p"){for(const b of bots){if(b.hp>0&&Math.hypot(q.x-b.x,q.y-b.y)<b.r+5){b.hp-=30;q.life=0;for(let i=0;i<6;i++)particles.push({x:b.x,y:b.y,vx:(Math.random()-.5)*100,vy:(Math.random()-.5)*100,life:.35,size:3});if(b.hp<=0){player.kills++;if(Math.random()<.45)loot.push({x:b.x,y:b.y});}}}}else if(Math.hypot(q.x-player.x,q.y-player.y)<player.r+5){player.hp-=10;q.life=0}}
bullets=bullets.filter(q=>q.life>0&&q.x>-50&&q.x<world.w+50&&q.y>-50&&q.y<world.h+50);bots=bots.filter(b=>b.hp>0);
for(const l of loot){if(dist(l,player)<35){player.reserve+=30;l.dead=true;show("+30 AMMO")}}loot=loot.filter(l=>!l.dead);
for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt}particles=particles.filter(p=>p.life>0);
if(bots.length===0){gameOver=true;show("VICTORY!");setTimeout(()=>document.getElementById("menu").classList.remove("hidden"),900)}
if(player.hp<=0){gameOver=true;show("ELIMINATED");setTimeout(()=>document.getElementById("menu").classList.remove("hidden"),900)}
camera.x=Math.max(W/2,Math.min(world.w-W/2,player.x));camera.y=Math.max(H/2,Math.min(world.h-H/2,player.y));updateHud();}
function draw(){ctx.clearRect(0,0,W,H);ctx.save();ctx.translate(W/2-camera.x,H/2-camera.y);
ctx.fillStyle="#243a28";ctx.fillRect(0,0,world.w,world.h);
ctx.strokeStyle="#34553a";ctx.lineWidth=2;for(let x=0;x<world.w;x+=100){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,world.h);ctx.stroke()}for(let y=0;y<world.h;y+=100){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(world.w,y);ctx.stroke()}
for(const r of rocks){ctx.fillStyle="#34483a";ctx.beginPath();ctx.arc(r.x,r.y,r.r,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#4d6650";ctx.stroke()}
ctx.strokeStyle="#57a7ff99";ctx.lineWidth=7;ctx.beginPath();ctx.arc(1300,900,580,0,Math.PI*2);ctx.stroke();
for(const l of loot){ctx.fillStyle="#f6c94c";ctx.fillRect(l.x-9,l.y-9,18,18);ctx.fillStyle="#513f08";ctx.fillRect(l.x-4,l.y-2,8,4)}
for(const b of bullets){ctx.fillStyle=b.owner==="p"?"#ffe27a":"#ff6b5f";ctx.beginPath();ctx.arc(b.x,b.y,4,0,Math.PI*2);ctx.fill()}
for(const b of bots)drawActor(b,"#ef6259");drawActor(player,"#55a9ff");
for(const p of particles){ctx.globalAlpha=Math.max(0,p.life/.35);ctx.fillStyle="#ffd66b";ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}
ctx.restore();
function drawActor(a,c){ctx.fillStyle="#0005";ctx.beginPath();ctx.ellipse(a.x,a.y+10,a.r,a.r*.55,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=c;ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fill();ctx.fillStyle="#dce8f0";ctx.beginPath();ctx.arc(a.x,a.y-5,7,0,Math.PI*2);ctx.fill();if(a!==player){ctx.fillStyle="#111";ctx.fillRect(a.x-18,a.y-29,36,5);ctx.fillStyle="#62df78";ctx.fillRect(a.x-18,a.y-29,36*(a.hp/a.maxHp),5)}}}
function loop(t){const dt=Math.min(.033,(t-last)/1000||0);last=t;update(dt);draw();requestAnimationFrame(loop)}requestAnimationFrame(loop);
document.getElementById("startBtn").onclick=()=>{document.getElementById("menu").classList.add("hidden");playing=true;reset()};
