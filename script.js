const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

const employees = {
  "EMP001": { name: "John Doe", department: "IT" },
  "EMP002": { name: "Priya Sharma", department: "HR" },
  "EMP003": { name: "Ravi Kumar", department: "Finance" },
"UTP223" : {name: "Shreya", department: "IS(Intern)"},
  "EMP004": { name: "Arjun Mehta", department: "Operations" }
};

// Employee Details 
document.addEventListener("DOMContentLoaded", () => {
  const empDetailsDiv = document.getElementById("employee-details");
  if (empDetailsDiv) {
    const empId = localStorage.getItem("currentEmployeeId");
    const emp = employees[empId];
    if (!emp) {
      empDetailsDiv.innerHTML = `<p style='color:red;'>Invalid QR Code!</p>`;
      return;
    }

    // const time = new Date().toLocaleString();
    // const status = toggleStatus(empId);
    // const record = { id: empId, name: emp.name, dept: emp.department, time, status };

    // saveRecord(record);
    const now = new Date();
const time = now.toLocaleString();
const today = now.toISOString().split('T')[0]; // e.g. "2025-11-07"

// Load all records
const records = JSON.parse(localStorage.getItem("records")) || [];

// Filter to check how many times this employee has scanned today
const todayRecords = records.filter(r => {
  const recordDate = new Date(r.time).toISOString().split('T')[0];
  return r.id === empId && recordDate === today;
});

if (todayRecords.length >= 2) {
  empDetailsDiv.innerHTML = `
    <p style="color:red;font-weight:bold;">⚠️ ${emp.name} has already scanned twice today!</p>
    <p><b>ID:</b> ${empId}</p>
    <p><b>Department:</b> ${emp.department}</p>
    <p><b>Last Scan Time:</b> ${todayRecords[todayRecords.length - 1].time}</p>
  `;
  return; // stop further processing
}

// Otherwise allow scanning
const status = toggleStatus(empId);
const record = { id: empId, name: emp.name, dept: emp.department, time, status };

// Save new record
saveRecord(record);

// Display employee info
empDetailsDiv.innerHTML = `
  <h3>${emp.name}</h3>
  <p><b>ID:</b> ${empId}</p>
  <p><b>Department:</b> ${emp.department}</p>
  <p><b>Time:</b> ${time}</p>
  <p><b>Status:</b> ${status}</p>
`;


    empDetailsDiv.innerHTML = `
      <h3>${emp.name}</h3>
      <p><b>ID:</b> ${empId}</p>
      <p><b>Department:</b> ${emp.department}</p>
      <p><b>Time:</b> ${time}</p>
      <p><b>Status:</b> ${status}</p>
      <div class="links">
        <a href="index.html" class="btn">← Back to Scanner</a>
        <a href="records.html" class="btn see-btn">📋 See Records</a>
      </div>
    `;
  }

  // Admin Login Logic
  const loginForm = document.getElementById("admin-login");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = document.getElementById("username").value;
      const pass = document.getElementById("password").value;
      const msg = document.getElementById("login-msg");

      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        msg.innerText = "Login successful. Redirecting...";
        setTimeout(() => (window.location.href = "records.html"), 800);
      } else {
        msg.innerText = "Invalid credentials!";
        msg.style.color = "red";
      }
    });
  }

  // Records Page
  const recordsTable = document.getElementById("records-table");
  if (recordsTable) {
    const records = JSON.parse(localStorage.getItem("records")) || [];
    const tbody = recordsTable.querySelector("tbody");

    if (records.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">No records available</td></tr>`;
    } else {
      records.forEach(r => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${r.id}</td>
          <td>${r.name}</td>
          <td>${r.dept}</td>
          <td>${r.time}</td>
          <td>${r.status}</td>
        `;
        tbody.appendChild(row);
      });
    }

    const downloadBtn = document.getElementById("download-btn");
    downloadBtn.addEventListener("click", downloadRecords);
  }
});

// inside/outside
function toggleStatus(empId) {
  const records = JSON.parse(localStorage.getItem("records")) || [];
  const last = [...records].reverse().find(r => r.id === empId);
  return (last && last.status === "Inside Premises") ? "Outside Premises" : "Inside Premises";
}

// Save new record to localStorage
function saveRecord(record) {
  const records = JSON.parse(localStorage.getItem("records")) || [];
  records.push(record);
  localStorage.setItem("records", JSON.stringify(records));
}

// Download records as CSV
function downloadRecords() {
  const records = JSON.parse(localStorage.getItem("records")) || [];
  if (records.length === 0) {
    alert("No records available!");
    return;
  }
  const csv = [
    ["Employee ID", "Name", "Department", "Time", "Status"],
    ...records.map(r => [r.id, r.name, r.dept, r.time, r.status])
  ].map(e => e.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "employee_records.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
}