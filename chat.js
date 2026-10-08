const $=id=>document.getElementById(id);
const messages=$("messages"),historyEl=$("history"),input=$("input"),send=$("send"),status=$("status");
let backend=localStorage.getItem("jarvisBackend")||"http://127.0.0.1:8000", chats=JSON.parse(localStorage.getItem("myaiChats")||"[]"), current=[];
function save(){localStorage.setItem("myaiChats",JSON.stringify(chats))}
function renderHistory(){historyEl.innerHTML="";chats.slice().reverse().forEach((c,i)=>{const b=document.createElement("button");b.textContent=c.title||"New chat";b.onclick=()=>loadChat(chats.length-1-i);historyEl.appendChild(b)})}
function add(role,text){const row=document.createElement("div");row.className="msg "+role;const av=document.createElement("div");av.className="avatar";av.textContent=role==="ai"?"✦":"U";const bubble=document.createElement("div");bubble.className="bubble";bubble.textContent=text;row.append(av,bubble);messages.appendChild(row);messages.scrollTop=messages.scrollHeight}
function welcome(){messages.innerHTML='<div class="welcome"><div class="logo">✦</div><h1>How can I help you?</h1><p>Ask questions, learn concepts, write ideas, or get help with your work.</p><div class="suggestions"><button>Explain photosynthesis simply</button><button>Help me learn Python</button><button>Write a short story</button><button>Give me study tips</button></div></div>';document.querySelectorAll(".suggestions button").forEach(b=>b.onclick=()=>{input.value=b.textContent;send.click()})}
async function ask(text){
 add("user",text);current.push({role:"user",content:text});send.disabled=true;
 const typing=document.createElement("div");typing.className="msg ai";typing.innerHTML='<div class="avatar">✦</div><div class="bubble typing">Thinking…</div>';messages.appendChild(typing);messages.scrollTop=messages.scrollHeight;
 let answer="";
 try{const r=await fetch(backend+"/api/ask",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:text})});if(!r.ok)throw 0;const d=await r.json();answer=d.answer||"No answer received.";status.textContent="● Online";status.className="on"}catch(e){answer="I can't reach the AI backend right now. Start your JARVIS backend on port 8000, then try again.";status.textContent="● Offline";status.className=""}
 typing.remove();add("ai",answer);current.push({role:"assistant",content:answer});
 if(current.filter(x=>x.role==="user").length===1)chats.push({title:text.slice(0,42),messages:current});else{const c=chats[chats.length-1];if(c)c.messages=current}
 save();renderHistory();send.disabled=false;input.focus()
}
$("form").onsubmit=e=>{e.preventDefault();const t=input.value.trim();if(!t)return;input.value="";ask(t)};
$("newChat").onclick=()=>{current=[];welcome();input.focus()};
$("clear").onclick=()=>{chats=[];current=[];save();renderHistory();welcome()};
function loadChat(i){const c=chats[i];if(!c)return;current=c.messages||[];messages.innerHTML="";current.forEach(x=>add(x.role==="assistant"?"ai":"user",x.content))}
$("menu").onclick=()=>document.querySelector(".sidebar").classList.toggle("open");
input.addEventListener("input",()=>{input.style.height="auto";input.style.height=Math.min(input.scrollHeight,180)+"px"});
renderHistory();welcome();
