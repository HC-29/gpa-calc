import './style.css';

// 1. GLOBAL SCALE DICTIONARY
const SCALES = {
    '4.0':  { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0 },
    '5.0':  { 'A': 5.0, 'B': 4.0, 'C': 3.0, 'D': 2.0, 'F': 0.0 },
    '10.0': { '10': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2, '1': 1, '0': 0 },
    '12.0': { 'A+': 12, 'A': 11, 'A-': 10, 'B+': 9, 'B': 8, 'B-': 7, 'C+': 6, 'C': 5, 'C-': 4, 'D+': 3, 'D': 2, 'F': 0 },
    '100.0': null // Handled via direct number input
};

const container = document.getElementById('course-container');
const gpaDisplay = document.getElementById('gpa-display');

// --- 2. THE CALCULATION ENGINE ---

function calculateGPA() {
    let totalPoints = 0;
    let totalCredits = 0;
    
    const scaleSelector = document.getElementById('scale-selector');
    const activeScaleKey = scaleSelector ? scaleSelector.value : '4.0';
    const selectedScale = SCALES[activeScaleKey];

    const rows = document.querySelectorAll('.course-card');

    rows.forEach(row => {
        const gradeInput = row.querySelector('.grade-select');
        const creditInput = row.querySelector('.credit-input');
        const weightInput = row.querySelector('.weight-select');

        const credits = parseFloat(creditInput.value) || 0;
        let gradeValue = 0;

        if (activeScaleKey === '100.0') {
            gradeValue = parseFloat(gradeInput.value) || 0;
        } else if (selectedScale) {
            gradeValue = selectedScale[gradeInput.value] || 0;
        }

        // Apply Weighted Boost (+1.0 for AP, +0.5 for Honors)
        const weightBoost = weightInput ? parseFloat(weightInput.value) : 0;
        
        if (credits > 0) {
            totalPoints += (gradeValue + weightBoost) * credits;
            totalCredits += credits;
        }
    });

    const result = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
    if (gpaDisplay) gpaDisplay.innerText = result;

    saveData(); // Persist to LocalStorage
}

// --- 3. UI GENERATOR (THE CARD) ---

function createCourseRow(name = '', grade = '', credits = '', weight = '0') {
    const scaleSelector = document.getElementById('scale-selector');
    const activeScaleKey = scaleSelector ? scaleSelector.value : '4.0';
    
    const div = document.createElement('div');
    div.className = "course-card bg-white border-[3px] border-slate-900 rounded-[1.5rem] p-5 flex flex-col md:flex-row gap-4 items-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transition-all mb-4";
    
    // Switch between Select Dropdown or Number Input for 100% scale
    const gradeInputHTML = activeScaleKey === '100.0' 
        ? `<input type="number" placeholder="0-100" value="${grade}" class="grade-select w-full bg-slate-50 border-2 border-slate-900 rounded-xl font-black p-2.5 outline-none focus:ring-2 focus:ring-primary/20">`
        : `<select class="grade-select w-full bg-slate-50 border-2 border-slate-900 rounded-xl font-black p-2.5 outline-none cursor-pointer focus:ring-2 focus:ring-primary/20">
            ${Object.keys(SCALES[activeScaleKey]).map(g => `<option value="${g}" ${g === grade ? 'selected' : ''}>${g}</option>`).join('')}
           </select>`;

    div.innerHTML = `
        <div class="flex-1 w-full min-w-37.5">
            <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Course Name</label>
            <input type="text" placeholder="e.g. Physics" value="${name}" class="name-input w-full font-bold text-lg outline-none bg-transparent">
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto items-end">
            <div>
                <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Grade</label>
                ${gradeInputHTML}
            </div>
            <div>
                <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Type</label>
                <select class="weight-select w-full bg-slate-50 border-2 border-slate-900 rounded-xl font-black p-2.5 outline-none cursor-pointer">
                    <option value="0" ${weight === '0' ? 'selected' : ''}>Regular</option>
                    <option value="0.5" ${weight === '0.5' ? 'selected' : ''}>Honors (+0.5)</option>
                    <option value="1.0" ${weight === '1.0' ? 'selected' : ''}>AP/IB (+1.0)</option>
                </select>
            </div>
            <div class="w-20">
                <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Credits</label>
                <input type="number" value="${credits}" class="credit-input w-full bg-slate-50 border-2 border-slate-900 rounded-xl font-black p-2.5 outline-none focus:ring-2 focus:ring-primary/20">
            </div>
            <button class="remove-btn p-2.5 text-slate-300 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
        </div>
    `;

    // Attach Listeners
    div.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', calculateGPA);
    });

    div.querySelector('.remove-btn').addEventListener('click', () => {
        div.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            div.remove();
            calculateGPA();
        }, 150);
    });

    container.appendChild(div);
}

// --- 4. PERSISTENCE (LOCAL STORAGE) ---

function saveData() {
    const courses = [];
    document.querySelectorAll('.course-card').forEach(row => {
        courses.push({
            name: row.querySelector('.name-input').value,
            grade: row.querySelector('.grade-select').value,
            credits: row.querySelector('.credit-input').value,
            weight: row.querySelector('.weight-select').value
        });
    });
    
    const scaleSelector = document.getElementById('scale-selector');
    const settings = {
        scale: scaleSelector ? scaleSelector.value : '4.0',
        courses: courses
    };
    
    localStorage.setItem('vector_user_data', JSON.stringify(settings));

    const status = document.getElementById('save-status');
    if (status) {
        status.innerText = "Synced";
        setTimeout(() => { status.innerText = "Local Sync Active"; }, 1500);
    }
}

function loadData() {
    const rawData = localStorage.getItem('vector_user_data');
    if (rawData) {
        const data = JSON.parse(rawData);
        
        // Restore Scale
        const scaleSelector = document.getElementById('scale-selector');
        if (scaleSelector && data.scale) scaleSelector.value = data.scale;

        // Restore Courses
        container.innerHTML = '';
        if (data.courses && data.courses.length > 0) {
            data.courses.forEach(c => createCourseRow(c.name, c.grade, c.credits, c.weight));
        } else {
            for(let i=0; i<3; i++) createCourseRow();
        }
    } else {
        // Default empty state
        for(let i=0; i<3; i++) createCourseRow();
    }
    calculateGPA();
}

// --- 5. INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-course');
    const scaleSelector = document.getElementById('scale-selector');

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            createCourseRow();
            calculateGPA();
        });
    }

    if (scaleSelector) {
        scaleSelector.addEventListener('change', () => {
            // Re-render rows to update the grade dropdowns for the new scale
            const currentCourses = [];
            document.querySelectorAll('.course-card').forEach(row => {
                currentCourses.push({
                    name: row.querySelector('.name-input').value,
                    grade: '', // Clear grades when switching scales to prevent errors
                    credits: row.querySelector('.credit-input').value,
                    weight: row.querySelector('.weight-select').value
                });
            });
            container.innerHTML = '';
            currentCourses.forEach(c => createCourseRow(c.name, c.grade, c.credits, c.weight));
            calculateGPA();
        });
    }

    loadData(); 
});
