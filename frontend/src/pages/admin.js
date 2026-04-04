// frontend/src/pages/admin.js
import { createUser, createCourse, enrollStudent, getUsersByRole, getAllCourses } from '../api/adminApi';
import { clearAuthData, getUserRole } from '../utils/authStorage';

// --- FRONTEND BOUNCER ---
const currentRole = getUserRole();
if (currentRole !== 'admin') {
    window.location.href = '/index.html';
}

// --- LOGOUT LOGIC ---
document.getElementById('logout-btn').addEventListener('click', () => {
    clearAuthData();
    window.location.href = '/index.html';
});

// --- POPULATE DROPDOWNS ---
const loadDropdowns = async () => {
    try {
        const teachersRes = await getUsersByRole('teacher');
        const studentsRes = await getUsersByRole('student');
        const coursesRes = await getAllCourses();

        const teacherSelect = document.getElementById('teacher-select');
        const studentSelect = document.getElementById('student-select');
        const courseSelect = document.getElementById('course-select');

        // Populate Teachers
        teacherSelect.innerHTML = '<option value="" disabled selected>Select a Professor...</option>';
        teachersRes.data.forEach(t => {
            teacherSelect.innerHTML += `<option value="${t._id}">${t.name} (${t.portalId})</option>`;
        });

        // Populate Students
        studentSelect.innerHTML = '<option value="" disabled selected>Select a Student...</option>';
        studentsRes.data.forEach(s => {
            studentSelect.innerHTML += `<option value="${s._id}">${s.name} (${s.portalId})</option>`;
        });

        // Populate Courses (Notice how we show the Teacher's name so the Admin knows which section it is!)
        courseSelect.innerHTML = '<option value="" disabled selected>Select a Course Section...</option>';
        coursesRes.data.forEach(c => {
            const profName = c.teacher ? c.teacher.name : 'Unknown';
            courseSelect.innerHTML += `<option value="${c._id}">${c.courseCode} - ${c.courseName} (Prof. ${profName})</option>`;
        });

    } catch (error) {
        console.error("Failed to load dropdown data:", error);
    }
};

// --- FORM 1: CREATE USER ---
document.getElementById('create-user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const messageDiv = document.getElementById('admin-message');

    try {
        const result = await createUser({ name, password, role });
        messageDiv.style.color = 'green';
        messageDiv.textContent = `✅ Success! Portal ID: ${result.portalId}`;
        document.getElementById('create-user-form').reset();
        
        // Reload dropdowns immediately so the new user appears!
        loadDropdowns(); 
    } catch (error) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = `❌ Error: ${error}`;
    }
});

// --- FORM 2: CREATE COURSE ---
document.getElementById('create-course-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const courseCode = document.getElementById('course-code').value;
    const courseName = document.getElementById('course-name').value;
    const teacherId = document.getElementById('teacher-select').value;
    const messageDiv = document.getElementById('course-message');

    try {
        await createCourse({ courseCode, courseName, teacherId });
        messageDiv.style.color = 'green';
        messageDiv.textContent = `✅ Course ${courseCode} successfully assigned!`;
        document.getElementById('create-course-form').reset();
        
        // Reload dropdowns so the new course appears in the enrollment menu!
        loadDropdowns();
    } catch (error) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = `❌ Error: ${error}`;
    }
});

// --- FORM 3: ENROLL STUDENT ---
document.getElementById('enroll-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const studentId = document.getElementById('student-select').value;
    const courseId = document.getElementById('course-select').value;
    const messageDiv = document.getElementById('enroll-message');

    try {
        await enrollStudent({ studentId, courseId });
        messageDiv.style.color = 'green';
        messageDiv.textContent = `✅ Student successfully enrolled!`;
        document.getElementById('enroll-form').reset();
    } catch (error) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = `❌ Error: ${error}`;
    }
});

// Initialize the page by loading the dropdowns!
loadDropdowns();