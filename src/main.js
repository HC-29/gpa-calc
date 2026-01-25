const courseList = document.getElementById('course-list');
const addBtn = document.getElementById('add-course');
const calcBtn = document.getElementById('calculate-btn');
const gpaDisplay = document.getElementById('gpa-display');
const scaleSelect = document.getElementById('gpa-scale'); // New element

// Grade Point Lookup Table
const gradeScales = {
  4: { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0 },
  5: { 'A+': 5.0, 'A': 5.0, 'A-': 4.7, 'B+': 4.3, 'B': 4.0, 'B-': 3.7, 'C+': 3.3, 'C': 3.0, 'C-': 2.7, 'D+': 2.3, 'D': 2.0, 'F': 0.0 }
};

function createRow() {
  const div = document.createElement('div');
  div.className = "grid grid-cols-12 gap-2 items-center course-row animate-in fade-in duration-300";
  div.innerHTML = `
    <input type="text" placeholder="Course" class="col-span-4 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-sm">
    <input type="number" placeholder="Credits" class="col-span-3 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 credit-input text-sm">
    <select class="col-span-4 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 grade-input text-sm">
      ${Object.keys(gradeScales[4]).map(g => `<option value="${g}">${g}</option>`).join('')}
    </select>
    <button class="col-span-1 text-red-400 hover:text-red-600 font-bold delete-btn">×</button>
  `;
  
  // Delete functionality
  div.querySelector('.delete-btn').addEventListener('click', () => div.remove());
  courseList.appendChild(div);
}

addBtn.addEventListener('click', createRow);

calcBtn.addEventListener('click', () => {
  const rows = document.querySelectorAll('.course-row');
  const selectedScale = scaleSelect.value;
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
  }
});