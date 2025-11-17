// CPU Scheduling Algorithms
class FCFSScheduler {
    schedule(processes) {
        const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
        const results = [];
        let currentTime = 0;

        for (const process of sortedProcesses) {
            const arrivalTime = process.arrivalTime;
            const cpuTime = process.cpuTime;
            const startTime = Math.max(currentTime, arrivalTime);
            const completionTime = startTime + cpuTime;
            const turnaroundTime = completionTime - arrivalTime;
            const waitingTime = turnaroundTime - cpuTime;
            const responseTime = startTime - arrivalTime;

            results.push({
                processId: process.id,
                arrivalTime,
                cpuTime,
                priority: process.priority,
                completionTime,
                waitingTime,
                turnaroundTime,
                responseTime,
                startTime,
                endTime: completionTime
            });

            currentTime = completionTime;
        }

        return results;
    }
}

// Shortest Job First Scheduler
class SJFScheduler {
    schedule(processes) {
        const results = [];
        const remaining = [...processes];
        let currentTime = 0;

        while (remaining.length > 0) {
            // Get processes that have arrived
            const available = remaining.filter(p => p.arrivalTime <= currentTime);

            if (available.length === 0) {
                // If no process has arrived, advance time to next arrival
                const nextProcess = remaining.reduce((min, p) => 
                    p.arrivalTime < min.arrivalTime ? p : min
                );
                currentTime = nextProcess.arrivalTime;
                continue;
            }

            // Sort by CPU time and pick the shortest
            available.sort((a, b) => a.cpuTime - b.cpuTime);
            const process = available[0];

            const arrivalTime = process.arrivalTime;
            const cpuTime = process.cpuTime;
            const startTime = currentTime;
            const completionTime = startTime + cpuTime;
            const turnaroundTime = completionTime - arrivalTime;
            const waitingTime = turnaroundTime - cpuTime;
            const responseTime = startTime - arrivalTime;

            results.push({
                processId: process.id,
                arrivalTime,
                cpuTime,
                priority: process.priority,
                completionTime,
                waitingTime,
                turnaroundTime,
                responseTime,
                startTime,
                endTime: completionTime
            });

            // Remove from remaining and update current time
            remaining.splice(remaining.indexOf(process), 1);
            currentTime = completionTime;
        }

        return results;
    }
}

// Shortest Remaining Time First (Preemptive)
class SRTFScheduler {
    schedule(processes) {
        const n = processes.length;
        const remaining = {};
        const started = {};
        const completion = {};
        const results = [];
        processes.forEach(p => { remaining[p.id] = p.cpuTime; started[p.id] = -1; });

        let currentTime = Math.min(...processes.map(p => p.arrivalTime));
        let completed = 0;

        while (completed < n) {
            const available = processes.filter(p => p.arrivalTime <= currentTime && remaining[p.id] > 0);
            if (available.length === 0) {
                // jump forward
                const future = processes.filter(p => remaining[p.id] > 0);
                currentTime = Math.min(...future.map(p => p.arrivalTime));
                continue;
            }

            // pick with smallest remaining time
            available.sort((a, b) => remaining[a.id] - remaining[b.id] || a.arrivalTime - b.arrivalTime);
            const p = available[0];

            if (started[p.id] === -1) started[p.id] = currentTime;

            // execute for 1 time unit (granularity = 1)
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
                    completionTime,
                    waitingTime,
                    turnaroundTime,
                    responseTime,
                    startTime,
                    endTime: completionTime
                });
            }
        }

        return results;
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

            // lower priority value = higher priority
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
                completionTime,
                waitingTime,
                turnaroundTime,
                responseTime,
                startTime,
                endTime: completionTime
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
        processes.forEach(p => { remaining[p.id] = p.cpuTime; started[p.id] = -1; });

        let currentTime = Math.min(...processes.map(p => p.arrivalTime));
        let completed = 0;

        while (completed < n) {
            const available = processes.filter(p => p.arrivalTime <= currentTime && remaining[p.id] > 0);
            if (available.length === 0) {
                const future = processes.filter(p => remaining[p.id] > 0);
                currentTime = Math.min(...future.map(p => p.arrivalTime));
                continue;
            }

            // choose by priority (lower value = higher priority)
            available.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);
            const p = available[0];

            if (started[p.id] === -1) started[p.id] = currentTime;

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
                    completionTime,
                    waitingTime,
                    turnaroundTime,
                    responseTime,
                    startTime,
                    endTime: completionTime
                });
            }
        }

        return results;
    }
}

// Round Robin Scheduler
class RoundRobinScheduler {
    schedule(processes, quantum = 2) {
        const n = processes.length;
        const remaining = {};
        const start = {};
        const completion = {};
        processes.forEach(p => { remaining[p.id] = p.cpuTime; start[p.id] = -1; });

        let currentTime = 0;
        const queue = [];
        const byArrival = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
        let ai = 0;

        // seed queue with arrivals at time 0
        while (ai < byArrival.length && byArrival[ai].arrivalTime <= currentTime) {
            queue.push(byArrival[ai]);
            ai++;
        }

        const results = [];
        while (Object.values(remaining).some(r => r > 0)) {
            if (queue.length === 0) {
                if (ai < byArrival.length) {
                    currentTime = byArrival[ai].arrivalTime;
                    while (ai < byArrival.length && byArrival[ai].arrivalTime <= currentTime) {
                        queue.push(byArrival[ai]); ai++;
                    }
                    continue;
                } else break;
            }

            const p = queue.shift();
            if (remaining[p.id] <= 0) continue;
            if (start[p.id] === -1) start[p.id] = Math.max(currentTime, p.arrivalTime);

            // advance time to arrival if needed
            if (currentTime < p.arrivalTime) currentTime = p.arrivalTime;

            const slice = Math.min(quantum, remaining[p.id]);
            remaining[p.id] -= slice;
            currentTime += slice;

            // enqueue newly arrived processes during this time slice
            while (ai < byArrival.length && byArrival[ai].arrivalTime <= currentTime) {
                queue.push(byArrival[ai]); ai++;
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
                    completionTime,
                    waitingTime,
                    turnaroundTime,
                    responseTime,
                    startTime,
                    endTime: completionTime
                });
            }
        }

        return results;
    }
}

// Main Application
class CPUSchedulingApp {
    constructor() {
        this.processList = [];
        this.results = [];
        this.processCount = 2;
        this.currentAlgorithm = 'fcfs';
        this.init();
    }

    init() {
        this.setupEventListeners();
        // Update UI to reflect the default algorithm (hide quantum/priority as needed)
        this.updateAlgorithmUI();
    }

    setupEventListeners() {
        document.getElementById('add-process').addEventListener('click', () => this.addProcess());
        document.getElementById('delete-process').addEventListener('click', () => this.deleteProcess());
        document.getElementById('calculate-btn').addEventListener('click', () => this.calculateSchedule());

        // Algorithm selector buttons
        document.querySelectorAll('.algo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectAlgorithm(e.target));
        });

        // No quantum button here; quantum is edited inline in the Processes area when RR is selected.
    }

    selectAlgorithm(button) {
        // Update active button
        document.querySelectorAll('.algo-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        this.currentAlgorithm = button.dataset.algorithm;
        this.updateAlgorithmUI();
    }

    updateAlgorithmUI() {
        const algo = this.currentAlgorithm;

        // Show quantum control (inline) only for Round Robin
        const quantumControl = document.querySelector('.quantum-control');
        if (quantumControl) {
            quantumControl.style.display = (algo === 'rr') ? '' : 'none';
        }

        // Show Priority column only when using priority algorithms
        const isPriorityAlgo = (algo === 'priority-preemptive' || algo === 'priority-nonpreemptive');

        // Process table priority column toggle
        const processTable = document.querySelector('.process-table');
        if (processTable) {
            const ths = processTable.querySelectorAll('thead th');
            let priorityIndex = -1;
            ths.forEach((th, idx) => {
                if (th.textContent.trim().toLowerCase() === 'priority') priorityIndex = idx;
            });

            if (priorityIndex >= 0) {
                // header
                processTable.querySelectorAll('thead th')[priorityIndex].style.display = isPriorityAlgo ? '' : 'none';

                // rows
                document.querySelectorAll('.process-table tbody tr').forEach(tr => {
                    const cell = tr.children[priorityIndex];
                    if (cell) cell.style.display = isPriorityAlgo ? '' : 'none';
                });
            }
        }

        // Results table priority column toggle
        const resultsTable = document.querySelector('.results-table');
        if (resultsTable) {
            const rThs = resultsTable.querySelectorAll('thead th');
            let rPriorityIndex = -1;
            rThs.forEach((th, idx) => {
                if (th.textContent.trim().toLowerCase() === 'priority') rPriorityIndex = idx;
            });

            if (rPriorityIndex >= 0) {
                resultsTable.querySelectorAll('thead th')[rPriorityIndex].style.display = isPriorityAlgo ? '' : 'none';
                document.querySelectorAll('.results-table tbody tr').forEach(tr => {
                    const cell = tr.children[rPriorityIndex];
                    if (cell) cell.style.display = isPriorityAlgo ? '' : 'none';
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
        // Ensure the UI visibility (Priority column / Quantum control) matches the currently selected algorithm
        try { this.updateAlgorithmUI(); } catch (e) { /* ignore if called before init */ }

        return newRow;
    }

    addPriorityProcess() {
        // Deprecated: adding priority via separate button is no longer used.
        return;
    }

    deleteProcess() {
        const tbody = document.getElementById('process-tbody');
        const rows = tbody.querySelectorAll('tr');
        if (rows.length > 1) {
            tbody.removeChild(rows[rows.length - 1]);
            this.processCount--;
        }
    }

    addProcessBatch() {
        const count = prompt('Enter number of processes to add:', '1');
        if (count && !isNaN(count) && parseInt(count) > 0) {
            for (let i = 0; i < parseInt(count); i++) {
                this.addProcess();
            }
        }
    }

    getProcessesFromTable() {
        const rows = document.querySelectorAll('.process-row');
        const processes = [];

        rows.forEach((row, index) => {
            const arrivalTime = parseInt(row.querySelector('.arrival-time').value) || 0;
            const cpuTime = parseInt(row.querySelector('.burst-time').value) || 0;
            const priority = parseInt(row.querySelector('.priority').value) || 0;

            if (cpuTime > 0) {
                processes.push({
                    id: index + 1,
                    arrivalTime,
                    cpuTime,
                    priority
                });
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

        let scheduler;
        if (this.currentAlgorithm === 'fcfs') {
            scheduler = new FCFSScheduler();
            this.results = scheduler.schedule(processes);
        } else if (this.currentAlgorithm === 'sjf') {
            scheduler = new SJFScheduler();
            this.results = scheduler.schedule(processes);
        } else if (this.currentAlgorithm === 'srtf') {
            scheduler = new SRTFScheduler();
            this.results = scheduler.schedule(processes);
        } else if (this.currentAlgorithm === 'priority-nonpreemptive') {
            scheduler = new PriorityNonPreemptiveScheduler();
            this.results = scheduler.schedule(processes);
        } else if (this.currentAlgorithm === 'priority-preemptive') {
            scheduler = new PriorityPreemptiveScheduler();
            this.results = scheduler.schedule(processes);
        } else if (this.currentAlgorithm === 'rr') {
            const quantum = parseInt(document.getElementById('quantum-input').value) || 2;
            scheduler = new RoundRobinScheduler();
            this.results = scheduler.schedule(processes, quantum);
        } else {
            // default fallback
            scheduler = new FCFSScheduler();
            this.results = scheduler.schedule(processes);
        }

        this.displayResults();
        this.displayGanttChart();
    }

    displayResults() {
        const resultsBody = document.getElementById('results-tbody');
        resultsBody.innerHTML = '';

        if (this.results.length === 0) {
            resultsBody.innerHTML = `
                <tr>
                    <td>1</td>
                    <td colspan="7" class="empty-message">No results available</td>
                </tr>
            `;
            return;
        }

        let totalWaitingTime = 0;
        let totalTurnaroundTime = 0;

        this.results.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.processId}</td>
                <td>${result.arrivalTime}</td>
                <td>${result.cpuTime}</td>
                <td>${result.priority}</td>
                <td>${result.completionTime}</td>
                <td>${result.waitingTime}</td>
                <td>${result.turnaroundTime}</td>
                <td>${result.responseTime}</td>
            `;
            resultsBody.appendChild(row);

            totalWaitingTime += result.waitingTime;
            totalTurnaroundTime += result.turnaroundTime;
        });

        // Add average row
        const avgRow = document.createElement('tr');
        avgRow.style.fontWeight = 'bold';
        avgRow.style.backgroundColor = '#d4e6f1';
        avgRow.innerHTML = `
            <td>Avg</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>${(totalWaitingTime / this.results.length).toFixed(2)}</td>
            <td>${(totalTurnaroundTime / this.results.length).toFixed(2)}</td>
            <td>-</td>
        `;
        resultsBody.appendChild(avgRow);
        // Re-apply column visibility rules (hides priority column for non-priority algorithms)
        this.updateAlgorithmUI();
    }

    displayGanttChart() {
        const ganttContainer = document.getElementById('gantt-chart');

        if (this.results.length === 0) {
            ganttContainer.innerHTML = '<p class="empty-message">Run calculations to see Gantt chart</p>';
            return;
        }
        // Create a clean, boxed Gantt chart using absolute positioning
        const timelineScale = 60; // pixels per unit time
        const minStart = Math.min(...this.results.map(r => r.startTime));
        const maxTime = Math.max(...this.results.map(r => r.endTime));
        const totalUnits = Math.max(1, maxTime - minStart);
        const totalWidth = totalUnits * timelineScale;

        let html = '';
        html += `<div class="gantt-visual">`;
        html += `<div class="gantt-inner" style="width:${totalWidth}px">`;

        // Draw blocks
        this.results.forEach(result => {
            const left = (result.startTime - minStart) * timelineScale;
            const width = Math.max(2, result.cpuTime * timelineScale);
            html += `<div class="gantt-block" style="left: ${left}px; width: ${width}px;">P${result.processId}</div>`;
        });

        html += `</div>`; // .gantt-inner

        // Time scale below
        html += `<div class="gantt-time-scale" style="width:${totalWidth}px">`;
        for (let t = minStart; t <= maxTime; t++) {
            const left = (t - minStart) * timelineScale;
            html += `<div class="gantt-time-label" style="left:${left}px">${t}</div>`;
        }
        html += `</div>`;

        html += `</div>`; // .gantt-visual

        ganttContainer.innerHTML = html;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CPUSchedulingApp();
});
