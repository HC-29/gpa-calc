// 1. Define the Base Point Values for each scale
const baseGrades = {
    // Standard 4.0 & 5.0 letters (Standard 4.0 logic)
    "4": { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0 },
    // 5.0 base often uses different step-downs (0.5 intervals)
    "5": { 'A+': 5.0, 'A': 5.0, 'A-': 4.5, 'B+': 4.0, 'B': 3.5, 'B-': 3.0, 'C+': 2.5, 'C': 2.0, 'C-': 1.5, 'D+': 1.0, 'D': 0.5, 'F': 0.0 },
    // International 10.0 scale
    "10": { 'A+': 10.0, 'A': 9.0, 'A-': 8.5, 'B+': 8.0, 'B': 7.0, 'B-': 6.5, 'C+': 6.0, 'C': 5.0, 'C-': 4.5, 'D+': 4.0, 'D': 3.0, 'F': 0.0 }
};

// 2. Define Weights for "Weighted" GPA calculation
const weights = {
    'regular': 0.0,
    'honors': 0.5,
    'ap-ib-college': 1.0
};

document.addEventListener('DOMContentLoaded', () => {
    const courseList = document.getElementById('course-list');
    const addBtn = document.getElementById('add-course');
    const calcBtn = document.getElementById('calculate-btn');
    const gpaDisplay = document.getElementById('gpa-display');
    const scaleSelect = document.getElementById('gpa-scale');

    // Function to generate a row
    function createRow() {
        const div = document.createElement('div');
        div.className = "grid grid-cols-12 gap-2 items-center course-row mb-4 animate-in fade-in duration-300";
        
        const currentScale = scaleSelect.value === '10' ? '10' : (scaleSelect.value.startsWith('5') ? '5' : '4');
        const grades = Object.keys(baseGrades[currentScale]);

        div.innerHTML = `
            <div class="col-span-12 md:col-span-4">
                <input type="text" placeholder="Course Name" class="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-sm">
            </div>
            <div class="col-span-4 md:col-span-3">
                <select class="w-full p-2 border rounded-lg outline-none text-sm level-input bg-slate-50">
                    <option value="regular">Regular</option>
                    <option value="honors">Honors (+0.5)</option>
                    <option value="ap-ib-college">AP/IB (+1.0)</option>
                </select>
            </div>
            <div class="col-span-3 md:col-span-2">
                <input type="number" placeholder="Credits" class="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 credit-input text-sm">
            </div>
            <div class="col-span-4 md:col-span-2">
                <select class="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 grade-input text-sm">
                    ${grades.map(g => `<option value="${g}">${g}</option>`).join('')}
                </select>
            </div>
            <div class="col-span-1 text-right">
                <button class="text-slate-300 hover:text-red-500 delete-btn text-xl transition-colors">×</button>
            </div>
        `;
        
        div.querySelector('.delete-btn').addEventListener('click', () => {
            if (document.querySelectorAll('.course-row').length > 1) {
                div.remove();
            }
        });

        courseList.appendChild(div);
    }

    // Calculation Logic
    calcBtn.addEventListener('click', () => {
        const rows = document.querySelectorAll('.course-row');
        const selectedScaleType = scaleSelect.value; // e.g., "4-weighted"
        
        let totalPoints = 0;
        let totalCredits = 0;

        rows.forEach(row => {
            const credits = parseFloat(row.querySelector('.credit-input').value);
            const gradeLetter = row.querySelector('.grade-input').value;
            const level = row.querySelector('.level-input').value;
            
            // Determine which base point set to use
            let baseSet = "4";
            if (selectedScaleType.startsWith("5")) baseSet = "5";
            if (selectedScaleType === "10") baseSet = "10";

            let gradeValue = baseGrades[baseSet][gradeLetter];

            // Only apply weights if the user selected a "Weighted" scale type
            if (selectedScaleType.includes("weighted") && selectedScaleType !== "10") {
                gradeValue += weights[level];
            }

            if (!isNaN(credits) && credits > 0) {
                totalPoints += (credits * gradeValue);
                totalCredits += credits;
            }
        });

        if (totalCredits > 0) {
            const gpa = totalPoints / totalCredits;
            gpaDisplay.innerText = gpa.toFixed(2);
            document.getElementById('result-container').classList.remove('hidden');
            document.getElementById('result-container').scrollIntoView({ behavior: 'smooth' });
        } else {
            alert("Please enter valid credit hours.");
        }
    });

    // Update grades if the base scale changes
    scaleSelect.addEventListener('change', () => {
        const rows = document.querySelectorAll('.course-row');
        const val = scaleSelect.value;
        const baseSet = val.startsWith("5") ? "5" : (val === "10" ? "10" : "4");
        const grades = Object.keys(baseGrades[baseSet]);

        rows.forEach(row => {
            const select = row.querySelector('.grade-input');
            select.innerHTML = grades.map(g => `<option value="${g}">${g}</option>`).join('');
        });
    });

    addBtn.addEventListener('click', createRow);
    
    // Initialize first row
    createRow();
});