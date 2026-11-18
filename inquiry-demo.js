(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const form = byId('inquiry-form');
  const fields = {name: byId('inquiry-name'), email: byId('inquiry-email'), type: byId('inquiry-type'), message: byId('inquiry-message')};
  const formView = byId('form-view');
  const resultView = byId('result-view');
  const status = byId('sample-status');
  Object.values(fields).forEach(field => field.addEventListener('input', () => field.setCustomValidity('')));
  form.addEventListener('submit', event => {
    event.preventDefault();
    Object.values(fields).forEach(field => { field.value = field.value.trim(); field.setCustomValidity(''); });
    if (!fields.name.value) fields.name.setCustomValidity('Please enter a sample name.');
    if (fields.message.value.length < 10) fields.message.setCustomValidity('Please add at least 10 characters about the project.');
    if (!form.reportValidity()) return;
    Object.entries(fields).forEach(([key, field]) => { byId('result-' + key).textContent = field.value; });
    formView.hidden = true;
    resultView.hidden = false;
    byId('result-heading').focus();
  });
  byId('sample-button').addEventListener('click', () => {
    fields.name.value = 'Jamie Taylor';
    fields.email.value = 'jamie@example.com';
    fields.type.value = 'Workflow automation';
    fields.message.value = 'I run a small creative studio and want new website inquiries organized in one place, with a reminder to follow up.';
    Object.values(fields).forEach(field => field.setCustomValidity(''));
    status.textContent = 'Sample details added. You can edit them or preview the inquiry.';
  });
  byId('edit-button').addEventListener('click', () => {
    resultView.hidden = true;
    formView.hidden = false;
    fields.name.focus();
  });
  byId('reset-button').addEventListener('click', () => {
    form.reset();
    Object.entries(fields).forEach(([key, field]) => { field.setCustomValidity(''); byId('result-' + key).textContent = ''; });
    status.textContent = '';
    resultView.hidden = true;
    formView.hidden = false;
    fields.name.focus();
  });
  byId('form-fields').disabled = false;
})();
