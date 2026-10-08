const $=id=>document.getElementById(id);
const messages=$("messages"),historyEl=$("history"),input=$("input"),send=$("send"),status=$("status");
let backend=localStorage.getItem("jarvisBackend")||"http://127.0.0.1:8000";
let chats=JSON.parse(localStorage.getItem("myaiChats")||"[]"),current=[],busy=false;
const save=()=>localStorage.setItem("myaiChats",JSON.stringify(chats));
function renderHistory(){historyEl.innerHTML="";chats.slice().reverse().forEach((c,i)=>{const b=document.createElement("button");b.textContent=c.title||"New chat";b.onclick=()=>loadChat(chats.length-1-i);historyEl.appendChild(b)})}
function add(role,text,actions=true){
 const row=document.createElement("div");row.className="msg "+role;
 const av=document.createElement("div");av.className="avatar";av.textContent=role==="ai"?"✦":"U";
 const wrap=document.createElement("div"),bubble=document.createElement("div");bubble.className="bubble";bubble.textContent=text;wrap.appendChild(bubble);
 if(role==="ai"&&actions){const a=document.createElement("div");a.className="bubble-actions";const copy=document.createElement("button");copy.textContent="Copy";copy.onclick=()=>{navigator.clipboard?.writeText(text);copy.textContent="Copied"};a.appendChild(copy);wrap.appendChild(a)}
 row.append(av,wrap);messages.appendChild(row);messages.scrollTop=messages.scrollHeight;
}
function welcome(){
 messages.innerHTML='<div class="welcome"><div class="logo">✦</div><h1>How can I help you?</h1><p>Your professional AI workspace for learning, ideas, writing and coding.</p><div class="suggestions"><button>Explain a difficult topic simply</button><button>Help me learn Python step by step</button><button>Write and improve my text</button><button>Help me plan a project</button></div></div>';
 document.querySelectorAll(".suggestions button").forEach(b=>b.onclick=()=>{input.value=b.textContent;submit()});
}
function submit(){const t=input.value.trim();if(!t||busy)return;input.value="";input.style.height="auto";ask(t)}
async function ask(text){
 busy=true;send.disabled=true;add("user",text);current.push({role:"user",content:text});
 const typing=document.createElement("div");typing.className="msg ai";typing.innerHTML='<div class="avatar">✦</div><div class="bubble typing">Thinking…</div>';messages.appendChild(typing);messages.scrollTop=messages.scrollHeight;
 let answer="";
 try{
   const r=await fetch(backend+"/api/ask",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:text,context:JSON.stringify(current.slice(-10))})});
   if(!r.ok)throw new Error("backend");
   const d=await r.json();answer=d.answer||"No answer received.";
   status.innerHTML="<i></i> Online";status.className="online";
 }catch(e){answer="I can't reach the AI backend. Start the local backend and make sure its address is configured correctly.";status.innerHTML="<i></i> Offline";status.className=""}
 typing.remove();add("ai",answer);current.push({role:"assistant",content:answer});
 if(current.filter(x=>x.role==="user").length===1)chats.push({title:text.slice(0,42),messages:current});else if(chats.length)chats[chats.length-1].messages=current;
 save();renderHistory();busy=false;send.disabled=false;input.focus();
}
$("form").onsubmit=e=>{e.preventDefault();submit()};
$("newChat").onclick=()=>{current=[];welcome();input.focus();document.querySelector(".sidebar").classList.remove("open")};
$("clear").onclick=()=>{if(confirm("Clear all saved chats?")){chats=[];current=[];save();renderHistory();welcome()}};
function loadChat(i){const c=chats[i];if(!c)return;current=c.messages||[];messages.innerHTML="";current.forEach(x=>add(x.role==="assistant"?"ai":"user",x.content,x.role==="assistant"));document.querySelector(".sidebar").classList.remove("open")}
$("menu").onclick=()=>document.querySelector(".sidebar").classList.toggle("open");
$("closeMenu").onclick=()=>document.querySelector(".sidebar").classList.remove("open");
$("theme").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("myaiDark",document.body.classList.contains("dark"))};
if(localStorage.getItem("myaiDark")==="true")document.body.classList.add("dark");
$("modelBtn").onclick=()=>$("modelMenu").classList.toggle("hidden");
document.querySelectorAll(".model-menu button").forEach(b=>b.onclick=()=>{$("modelBtn").querySelector("span").textContent=b.textContent.split(" ")[0];$("modelMenu").classList.add("hidden")});
input.addEventListener("input",()=>{input.style.height="auto";input.style.height=Math.min(input.scrollHeight,180)+"px"});
input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit()}});
$("voiceBtn").onclick=()=>{
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR){alert("Voice input is not supported by this browser.");return}
 const r=new SR();r.lang="en-IN";r.onstart=()=>$("voiceBtn").textContent="🔴";r.onresult=e=>{input.value=e.results[0][0].transcript;submit()};r.onend=()=>$("voiceBtn").textContent="🎙";r.start();
};
renderHistory();welcome();
