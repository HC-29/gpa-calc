// 1. Move the Grade Scales to the top (they don't need the DOM)
const gradeScales = {
  4: { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0 },
  5: { 'A+': 5.0, 'A': 5.0, 'A-': 4.7, 'B+': 4.3, 'B': 4.0, 'B-': 3.7, 'C+': 3.3, 'C': 3.0, 'C-': 2.7, 'D+': 2.3, 'D': 2.0, 'F': 0.0 }
};

// 2. Wrap EVERYTHING in the DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
    const courseList = document.getElementById('course-list');
    const addBtn = document.getElementById('add-course');
    const calcBtn = document.getElementById('calculate-btn');
    const gpaDisplay = document.getElementById('gpa-display');
    const scaleSelect = document.getElementById('gpa-scale');

    function createRow() {
        const div = document.createElement('div');
        div.className = "grid grid-cols-12 gap-2 items-center course-row mb-3";
        
        // Default to scale 4 if the select isn't found for some reason
        const currentScale = scaleSelect ? scaleSelect.value : 4;
        const grades = Object.keys(gradeScales[currentScale]);

        div.innerHTML = `
            <input type="text" placeholder="Course Name" class="col-span-5 md:col-span-6 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-sm">
            <input type="number" placeholder="Cr." class="col-span-3 md:col-span-2 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 credit-input text-sm">
            <select class="col-span-3 md:col-span-3 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 grade-input text-sm">
                ${grades.map(g => `<option value="${g}">${g}</option>`).join('')}
            </select>
            <button class="col-span-1 text-slate-300 hover:text-red-500 font-bold delete-btn transition-colors text-xl">×</button>
        `;
        
        div.querySelector('.delete-btn').addEventListener('click', () => {
            if (document.querySelectorAll('.course-row').length > 1) {
                div.remove();
            } else {
                alert("You need at least one course!");
            }
        });

        courseList.appendChild(div);
    }

    // Event Listeners
    addBtn.addEventListener('click', createRow);

    calcBtn.addEventListener('click', () => {
        const rows = document.querySelectorAll('.course-row');
        const selectedScale = scaleSelect ? scaleSelect.value : 4;
        let totalPoints = 0;
        let totalCredits = 0;

        rows.forEach(row => {
            const credits = parseFloat(row.querySelector('.credit-input').value);
            const gradeLetter = row.querySelector('.grade-input').value;
            const gradeValue = gradeScales[selectedScale][gradeLetter];

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
            alert("Please enter credit hours.");
        }
    });

    if (scaleSelect) {
        scaleSelect.addEventListener('change', () => {
            const rows = document.querySelectorAll('.course-row');
            const grades = Object.keys(gradeScales[scaleSelect.value]);
            rows.forEach(row => {
                const select = row.querySelector('.grade-input');
                select.innerHTML = grades.map(g => `<option value="${g}">${g}</option>`).join('');
            });
        });
    }

    // Start with one row
    createRow();
});