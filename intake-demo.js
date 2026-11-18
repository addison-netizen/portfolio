(() => {
  'use strict';
  function createDraft(input) {
    const data = Object.fromEntries(Object.entries(input).map(([key,value]) => [key,String(value || '').trim()]));
    for (const key of ['client','email','project','goal','deliverables']) if (!data[key]) throw new Error('Missing required detail: ' + key);
    const slug = data.project.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60).replace(/-$/,'') || 'project';
    return {
      filename: slug + '-brief-draft.txt',
      text: ['PROJECT BRIEF — DRAFT','Sample document · not an approved agreement','',
        'PROJECT: ' + data.project,'CLIENT: ' + data.client,'CONTACT: ' + data.email,'',
        '1. PROJECT GOAL',data.goal,'','2. REQUESTED DELIVERABLES',data.deliverables,'',
        '3. PREFERRED TIMELINE',data.timeline || 'To be confirmed.','',
        '4. DETAILS TO CONFIRM','- Final scope and acceptance criteria','- Budget and payment terms','- Required access, content, and responsibilities','- Agreed schedule and review process','',
        '5. REVIEW STATUS','Draft prepared from intake details. Review and confirm all information before proceeding.',''].join('\n')
    };
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {createDraft};
  if (typeof document === 'undefined') return;
  const el = id => document.getElementById(id);
  const keys = ['client','email','project','goal','deliverables','timeline'];
  const fields = Object.fromEntries(keys.map(key => [key,el(key)]));
  const form = el('intake-form');
  let filename = '';
  function invalidateReview() { el('reviewed').checked=false; el('download').disabled=true; el('download-status').textContent=''; }
  keys.forEach(key => fields[key].addEventListener('input',()=>fields[key].setCustomValidity('')));
  form.addEventListener('submit',event => {
    event.preventDefault();
    keys.forEach(key => {fields[key].value=fields[key].value.trim(); fields[key].setCustomValidity('');});
    for (const key of ['client','email','project','goal','deliverables']) if (!fields[key].value) fields[key].setCustomValidity('Please enter sample details.');
    for (const key of ['goal','deliverables']) if (fields[key].value.length<10) fields[key].setCustomValidity('Please enter at least 10 characters.');
    if (!form.reportValidity()) return;
    const result=createDraft(Object.fromEntries(keys.map(key=>[key,fields[key].value])));
    filename=result.filename;
    el('draft-text').value=result.text;
    el('draft-filename').textContent='Suggested filename: ' + filename;
    invalidateReview();
    el('intake-view').hidden=true; el('draft-view').hidden=false; el('draft-heading').focus();
  });
  el('sample').addEventListener('click',()=>{
    const sample={client:'Maple & Main',email:'jamie@example.com',project:'New customer welcome workflow',goal:'Keep new customer requests organized and make sure each person receives a timely response.',deliverables:'An intake form, an organized customer tracker, and a welcome email draft for review.',timeline:'Within four weeks, subject to scope review'};
    keys.forEach(key=>{fields[key].value=sample[key];fields[key].setCustomValidity('');});
    el('intake-status').textContent='Sample details added. Edit them or generate the draft.';
  });
  el('draft-text').addEventListener('input',invalidateReview);
  el('reviewed').addEventListener('change',()=>{el('download').disabled=!el('reviewed').checked || !el('draft-text').value.trim();});
  el('edit-intake').addEventListener('click',()=>{invalidateReview();el('draft-view').hidden=true;el('intake-view').hidden=false;fields.client.focus();});
  el('start-over').addEventListener('click',()=>{
    form.reset(); keys.forEach(key=>fields[key].setCustomValidity('')); filename='';
    el('draft-text').value='';el('draft-filename').textContent='';el('intake-status').textContent='';invalidateReview();
    el('draft-view').hidden=true;el('intake-view').hidden=false;fields.client.focus();
  });
  el('download').addEventListener('click',()=>{
    if (!el('reviewed').checked || !el('draft-text').value.trim() || !filename) return;
    const url=URL.createObjectURL(new Blob([el('draft-text').value],{type:'text/plain;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    el('download-status').textContent='Download requested. Check your browser downloads for ' + filename + '. Nothing was emailed.';
  });
  el('intake-fields').disabled=false;
})();
