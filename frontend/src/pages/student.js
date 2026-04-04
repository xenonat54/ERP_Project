// frontend/src/pages/student.js
import { getStudentProfile, getMyGrades } from '../api/studentApi';
import { clearAuthData, getUserRole } from '../utils/authStorage';

// --- FRONTEND BOUNCER ---
// Ensure only students can access this page
const currentRole = getUserRole();
if (currentRole !== 'student') {
    window.location.href = '/index.html';
}

// --- LOGOUT LOGIC ---
document.getElementById('logout-btn').addEventListener('click', () => {
    clearAuthData();
    window.location.href = '/index.html';
});

// --- LOAD PROFILE DATA ---
const loadProfile = async () => {
    try {
        const profileRes = await getStudentProfile();
        const user = profileRes.data;
        
        document.getElementById('student-name').textContent = user.name;
        document.getElementById('portal-id').textContent = `Portal ID: ${user.portalId}`;
    } catch (error) {
        console.error("Failed to load profile:", error);
    }
};

// --- LOAD GRADES & TRANSCRIPT ---
const loadGrades = async () => {
    const errorDiv = document.getElementById('grades-error');
    const tableBody = document.getElementById('grades-table-body');
    
    try {
        const gradesRes = await getMyGrades();
        tableBody.innerHTML = ''; // Clear loading state
        errorDiv.textContent = ''; // Clear previous errors

        if (gradesRes.data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 20px; color: #888;">
                        No grades found in your record.
                    </td>
                </tr>`;
            return;
        }

        gradesRes.data.forEach(grade => {
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid #eee';

            // --- DEFENSIVE CHECK ---
            // If the course link is broken (e.g., course was deleted), 
            // we use a fallback string instead of crashing.
            const courseName = grade.course ? grade.course.courseName : "Course Unavailable";
            const courseCode = grade.course ? `(${grade.course.courseCode})` : "";
            
            const dateStr = new Date(grade.createdAt).toLocaleDateString();

            row.innerHTML = `
                <td style="padding: 15px 0;">
                    <div style="font-weight: bold; color: #333;">${courseName}</div>
                    <div style="font-size: 0.85em; color: #777;">${courseCode}</div>
                </td>
                <td style="padding: 15px 0; color: ${grade.score >= 40 ? '#2e7d32' : '#d32f2f'}; font-weight: bold;">
                    ${grade.score}/100
                </td>
                <td style="padding: 15px 0; color: #555;">
                    ${grade.remarks || '<span style="color:#ccc;">No remarks</span>'}
                </td>
                <td style="padding: 15px 0; color: #888; font-size: 0.9em;">
                    ${dateStr}
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        // Log the error for the developer
        console.error("Grade Loading Error:", error);
        // Show a user-friendly message on the UI
        errorDiv.style.color = '#d32f2f';
        errorDiv.textContent = `⚠️ Error loading grades: ${error}`;
    }
};

// --- INITIALIZE PAGE ---
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadGrades();
});