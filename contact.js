(() => {
  'use strict';
  const form=document.getElementById('contact-form');
  const button=document.getElementById('send-inquiry');
  const status=document.getElementById('send-status');
  const error=document.getElementById('send-error');
  const fields=['contact-name','contact-email','contact-message'].map(id=>document.getElementById(id));
  let sending=false;
  fields.forEach(field=>field.addEventListener('input',()=>field.setCustomValidity('')));
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(sending) return;
    fields.forEach(field=>{field.value=field.value.trim();field.setCustomValidity('');});
    if(!fields[0].value) fields[0].setCustomValidity('Please enter your name.');
    if(fields[2].value.length<20) fields[2].setCustomValidity('Please describe your project in at least 20 characters.');
    if(!form.reportValidity()) return;
    sending=true;button.disabled=true;error.hidden=true;status.textContent='Sending your inquiry…';
    try {
      const response=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(form)).toString()});
      if(!response.ok) throw new Error('Submission not accepted');
      window.location.assign('/thank-you.html');
    } catch {
      sending=false;button.disabled=false;status.textContent='';
      error.textContent='We could not confirm that your inquiry was sent. Your details are still here. Please try again, or email a.manley2024@gmail.com.';
      error.hidden=false;
    }
  });
})();
