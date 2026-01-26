const GRADE_DATA = [
    { min: 97, max: 100, letter: 'A+', gpa: 4.0 },
    { min: 93, max: 96, letter: 'A', gpa: 4.0 },
    { min: 90, max: 92, letter: 'A-', gpa: 3.7 },
    { min: 87, max: 89, letter: 'B+', gpa: 3.3 },
    { min: 83, max: 86, letter: 'B', gpa: 3.0 },
    { min: 80, max: 82, letter: 'B-', gpa: 2.7 },
    { min: 77, max: 79, letter: 'C+', gpa: 2.3 },
    { min: 73, max: 76, letter: 'C', gpa: 2.0 },
    { min: 70, max: 72, letter: 'C-', gpa: 1.7 },
    { min: 67, max: 69, letter: 'D+', gpa: 1.3 },
    { min: 65, max: 66, letter: 'D', gpa: 1.0 },
    { min: 0, max: 64, letter: 'F', gpa: 0.0 }
];

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('grade-table-body');
    const input = document.getElementById('converter-input');
    const resLetter = document.getElementById('res-letter');
    const resGpa = document.getElementById('res-gpa');

    // 1. Populate Table
    GRADE_DATA.forEach(item => {
        const row = document.createElement('tr');
        row.className = "hover:bg-slate-50 transition-colors";
        row.innerHTML = `
            <td class="p-6 font-medium text-slate-600">${item.min}% - ${item.max}%</td>
            <td class="p-6 font-black text-slate-800">${item.letter}</td>
            <td class="p-6 font-bold text-primary">${item.gpa.toFixed(1)}</td>
        `;
        tableBody.appendChild(row);
    });

    // 2. Live Conversion Logic
    input.addEventListener('input', (e) => {
        const val = e.target.value.trim().toUpperCase();
        if (!val) {
            resLetter.innerText = '--';
            resGpa.innerText = '--';
            return;
        }

        let found = null;

        if (!isNaN(val)) {
            // It's a number/percentage
            const num = parseFloat(val);
            found = GRADE_DATA.find(g => num >= g.min && num <= g.max);
            // Handle edge case for 100+
            if (num > 100) found = GRADE_DATA[0];
        } else {
            // It's a letter
            found = GRADE_DATA.find(g => g.letter === val);
        }

        if (found) {
            resLetter.innerText = found.letter;
            resGpa.innerText = found.gpa.toFixed(1);
        } else {
            resLetter.innerText = '??';
            resGpa.innerText = '--';
        }
    });
});