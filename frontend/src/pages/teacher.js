import { getAllStudents, assignGrade } from '../api/teacherApi';
import { clearAuthData, getUserRole } from '../utils/authStorage';

// --- FRONTEND BOUNCER ---
const currentRole = getUserRole();
if (currentRole !== 'teacher') {
    window.location.href = '/index.html';
}

// --- LOGOUT ---
document.getElementById('logout-btn').addEventListener('click', () => {
    clearAuthData();
    window.location.href = '/index.html';
});

// --- LOAD ROSTER & DROPDOWN ---
const loadRoster = async () => {
    const tableBody = document.getElementById('student-roster-body');
    const studentSelect = document.getElementById('student-select');

    try {
        const result = await getAllStudents();
        
        // Clear loading states
        tableBody.innerHTML = '';
        studentSelect.innerHTML = '<option value="" disabled selected>Select a student...</option>';

        if (!result.data || result.data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 20px;">No students enrolled in your sections yet.</td></tr>';
            return;
        }

        result.data.forEach(student => {
            // 1. Fill Table
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid #eee';
            row.innerHTML = `
                <td style="padding: 10px 0;"><strong>${student.portalId}</strong></td>
                <td style="padding: 10px 0;">${student.name}</td>
                <td style="padding: 10px 0;"><span class="role-badge">${student.role}</span></td>
            `;
            tableBody.appendChild(row);

            // 2. Fill Dropdown (Use _id for the value!)
            const option = document.createElement('option');
            option.value = student._id;
            option.textContent = `${student.name} (${student.portalId})`;
            studentSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Failed to load roster:", error);
        tableBody.innerHTML = `<tr><td colspan="3" style="color:red; text-align:center;">Error: ${error}</td></tr>`;
    }
};

// --- SUBMIT GRADE ---
document.getElementById('grade-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const studentId = document.getElementById('student-select').value;
    const score = document.getElementById('score').value;
    const remarks = document.getElementById('remarks').value;
    const messageDiv = document.getElementById('grade-message');
    const submitBtn = document.getElementById('submit-grade-btn');

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        await assignGrade({ 
            studentId, 
            score: Number(score), 
            remarks 
        });

        messageDiv.style.color = 'green';
        messageDiv.textContent = '✅ Grade assigned successfully!';
        document.getElementById('grade-form').reset();
    } catch (error) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = `❌ Error: ${error}`;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Grade';
    }
});

// Initialize
loadRoster();