const courseList = document.getElementById('course-list');
const addBtn = document.getElementById('add-course');
const calcBtn = document.getElementById('calculate-btn');
const resultContainer = document.getElementById('result-container');
const gpaDisplay = document.getElementById('gpa-display');

// Function to add a new row
addBtn.addEventListener('click', () => {
  const newRow = document.createElement('div');
  newRow.className = "grid grid-cols-12 gap-3 items-center course-row animate-in fade-in duration-300";
  newRow.innerHTML = `
    <input type="text" placeholder="Course Name" class="col-span-5 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400">
    <input type="number" placeholder="Credits" class="col-span-3 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 credit-input">
    <select class="col-span-4 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 grade-input">
      <option value="4.0">A</option>
      <option value="3.0">B</option>
      <option value="2.0">C</option>
      <option value="1.0">D</option>
      <option value="0.0">F</option>
    </select>
  `;
  courseList.appendChild(newRow);
});

// The Calculation Logic
calcBtn.addEventListener('click', () => {
  const creditInputs = document.querySelectorAll('.credit-input');
  const gradeInputs = document.querySelectorAll('.grade-input');
  
  let totalPoints = 0;
  let totalCredits = 0;

  creditInputs.forEach((input, index) => {
    const credits = parseFloat(input.value);
    const gradeValue = parseFloat(gradeInputs[index].value);

    if (!isNaN(credits) && credits > 0) {
      totalPoints += (credits * gradeValue);
      totalCredits += credits;
    }
  });

  if (totalCredits > 0) {
    const gpa = totalPoints / totalCredits;
    gpaDisplay.innerText = gpa.toFixed(2);
    resultContainer.classList.remove('hidden');
  } else {
    alert("Please enter valid credit hours!");
  }
});