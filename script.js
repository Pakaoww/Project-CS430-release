// CPU Scheduling Algorithms and App Controller

// FCFS Scheduler
class FCFSScheduler {
  schedule(processes) {
    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const results = [];
    let currentTime = 0;
    for (const p of sorted) {
      const startTime = Math.max(currentTime, p.arrivalTime);
      const completionTime = startTime + p.cpuTime;
      const turnaroundTime = completionTime - p.arrivalTime;
      const waitingTime = turnaroundTime - p.cpuTime;
      const responseTime = startTime - p.arrivalTime;
      results.push({
        processId: p.id,
        arrivalTime: p.arrivalTime,
        cpuTime: p.cpuTime,
        priority: p.priority,
        startTime,
        completionTime,
        endTime: completionTime,
        waitingTime,
        turnaroundTime,
        responseTime
      });
      currentTime = completionTime;
    }
    return results;
  }
}

// SJF Scheduler (non-preemptive)
class SJFScheduler {
  schedule(processes) {
    const results = [];
    const remaining = [...processes];
    let currentTime = 0;
    while (remaining.length > 0) {
      const available = remaining.filter(p => p.arrivalTime <= currentTime);
      if (available.length === 0) {
        currentTime = Math.min(...remaining.map(p => p.arrivalTime));
        continue;
      }
      available.sort((a, b) => a.cpuTime - b.cpuTime || a.arrivalTime - b.arrivalTime);
      const p = available[0];
      const startTime = Math.max(currentTime, p.arrivalTime);
      const completionTime = startTime + p.cpuTime;
      const turnaroundTime = completionTime - p.arrivalTime;
      const waitingTime = turnaroundTime - p.cpuTime;
      const responseTime = startTime - p.arrivalTime;
      results.push({
        processId: p.id,
        arrivalTime: p.arrivalTime,
        cpuTime: p.cpuTime,
        priority: p.priority,
        startTime,
        completionTime,
        endTime: completionTime,
        waitingTime,
        turnaroundTime,
        responseTime
      });
      remaining.splice(remaining.indexOf(p), 1);
      currentTime = completionTime;
    }
    return results;
  }
}

// SRTF Scheduler (preemptive) - returns {results, timeline}
class SRTFScheduler {
  schedule(processes) {
    const n = processes.length;
    const remaining = {};
    const started = {};
    const completion = {};
    const results = [];
    const timeline = [];
    processes.forEach(p => {
      remaining[p.id] = p.cpuTime;
      started[p.id] = -1;
    });
    let currentTime = Math.min(...processes.map(p => p.arrivalTime));
    let completed = 0;
    while (completed < n) {
      const available = processes.filter(p => p.arrivalTime <= currentTime && remaining[p.id] > 0);
      if (available.length === 0) {
        const future = processes.filter(p => remaining[p.id] > 0);
        currentTime = Math.min(...future.map(p => p.arrivalTime));
        continue;
      }
      available.sort((a, b) => remaining[a.id] - remaining[b.id] || a.arrivalTime - b.arrivalTime);
      const p = available[0];
      if (started[p.id] === -1) started[p.id] = currentTime;
      const last = timeline[timeline.length - 1];
      if (last && last.processId === p.id && last.end === currentTime) {
        last.end = currentTime + 1;
      } else {
        timeline.push({ processId: p.id, start: currentTime, end: currentTime + 1 });
      }
      remaining[p.id] -= 1;
      currentTime += 1;
      if (remaining[p.id] === 0) {
        completion[p.id] = currentTime;
        completed += 1;
        const arrivalTime = p.arrivalTime;
        const cpuTime = p.cpuTime;
        const startTime = started[p.id];
        const completionTime = completion[p.id];
        const turnaroundTime = completionTime - arrivalTime;
        const waitingTime = turnaroundTime - cpuTime;
        const responseTime = startTime - arrivalTime;
        results.push({
          processId: p.id,
          arrivalTime,
          cpuTime,
          priority: p.priority,
          startTime,
          completionTime,
          endTime: completionTime,
          waitingTime,
          turnaroundTime,
          responseTime
        });
      }
    }
    return { results, timeline };
  }
}

// Priority (Non-Preemptive)
class PriorityNonPreemptiveScheduler {
  schedule(processes) {
    const results = [];
    const remaining = [...processes];
    let currentTime = 0;
    while (remaining.length > 0) {
      const available = remaining.filter(p => p.arrivalTime <= currentTime);
      if (available.length === 0) {
        currentTime = Math.min(...remaining.map(p => p.arrivalTime));
        continue;
      }
      available.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);
      const p = available[0];
      const startTime = Math.max(currentTime, p.arrivalTime);
      const completionTime = startTime + p.cpuTime;
      const turnaroundTime = completionTime - p.arrivalTime;
      const waitingTime = turnaroundTime - p.cpuTime;
      const responseTime = startTime - p.arrivalTime;
      results.push({
        processId: p.id,
        arrivalTime: p.arrivalTime,
        cpuTime: p.cpuTime,
        priority: p.priority,
        startTime,
        completionTime,
        endTime: completionTime,
        waitingTime,
        turnaroundTime,
        responseTime
      });
      remaining.splice(remaining.indexOf(p), 1);
      currentTime = completionTime;
    }
    return results;
  }
}

// Priority (Preemptive)
class PriorityPreemptiveScheduler {
  schedule(processes) {
    const n = processes.length;
    const remaining = {};
    const started = {};
    const completion = {};
    const results = [];
    const timeline = [];
    processes.forEach(p => {
      remaining[p.id] = p.cpuTime;
      started[p.id] = -1;
    });
    let currentTime = Math.min(...processes.map(p => p.arrivalTime));
    let completed = 0;
    while (completed < n) {
      const available = processes.filter(p => p.arrivalTime <= currentTime && remaining[p.id] > 0);
      if (available.length === 0) {
        const future = processes.filter(p => remaining[p.id] > 0);
        currentTime = Math.min(...future.map(p => p.arrivalTime));
        continue;
      }
      available.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);
      const p = available[0];
      if (started[p.id] === -1) started[p.id] = currentTime;
      const last = timeline[timeline.length - 1];
      if (last && last.processId === p.id && last.end === currentTime) {
        last.end = currentTime + 1;
      } else {
        timeline.push({ processId: p.id, start: currentTime, end: currentTime + 1 });
      }
      remaining[p.id] -= 1;
      currentTime += 1;
      if (remaining[p.id] === 0) {
        completion[p.id] = currentTime;
        completed += 1;
        const arrivalTime = p.arrivalTime;
        const cpuTime = p.cpuTime;
        const startTime = started[p.id];
        const completionTime = completion[p.id];
        const turnaroundTime = completionTime - arrivalTime;
        const waitingTime = turnaroundTime - cpuTime;
        const responseTime = startTime - arrivalTime;
        results.push({
          processId: p.id,
          arrivalTime,
          cpuTime,
          priority: p.priority,
          startTime,
          completionTime,
          endTime: completionTime,
          waitingTime,
          turnaroundTime,
          responseTime
        });
      }
    }
    return { results, timeline };
  }
}

// Round Robin Scheduler
class RoundRobinScheduler {
  schedule(processes, quantum = 2) {
    const n = processes.length;
    const remaining = {};
    const start = {};
    const completion = {};
    processes.forEach(p => {
      remaining[p.id] = p.cpuTime;
      start[p.id] = -1;
    });

    let currentTime = 0;
    const queue = [];
    const byArrival = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let ai = 0;
    while (ai < byArrival.length && byArrival[ai].arrivalTime <= currentTime) {
      queue.push(byArrival[ai]);
      ai++;
    }

    const results = [];
    const timeline = [];
    while (Object.values(remaining).some(r => r > 0)) {
      if (queue.length === 0) {
        if (ai < byArrival.length) {
          currentTime = byArrival[ai].arrivalTime;
          while (ai < byArrival.length && byArrival[ai].arrivalTime <= currentTime) {
            queue.push(byArrival[ai]);
            ai++;
          }
          continue;
        } else break;
      }

      const p = queue.shift();
      if (remaining[p.id] <= 0) continue;
      if (start[p.id] === -1) start[p.id] = Math.max(currentTime, p.arrivalTime);
      if (currentTime < p.arrivalTime) currentTime = p.arrivalTime;

      const slice = Math.min(quantum, remaining[p.id]);
      const last = timeline[timeline.length - 1];
      if (last && last.processId === p.id && last.end === currentTime) {
        last.end = currentTime + slice;
      } else {
        timeline.push({ processId: p.id, start: currentTime, end: currentTime + slice });
      }

      remaining[p.id] -= slice;
      currentTime += slice;

      while (ai < byArrival.length && byArrival[ai].arrivalTime <= currentTime) {
        queue.push(byArrival[ai]);
        ai++;
      }

      if (remaining[p.id] > 0) {
        queue.push(p);
      } else {
        completion[p.id] = currentTime;
        const arrivalTime = p.arrivalTime;
        const cpuTime = p.cpuTime;
        const startTime = start[p.id];
        const completionTime = completion[p.id];
        const turnaroundTime = completionTime - arrivalTime;
        const waitingTime = turnaroundTime - cpuTime;
        const responseTime = startTime - arrivalTime;
        results.push({
          processId: p.id,
          arrivalTime,
          cpuTime,
          priority: p.priority,
          startTime,
          completionTime,
          endTime: completionTime,
          waitingTime,
          turnaroundTime,
          responseTime
        });
      }
    }

    return { results, timeline };
  }
}

// Main Application
class CPUSchedulingApp {
  constructor() {
    this.processCount = 2;
    this.currentAlgorithm = 'fcfs';
    this.results = [];
    this.timeline = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateAlgorithmUI();
  }

  setupEventListeners() {
    document.getElementById('add-process').addEventListener('click', () => this.addProcess());
    document.getElementById('delete-process').addEventListener('click', () => this.deleteProcess());
    document.getElementById('calculate-btn').addEventListener('click', () => this.calculateSchedule());

    document.querySelectorAll('.algo-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.selectAlgorithm(e.target));
    });
  }

  selectAlgorithm(button) {
    document.querySelectorAll('.algo-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    this.currentAlgorithm = button.dataset.algorithm;
    this.updateAlgorithmUI();
  }

  updateAlgorithmUI() {
    const algo = this.currentAlgorithm;

    const quantumControl = document.querySelector('.quantum-control');
    if (quantumControl) {
      quantumControl.style.display = (algo === 'rr') ? '' : 'none';
    }

    const isPriority = (algo === 'priority-preemptive' || algo === 'priority-nonpreemptive');

    const processTable = document.querySelector('.process-table');
    if (processTable) {
      const ths = processTable.querySelectorAll('thead th');
      let priorityIndex = -1;
      ths.forEach((th, idx) => {
        if (th.textContent.trim().toLowerCase() === 'priority') priorityIndex = idx;
      });
      if (priorityIndex >= 0) {
        processTable.querySelectorAll('thead th')[priorityIndex].style.display = isPriority ? '' : 'none';
        document.querySelectorAll('.process-table tbody tr').forEach(tr => {
          const cell = tr.children[priorityIndex];
          if (cell) cell.style.display = isPriority ? '' : 'none';
        });
      }
    }

    const resultsTable = document.querySelector('.results-table');
    if (resultsTable) {
      const rThs = resultsTable.querySelectorAll('thead th');
      let rPriorityIndex = -1;
      rThs.forEach((th, idx) => {
        if (th.textContent.trim().toLowerCase() === 'priority') rPriorityIndex = idx;
      });
      if (rPriorityIndex >= 0) {
        resultsTable.querySelectorAll('thead th')[rPriorityIndex].style.display = isPriority ? '' : 'none';
        document.querySelectorAll('.results-table tbody tr').forEach(tr => {
          const cell = tr.children[rPriorityIndex];
          if (cell) cell.style.display = isPriority ? '' : 'none';
        });
      }
    }
  }

  addProcess() {
    this.processCount++;
    const tbody = document.getElementById('process-tbody');
    const newRow = document.createElement('tr');
    newRow.className = 'process-row';
    newRow.innerHTML = `
      <td><input type="text" value="P${this.processCount}" disabled></td>
      <td><input type="number" class="arrival-time" value="0" min="0"></td>
      <td><input type="number" class="burst-time" value="1" min="1"></td>
      <td><input type="number" class="priority" value="0" min="0"></td>
    `;
    tbody.appendChild(newRow);
    try {
      this.updateAlgorithmUI();
    } catch (e) {}
    return newRow;
  }

  deleteProcess() {
    const tbody = document.getElementById('process-tbody');
    const rows = tbody.querySelectorAll('tr');
    if (rows.length > 1) {
      tbody.removeChild(rows[rows.length - 1]);
      this.processCount--;
    }
  }

  getProcessesFromTable() {
    const rows = document.querySelectorAll('.process-row');
    const processes = [];
    rows.forEach((row, idx) => {
      const arrivalTime = parseInt(row.querySelector('.arrival-time').value) || 0;
      const cpuTime = parseInt(row.querySelector('.burst-time').value) || 0;
      const priority = parseInt(row.querySelector('.priority').value) || 0;
      if (cpuTime > 0) {
        processes.push({ id: idx + 1, arrivalTime, cpuTime, priority });
      }
    });
    return processes;
  }

  calculateSchedule() {
    const processes = this.getProcessesFromTable();
    if (processes.length === 0) {
      alert('Please add at least one process with Burst Time > 0');
      return;
    }

    let schedulerResult = null;
    if (this.currentAlgorithm === 'fcfs') {
      schedulerResult = new FCFSScheduler().schedule(processes);
    } else if (this.currentAlgorithm === 'sjf') {
      schedulerResult = new SJFScheduler().schedule(processes);
    } else if (this.currentAlgorithm === 'srtf') {
      schedulerResult = new SRTFScheduler().schedule(processes);
    } else if (this.currentAlgorithm === 'priority-nonpreemptive') {
      schedulerResult = new PriorityNonPreemptiveScheduler().schedule(processes);
    } else if (this.currentAlgorithm === 'priority-preemptive') {
      schedulerResult = new PriorityPreemptiveScheduler().schedule(processes);
    } else if (this.currentAlgorithm === 'rr') {
      const quantum = parseInt(document.getElementById('quantum-input').value) || 2;
      schedulerResult = new RoundRobinScheduler().schedule(processes, quantum);
    } else {
      schedulerResult = new FCFSScheduler().schedule(processes);
    }

    if (Array.isArray(schedulerResult)) {
      this.results = schedulerResult;
      this.timeline = null;
    } else {
      this.results = schedulerResult.results || [];
      this.timeline = schedulerResult.timeline || null;
    }

    this.displayResults();
    this.displayGanttChart();
  }

  displayResults() {
    const resultsBody = document.getElementById('results-tbody');
    resultsBody.innerHTML = '';

    if (!this.results || this.results.length === 0) {
      resultsBody.innerHTML = `<tr><td colspan="8" class="empty-message">No results available</td></tr>`;
      return;
    }

    let totalWaiting = 0;
    let totalTurnaround = 0;

    this.results.forEach(r => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${r.processId}</td>
        <td>${r.arrivalTime}</td>
        <td>${r.cpuTime}</td>
        <td>${r.priority}</td>
        <td>${r.completionTime}</td>
        <td>${r.waitingTime}</td>
        <td>${r.turnaroundTime}</td>
        <td>${r.responseTime}</td>
      `;
      resultsBody.appendChild(row);
      totalWaiting += r.waitingTime;
      totalTurnaround += r.turnaroundTime;
    });

    const avgRow = document.createElement('tr');
    avgRow.style.fontWeight = 'bold';
    avgRow.style.backgroundColor = '#d4e6f1';
    avgRow.innerHTML = `
      <td>Avg</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>${(totalWaiting / this.results.length).toFixed(2)}</td>
      <td>${(totalTurnaround / this.results.length).toFixed(2)}</td>
      <td>-</td>
    `;
    resultsBody.appendChild(avgRow);
    this.updateAlgorithmUI();
  }

  displayGanttChart() {
    const ganttContainer = document.getElementById('gantt-chart');

    if ((!this.timeline || this.timeline.length === 0) && (!this.results || this.results.length === 0)) {
      ganttContainer.innerHTML = '<p class="empty-message">Run calculations to see Gantt chart</p>';
      return;
    }

    const timeline = (this.timeline && this.timeline.length)
      ? this.timeline
      : this.results.map(r => ({ processId: r.processId, start: r.startTime, end: r.endTime }));

    const minStart = Math.min(...timeline.map(s => s.start));
    const maxEnd = Math.max(...timeline.map(s => s.end));
    const units = Math.max(1, maxEnd - minStart);
    const scale = 40;
    const totalWidth = units * scale;

    let html = `<div class="gantt-visual"><div class="gantt-inner" style="width:${totalWidth}px">`;

    const colors = {};
    function colorFor(pid) {
      if (colors[pid]) return colors[pid];
      const palette = ['#6fb7be', '#f6b26b', '#93c47d', '#8fa3ff', '#f28b82', '#c9a0dc', '#ffd966'];
      const c = palette[Object.keys(colors).length % palette.length];
      colors[pid] = c;
      return c;
    }

    timeline.forEach(slice => {
      const left = (slice.start - minStart) * scale;
      const width = Math.max(2, (slice.end - slice.start) * scale);
      html += `<div class="gantt-block" style="left:${left}px;width:${width}px;background:${colorFor(slice.processId)}">P${slice.processId}</div>`;
    });

    html += `</div><div class="gantt-time-scale" style="width:${totalWidth}px">`;
    for (let t = minStart; t <= maxEnd; t++) {
      const left = (t - minStart) * scale;
      html += `<div class="gantt-time-label" style="left:${left}px">${t}</div>`;
    }
    html += `</div></div>`;

    ganttContainer.innerHTML = html;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CPUSchedulingApp();
});
