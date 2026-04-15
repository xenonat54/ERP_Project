// Import all your API functions at the top
import { 
    createUser, 
    createCourse, 
    enrollStudent, 
    getUsersByRole, 
    getAllCourses,
    deleteStudent, 
    deleteTeacher 
} from '../api/adminApi.js';

// ==========================================
// 1. INITIALIZATION & DATA LOADING
// ==========================================

// This function fetches users from the database and fills ALL the dropdowns
async function loadDropdowns() {
    try {
       // 1. Fetch the raw responses from the backend
        const rawStudents = await getUsersByRole('student');
        const rawTeachers = await getUsersByRole('teacher');
        const rawCourses = await getAllCourses(); 

        // 2. Unwrap the box to get the actual arrays!
        const students = rawStudents.data;
        const teachers = rawTeachers.data;
        const courses = rawCourses.data;

        // Grab the standard dropdown elements from the HTML
        const enrollStudentSelect = document.getElementById('student-select'); 
        const createCourseTeacherSelect = document.getElementById('teacher-select'); 
        const courseSelect = document.getElementById('course-select'); // <-- Grab course dropdown
        
        // Grab the NEW Danger Zone Dropdowns
        const deleteStudentSelect = document.getElementById('delete-student-select');
        const deleteTeacherSelect = document.getElementById('delete-teacher-select');
        const replacementTeacherSelect = document.getElementById('replacement-teacher-select');

        // Clear out existing options and set default placeholders
        if (enrollStudentSelect) enrollStudentSelect.innerHTML = '<option value="" disabled selected>Select a Student...</option>';
        if (createCourseTeacherSelect) createCourseTeacherSelect.innerHTML = '<option value="" disabled selected>Select a Teacher...</option>';
        if (courseSelect) courseSelect.innerHTML = '<option value="" disabled selected>Select a Course...</option>'; // <-- Reset course list
        if (deleteStudentSelect) deleteStudentSelect.innerHTML = '<option value="" disabled selected>Select a Student...</option>';
        if (deleteTeacherSelect) deleteTeacherSelect.innerHTML = '<option value="" disabled selected>Select a Teacher...</option>';
        if (replacementTeacherSelect) replacementTeacherSelect.innerHTML = '<option value="" disabled selected>Select a Replacement...</option>';

        // Populate Student Dropdowns
        if (students && students.length > 0) {
            students.forEach(student => {
                const studentOption = `<option value="${student._id}">${student.name} (${student.portalId})</option>`;
                if (enrollStudentSelect) enrollStudentSelect.innerHTML += studentOption;
                if (deleteStudentSelect) deleteStudentSelect.innerHTML += studentOption;
            });
        }

        // Populate Teacher Dropdowns
        if (teachers && teachers.length > 0) {
            teachers.forEach(teacher => {
                const teacherOption = `<option value="${teacher._id}">${teacher.name} (${teacher.portalId})</option>`;
                if (createCourseTeacherSelect) createCourseTeacherSelect.innerHTML += teacherOption;
                if (deleteTeacherSelect) deleteTeacherSelect.innerHTML += teacherOption;
                if (replacementTeacherSelect) replacementTeacherSelect.innerHTML += teacherOption;
            });
        }

        // Populate Course Dropdowns
        if (courses && courses.length > 0) {
            courses.forEach(course => {
                if (courseSelect) courseSelect.innerHTML += `<option value="${course._id}">${course.courseName} (${course.courseCode})</option>`;
            });
        }

    } catch (error) {
        console.error("Failed to load dropdown data:", error);
    }
}
// Call this immediately when the page loa
    loadDropdowns();

// ==========================================
// 2. FORM SUBMISSION EVENT LISTENERS
// ==========================================

// --- FORM 1: CREATE USER ---
const createUserForm = document.getElementById('create-user-form');
if (createUserForm) {
    createUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value; 
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        const messageDiv = document.getElementById('admin-message'); 

        try {
            const result = await createUser({ name, password, role });
            messageDiv.style.color = 'green';
            messageDiv.textContent = `✅ Success! Portal ID: ${result.portalId}`;
            createUserForm.reset();
            loadDropdowns(); // Reload dropdowns so new user appears immediately
        } catch (error) {
            messageDiv.style.color = 'red';
            messageDiv.textContent = `❌ Error: ${error}`;
        }
    });
}

// --- FORM 2: CREATE COURSE ---
const createCourseForm = document.getElementById('create-course-form');
if (createCourseForm) {
    createCourseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const courseCode = document.getElementById('course-code').value;
        const courseName = document.getElementById('course-name').value;
        const section = document.getElementById('course-section').value; 
        const teacherId = document.getElementById('teacher-select').value;
        const messageDiv = document.getElementById('course-message');

        try {
            const result = await createCourse({ courseCode, courseName, section, teacherId: teacherId });
            messageDiv.style.color = 'green';
            messageDiv.textContent = '✅ ' + result.message;
            createCourseForm.reset();
        } catch (error) {
            messageDiv.style.color = 'red';
            messageDiv.textContent = '❌ ' + error;
        }
    });
}

// --- FORM 3: ENROLL STUDENT --- 
const enrollStudentForm = document.getElementById('enroll-student-form');
if (enrollStudentForm) {
    enrollStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const studentId = document.getElementById('student-select').value;
        const courseId = document.getElementById('course-select').value;
        const messageDiv = document.getElementById('enroll-message');

        try {
            const result = await enrollStudent(studentId, courseId);
            messageDiv.style.color = 'green';
            messageDiv.textContent = '✅ ' + result.message;
            enrollStudentForm.reset();
        } catch (error) {
            messageDiv.style.color = 'red';
            messageDiv.textContent = '❌ ' + error;
        }
    });
}

// --- FORM 4: DELETE STUDENT (DANGER ZONE) ---
const deleteStudentForm = document.getElementById('delete-student-form');
if (deleteStudentForm) {
    deleteStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const studentId = document.getElementById('delete-student-select').value;
        const msgDiv = document.getElementById('delete-student-msg');

        if (!confirm("WARNING: This will permanently delete the student and all their course enrollments. Proceed?")) return;

        try {
            const result = await deleteStudent(studentId);
            msgDiv.style.color = 'green';
            msgDiv.textContent = '✅ ' + result.message;
            loadDropdowns(); // Refresh the dropdowns so the deleted student disappears!
        } catch (error) {
            msgDiv.style.color = 'red';
            msgDiv.textContent = '❌ ' + error;
        }
    });
}

// --- FORM 5: DELETE TEACHER (DANGER ZONE) ---
const deleteTeacherForm = document.getElementById('delete-teacher-form');
if (deleteTeacherForm) {
    deleteTeacherForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const teacherId = document.getElementById('delete-teacher-select').value;
        const replacementTeacherId = document.getElementById('replacement-teacher-select').value;
        const msgDiv = document.getElementById('delete-teacher-msg');

        if (teacherId === replacementTeacherId) {
            msgDiv.style.color = 'red';
            msgDiv.textContent = '❌ Target and Replacement teacher cannot be the same person.';
            return;
        }

        if (!confirm("Are you sure? All courses will be transferred to the replacement teacher.")) return;

        try {
            const result = await deleteTeacher(teacherId, replacementTeacherId);
            msgDiv.style.color = 'green';
            msgDiv.textContent = '✅ ' + result.message;
            loadDropdowns(); // Refresh the dropdowns so the deleted teacher disappears!
        } catch (error) {
            msgDiv.style.color = 'red';
            msgDiv.textContent = '❌ ' + error;
        }
    });

    // ==========================================
// 3. LOGOUT LOGIC (Restored)
// ==========================================
const logoutBtn = document.getElementById('logout-btn'); // Change this ID if your HTML uses a different one!
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        // Clear the saved login token
        localStorage.removeItem('token'); 
        // Redirect back to the login page (adjust this path if your login is named differently)
        window.location.href = '/index.html'; 
    });
}
}