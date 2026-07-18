(function () {
  const drawer = document.getElementById('drawer');
  const messages = document.getElementById('messages');
  const input = document.getElementById('aiInput');
  function respond(question) {
    const q = question.toLowerCase();
    let target = 0;
    if (q.includes('困难') || q.includes('帮扶')) target = 3;
    else if (q.includes('岗位') || q.includes('技能') || q.includes('供需')) target = 2;
    else if (q.includes('产业') || q.includes('企业')) target = 4;
    else if (q.includes('学院') || q.includes('专业')) target = 1;
    if (target !== window.c) { window.c = target; window.render(); }
    const extra = target === 3 ? '建议举措：岗位专场、简历门诊、技能培训、心理支持、导师结对、企业直推，并按响应、参与、面试、就业转化追踪成效。' : '已同步更新该主题的指标、汇总图表和预警。';
    messages.insertAdjacentHTML('beforeend', `<div class="ai-msg user">${question}</div><div class="ai-msg">已切换至「${window.T[target].name.slice(3)}」。${extra}</div>`);
    messages.scrollTop = messages.scrollHeight;
  }
  document.getElementById('ask').onclick = () => drawer.classList.add('open');
  document.getElementById('ai').onclick = () => drawer.classList.add('open');
  document.getElementById('aiClose').onclick = () => drawer.classList.remove('open');
  document.getElementById('aiSend').onclick = () => { const q = input.value.trim(); if (q) { respond(q); input.value = ''; } };
  input.onkeydown = e => { if (e.key === 'Enter') document.getElementById('aiSend').click(); };
})();
