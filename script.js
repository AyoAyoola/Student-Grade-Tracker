// State
let students = [];

// DOM Elements
const form = document.getElementById('student-form');
const nameInput = document.getElementById('student-name');
const gradeInput = document.getElementById('student-grade');
const errorMessage = document.getElementById('error-message');
const studentListBody = document.getElementById('student-list-body');
const averageValueDisplay = document.getElementById('average-value');
const studentCountDisplay = document.getElementById('student-count');

// Initialization
function init() {
    loadData();
    renderStudents();
}

// Event Listeners
form.addEventListener('submit', function(e) {
    e.preventDefault();
    addStudent();
});

studentListBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-delete')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        deleteStudent(id);
    }
});

// Functions
function addStudent() {
    const name = nameInput.value.trim();
    const gradeVal = gradeInput.value;
    
    // Validation
    if (!name) {
        showError('Student name cannot be empty.');
        return;
    }
    
    if (gradeVal === '') {
        showError('Grade cannot be empty.');
        return;
    }
    
    const grade = parseFloat(gradeVal);
    
    if (isNaN(grade) || grade < 0 || grade > 100) {
        showError('Grade must be a number between 0 and 100.');
        return;
    }
    
    clearError();
    
    // Create new student
    const newStudent = {
        id: Date.now(), // simple unique id
        name: name,
        grade: grade
    };
    
    students.push(newStudent);
    saveData();
    
    // Reset form
    form.reset();
    nameInput.focus();
    
    renderStudents();
}

function deleteStudent(id) {
    students = students.filter(student => student.id !== id);
    saveData();
    renderStudents();
}

function calculateAverage() {
    if (students.length === 0) return 0;
    
    const total = students.reduce((sum, student) => sum + student.grade, 0);
    return (total / students.length).toFixed(1);
}

function renderStudents() {
    studentListBody.innerHTML = '';
    
    const average = calculateAverage();
    averageValueDisplay.textContent = average;
    
    studentCountDisplay.textContent = `${students.length} Student${students.length !== 1 ? 's' : ''}`;
    
    if (students.length === 0) {
        studentListBody.innerHTML = `
            <tr>
                <td colspan="3" class="empty-state">No students added yet.</td>
            </tr>
        `;
        return;
    }
    
    students.forEach(student => {
        const isAboveAverage = student.grade > average && students.length > 1;
        
        const tr = document.createElement('tr');
        
        // Name Cell
        const tdName = document.createElement('td');
        tdName.textContent = student.name;
        
        // Grade Cell
        const tdGrade = document.createElement('td');
        const gradeSpan = document.createElement('span');
        gradeSpan.textContent = student.grade;
        gradeSpan.className = 'grade-cell';
        if (isAboveAverage) {
            gradeSpan.classList.add('above-average');
            gradeSpan.title = 'Above average!';
        }
        tdGrade.appendChild(gradeSpan);
        
        // Action Cell
        const tdAction = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'btn-delete';
        deleteBtn.setAttribute('data-id', student.id);
        tdAction.appendChild(deleteBtn);
        
        tr.appendChild(tdName);
        tr.appendChild(tdGrade);
        tr.appendChild(tdAction);
        
        studentListBody.appendChild(tr);
    });
}

function showError(msg) {
    errorMessage.textContent = msg;
}

function clearError() {
    errorMessage.textContent = '';
}

// Local Storage functionality
function saveData() {
    localStorage.setItem('studentGrades', JSON.stringify(students));
}

function loadData() {
    const saved = localStorage.getItem('studentGrades');
    if (saved) {
        try {
            students = JSON.parse(saved);
        } catch (e) {
            console.error('Error parsing saved data', e);
            students = [];
        }
    }
}

// Start app
init();
