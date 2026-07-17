const roleConfig = {
  leader: { label: '校领导', title: '全校就业治理总览', crumb: '决策驾驶舱 / 全校总览', stage: 'globe', workspace: 'leader' },
  college: { label: '二级学院', title: '学院教学反馈专题', crumb: '学院教学专题 / 培养诊断', stage: 'college', workspace: 'college' },
  industry: { label: '工信部门', title: '区域产业人才协同', crumb: '政务供需专题 / 产业人才', stage: 'industry', workspace: 'industry' },
  hr: { label: '人社部门', title: '区域就业治理专题', crumb: '政务供需专题 / 就业治理', stage: 'industry', workspace: 'industry' },
  career: { label: '就业处', title: '就业过程运营作战', crumb: '就业运营台 / 过程运营', stage: 'operation', workspace: 'career' },
  student: { label: '学生', title: '我的就业机会中心', crumb: '学生服务端 / 个人机会', stage: 'student', workspace: 'student' }
};

const metricSets = {
  default: [
    ['毕业生规模', '11,065', '2025届正式样本'],
    ['去向落实率', '91.47%', '统一统计口径'],
    ['留桂率', '50.75%', '区内就业贡献'],
    ['专业对口度', '86.79%', '就业质量指标']
  ],
  student: [
    ['能力档案', '待完善', '补充证书与实训经历'],
    ['匹配岗位', '接入中', '岗位数据通过校验后开放'],
    ['求职进度', '本人可见', '按授权展示过程记录'],
    ['就业老师', '可联系', '需要时发起服务申请']
  ]
};

const structures = {
  college: [['智能制造学院', '94.2%', '良好'], ['交通运输学院', '92.8%', '良好'], ['信息工程学院', '90.6%', '关注'], ['商贸管理学院', '88.7%', '预警'], ['艺术设计学院', '86.9%', '预警']],
  group: [['困难毕业生', '89.4%', '关注'], ['少数民族学生', '90.8%', '良好'], ['离校未就业', '327人', '预警'], ['专升本群体', '17.52%', '良好']],
  region: [['广西', '50.75%', '核心'], ['广东', '37.38%', '主要'], ['长三角', '4.62%', '关注'], ['其他地区', '7.25%', '稳定']],
  industry: [['制造业', '30.83%', '核心'], ['教育行业', '14.26%', '稳定'], ['信息技术', '12.48%', '增长'], ['现代服务业', '11.72%', '稳定']]
};

const alerts = [
  { title: '商贸管理学院低于校均值', state: '待研判', detail: '关联落实率与专业对口度' },
  { title: '离校未就业学生 327 人', state: '需帮扶', detail: '按授权下钻未就业原因' },
  { title: '制造业人才供给结构偏差', state: '需复核', detail: '外部岗位数据尚未正式接入' },
  { title: '3 项就业数据待校验', state: '今日', detail: '异常记录等待责任部门确认' }
];

const regionData = {
  '南宁市': { short: '南宁', lon: 108.37, lat: 22.82, focus: '数字经济、现代服务、先进制造', status: '城市明细接入中' },
  '柳州市': { short: '柳州', lon: 109.42, lat: 24.33, focus: '汽车、机械制造、智能制造', status: '城市明细接入中' },
  '桂林市': { short: '桂林', lon: 110.29, lat: 25.27, focus: '文旅、电子信息、装备制造', status: '城市明细接入中' },
  '梧州市': { short: '梧州', lon: 111.28, lat: 23.48, focus: '再生资源、食品医药、电子信息', status: '城市明细接入中' },
  '北海市': { short: '北海', lon: 109.12, lat: 21.49, focus: '电子信息、临港产业、文旅', status: '城市明细接入中' },
  '防城港市': { short: '防城港', lon: 108.35, lat: 21.69, focus: '钢铁、有色金属、临港物流', status: '城市明细接入中' },
  '钦州市': { short: '钦州', lon: 108.62, lat: 21.95, focus: '石化、新能源材料、港航物流', status: '城市明细接入中' },
  '贵港市': { short: '贵港', lon: 109.60, lat: 23.10, focus: '新能源汽车、木业、现代物流', status: '城市明细接入中' },
  '玉林市': { short: '玉林', lon: 110.18, lat: 22.65, focus: '机械制造、医药健康、服装皮革', status: '城市明细接入中' },
  '百色市': { short: '百色', lon: 106.62, lat: 23.90, focus: '铝产业、农业加工、新能源', status: '城市明细接入中' },
  '贺州市': { short: '贺州', lon: 111.55, lat: 24.42, focus: '碳酸钙、生态食品、文旅康养', status: '城市明细接入中' },
  '河池市': { short: '河池', lon: 108.06, lat: 24.70, focus: '有色金属、茧丝绸、生态产业', status: '城市明细接入中' },
  '来宾市': { short: '来宾', lon: 109.23, lat: 23.73, focus: '制糖、能源、碳酸钙', status: '城市明细接入中' },
  '崇左市': { short: '崇左', lon: 107.36, lat: 22.40, focus: '糖业、口岸物流、特色农业', status: '城市明细接入中' }
};

let currentRole = 'leader';
let structureKey = 'college';
let stageKey = 'globe';
let toastTimer;
let globeAnimationId = 0;
let globeRenderer = null;
let globeObserver = null;
let activeRegion = null;
let regionConversation = [];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function renderMetrics() {
  const metrics = currentRole === 'student' ? metricSets.student : metricSets.default;
  $('#metricGrid').innerHTML = metrics.map((metric, index) => `
    <button class="metric ${index === 1 ? 'active' : ''}" data-metric="${metric[0]}" title="查看${metric[0]}的结构与口径">
      <small>${metric[0]}</small><strong>${metric[1]}</strong><em>${metric[2]}</em>
    </button>`).join('');
}

function statusClass(status) {
  if (status === '预警') return 'risk';
  if (status === '关注') return 'warn';
  return 'good';
}

function renderStructure() {
  $('#structureList').innerHTML = structures[structureKey].map((row, index) => `
    <button class="structure-row" data-item="${row[0]}" title="下钻查看${row[0]}">
      <span>${String(index + 1).padStart(2, '0')} · ${row[0]}</span><span>${row[1]}</span><em class="${statusClass(row[2])}">${row[2]}</em>
    </button>`).join('');
}

function globeView() {
  const capabilities = [
    ['指标查询', '预设问题 + 参数化查询'],
    ['数据解读', '固定框架 + 结构化数据'],
    ['异常分析', '展示证据，不推断因果'],
    ['供需匹配', '规则与标签先行'],
    ['行动建议', '业务人员确认后执行']
  ];
  const steps = [
    ['01', '发起查询', '指标、问题或地球仪入口'],
    ['02', '识别条件', '指标、学院、专业与时间'],
    ['03', '权限调用', '返回授权范围内结果'],
    ['04', '同屏解读', '图表、明细、口径与更新'],
    ['05', '下钻行动', '继续分析或生成任务']
  ];
  return `<div class="globe-view">
    <aside class="globe-rail capability-rail">
      <div class="globe-rail-title"><span>ANALYSIS</span><b>首期分析能力</b></div>
      <div class="capability-list">${capabilities.map((item, index) => `<button data-globe-question="${item[0]}" title="查询${item[0]}"><i>0${index + 1}</i><span><b>${item[0]}</b><small>${item[1]}</small></span></button>`).join('')}</div>
    </aside>
    <section class="globe-center" aria-label="平台统一查询入口">
      <div class="globe-orbit globe-orbit-one"></div><div class="globe-orbit globe-orbit-two"></div>
      <canvas id="globeCanvas" aria-label="可交互数据地球仪"></canvas>
      <div class="region-label-layer">${Object.entries(regionData).map(([name, region]) => `<button class="region-label" data-region="${name}" title="查询${name}数据"><i></i>${region.short}</button>`).join('')}</div>
      <button class="globe-entry" data-globe-query title="查询广西全区数据"><span>GUANGXI DATA GLOBE</span><b>广西区域智能查询</b><small>点击城市名称查看地区分析</small></button>
      <div class="globe-signals"><span>14 个设区市</span><span>地区点击查询</span><span>依据可追溯</span></div>
    </section>
    <aside class="globe-rail process-rail">
      <div class="globe-rail-title"><span>QUERY FLOW</span><b>同屏查询与解读</b></div>
      <ol>${steps.map(item => `<li><i>${item[0]}</i><span><b>${item[1]}</b><small>${item[2]}</small></span></li>`).join('')}</ol>
    </aside>
    <div class="globe-boundary"><b>数据使用边界</b><span>统计事实与建议分区</span><span>敏感字段授权脱敏</span><span>查询日志全程留痕</span><span>学生评价须人工复核</span></div>
  </div>`;
}

function disposeGlobe() {
  cancelAnimationFrame(globeAnimationId);
  globeAnimationId = 0;
  globeObserver?.disconnect();
  globeObserver = null;
  globeRenderer?.dispose();
  globeRenderer = null;
}

function initGlobe() {
  disposeGlobe();
  const canvas = $('#globeCanvas');
  const host = canvas?.parentElement;
  if (!canvas || !host || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
  camera.position.set(0, .08, 3.35);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  globeRenderer = renderer;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const globe = new THREE.Group();
  globe.rotation.x = -.14;
  globe.rotation.z = -.08;
  scene.add(globe);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0x18aee0, wireframe: true, transparent: true, opacity: .16 })
  );
  globe.add(sphere);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.035, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0x35dfff, transparent: true, opacity: .09, side: THREE.BackSide })
  );
  globe.add(atmosphere);

  const pointPositions = [];
  const pointColors = [];
  const colorA = new THREE.Color(0x38ddff);
  const colorB = new THREE.Color(0x2de3ae);
  const pointCount = 1150;
  for (let index = 0; index < pointCount; index += 1) {
    const y = 1 - (index / (pointCount - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = Math.PI * (3 - Math.sqrt(5)) * index;
    pointPositions.push(Math.cos(theta) * radius * 1.012, y * 1.012, Math.sin(theta) * radius * 1.012);
    const color = index % 7 < 5 ? colorA : colorB;
    pointColors.push(color.r, color.g, color.b);
  }
  const pointGeometry = new THREE.BufferGeometry();
  pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pointPositions, 3));
  pointGeometry.setAttribute('color', new THREE.Float32BufferAttribute(pointColors, 3));
  const points = new THREE.Points(pointGeometry, new THREE.PointsMaterial({ size: .018, transparent: true, opacity: .74, vertexColors: true }));
  globe.add(points);

  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x2bceff, transparent: true, opacity: .22, side: THREE.DoubleSide });
  const ringOne = new THREE.Mesh(new THREE.TorusGeometry(1.16, .006, 8, 120), ringMaterial);
  ringOne.rotation.x = Math.PI / 2.35;
  globe.add(ringOne);
  const ringTwo = ringOne.clone();
  ringTwo.scale.setScalar(1.08);
  ringTwo.rotation.set(Math.PI / 2.7, .4, .7);
  globe.add(ringTwo);

  const regionMeshes = [];
  const regionPositions = {};
  Object.entries(regionData).forEach(([name, region], index) => {
    const x = ((region.lon - 109.1) / 3.25) * .78;
    const y = ((region.lat - 23.3) / 2.35) * .72;
    const z = Math.sqrt(Math.max(.1, 1 - x * x - y * y));
    const position = new THREE.Vector3(x, y, z).normalize().multiplyScalar(1.045);
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(name === '南宁市' ? .038 : .026, 14, 14),
      new THREE.MeshBasicMaterial({ color: name === '南宁市' ? 0xf5c24d : index % 3 === 0 ? 0xb28cff : 0x35e4bd })
    );
    node.position.copy(position);
    node.userData.region = name;
    globe.add(node);
    regionMeshes.push(node);
    regionPositions[name] = position;
  });

  const arcTargets = ['柳州市', '桂林市', '钦州市', '百色市', '梧州市'];
  arcTargets.forEach((name, index) => {
    const start = regionPositions['南宁市'].clone();
    const end = regionPositions[name].clone();
    const middle = start.clone().add(end).normalize().multiplyScalar(1.42 + index * .04);
    const curve = new THREE.QuadraticBezierCurve3(start, middle, end);
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
    globe.add(new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: index % 2 ? 0xb28cff : 0x38dfff, transparent: true, opacity: .55 })));
  });

  const regionLabels = [...host.querySelectorAll('[data-region]')];
  const labelOffsets = { '防城港市': [-11, 7], '钦州市': [10, -5], '北海市': [7, 7] };
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  canvas.addEventListener('click', event => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(regionMeshes)[0];
    if (hit?.object?.userData?.region) openRegionQuery(hit.object.userData.region);
  });

  const resize = () => {
    const rect = host.getBoundingClientRect();
    const width = Math.max(240, rect.width);
    const height = Math.max(240, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  resize();
  globeObserver = new ResizeObserver(resize);
  globeObserver.observe(host);

  let targetRotationX = globe.rotation.x;
  let targetRotationY = 0;
  host.addEventListener('pointermove', event => {
    const rect = host.getBoundingClientRect();
    targetRotationY = ((event.clientX - rect.left) / rect.width - .5) * .22;
    targetRotationX = -.14 + ((event.clientY - rect.top) / rect.height - .5) * .16;
  }, { passive: true });
  host.addEventListener('pointerleave', () => { targetRotationX = -.14; targetRotationY = 0; }, { passive: true });

  const animate = (time = 0) => {
    const idleRotation = Math.sin(time * .00035) * .045;
    globe.rotation.y += (targetRotationY + idleRotation - globe.rotation.y) * .035;
    globe.rotation.x += (targetRotationX - globe.rotation.x) * .035;
    ringOne.rotation.z += .0016;
    ringTwo.rotation.z -= .0011;
    globe.updateMatrixWorld(true);
    const rect = host.getBoundingClientRect();
    regionLabels.forEach(label => {
      const node = regionMeshes.find(item => item.userData.region === label.dataset.region);
      if (!node) return;
      const world = node.position.clone().applyMatrix4(globe.matrixWorld);
      const projected = world.clone().project(camera);
      const [offsetX = 0, offsetY = 0] = labelOffsets[label.dataset.region] || [];
      label.style.left = `${(projected.x * .5 + .5) * rect.width + offsetX}px`;
      label.style.top = `${(-projected.y * .5 + .5) * rect.height + offsetY}px`;
      label.classList.toggle('is-hidden', world.z < .15 || Math.abs(projected.x) > 1 || Math.abs(projected.y) > 1);
    });
    renderer.render(scene, camera);
    globeAnimationId = requestAnimationFrame(animate);
  };
  animate();
}

function collegeView() {
  const rows = [
    ['智能制造学院', '94.2%', '90.1%', '58.4%', '+2.7'],
    ['交通运输学院', '92.8%', '88.7%', '54.9%', '+1.3'],
    ['信息工程学院', '90.6%', '85.2%', '45.8%', '-0.9'],
    ['商贸管理学院', '88.7%', '79.6%', '48.1%', '-2.8'],
    ['艺术设计学院', '86.9%', '76.8%', '42.3%', '-4.6']
  ];
  return `<div class="diagnosis-grid">
    <section class="diagnostic-module primary">
      <div class="module-heading"><b>学院就业诊断矩阵</b><span>结构演示 · 上线绑定正式数据</span></div>
      <table class="diag-table"><thead><tr><th>学院</th><th>落实率</th><th>对口度</th><th>留桂率</th><th>目标差</th></tr></thead>
        <tbody>${rows.map(row => `<tr data-college="${row[0]}">${row.map((cell, index) => `<td class="${index === 4 ? (cell.startsWith('+') ? 'positive' : 'negative') : ''}">${cell}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
      <div class="panel-note"><span>数据边界</span>学院明细为交互结构演示；正式上线须绑定统一指标服务与更新时间。</div>
    </section>
    <section class="diagnostic-module">
      <div class="module-heading"><b>未就业原因</b><span>待接入过程数据</span></div>
      <div class="bar-list">${[['求职中',46],['升学准备',24],['暂不就业',17],['材料待审核',13]].map(item => `<div class="bar-row"><div><span>${item[0]}</span><b>${item[1]}%</b></div><div class="bar-track"><i style="width:${item[1]}%"></i></div></div>`).join('')}</div>
    </section>
    <section class="diagnostic-module">
      <div class="module-heading"><b>能力证据与教学反馈</b><span>需人工确认</span></div>
      <div class="evidence-list">
        <div class="evidence-item risk"><b>专业对口度信号</b><p>定位低于校均的专业，继续核验岗位与课程映射。</p></div>
        <div class="evidence-item"><b>实训经历证据</b><p>对比实训经历与录用转化，避免直接推断因果。</p></div>
        <div class="evidence-item"><b>建议动作</b><p>复核后生成教学研判或学生帮扶任务。</p></div>
      </div>
    </section>
  </div>`;
}

function industryView() {
  return `<div class="diagnosis-grid">
    <section class="diagnostic-module primary" style="overflow:auto">
      <div class="module-heading"><b>专业—产业—岗位—区域流向</b><span>就业结果已接入 · 岗位需求接入中</span></div>
      <div class="supply-flow">
        <svg class="flow-lines" viewBox="0 0 800 250" preserveAspectRatio="none" aria-hidden="true">
          <path d="M110,55 C205,55 190,38 285,38 M110,55 C205,55 190,110 285,110 M110,150 C205,150 190,180 285,180 M310,38 C405,38 390,54 485,54 M310,110 C405,110 390,125 485,125 M310,180 C405,180 390,198 485,198 M510,54 C605,54 590,72 685,72 M510,125 C605,125 590,145 685,145 M510,198 C605,198 590,210 685,210" />
        </svg>
        <div class="flow-column"><b>学校供给</b><div class="flow-node">制造类专业<strong>3,411</strong></div><div class="flow-node">数字技术类<strong>1,381</strong></div></div>
        <div class="flow-column"><b>产业方向</b><div class="flow-node">制造业<strong>30.83%</strong></div><div class="flow-node">信息技术<strong>12.48%</strong></div><div class="flow-node">现代服务<strong>11.72%</strong></div></div>
        <div class="flow-column"><b>岗位需求</b><div class="flow-node">智能制造岗位<strong>接入中</strong></div><div class="flow-node">工业软件岗位<strong>接入中</strong></div><div class="flow-node">商贸服务岗位<strong>接入中</strong></div></div>
        <div class="flow-column"><b>就业区域</b><div class="flow-node">广西<strong>50.75%</strong></div><div class="flow-node">广东<strong>37.38%</strong></div><div class="flow-node">其他地区<strong>11.87%</strong></div></div>
      </div>
    </section>
    <section class="diagnostic-module">
      <div class="module-heading"><b>重点产业人才贡献</b><span>产业口径待共建</span></div>
      <div class="bar-list">${[['制造业',78],['新能源汽车',64],['数字经济',49],['现代物流',42]].map(item => `<div class="bar-row"><div><span>${item[0]}</span><b>${item[1]}</b></div><div class="bar-track"><i style="width:${item[1]}%"></i></div></div>`).join('')}</div>
    </section>
    <section class="diagnostic-module">
      <div class="module-heading"><b>技能需求差距</b><span>参考信号</span></div>
      <div class="evidence-list"><div class="evidence-item"><b>等待岗位描述数据</b><p>技能热度与增速将在结构化岗位描述校验后开放。</p></div><div class="evidence-item risk"><b>不可直接用于招生调整</b><p>需结合稳定周期、样本规模和企业访谈人工确认。</p></div></div>
    </section>
  </div>`;
}

function operationView() {
  const stages = [['岗位触达','待接入','92%','#3377c5'], ['学生投递','待接入','76%','#25866c'], ['企业面试','待接入','60%','#7464b8'], ['录用 Offer','待接入','46%','#c88120'], ['最终签约','已核验','34%','#123c32']];
  return `<div class="diagnosis-grid">
    <section class="diagnostic-module primary"><div class="module-heading"><b>求职转化漏斗</b><span>过程数据分阶段接入</span></div><div class="funnel">${stages.map(item => `<div style="width:${item[2]};background:${item[3]}"><b>${item[0]}</b>${item[1]}</div>`).join('')}</div><div class="panel-note"><span>运营目标</span>识别求职流程卡点，并将学生、岗位、企业问题转为责任任务。</div></section>
    <section class="diagnostic-module"><div class="module-heading"><b>学生服务分层</b><span>按角色授权</span></div><div class="bar-list">${[['已落实',68],['求职活跃',19],['需重点帮扶',8],['暂不就业',5]].map(item => `<div class="bar-row"><div><span>${item[0]}</span><b>${item[1]}%</b></div><div class="bar-track"><i style="width:${item[1]}%"></i></div></div>`).join('')}</div></section>
    <section class="diagnostic-module"><div class="module-heading"><b>岗位与企业效能</b><span>接入中</span></div><div class="evidence-list"><div class="evidence-item"><b>岗位有效率</b><p>等待岗位明细及有效期字段。</p></div><div class="evidence-item"><b>企业录用率</b><p>需建立面试、Offer 与签约回填机制。</p></div></div></section>
  </div>`;
}

function studentView() {
  return `<div class="diagnosis-grid">
    <section class="diagnostic-module primary"><div class="module-heading"><b>个人能力与岗位匹配</b><span>仅本人可见</span></div><div class="answer-empty" style="min-height:230px"><span>◎</span><b>岗位数据正在接入</b><p>完善技能、证书、实训和求职意向后，平台将提供可解释的岗位匹配结果。</p></div><div class="panel-note"><span>推荐可解释</span>系统会分别说明已匹配能力、缺失能力和数据依据，不输出无证据结论。</div></section>
    <section class="diagnostic-module"><div class="module-heading"><b>能力档案</b><span>本人维护</span></div><div class="evidence-list"><div class="evidence-item"><b>专业与课程</b><p>已从校内系统同步，异常可申请修正。</p></div><div class="evidence-item risk"><b>技能与实训</b><p>待补充证书、竞赛和企业实训记录。</p></div></div></section>
    <section class="diagnostic-module"><div class="module-heading"><b>下一步行动</b><span>可执行建议</span></div><div class="evidence-list"><div class="evidence-item"><b>完善求职意向</b><p>补充期望城市、行业和岗位方向。</p></div><div class="evidence-item"><b>联系就业老师</b><p>需要帮扶时可提交服务申请。</p></div></div></section>
  </div>`;
}

function renderStage() {
  disposeGlobe();
  const titles = { globe: '数据查询与分析', college: '学院诊断', industry: '产业协同', operation: '运营作战', student: '个人机会' };
  $('#stageTitle').textContent = titles[stageKey];
  $('#stageStepLabel').textContent = stageKey === 'globe' ? '03 · 智能查询' : stageKey === 'student' ? '03 · 个人机会' : '03 · 看原因';
  $('#stageContent').innerHTML = stageKey === 'globe' ? globeView() : stageKey === 'college' ? collegeView() : stageKey === 'industry' ? industryView() : stageKey === 'operation' ? operationView() : studentView();
  $$('.stage-tabs button').forEach(button => button.classList.toggle('active', button.dataset.stage === stageKey));
  $('.stage-tabs').style.visibility = stageKey === 'student' ? 'hidden' : 'visible';
  if (stageKey === 'globe') requestAnimationFrame(initGlobe);
}

function renderAlerts() {
  $('#alertList').innerHTML = alerts.map(alert => `<button class="alert-item" data-alert="${alert.title}" title="查看并处置${alert.title}"><div><i class="alert-dot"></i><b>${alert.title}</b><em>${alert.state}</em></div><p>${alert.detail}</p></button>`).join('');
}

function clearRegionQuery() {
  activeRegion = null;
  regionConversation = [];
  $$('[data-region]').forEach(label => label.classList.remove('active'));
}

function setWorkspace(role, showNotice = true) {
  const config = roleConfig[role];
  if (!config) return;
  currentRole = role;
  clearRegionQuery();
  stageKey = config.stage;
  $('#roleSelect').value = role;
  $('#pageTitle').textContent = '广西区域化岗位数据供需一体化平台';
  $('#breadcrumb').textContent = config.title;
  $('#aiContext').textContent = `${$('#periodSelect').value} · ${$('#scopeSelect').value} · ${config.label}`;
  $('#app').dataset.role = role;
  $('#dashboard').classList.toggle('student-view', role === 'student');
  $('#destinationBlock').hidden = role === 'student';
  renderMetrics();
  renderStage();
  $('#drawerBackdrop').classList.remove('open');
  if (showNotice) toast(`已切换为${config.label}视角`);
}

function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('show'), 2200);
}

function openAI(question = '') {
  $('#aiDrawer').classList.add('open');
  $('#aiDrawer').setAttribute('aria-hidden', 'false');
  $('#insightFab').setAttribute('aria-expanded', 'true');
  $('#drawerBackdrop').classList.add('open');
  if (question) runAI(question);
}

function closeAI() {
  $('#aiDrawer').classList.remove('open');
  $('#aiDrawer').setAttribute('aria-hidden', 'true');
  $('#insightFab').setAttribute('aria-expanded', 'false');
  $('#drawerBackdrop').classList.remove('open');
}

function answerFor(question) {
  if (question.includes('学院')) return {
    fact: '当前演示结构中，智能制造学院落实率为 94.2%，商贸管理学院为 88.7%。学院明细尚需在上线时绑定统一指标服务，不能替代正式报表。',
    suggestion: '建议优先定位低于目标的学院，结合专业、未就业原因和岗位流向复核，再生成学院督导任务。'
  };
  if (question.includes('产业') || question.includes('技能') || question.includes('岗位')) return {
    fact: '2025届就业结果显示，制造业吸纳占比为 30.83%，留桂率为 50.75%。实时岗位与技能需求接口仍在接入中，因此当前不能给出正式岗位缺口数量。',
    suggestion: '可先以就业流向识别重点产业方向；待岗位样本、有效期和技能字段完成校验后，再开展供需比与课程差距研判。'
  };
  return {
    fact: '2025届毕业生 11,065 人，毕业去向落实率 91.47%，留桂率 50.75%，专业对口度 86.79%。单位就业占 73.57%，升学占 17.52%，待就业占 8.52%。',
    suggestion: '建议继续查看学院差异与离校未就业群体，并将明确异常转入任务闭环。统计事实与建议应分区使用。'
  };
}

function regionAnswerFor(question, regionName) {
  const region = regionData[regionName];
  if (question.includes('产业') || question.includes('方向')) {
    return `${regionName}当前产业标签参考为：${region.focus}。该标签用于组织查询条件，不代表岗位数量或人才缺口结论；城市岗位明细接入并校验后，才能计算岗位趋势和供需比。`;
  }
  if (question.includes('来源') || question.includes('口径') || question.includes('真实')) {
    return `当前可核验来源为2025届全校就业质量数据，正式指标包括毕业生11,065人、去向落实率91.47%、留桂率50.75%和专业对口度86.79%。${regionName}城市级就业人数、岗位总量、薪资和匹配率尚未接入，平台不会补造数据。`;
  }
  if (question.includes('建议') || question.includes('下一步') || question.includes('怎么')) {
    return `建议先接入${regionName}的有效在招岗位、行业、技能、薪资与有效期字段，再与学校专业、毕业生供给和就业流向关联。完成质量校验后，可继续生成拓岗、学生推荐或课程研判任务，并由业务人员确认。`;
  }
  return `已定位${regionName}。当前可核验的全区基线为：2025届毕业生11,065人、去向落实率91.47%、留桂率50.75%、专业对口度86.79%。${regionName}的产业标签参考为“${region.focus}”；城市级就业人数、岗位总量和供需匹配率仍在接入中，因此暂不输出未经验证的地区数字。`;
}

function renderRegionConversation(loading = false) {
  $('#aiAnswer').innerHTML = `<div class="conversation-thread">${regionConversation.map(message => `<div class="chat-bubble ${message.role}"><span>${message.role === 'user' ? '你的问题' : `${activeRegion}分析`}</span><p>${message.text}</p></div>`).join('')}${loading ? '<div class="answer-loading"><i></i><span>正在核对地区、权限和数据来源…</span></div>' : ''}</div>`;
}

function runRegionAI(question) {
  const cleanQuestion = String(question || '').trim();
  if (!cleanQuestion || !activeRegion) return;
  $('#aiInput').value = '';
  regionConversation.push({ role: 'user', text: cleanQuestion });
  renderRegionConversation(true);
  $('#evidence').classList.add('hidden');
  window.setTimeout(() => {
    regionConversation.push({ role: 'assistant', text: regionAnswerFor(cleanQuestion, activeRegion) });
    renderRegionConversation();
    $('#evidence').innerHTML = `<div><h3>${activeRegion} · 可信依据</h3><span class="data-badge pending-badge">城市明细接入中</span></div><dl><dt>正式数据</dt><dd>2025届全校就业质量数据</dd><dt>全区样本</dt><dd>毕业生 11,065 人</dd><dt>地区标签</dt><dd>${regionData[activeRegion].focus}（参考）</dd><dt>缺失字段</dt><dd>城市就业人数、有效岗位、薪资、技能与匹配率</dd></dl>`;
    $('#evidence').classList.remove('hidden');
  }, 420);
}

function openRegionQuery(regionName) {
  if (!regionData[regionName]) return;
  activeRegion = regionName;
  regionConversation = [];
  $$('[data-region]').forEach(label => label.classList.toggle('active', label.dataset.region === regionName));
  $('#aiContext').textContent = `${$('#periodSelect').value} · ${regionName} · ${roleConfig[currentRole].label}`;
  openAI();
  runRegionAI(`分析${regionName}当前就业供需情况`);
}

function runAI(question) {
  const cleanQuestion = String(question || '').trim();
  if (!cleanQuestion) { toast('请输入需要查询的问题'); return; }
  if (activeRegion) { runRegionAI(cleanQuestion); return; }
  $('#aiInput').value = cleanQuestion;
  $('#aiAnswer').innerHTML = '<div class="answer-loading"><i></i><span>正在识别指标、权限和统计范围…</span></div>';
  $('#evidence').classList.add('hidden');
  window.setTimeout(() => {
    const answer = answerFor(cleanQuestion);
    $('#aiAnswer').innerHTML = `<div class="answer-section"><span>统计事实</span><p>${answer.fact}</p></div><div class="answer-section suggestion"><span>分析建议 · 需人工确认</span><p>${answer.suggestion}</p></div>`;
    $('#evidence').classList.remove('hidden');
  }, 520);
}

function openTask(title = '商贸管理学院就业风险复核') {
  $('#taskTitle').value = title;
  $('#taskModal').showModal();
}

document.addEventListener('click', event => {
  const structureTab = event.target.closest('[data-structure]');
  if (structureTab) {
    structureKey = structureTab.dataset.structure;
    $$('#structureTabs button').forEach(button => button.classList.toggle('active', button === structureTab));
    renderStructure();
  }

  const stage = event.target.closest('[data-stage]');
  if (stage) { stageKey = stage.dataset.stage; renderStage(); }

  const metric = event.target.closest('[data-metric]');
  if (metric) {
    $$('.metric').forEach(button => button.classList.toggle('active', button === metric));
    if (metric.dataset.metric.includes('留桂')) structureKey = 'region';
    if (metric.dataset.metric.includes('对口')) structureKey = 'industry';
    $$('#structureTabs button').forEach(button => button.classList.toggle('active', button.dataset.structure === structureKey));
    renderStructure();
    toast(`已联动到“${metric.dataset.metric}”结构分析`);
  }

  const item = event.target.closest('[data-item]');
  if (item) {
    stageKey = structureKey === 'industry' ? 'industry' : 'college';
    renderStage();
    toast(`已按“${item.dataset.item}”下钻筛选`);
  }

  const college = event.target.closest('[data-college]');
  if (college) toast(`已定位${college.dataset.college}，可继续生成研判任务`);

  const alert = event.target.closest('[data-alert]');
  if (alert) openTask(alert.dataset.alert);

  const ai = event.target.closest('[data-ai]');
  if (ai) { clearRegionQuery(); openAI(ai.dataset.ai); }

  const question = event.target.closest('[data-question]');
  if (question) runAI(question.dataset.question);

  const globeQuestion = event.target.closest('[data-globe-question]');
  if (globeQuestion) { clearRegionQuery(); openAI(`使用${globeQuestion.dataset.globeQuestion}能力，查询当前范围的就业数据`); }

  const region = event.target.closest('[data-region]');
  if (region) openRegionQuery(region.dataset.region);

  const globeEntry = event.target.closest('[data-globe-query]');
  if (globeEntry) { clearRegionQuery(); openAI('截至目前，广西全区毕业生就业去向落实情况如何？'); }

  const job = event.target.closest('[data-job]');
  if (job) { clearRegionQuery(); openAI(`分析${job.dataset.job}岗位需求与学校人才供给`); }
});

$('#roleSelect').addEventListener('change', event => setWorkspace(event.target.value));
$('#periodSelect').addEventListener('change', event => { $('#aiContext').textContent = `${event.target.value} · ${activeRegion || $('#scopeSelect').value} · ${roleConfig[currentRole].label}`; toast(`统计届别已切换为${event.target.value}`); });
$('#scopeSelect').addEventListener('change', event => { $('#aiContext').textContent = `${$('#periodSelect').value} · ${activeRegion || event.target.value} · ${roleConfig[currentRole].label}`; toast(`数据范围已切换为${event.target.value}`); });
$('#aiOpen').addEventListener('click', () => {
  clearRegionQuery();
  stageKey = 'globe';
  renderStage();
  toast('请点击广西数据球上的地区名称发起查询');
});
$('#insightFab').addEventListener('click', () => {
  clearRegionQuery();
  openAI('请对当前就业数据进行透视分析');
});
$('#aiClose').addEventListener('click', closeAI);
$('#drawerBackdrop').addEventListener('click', () => { closeAI(); $('#drawerBackdrop').classList.remove('open'); });
$('#aiSend').addEventListener('click', () => runAI($('#aiInput').value));
$('#aiInput').addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); runAI(event.target.value); } });
$('#createTask').addEventListener('click', () => openTask());
$('#createTaskTop').addEventListener('click', () => openTask('新建就业研判任务'));
$('#submitTask').addEventListener('click', event => {
  event.preventDefault();
  if (!$('#taskTitle').value.trim()) { toast('请填写任务标题'); return; }
  $('#taskModal').close();
  toast('任务已生成，等待责任人员确认后派发');
});
$('#dataInfo').addEventListener('click', () => $('#dictionaryModal').showModal());
$('#fullscreen').addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeAI(); });

renderMetrics();
renderStructure();
renderStage();
renderAlerts();
