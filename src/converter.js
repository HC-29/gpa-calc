import "./style.css"

const CONVERSION_DATA = [
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
    const input = document.getElementById('converter-input');
    const tableBody = document.getElementById('grade-table-body');
    const resPercent = document.getElementById('res-percent');
    const resLetter = document.getElementById('res-letter');
    const resGpa = document.getElementById('res-gpa');

    // Build table and store references for highlighting
    const rowRefs = CONVERSION_DATA.map(data => {
        const tr = document.createElement('tr');
        tr.className = "transition-all duration-300 border-l-4 border-transparent";
        tr.innerHTML = `
            <td class="p-5 font-medium text-slate-600">${data.min}% - ${data.max}%</td>
            <td class="p-5 font-black text-slate-800 text-center">${data.letter}</td>
            <td class="p-5 font-bold text-primary text-right">${data.gpa.toFixed(1)}</td>
        `;
        tableBody.appendChild(tr);
        return { tr, ...data };
    });

    input.addEventListener('input', (e) => {
        let val = e.target.value.trim().toUpperCase().replace('%', '');
        
        // Reset highlights and results
        rowRefs.forEach(ref => {
            ref.tr.classList.remove('bg-blue-50', 'border-l-primary');
        });

        if (!val) {
            resPercent.innerText = '--';
            resLetter.innerText = '--';
            resGpa.innerText = '--';
            return;
        }

        let match = null;

        if (!isNaN(val)) {
            const num = parseFloat(val);
            // Detection Logic: 
            // If num <= 4.0, assume it's a GPA input. 
            // If num > 4.0, assume it's a Percentage input.
            if (num <= 4.0) {
                match = CONVERSION_DATA.find(d => num >= d.gpa) || CONVERSION_DATA[CONVERSION_DATA.length - 1];
            } else {
                match = CONVERSION_DATA.find(d => num >= d.min && num <= d.max);
                if (num > 100) match = CONVERSION_DATA[0];
            }
        } else {
            // Letter Grade Input
            match = CONVERSION_DATA.find(d => d.letter === val);
        }

        if (match) {
            resPercent.innerText = `${match.min}%`;
            resLetter.innerText = match.letter;
            resGpa.innerText = match.gpa.toFixed(1);

            // Find and highlight the specific row in the table
            const activeRow = rowRefs.find(ref => ref.letter === match.letter);
            if (activeRow) {
                activeRow.tr.classList.add('bg-blue-50', 'border-l-primary');
                activeRow.tr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            resPercent.innerText = '--';
            resLetter.innerText = '??';
            resGpa.innerText = '--';
        }
    });
});