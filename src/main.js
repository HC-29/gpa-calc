// Strict Grade Mapping Data
const SCALES = {
    "4": { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0 },
    "5": { 'A+': 5.0, 'A': 5.0, 'A-': 4.5, 'B+': 4.0, 'B': 3.5, 'B-': 3.0, 'C+': 2.5, 'C': 2.0, 'C-': 1.5, 'D+': 1.0, 'D': 0.5, 'F': 0.0 },
    "10": { 'A+': 10.0, 'A': 9.0, 'A-': 8.5, 'B+': 8.0, 'B': 7.5, 'B-': 7.0, 'C+': 6.5, 'C': 6.0, 'C-': 5.5, 'D+': 5.0, 'D': 4.0, 'F': 0.0 }
};

const LEVEL_WEIGHTS = { 'regular': 0.0, 'honors': 0.5, 'ap': 1.0 };

document.addEventListener('DOMContentLoaded', () => {
    let currentScale = '4';
    let isWeighted = false;

    const courseList = document.getElementById('course-list');
    const gpaDisplay = document.getElementById('gpa-display');
    const addBtn = document.getElementById('add-course');
    const calcBtn = document.getElementById('calculate-btn');

    // --- SEGMENTED TOGGLE LOGIC ---
    function setupToggle(containerId, initialVal, callback) {
        const container = document.getElementById(containerId);
        const buttons = container.querySelectorAll('button');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => {
                    b.classList.remove('bg-white', 'text-primary', 'shadow-sm');
                    b.classList.add('text-slate-500');
                });
                btn.classList.add('bg-white', 'text-primary', 'shadow-sm');
                btn.classList.remove('text-slate-500');

                const val = btn.dataset.scale || btn.dataset.weighted;
                callback(val);
            });
        });
    }

    setupToggle('scale-toggle', '4', (val) => {
        currentScale = val;
        syncRowsToSettings();
    });

    setupToggle('weight-toggle', 'false', (val) => {
        isWeighted = (val === 'true');
        syncRowsToSettings();
    });

    // Synchronize rows with global scale/weight settings
    function syncRowsToSettings() {
        const rows = document.querySelectorAll('.course-row');
        rows.forEach(row => {
            // Level Selector UI
            const levelSelect = row.querySelector('.level-input');
            levelSelect.disabled = !isWeighted;
            levelSelect.style.opacity = isWeighted ? "1" : "0.4";
            levelSelect.style.cursor = isWeighted ? "pointer" : "not-allowed";

            // Grade Dropdown content
            const gradeSelect = row.querySelector('.grade-input');
            const previousVal = gradeSelect.value;
            const grades = Object.keys(SCALES[currentScale]);

            gradeSelect.innerHTML = grades.map(g => `<option value="${g}">${g}</option>`).join('');
            if (grades.includes(previousVal)) gradeSelect.value = previousVal;
        });
    }

    // --- ROW GENERATION ---
    function createRow() {
        const row = document.createElement('div');
        row.className = "course-row grid grid-cols-12 gap-3 p-4 items-center group transition-colors hover:bg-slate-50/50";

        row.innerHTML = `
            <div class="col-span-12 md:col-span-4">
                <input type="text" placeholder="Course Name" class="w-full p-2 bg-transparent outline-none font-medium placeholder:text-slate-300">
            </div>
            <div class="col-span-5 md:col-span-3">
                <select class="level-input w-full p-2 bg-white md:bg-slate-100 rounded-lg text-xs font-bold appearance-none cursor-pointer border md:border-none transition-opacity">
                    <option value="regular">Regular Course</option>
                    <option value="honors">Honors (+0.5)</option>
                    <option value="ap">AP / IB (+1.0)</option>
                </select>
            </div>
            <div class="col-span-3 md:col-span-2">
                <input type="number" placeholder="Credits" class="credit-input w-full p-2 outline-none text-center font-bold border-b-2 border-transparent focus:border-blue-500 bg-transparent" min="0">
            </div>
            <div class="col-span-3 md:col-span-2">
                <select class="grade-input w-full p-2 font-black text-primary bg-transparent outline-none cursor-pointer text-center">
                    </select>
            </div>
            <div class="col-span-1 text-right">
                <button class="delete-btn text-slate-300 hover:text-red-500 transition-colors p-1">&times;</button>
            </div>
        `;

        row.querySelector('.delete-btn').addEventListener('click', () => {
            if (document.querySelectorAll('.course-row').length > 1) {
                row.remove();
                calculateGPA();
            }
        });

        courseList.appendChild(row);
        syncRowsToSettings();
    }

    // --- CALCULATION LOGIC ---
    function calculateGPA() {
        const rows = document.querySelectorAll('.course-row');
        let totalQualityPoints = 0;
        let totalCredits = 0;

        rows.forEach(row => {
            const credits = parseFloat(row.querySelector('.credit-input').value);
            const gradeLetter = row.querySelector('.grade-input').value;
            const level = row.querySelector('.level-input').value;

            if (!isNaN(credits) && credits > 0) {
                // Formula: (Base Grade Point + Weighted Bonus) * Credit Hours
                let points = SCALES[currentScale][gradeLetter];
                if (isWeighted) points += LEVEL_WEIGHTS[level];

                totalQualityPoints += (points * credits);
                totalCredits += credits;
            }
        });

        const result = totalCredits > 0 ? (totalQualityPoints / totalCredits).toFixed(2) : "0.00";
        const ring = document.getElementById('gpa-ring');
        let percentage = (parseFloat(result) / parseFloat(currentScale)) * 100;
        percentage = Math.min(percentage, 100);
        // Update the display text
        gpaDisplay.innerText = result;

        // Dynamically update the ring border
        // The blue color fills up to the percentage, the gray color takes over for the rest
        ring.style.background = `conic-gradient(
    #0076ED ${percentage}%, 
    #e2e8f0 ${percentage}%
)`;
    }

    // Event Listeners
    addBtn.addEventListener('click', createRow);
    calcBtn.addEventListener('click', calculateGPA);

    // Initialize with 4 rows
    for (let i = 0; i < 4; i++) createRow();
});

