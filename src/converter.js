import "./style.css"

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input-percent');
    
    // Elements to update
    const res4 = document.getElementById('res-4');
    const res10 = document.getElementById('res-10');
    const res12 = document.getElementById('res-12');
    const resLetter = document.getElementById('res-letter');

    function convert() {
        const val = parseFloat(input.value) || 0;

        // 4.0 Scale Logic (Standard)
        let gpa4 = 0;
        let letter = 'F';
        if (val >= 93) { gpa4 = 4.0; letter = 'A'; }
        else if (val >= 90) { gpa4 = 3.7; letter = 'A-'; }
        else if (val >= 87) { gpa4 = 3.3; letter = 'B+'; }
        else if (val >= 83) { gpa4 = 3.0; letter = 'B'; }
        else if (val >= 80) { gpa4 = 2.7; letter = 'B-'; }
        else if (val >= 77) { gpa4 = 2.3; letter = 'C+'; }
        else if (val >= 73) { gpa4 = 2.0; letter = 'C'; }
        else if (val >= 70) { gpa4 = 1.7; letter = 'C-'; }
        else if (val >= 67) { gpa4 = 1.3; letter = 'D+'; }
        else if (val >= 65) { gpa4 = 1.0; letter = 'D'; }
        else { gpa4 = 0.0; letter = 'F'; }

        // Update Displays
        res4.innerText = gpa4.toFixed(1);
        res10.innerText = (val / 10).toFixed(1);
        res12.innerText = (val / 100 * 12).toFixed(1);
        resLetter.innerText = `Grade: ${letter}`;

        // Add a "Poppy" animation on update
        [res4, res10, res12].forEach(el => {
            el.classList.add('scale-110', 'text-primary');
            setTimeout(() => el.classList.remove('scale-110', 'text-primary'), 100);
        });
    }

    input.addEventListener('input', convert);
    convert(); // Initial run
});