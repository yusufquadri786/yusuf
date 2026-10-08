const $=id=>document.getElementById(id);
const messages=$("messages");
let backend=localStorage.getItem("jarvisBackend")||"http://127.0.0.1:8000";
const controller="http://127.0.0.1:8010";
$("backendUrl").value=backend;
let recognition=null,listening=false;
const started=Date.now();

function activity(text){const el=$("activityText");if(el)el.textContent=text}
function addMessage(role,text){
 const el=document.createElement("div");el.className="msg "+role;
 el.innerHTML="<b>"+(role==="ai"?"JARVIS":"YOU")+"</b><p></p>";
 el.querySelector("p").textContent=text;messages.appendChild(el);messages.scrollTop=messages.scrollHeight;
}
function speak(text){
 if(!("speechSynthesis"in window))return;
 speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.94;u.pitch=.88;speechSynthesis.speak(u);
}
function localAnswer(q){
 const x=q.toLowerCase();
 if(x.includes("current time")||x==="time")return "The current local time is "+new Date().toLocaleTimeString();
 if(x.includes("who are you"))return "I am JARVIS X, an original AI command-center interface.";
 if(x.includes("hello")||x.includes("hi jarvis"))return "Hello. All core interface systems are online.";
 if(x.includes("artificial intelligence"))return "Artificial intelligence enables computers to perform tasks that normally require human-like reasoning, learning or perception.";
 if(x.includes("photosynthesis"))return "Photosynthesis is how green plants use light to make food from carbon dioxide and water, releasing oxygen.";
 return null;
}
function controlIntent(q){
 const x=q.toLowerCase().trim();
 const apps=["notepad","calculator","paint","explorer"];
 const folders=["desktop","documents","downloads"];
 const sites=["google","youtube","github"];
 for(const a of apps) if(x.includes("open "+a)||x==="start "+a) return ["open_app",a];
 for(const f of folders) if(x.includes("open "+f)||x.includes("show "+f)) return ["open_folder",f];
 for(const s of sites) if(x.includes("open "+s)||x.includes("go to "+s)) return ["open_site",s];
 if(x.includes("system information")||x.includes("system info")||x.includes("computer information")) return ["system_info",""];
 return null;
}
async function runControl(intent){
 try{
  const r=await fetch(controller+"/api/control",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:intent[0],target:intent[1]})});
  if(!r.ok)throw new Error("controller");
  const d=await r.json();return d.ok?(typeof d.result==="object"?JSON.stringify(d.result):d.result):d.result;
 }catch(e){return "Laptop control is offline. Start the local JARVIS controller with: python -m uvicorn jarvis_control_api:app --host 127.0.0.1 --port 8010";}
}
async function ask(q){
 q=q.trim();if(!q)return;
 addMessage("user",q);activity("Processing command: "+q);
 $("statusText").textContent="PROCESSING";$("listening").textContent="THINKING";$("aiBar").style.width="96%";
 const intent=controlIntent(q);
 let answer=intent?await runControl(intent):localAnswer(q);
 if(intent){activity("Safe local laptop-control action completed.");}
 if(!answer){
  try{
   const r=await fetch(backend+"/api/ask",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q})});
   if(!r.ok)throw new Error("backend");
   const d=await r.json();answer=d.answer||"I received no answer from the AI service.";
   $("engine").textContent="AI ONLINE";activity("Cloud AI response received.");
  }catch(e){
   answer="Advanced AI is offline. Start the JARVIS backend or use one of the safe laptop commands.";
   $("engine").textContent="LOCAL";activity("Advanced backend offline — local mode active.");
  }
 }
 addMessage("ai",answer);speak(answer);
 $("statusText").textContent="SYSTEM ONLINE";$("listening").textContent="SYSTEM STANDBY";$("aiBar").style.width="88%";
}
$("sendBtn").onclick=()=>{ask($("prompt").value);$("prompt").value=""};
$("prompt").addEventListener("keydown",e=>{if(e.key==="Enter")$("sendBtn").click()});
document.querySelectorAll("[data-cmd]").forEach(b=>b.onclick=()=>ask(b.dataset.cmd));
$("micBtn").onclick=()=>{
 if(!recognition){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){addMessage("ai","Voice recognition is not supported by this browser. Try Chrome or Edge.");return}
  recognition=new SR();recognition.lang="en-IN";recognition.interimResults=false;recognition.continuous=false;
  recognition.onstart=()=>{listening=true;$("voiceState").textContent="LISTENING";$("listening").textContent="LISTENING";$("statusText").textContent="VOICE INPUT";activity("Microphone active — listening.");$("orb").style.filter="brightness(1.5)"};
  recognition.onresult=e=>ask(e.results[0][0].transcript);
  recognition.onerror=()=>{listening=false;$("voiceState").textContent="READY";$("listening").textContent="SYSTEM STANDBY";$("statusText").textContent="SYSTEM ONLINE";activity("Voice input ended.")};
  recognition.onend=()=>{listening=false;$("voiceState").textContent="READY";$("listening").textContent="SYSTEM STANDBY";$("statusText").textContent="SYSTEM ONLINE";$("orb").style.filter=""};
 }
 recognition.start();
};
setInterval(()=>{
 $("clock").textContent=new Date().toLocaleTimeString();
 const sec=Math.floor((Date.now()-started)/1000),h=String(Math.floor(sec/3600)).padStart(2,"0"),m=String(Math.floor(sec%3600/60)).padStart(2,"0"),s=String(sec%60).padStart(2,"0");
 $("uptime").textContent=h+":"+m+":"+s;
},1000);
$("settingsBtn").onclick=()=>$("settings").classList.remove("hidden");
$("closeSettings").onclick=()=>$("settings").classList.add("hidden");
$("saveSettings").onclick=()=>{
 backend=$("backendUrl").value.replace(/\/$/,"");localStorage.setItem("jarvisBackend",backend);
 $("settings").classList.add("hidden");activity("Backend configuration saved.");addMessage("ai","Backend address saved.");
};
window.addEventListener("keydown",e=>{if(e.key.toLowerCase()==="j"&&e.ctrlKey){e.preventDefault();$("micBtn").click()}});
