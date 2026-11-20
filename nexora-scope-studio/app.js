(() => {
  'use strict';
  const form = document.getElementById('project-form');
  const output = document.getElementById('brief-output');
  const toast = document.getElementById('toast');
  const names = {website:'Website',app:'Mobile app',ai:'AI solution',automation:'Automation'};
  const base = {website:[9000,18000],app:[30000,60000],ai:[15000,35000],automation:[12000,28000]};
  const featureCost = {'User accounts':[4000,8000],'Admin dashboard':[5000,9000],'Payments or checkout':[6000,12000],'AI-powered feature':[5000,12000],'Analytics and reports':[2000,5000],'Multiple languages':[3000,6000]};
  let latestBrief = '';
  let toastTimer;
  const money = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Math.round(n));
  const type = () => form.querySelector('input[name="projectType"]:checked').value;
  const features = () => Array.from(form.querySelectorAll('input[name="features"]:checked')).map(x=>x.value);
  const budgetText = v => ({10000:'Under ₹10,000',25000:'₹10,000–₹25,000',50000:'₹25,000–₹50,000',100000:'₹50,000–₹1 lakh',200000:'₹1 lakh+'})[Number(v)] || 'Not specified';
  function estimate(){
    const t=type(), size=Number(form.elements.size.value), integrations=Number(form.elements.integrations.value), design=form.elements.design.value, selected=features();
    let low=base[t][0]+Math.max(0,size-3)*900+integrations*1800;
    let high=base[t][1]+Math.max(0,size-3)*1500+integrations*3500;
    selected.forEach(f=>{low+=featureCost[f][0];high+=featureCost[f][1];});
    if(design==='polished'){low+=4000;high+=7000;}
    if(design==='premium'){low+=8000;high+=15000;}
    return {t,size,integrations,design,selected,low,high};
  }
  function update(){
    const e=estimate(), budget=Number(form.elements.budget.value);
    document.getElementById('estimate-range').textContent=money(e.low)+'–'+money(e.high);
    document.getElementById('summary-type').textContent=names[e.t];
    document.getElementById('summary-size').textContent=e.size<=3?'1–3 items':e.size+' items approx.';
    document.getElementById('summary-features').textContent=String(e.selected.length);
    document.getElementById('summary-budget').textContent=budgetText(budget);
    const status=document.getElementById('budget-status'), title=document.getElementById('fit-title'), copy=document.getElementById('fit-copy');
    if(budget<e.low){status.textContent='Consider a smaller first phase';title.textContent='Build an MVP first';copy.textContent='Your selected budget is below this indicative scope. Start with the core outcome, then add lower-priority features in a later phase.';}
    else if(budget<e.high){status.textContent='Review the feature list';title.textContent='Prioritise the essentials';copy.textContent='Your budget overlaps the lower part of the estimate. Confirm integrations and features before agreeing on a final scope.';}
    else{status.textContent='Budget may cover this scope';title.textContent='Plan a realistic first release';copy.textContent='Your planned budget is at or above the indicative upper range. Keep a small contingency and confirm all requirements before development.';}
  }
  function notify(message){
    toast.textContent=message;toast.classList.add('show');window.clearTimeout(toastTimer);
    toastTimer=window.setTimeout(()=>toast.classList.remove('show'),2600);
  }
  function makeBrief(){
    const data=new FormData(form), e=estimate();
    const project=String(data.get('projectName')||'').trim(), brand=String(data.get('businessName')||'').trim(), goal=String(data.get('goal')||'').trim();
    if(!project||!goal){form.reportValidity();return;}
    const featureList=e.selected.length?e.selected.map(x=>'- '+x).join('\n'):'- Core functionality only; details to be confirmed';
    const integrations=e.integrations===0?'None planned at this stage':e.integrations+' integration(s), exact services to be confirmed';
    latestBrief=[
      'NEXORA AI — PROJECT DISCOVERY BRIEF','====================================',
      'Project: '+project,'Business / brand: '+(brand||'Not provided'),'Project type: '+names[e.t],'',
      'GOAL',goal,'','INITIAL SCOPE','Approximate pages / screens / workflows: '+e.size,
      'Design direction: '+e.design,'Requested features:',featureList,'Integrations: '+integrations,
      'Preferred timeline: '+data.get('timeline'),'','BUDGET PLANNING','Customer budget: '+budgetText(data.get('budget')),
      'Illustrative planning range: '+money(e.low)+'–'+money(e.high),
      'This is not a final quotation. Confirm scope, third-party costs, hosting, testing and delivery milestones before approval.',
      '','SUGGESTED NEXT STEPS','1. Review and confirm the goal and must-have features.',
      '2. Agree on the first-release scope and any later phases.',
      '3. Confirm timeline, responsibilities and final written quotation.',
      '4. Approve the plan before development begins.','',
      'Prepared with NEXORA Scope Studio. This brief is generated in your browser; it is not automatically sent or saved.'
    ].join('\n');
    output.textContent=latestBrief;notify('Project brief generated. Review it before sharing.');
  }
  form.addEventListener('input',update);
  form.addEventListener('change',update);
  form.addEventListener('submit',event=>{event.preventDefault();makeBrief();});
  form.addEventListener('reset',()=>{window.setTimeout(()=>{latestBrief='';output.textContent='Your project brief will appear here after you enter a project name and goal, then select “Generate project brief”.';update();},0);});
  document.getElementById('copy-brief').addEventListener('click',async()=>{
    if(!latestBrief){notify('Generate your project brief first.');return;}
    try{await navigator.clipboard.writeText(latestBrief);notify('Brief copied to clipboard.');}
    catch(error){
      const helper=document.createElement('textarea');helper.value=latestBrief;helper.setAttribute('readonly','');helper.style.position='fixed';helper.style.opacity='0';
      document.body.appendChild(helper);helper.select();const copied=document.execCommand('copy');helper.remove();
      notify(copied?'Brief copied to clipboard.':'Clipboard unavailable. Use Download .txt instead.');
    }
  });
  document.getElementById('download-brief').addEventListener('click',()=>{
    if(!latestBrief){notify('Generate your project brief first.');return;}
    const blob=new Blob([latestBrief],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download='nexora-project-brief.txt';document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url);notify('Your .txt brief is ready.');
  });
  document.getElementById('year').textContent=new Date().getFullYear();
  update();
})();