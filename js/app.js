/* PMS Interactive Mockup
 *
 * Roles: Employee | HR | Admin | Manager | Team Lead
 *
 * Flow: Employee → Review Cycles (quarterly) → Goals List → Review
 */

const ROLES = {
  admin:    { name: 'Admin',     avatar: 'AD', user: 'Alex Admin',   color: '#2563eb', email: 'alex.admin@pms.com' },
  hr:       { name: 'HR',        avatar: 'HR', user: 'Sarah HR',     color: '#7c3aed', email: 'sarah.hr@pms.com' },
  manager:  { name: 'Manager',   avatar: 'MG', user: 'Mike Manager', color: '#059669', email: 'mike.manager@pms.com' },
  teamlead: { name: 'Team Lead', avatar: 'TL', user: 'Tom TeamLead', color: '#d97706', email: 'tom.teamlead@pms.com' },
  employee: { name: 'Employee',  avatar: 'JD', user: 'John Doe',     color: '#64748b', email: 'john.doe@pms.com' }
};

/* In a real system the server resolves role from the authenticated account.
   Here we simulate that lookup from the email the user enters. */
function resolveRoleFromEmail(email) {
  const clean = (email || '').trim().toLowerCase();
  const found = Object.keys(ROLES).find(key => ROLES[key].email === clean);
  return found || null;
}

const WEIGHTAGE = { employee: 60, teamlead: 10, manager: 20, admin: 10 };

/* ---------- In-memory data stores ---------- */
let DEPARTMENTS = [
  { id: 1, name: 'QA', description: 'Quality Assurance', employees: 42, status: 'Active' },
  { id: 2, name: 'Sales', description: 'Sales team', employees: 55, status: 'Active' },
  { id: 3, name: 'Marketing', description: 'Marketing team', employees: 28, status: 'Active' },
  { id: 4, name: '.NET', description: '.NET development', employees: 68, status: 'Active' },
  { id: 5, name: 'HR', description: 'Human Resources', employees: 12, status: 'Active' },
  { id: 6, name: 'Operations', description: 'Operations', employees: 43, status: 'Inactive' }
];

let DESIGNATIONS = [
  { id: 1, name: 'Intern', description: 'Internship role', employees: 18, status: 'Active' },
  { id: 2, name: 'Junior', description: 'Junior level', employees: 96, status: 'Active' },
  { id: 3, name: 'Senior', description: 'Senior level', employees: 74, status: 'Active' },
  { id: 4, name: 'Executive', description: 'Executive level', employees: 32, status: 'Inactive' }
];

let GOALS_LIB = [
  { id: 1, title: 'Deliver projects on time', description: '95% on-time delivery', scope: 'Organization-wide', dept: '', category: 'Technical', maxScore: 100, status: 'Active' },
  { id: 2, title: 'Team collaboration', description: 'Meetings, knowledge sharing', scope: 'Organization-wide', dept: '', category: 'Behavioral', maxScore: 200, status: 'Active' },
  { id: 3, title: 'Code quality & peer reviews', description: 'Review participation & standards', scope: 'Department', dept: '.NET', category: 'Technical', maxScore: 100, status: 'Active' },
  { id: 4, title: '.NET sprint velocity', description: 'Story points completed per sprint', scope: 'Department', dept: '.NET', category: 'Technical', maxScore: 100, status: 'Active' },
  { id: 5, title: 'QA defect rate', description: 'Reduce escaped defects', scope: 'Department', dept: 'QA', category: 'Technical', maxScore: 100, status: 'Active' },
  { id: 6, title: 'Client satisfaction', description: 'NPS & feedback scores', scope: 'Department', dept: 'Sales', category: 'Business', maxScore: 100, status: 'Active' },
  { id: 7, title: 'Campaign ROI', description: 'Marketing campaign performance', scope: 'Department', dept: 'Marketing', category: 'Business', maxScore: 1100, status: 'Active' }
];

let EMPLOYEES = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@company.com', dept: '.NET', designation: 'Junior', manager: 'Mike Manager', teamLead: 'Tom TeamLead', role: 'Employee', status: 'Pending Review', plannedLeave: 12, unplannedLeave: 6, optionalLeave: 2 },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@company.com', dept: 'QA', designation: 'Senior', manager: 'Mike Manager', teamLead: 'Tom TeamLead', role: 'Employee', status: 'Complete', plannedLeave: 12, unplannedLeave: 6, optionalLeave: 2 },
  { id: 3, firstName: 'Bob', lastName: 'Wilson', email: 'bob.wilson@company.com', dept: 'Sales', designation: 'Executive', manager: 'Mike Manager', teamLead: 'Tom TeamLead', role: 'Employee', status: 'Self Assessment Done', plannedLeave: 12, unplannedLeave: 6, optionalLeave: 2 },
  { id: 4, firstName: 'Alice', lastName: 'Brown', email: 'alice.brown@company.com', dept: 'Marketing', designation: 'Intern', manager: 'Mike Manager', teamLead: 'Tom TeamLead', role: 'Employee', status: 'In Progress', plannedLeave: 8, unplannedLeave: 4, optionalLeave: 1 },
  { id: 5, firstName: 'Chris', lastName: 'Lee', email: 'chris.lee@company.com', dept: '.NET', designation: 'Senior', manager: 'Mike Manager', teamLead: 'Tom TeamLead', role: 'Employee', status: 'Pending Review', plannedLeave: 12, unplannedLeave: 6, optionalLeave: 2 }
];

let EMPLOYEE_WEIGHTAGES = [
  { id: 1, name: 'John Doe', email: 'john.doe@company.com', dept: '.NET', designation: 'Junior', employee: 0, teamlead: 30, manager: 50, admin: 20 },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@company.com', dept: 'QA', designation: 'Senior', employee: 0, teamlead: 25, manager: 50, admin: 25 },
  { id: 3, name: 'Bob Wilson', email: 'bob.wilson@company.com', dept: 'Sales', designation: 'Executive', employee: 0, teamlead: 0, manager: 70, admin: 30 },
  { id: 4, name: 'Alice Brown', email: 'alice.brown@company.com', dept: 'Marketing', designation: 'Intern', employee: 0, teamlead: 30, manager: 50, admin: 20 },
  { id: 5, name: 'Chris Lee', email: 'chris.lee@company.com', dept: '.NET', designation: 'Senior', employee: 0, teamlead: 40, manager: 40, admin: 20 }
];

/* Review cycles per employee (quarterly) */
let REVIEW_CYCLES = [
  { id: 1, employeeId: 1, quarter: 'Q4 2025', period: 'Oct–Dec 2025', status: 'Complete', goalsCount: 4 },
  { id: 2, employeeId: 1, quarter: 'Q1 2026', period: 'Jan–Mar 2026', status: 'In Progress', goalsCount: 5 },
  { id: 3, employeeId: 1, quarter: 'Q2 2026', period: 'Apr–Jun 2026', status: 'Draft', goalsCount: 0 },
  { id: 4, employeeId: 2, quarter: 'Q4 2025', period: 'Oct–Dec 2025', status: 'Complete', goalsCount: 4 },
  { id: 5, employeeId: 2, quarter: 'Q1 2026', period: 'Jan–Mar 2026', status: 'Complete', goalsCount: 4 },
  { id: 6, employeeId: 2, quarter: 'Q2 2026', period: 'Apr–Jun 2026', status: 'Draft', goalsCount: 0 },
  { id: 7, employeeId: 3, quarter: 'Q1 2026', period: 'Jan–Mar 2026', status: 'In Progress', goalsCount: 5 },
  { id: 8, employeeId: 3, quarter: 'Q2 2026', period: 'Apr–Jun 2026', status: 'Draft', goalsCount: 0 },
  { id: 9, employeeId: 4, quarter: 'Q1 2026', period: 'Jan–Mar 2026', status: 'In Progress', goalsCount: 3 },
  { id: 10, employeeId: 4, quarter: 'Q2 2026', period: 'Apr–Jun 2026', status: 'Draft', goalsCount: 0 },
  { id: 11, employeeId: 5, quarter: 'Q1 2026', period: 'Jan–Mar 2026', status: 'Pending Review', goalsCount: 5 },
  { id: 12, employeeId: 5, quarter: 'Q2 2026', period: 'Apr–Jun 2026', status: 'Draft', goalsCount: 0 }
];

/* Document types master (Admin-configured; mirrors API: /document-types, incl. IsMandatory) */
const DOCUMENT_TYPES = [
  { name: 'Offer Letter', mandatory: true },
  { name: 'ID Proof', mandatory: true },
  { name: 'Resume', mandatory: true },
  { name: 'Address Proof', mandatory: false },
  { name: 'Educational Certificate', mandatory: false },
  { name: 'Relieving Letter', mandatory: false },
  { name: 'Bank Details', mandatory: false },
  { name: 'Other', mandatory: false }
];

/* Mirrors appsettings.json FileUploadSettings — kept in sync with the API's own
   ValidateFile() so the mockup rejects the same files the server would. */
const DOC_MAX_SIZE_MB = 5;
const DOC_ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

/* Employee documents — visible/manageable by Admin and HR only (API policy: Employee.Manage,
   same as the rest of the employee module — Manager/TeamLead never see this, unlike goals).
   `previewUrl` only exists for files uploaded in this session (real blob: URL); seeded demo
   rows don't have real bytes behind them, so their preview falls back to a note about that.
   `history` holds prior versions, pushed by saveDocument() on every Replace. */
let EMPLOYEE_DOCUMENTS = [
  { id: 1, employeeId: 1, docType: 'Offer Letter', fileName: 'john_doe_offer_letter.pdf', sizeKb: 184, description: '', versionCount: 1, uploadedBy: 'Sarah HR', uploadedDate: '2025-11-02', previewUrl: null, history: [] },
  { id: 2, employeeId: 1, docType: 'ID Proof', fileName: 'john_doe_aadhaar.pdf', sizeKb: 96, description: 'Aadhaar card', versionCount: 1, uploadedBy: 'Sarah HR', uploadedDate: '2025-11-02', previewUrl: null, history: [] },
  { id: 3, employeeId: 2, docType: 'Offer Letter', fileName: 'jane_smith_offer_letter.pdf', sizeKb: 176, description: '', versionCount: 2, uploadedBy: 'Sarah HR', uploadedDate: '2025-08-14', previewUrl: null,
    history: [{ versionNumber: 1, fileName: 'jane_smith_offer_letter_draft.pdf', sizeKb: 168, replacedBy: 'Sarah HR', replacedOn: '2025-08-10' }] }
];

/* Set right after "+ Add Employee" succeeds so the profile page can surface a one-time
   "upload their documents" prompt; cleared after the first render that shows it. */
let justAddedEmployeeId = null;

/* Set after an upload/replace/delete so the profile page can flash a one-time confirmation
   next to the Documents card; cleared after the first render that shows it. */
let lastDocFeedback = null; // { employeeId, message }

/* ==================== LEAVE MANAGEMENT ==================== */

/* Leave type master — the 3 leave codes captured on the Employee "Leave" step. */
const LEAVE_TYPES = [
  { code: 'PL', name: 'Planned Leave', assignType: 'Manual', field: 'plannedLeave' },
  { code: 'UL', name: 'Unplanned Leave', assignType: 'Manual', field: 'unplannedLeave' },
  { code: 'OL', name: 'Optional Leave', assignType: 'Manual', field: 'optionalLeave' }
];

/* Current balance per employee × leave code × financial year. Seeded from the employee's
   stepper fields (seedLeaveDataForEmployee) and adjusted by credits/debits. */
let LEAVE_BALANCES = [];

/* Ledger — every credit (opening balance, manual credit, encashment) and debit (availed leave,
   once approved). Feeds the "Leave Transactions" table and the AL/CR/CF/EN/DB totals strip. */
let LEAVE_LEDGER = [];

/* Leave requests raised via "Avail Leave" — approved/rejected by HR/Admin. */
let LEAVE_REQUESTS = [];

/* Employee currently selected on the Leave Management page (HR/Admin picker). */
let selectedLeaveEmployeeId = null;
let selectedLeaveDeptFilter = '';

/** Calendar-year financial year, matching the reference screenshot (01/01–31/12).
    Swap this in one place if the real system uses an Apr–Mar year instead. */
function getCurrentFinancialYear() {
  const y = new Date().getFullYear();
  return { year: String(y), fromLabel: `01/01/${y}`, toLabel: `31/12/${y}` };
}

/** Seeds LEAVE_BALANCES + an opening-credit LEAVE_LEDGER row for a newly added/edited
    employee, from their plannedLeave/unplannedLeave/optionalLeave fields. Existing
    balance rows for this employee+FY are replaced rather than duplicated, so re-saving
    the Leave step (edit mode) adjusts the balance instead of double-crediting it. */
function seedLeaveDataForEmployee(emp) {
  const fy = getCurrentFinancialYear().year;
  LEAVE_TYPES.forEach(lt => {
    const days = Number(emp[lt.field]) || 0;
    let bal = LEAVE_BALANCES.find(b => b.employeeId === emp.id && b.financialYear === fy && b.code === lt.code);
    if (!bal) {
      bal = { id: `${emp.id}-${lt.code}-${fy}`, employeeId: emp.id, financialYear: fy, code: lt.code, balance: 0 };
      LEAVE_BALANCES.push(bal);
    }
    const already = LEAVE_LEDGER.some(l => l.employeeId === emp.id && l.financialYear === fy && l.code === lt.code && l.note === 'Opening credit');
    if (!already) {
      bal.balance = days;
      LEAVE_LEDGER.push({ id: `led-${nextId.leaveLedger++}`, employeeId: emp.id, financialYear: fy, type: 'CR', code: lt.code, date: new Date().toISOString().slice(0, 10), days, note: 'Opening credit' });
    } else if (days !== bal.balance) {
      // Edit mode: opening credit already recorded — treat a changed stepper value as a manual adjustment.
      const delta = days - bal.balance;
      bal.balance = days;
      LEAVE_LEDGER.push({ id: `led-${nextId.leaveLedger++}`, employeeId: emp.id, financialYear: fy, type: delta >= 0 ? 'CR' : 'DB', code: lt.code, date: new Date().toISOString().slice(0, 10), days: Math.abs(delta), note: 'Balance adjusted' });
    }
  });
}

function getEmployeeLeaveBalances(employeeId) {
  const fy = getCurrentFinancialYear().year;
  return LEAVE_TYPES.map(lt => {
    const bal = LEAVE_BALANCES.find(b => b.employeeId === employeeId && b.financialYear === fy && b.code === lt.code);
    return { code: lt.code, name: lt.name, assignType: lt.assignType, balance: bal ? bal.balance : 0 };
  });
}

function getEmployeeLeaveLedger(employeeId) {
  const fy = getCurrentFinancialYear().year;
  return LEAVE_LEDGER.filter(l => l.employeeId === employeeId && l.financialYear === fy)
    .slice().sort((a, b) => b.date.localeCompare(a.date));
}

function getEmployeeLeaveRequests(employeeId) {
  return LEAVE_REQUESTS.filter(r => r.employeeId === employeeId)
    .slice().sort((a, b) => b.requestedDate.localeCompare(a.requestedDate));
}

/* Admin/HR/Manager/Team Lead don't have a row in EMPLOYEES (that list is the roster
   *they* manage) — but they still take their own leave, so "My Leave" needs an employee-
   shaped record for each of them to seed a balance/ledger against. Kept out of EMPLOYEES on
   purpose: these 4 people shouldn't show up in the Employees CRUD list or the goals/review
   flow, only on their own "My Leave" page. */
const SELF_LEAVE_PROFILES = {
  admin:    { id: 901, firstName: 'Alex',  lastName: 'Admin',    email: ROLES.admin.email,    dept: 'Admin',      designation: 'Administrator', plannedLeave: 12, unplannedLeave: 6, optionalLeave: 2 },
  hr:       { id: 902, firstName: 'Sarah', lastName: 'HR',       email: ROLES.hr.email,       dept: 'HR',         designation: 'HR Manager',     plannedLeave: 12, unplannedLeave: 6, optionalLeave: 2 },
  manager:  { id: 903, firstName: 'Mike',  lastName: 'Manager',  email: ROLES.manager.email,  dept: '.NET',       designation: 'Manager',        plannedLeave: 15, unplannedLeave: 8, optionalLeave: 3 },
  teamlead: { id: 904, firstName: 'Tom',   lastName: 'TeamLead', email: ROLES.teamlead.email, dept: '.NET',       designation: 'Team Lead',      plannedLeave: 14, unplannedLeave: 7, optionalLeave: 2 }
};

/** Resolves "the currently logged-in person's own employee row" for self-service "My Leave"
    views. Employee has a real EMPLOYEES row; Admin/HR/Manager/Team Lead use their
    SELF_LEAVE_PROFILES stand-in instead. */
function getCurrentEmployee() {
  const email = ROLES[currentRole]?.email;
  return EMPLOYEES.find(e => e.email === email) || SELF_LEAVE_PROFILES[currentRole] || EMPLOYEES[0] || null;
}

/* Phase 2 hook — called whenever a leave request is submitted. Currently a no-op; this is
   where the HR/Admin notification bell + "generic mail to HR, CC TL/Manager/Admin" attach
   later without needing to touch saveLeaveRequest() itself. */
function onLeaveApplied(request) {
  // TODO (Phase 2): push a NOTIFICATIONS entry for HR/Admin + trigger the leave-applied email.
}

/* Phase 2 hook — called on approval. Currently a no-op; balance deduction + a DB ledger row
   attach here once notifications/mail are wired up. */
function applyBalanceDeduction(request) {
  // TODO (Phase 2): subtract request.days from the matching LEAVE_BALANCES row and push a
  // 'DB' LEAVE_LEDGER entry, so the Leave Transactions/Balance tables reflect the approval.
}

/* Goals assigned — scores/remarks per role (self / TL / manager / admin) */
let ASSIGNED_GOALS = [
  /* John Doe — Q4 2025 (Complete) */
  { id: 1, cycleId: 1, employeeId: 1, title: 'Deliver projects on time', description: 'Complete sprint tasks within deadlines.', kpi: 'On-time delivery %', scope: 'Org-wide', type: 'Standard', maxScore: 100,
    selfScore: 88, selfRemark: 'Met most sprint deadlines in Q4.',
    tlScore: 85, tlRemark: 'Solid delivery; one dependency slip.',
    managerScore: 86, managerRemark: 'Consistent performer.',
    adminScore: 85, adminRemark: 'Approved — good quarter.', status: 'Complete' },
  { id: 2, cycleId: 1, employeeId: 1, title: 'Team collaboration', description: 'Active participation in team ceremonies.', kpi: 'Meeting participation', scope: 'Org-wide', type: 'Standard', maxScore: 200,
    selfScore: 170, selfRemark: 'Attended all standups and retros.',
    tlScore: 165, tlRemark: 'Good collaborator.',
    managerScore: 168, managerRemark: 'Helps juniors often.',
    adminScore: 165, adminRemark: 'Approved.', status: 'Complete' },
  { id: 3, cycleId: 1, employeeId: 1, title: 'Code quality & peer reviews', description: 'Maintain review standards.', kpi: 'PR reviews completed', scope: '.NET', type: 'Standard', maxScore: 100,
    selfScore: 92, selfRemark: 'Reviewed 18 PRs.',
    tlScore: 90, tlRemark: 'Thorough reviews.',
    managerScore: 91, managerRemark: 'Quality focus is strong.',
    adminScore: 90, adminRemark: 'Approved.', status: 'Complete' },
  { id: 4, cycleId: 1, employeeId: 1, title: '.NET sprint velocity', description: 'Meet story-point targets.', kpi: 'Story points / sprint', scope: '.NET', type: 'Standard', maxScore: 100,
    selfScore: 86, selfRemark: 'Hit targets in 5 of 6 sprints.',
    tlScore: 84, tlRemark: 'One sprint under target.',
    managerScore: 85, managerRemark: 'Acceptable velocity.',
    adminScore: 84, adminRemark: 'Approved.', status: 'Complete' },

  /* John Doe — Q1 2026 (ready for Admin review — TL & Manager already scored) */
  { id: 5, cycleId: 2, employeeId: 1, title: 'Deliver projects on time', description: 'Complete assigned sprint tasks within deadlines. Target: 95% on-time delivery.', kpi: 'On-time delivery %', scope: 'Org-wide', type: 'Standard', maxScore: 100,
    selfScore: 85, selfRemark: 'Completed 94% of sprint tasks on time. Missed 1 deadline due to dependency.',
    tlScore: 82, tlRemark: 'Good delivery rate; one missed deadline noted.',
    managerScore: 80, managerRemark: 'Slightly below target — plan better next quarter.',
    adminScore: null, adminRemark: '', status: 'Assessed' },
  { id: 6, cycleId: 2, employeeId: 1, title: 'Team collaboration', description: 'Active participation in standups, retrospectives, and knowledge sharing.', kpi: 'Meeting & knowledge share count', scope: 'Org-wide', type: 'Standard', maxScore: 200,
    selfScore: 160, selfRemark: 'Led 2 knowledge sharing sessions. Active in all team ceremonies.',
    tlScore: 150, tlRemark: 'Active team member, good contributions.',
    managerScore: 155, managerRemark: 'Strong collaboration; keep mentoring.',
    adminScore: null, adminRemark: '', status: 'Assessed' },
  { id: 7, cycleId: 2, employeeId: 1, title: 'Code quality & peer reviews', description: 'Participate in code reviews and maintain quality standards.', kpi: 'PR reviews completed', scope: '.NET', type: 'Standard', maxScore: 100,
    selfScore: 90, selfRemark: 'Reviewed 15 PRs this quarter. Zero critical bugs in my code.',
    tlScore: 88, tlRemark: 'Excellent review participation.',
    managerScore: 90, managerRemark: 'Quality bar is high.',
    adminScore: null, adminRemark: '', status: 'Assessed' },
  { id: 8, cycleId: 2, employeeId: 1, title: '.NET sprint velocity', description: 'Meet agreed story-point targets each sprint.', kpi: 'Story points / sprint', scope: '.NET', type: 'Standard', maxScore: 100,
    selfScore: 88, selfRemark: 'Met story-point targets in 5 of 6 sprints.',
    tlScore: 85, tlRemark: 'Consistent velocity; one sprint slipped.',
    managerScore: 86, managerRemark: 'Steady contributor.',
    adminScore: null, adminRemark: '', status: 'Assessed' },
  { id: 9, cycleId: 2, employeeId: 1, title: 'Learn new technology stack', description: 'Complete React Advanced certification and apply in project work.', kpi: 'Certification + production usage', scope: 'Custom', type: 'Custom', maxScore: 100,
    selfScore: 80, selfRemark: 'Completed React certification. Applied hooks pattern in Project X.',
    tlScore: 75, tlRemark: 'Certification done; needs more production usage.',
    managerScore: 78, managerRemark: 'Good initiative — apply more in delivery.',
    adminScore: null, adminRemark: '', status: 'Assessed' },

  /* Jane Smith — Q4 2025 */
  { id: 10, cycleId: 4, employeeId: 2, title: 'Deliver projects on time', description: '95% on-time delivery for QA releases.', kpi: 'On-time delivery %', scope: 'Org-wide', type: 'Standard', maxScore: 100,
    selfScore: 91, selfRemark: 'All releases on schedule.', tlScore: 90, tlRemark: 'Reliable.', managerScore: 92, managerRemark: 'Excellent.', adminScore: 90, adminRemark: 'Approved.', status: 'Complete' },
  { id: 11, cycleId: 4, employeeId: 2, title: 'Team collaboration', description: 'Knowledge sharing sessions.', kpi: 'Knowledge share sessions', scope: 'Org-wide', type: 'Standard', maxScore: 200,
    selfScore: 175, selfRemark: 'Ran 3 QA workshops.', tlScore: 170, tlRemark: 'Great sharing.', managerScore: 172, managerRemark: 'Team player.', adminScore: 170, adminRemark: 'Approved.', status: 'Complete' },
  { id: 12, cycleId: 4, employeeId: 2, title: 'QA defect rate', description: 'Reduce escaped defects.', kpi: 'Escaped defect count', scope: 'QA', type: 'Standard', maxScore: 100,
    selfScore: 89, selfRemark: 'Escaped defects down 20%.', tlScore: 88, tlRemark: 'Solid QA.', managerScore: 90, managerRemark: 'Strong results.', adminScore: 88, adminRemark: 'Approved.', status: 'Complete' },
  { id: 13, cycleId: 4, employeeId: 2, title: 'Test automation coverage', description: 'Increase automation %.', kpi: 'Automation coverage %', scope: 'QA', type: 'Standard', maxScore: 100,
    selfScore: 84, selfRemark: 'Coverage up to 72%.', tlScore: 82, tlRemark: 'Good progress.', managerScore: 85, managerRemark: 'Keep pushing.', adminScore: 82, adminRemark: 'Approved.', status: 'Complete' },

  /* Jane Smith — Q1 2026 (Complete) */
  { id: 14, cycleId: 5, employeeId: 2, title: 'Deliver projects on time', description: '95% on-time delivery', kpi: 'On-time delivery %', scope: 'Org-wide', type: 'Standard', maxScore: 100,
    selfScore: 90, selfRemark: 'On-time releases.', tlScore: 88, tlRemark: 'Consistent.', managerScore: 92, managerRemark: 'Exceeds.', adminScore: 90, adminRemark: 'Approved.', status: 'Reviewed' },
  { id: 15, cycleId: 5, employeeId: 2, title: 'Team collaboration', description: 'Knowledge sharing', kpi: 'Knowledge share sessions', scope: 'Org-wide', type: 'Standard', maxScore: 200,
    selfScore: 180, selfRemark: 'Led QA guild.', tlScore: 175, tlRemark: 'Excellent.', managerScore: 178, managerRemark: 'Role model.', adminScore: 175, adminRemark: 'Approved.', status: 'Reviewed' },
  { id: 16, cycleId: 5, employeeId: 2, title: 'QA defect rate', description: 'Reduce escaped defects', kpi: 'Escaped defect count', scope: 'QA', type: 'Standard', maxScore: 100,
    selfScore: 92, selfRemark: 'Lowest escape rate this year.', tlScore: 90, tlRemark: 'Outstanding.', managerScore: 91, managerRemark: 'Top performer.', adminScore: 90, adminRemark: 'Approved.', status: 'Reviewed' },
  { id: 17, cycleId: 5, employeeId: 2, title: 'Test automation coverage', description: 'Increase automation %', kpi: 'Automation coverage %', scope: 'QA', type: 'Standard', maxScore: 100,
    selfScore: 88, selfRemark: 'Coverage 78%.', tlScore: 85, tlRemark: 'Good climb.', managerScore: 87, managerRemark: 'On track.', adminScore: 85, adminRemark: 'Approved.', status: 'Reviewed' },

  /* Bob Wilson — Q1 2026 (TL skipped — weightage 0; Manager scored) */
  { id: 18, cycleId: 7, employeeId: 3, title: 'Deliver projects on time', description: 'On-time delivery for sales deliverables.', kpi: 'On-time delivery %', scope: 'Org-wide', type: 'Standard', maxScore: 100,
    selfScore: 75, selfRemark: 'Most proposals delivered on time.', tlScore: null, tlRemark: '', managerScore: 72, managerRemark: 'Needs tighter planning.', adminScore: null, adminRemark: '', status: 'Assessed' },
  { id: 19, cycleId: 7, employeeId: 3, title: 'Client satisfaction', description: 'NPS & feedback scores from clients.', kpi: 'NPS score', scope: 'Sales', type: 'Standard', maxScore: 100,
    selfScore: 70, selfRemark: 'NPS average 68.', tlScore: null, tlRemark: '', managerScore: 68, managerRemark: 'Improve follow-ups.', adminScore: null, adminRemark: '', status: 'Assessed' },
  { id: 20, cycleId: 7, employeeId: 3, title: 'Team collaboration', description: 'Cross-team collaboration on deals.', kpi: 'Team participation', scope: 'Org-wide', type: 'Standard', maxScore: 200,
    selfScore: 140, selfRemark: 'Worked with marketing on 2 campaigns.', tlScore: null, tlRemark: '', managerScore: 135, managerRemark: 'More sync needed.', adminScore: null, adminRemark: '', status: 'Assessed' },
  { id: 21, cycleId: 7, employeeId: 3, title: 'Pipeline growth', description: 'Grow sales pipeline value this quarter.', kpi: 'Pipeline value growth %', scope: 'Sales', type: 'Custom', maxScore: 100,
    selfScore: 78, selfRemark: 'Pipeline up 12%.', tlScore: null, tlRemark: '', managerScore: 75, managerRemark: 'Decent growth.', adminScore: null, adminRemark: '', status: 'Assessed' },
  { id: 22, cycleId: 7, employeeId: 3, title: 'Deal closure rate', description: 'Meet close-rate targets.', kpi: 'Deal close rate %', scope: 'Sales', type: 'Standard', maxScore: 100,
    selfScore: 72, selfRemark: 'Closed 8 of 12 deals.', tlScore: null, tlRemark: '', managerScore: 70, managerRemark: 'Close to target.', adminScore: null, adminRemark: '', status: 'Assessed' },

  /* Alice Brown — Q1 2026 */
  { id: 23, cycleId: 9, employeeId: 4, title: 'Deliver projects on time', description: 'Complete campaign milestones on schedule.', kpi: 'On-time delivery %', scope: 'Org-wide', type: 'Standard', maxScore: 100,
    selfScore: 82, selfRemark: 'Campaigns shipped on time.', tlScore: 80, tlRemark: 'Good pacing.', managerScore: 81, managerRemark: 'Reliable intern.', adminScore: null, adminRemark: '', status: 'Assessed' },
  { id: 24, cycleId: 9, employeeId: 4, title: 'Campaign ROI', description: 'Improve marketing campaign ROI.', kpi: 'Campaign ROI %', scope: 'Marketing', type: 'Standard', maxScore: 1100,
    selfScore: 780, selfRemark: 'ROI improved on 2 of 3 campaigns.', tlScore: 750, tlRemark: 'Promising results.', managerScore: 760, managerRemark: 'Keep optimizing spend.', adminScore: null, adminRemark: '', status: 'Assessed' },
  { id: 25, cycleId: 9, employeeId: 4, title: 'Team collaboration', description: 'Collaborate with design and sales teams.', kpi: 'Cross-team sessions', scope: 'Org-wide', type: 'Standard', maxScore: 200,
    selfScore: 150, selfRemark: 'Weekly sync with design.', tlScore: 145, tlRemark: 'Communicates well.', managerScore: 148, managerRemark: 'Fits the team.', adminScore: null, adminRemark: '', status: 'Assessed' },

  /* Chris Lee — Q1 2026 */
  { id: 26, cycleId: 11, employeeId: 5, title: 'Deliver projects on time', description: 'Sprint delivery for .NET projects.', kpi: 'On-time delivery %', scope: 'Org-wide', type: 'Standard', maxScore: 100,
    selfScore: 87, selfRemark: 'All major milestones met.', tlScore: 85, tlRemark: 'Reliable senior.', managerScore: 86, managerRemark: 'Strong ownership.', adminScore: null, adminRemark: '', status: 'Assessed' },
  { id: 27, cycleId: 11, employeeId: 5, title: 'Team collaboration', description: 'Mentor juniors and share knowledge.', kpi: 'Mentoring hours', scope: 'Org-wide', type: 'Standard', maxScore: 200,
    selfScore: 170, selfRemark: 'Mentored 2 juniors weekly.', tlScore: 165, tlRemark: 'Great mentor.', managerScore: 168, managerRemark: 'Leadership quality.', adminScore: null, adminRemark: '', status: 'Assessed' },
  { id: 28, cycleId: 11, employeeId: 5, title: 'Code quality & peer reviews', description: 'Lead code review standards.', kpi: 'PR reviews completed', scope: '.NET', type: 'Standard', maxScore: 100,
    selfScore: 93, selfRemark: 'Set review checklist for team.', tlScore: 90, tlRemark: 'Raises the bar.', managerScore: 92, managerRemark: 'Excellent standards.', adminScore: null, adminRemark: '', status: 'Assessed' },
  { id: 29, cycleId: 11, employeeId: 5, title: '.NET sprint velocity', description: 'Drive team velocity targets.', kpi: 'Story points / sprint', scope: '.NET', type: 'Standard', maxScore: 100,
    selfScore: 90, selfRemark: 'Team hit velocity 5/6 sprints.', tlScore: 88, tlRemark: 'Drives the team.', managerScore: 89, managerRemark: 'Good leadership.', adminScore: null, adminRemark: '', status: 'Assessed' },
  { id: 30, cycleId: 11, employeeId: 5, title: 'Architecture improvement', description: 'Refactor shared .NET services.', kpi: 'Services refactored', scope: 'Custom', type: 'Custom', maxScore: 100,
    selfScore: 85, selfRemark: 'Refactored auth and logging services.', tlScore: 82, tlRemark: 'Solid technical work.', managerScore: 84, managerRemark: 'Valuable initiative.', adminScore: null, adminRemark: '', status: 'Assessed' }
];

let nextId = { dept: 7, desig: 5, goal: 8, emp: 6, cycle: 13, assign: 31, doc: 4, leaveLedger: 1, leaveReq: 1 };

let selectedEmployeeId = null;
let selectedCycleId = null;
let editingWeightageEmployeeId = null;
let weightageEditDraft = null;
let currentRole = 'admin';
let currentPage = 'dashboard';
let presentationMode = false;

/* Admin analytics dashboard — selected review cycle (quarter) and Top-N size for the
   High/Low Performers widgets. Quarter is lazily defaulted to whichever quarter has the
   most fully-Complete cycles (see defaultDashboardQuarter()) the first time it's rendered. */
let dashboardQuarter = null;
let dashboardTopN = 5;
let flowStep = 0;

const FLOW_STEPS = [
  { role: 'admin',    page: 'dashboard',       label: '1/13 — Admin Dashboard',     desc: 'Admin system overview' },
  { role: 'admin',    page: 'departments',     label: '2/13 — Departments',         desc: 'Admin: Department CRUD' },
  { role: 'admin',    page: 'designations',    label: '3/13 — Designations',        desc: 'Admin: Designation CRUD' },
  { role: 'admin',    page: 'goals',           label: '4/13 — Goals Library',       desc: 'Admin: Goals CRUD' },
  { role: 'admin',    page: 'weightage',       label: '5/13 — Weightage Config',    desc: 'Admin sets role weightage %' },
  { role: 'admin',    page: 'employees',       label: '6/13 — Employees (Admin)',   desc: 'Admin: Employees CRUD' },
  { role: 'hr',       page: 'employees',       label: '7/13 — Employees (HR)',      desc: 'HR: Employees CRUD' },
  { role: 'admin',    page: 'review-cycles',   label: '8/13 — Employee Profile',    desc: 'Admin opens an employee profile: details & quarterly history', before: () => { selectedEmployeeId = 1; selectedCycleId = null; } },
  { role: 'employee', page: 'my-goals',        label: '9/13 — View Assigned Goals', desc: 'Employee views goals' },
  { role: 'employee', page: 'self-assessment', label: '10/13 — Self Assessment',    desc: 'Employee rates goals & submits' },
  { role: 'teamlead', page: 'review',          label: '11/13 — Team Lead Review',   desc: 'TL review if weightage > 0' },
  { role: 'manager',  page: 'review',          label: '12/13 — Manager Review',     desc: 'Manager review if weightage > 0' },
  { role: 'admin',    page: 'score',           label: '13/13 — Final Score',        desc: 'Weighted final score + history' }
];

const ROLE_ACCESS = {
  admin:    ['dashboard', 'departments', 'designations', 'goals', 'weightage', 'employees', 'review-cycles', 'employee-goals', 'assign-goals', 'review', 'score', 'history', 'leave-management', 'my-leave'],
  hr:       ['dashboard', 'employees', 'review-cycles', 'my-goals', 'self-assessment', 'history', 'leave-management', 'my-leave'],
  manager:  ['dashboard', 'employees', 'review-cycles', 'employee-goals', 'assign-goals', 'review', 'history', 'my-goals', 'self-assessment', 'score', 'leave-management', 'my-leave'],
  teamlead: ['dashboard', 'employees', 'review-cycles', 'employee-goals', 'assign-goals', 'review', 'history', 'my-goals', 'self-assessment', 'leave-management', 'my-leave'],
  employee: ['dashboard', 'my-goals', 'self-assessment', 'score', 'history', 'leave-management']
};

const NAV = {
  admin: [
    { section: 'Overview', items: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' }
    ]},
    { section: 'Master Data (Admin)', items: [
      { id: 'departments', icon: '🏢', label: 'Departments' },
      { id: 'designations', icon: '👔', label: 'Designations' },
      { id: 'goals', icon: '🎯', label: 'Goals' },
      { id: 'weightage', icon: '⚖️', label: 'Weightage' }
    ]},
    { section: 'Employees & Reviews', items: [
      { id: 'employees', icon: '👥', label: 'Employees' },
      { id: 'leave-management', icon: '🗓️', label: 'Leave Management' }
    ]},
    { section: 'Own Performance', items: [
      { id: 'my-leave', icon: '🧳', label: 'My Leave' }
    ]}
  ],
  hr: [
    { section: 'Overview', items: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' }
    ]},
    { section: 'Authorized Actions', items: [
      { id: 'employees', icon: '👥', label: 'Manage Employees' },
      { id: 'leave-management', icon: '🗓️', label: 'Leave Management' }
    ]},
    { section: 'Own Performance', items: [
      { id: 'my-goals', icon: '🎯', label: 'My Goals' },
      { id: 'self-assessment', icon: '📝', label: 'Self Assessment' },
      { id: 'history', icon: '📅', label: 'My History' },
      { id: 'my-leave', icon: '🧳', label: 'My Leave' }
    ]}
  ],
  manager: [
    { section: 'Overview', items: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' }
    ]},
    { section: 'Team (under Manager)', items: [
      { id: 'employees', icon: '👥', label: 'My Team' },
      { id: 'history', icon: '📅', label: 'Team History' },
      { id: 'leave-management', icon: '🗓️', label: 'Team Leave (View Only)' }
    ]},
    { section: 'Own Performance', items: [
      { id: 'my-goals', icon: '🎯', label: 'My Goals' },
      { id: 'self-assessment', icon: '📝', label: 'Self Assessment' },
      { id: 'my-leave', icon: '🧳', label: 'My Leave' }
    ]}
  ],
  teamlead: [
    { section: 'Overview', items: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' }
    ]},
    { section: 'Team (under Team Lead)', items: [
      { id: 'employees', icon: '👥', label: 'My Team' },
      { id: 'history', icon: '📅', label: 'Team History' },
      { id: 'leave-management', icon: '🗓️', label: 'Team Leave (View Only)' }
    ]},
    { section: 'Own Performance', items: [
      { id: 'my-goals', icon: '🎯', label: 'My Goals' },
      { id: 'self-assessment', icon: '📝', label: 'Self Assessment' },
      { id: 'my-leave', icon: '🧳', label: 'My Leave' }
    ]}
  ],
  employee: [
    { section: 'Overview', items: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' }
    ]},
    { section: 'Authorized Actions', items: [
      { id: 'my-goals', icon: '🎯', label: 'Assigned Goals' },
      { id: 'self-assessment', icon: '📝', label: 'Self Assessment' },
      { id: 'score', icon: '🏆', label: 'My Score' },
      { id: 'history', icon: '📅', label: 'Review History' },
      { id: 'leave-management', icon: '🗓️', label: 'My Leave' }
    ]}
  ]
};

const PAGES = {
  dashboard:         { title: 'Dashboard',               render: renderDashboard },
  departments:       { title: 'Departments',             render: renderDepartments },
  designations:      { title: 'Designations',            render: renderDesignations },
  goals:             { title: 'Goals',                   render: renderGoals },
  weightage:         { title: 'Weightage Configuration', render: renderWeightage },
  employees:         { title: 'Employees',               render: renderEmployees },
  'review-cycles':   { title: 'Review Cycles',           render: renderReviewCycles },
  'employee-goals':  { title: 'Goals List',              render: renderEmployeeGoals },
  'assign-goals':    { title: 'Assign Goals',            render: renderAssignGoals },
  'my-goals':        { title: 'Assigned Goals',          render: renderMyGoals },
  'self-assessment': { title: 'Self Assessment',         render: renderSelfAssessment },
  review:            { title: 'Review Goals',            render: renderReview },
  score:             { title: 'Score Summary',           render: renderScore },
  history:           { title: 'Quarterly History',       render: renderHistory },
  'leave-management': { title: 'Leave Management',       render: renderLeaveManagement },
  'my-leave':         { title: 'My Leave',                render: renderLeaveManagementSelf }
};

document.addEventListener('click', (e) => {
  const switcher = document.getElementById('roleSwitcher');
  const menu = document.getElementById('roleSwitcherMenu');
  if (menu && switcher && !switcher.contains(e.target)) menu.classList.remove('show');
  if (!e.target.closest('.kebab-wrap')) closeAllKebabMenus();
});

window.addEventListener('scroll', () => closeAllKebabMenus(), true);
window.addEventListener('resize', () => closeAllKebabMenus());

function toggleRoleMenu(e) {
  e.stopPropagation();
  document.getElementById('roleSwitcherMenu').classList.toggle('show');
}

/* ==================== Generic row action ("kebab") menu ====================
   Used by table rows (Employees list, Quarterly History, etc.) to keep the
   Actions column to a single button instead of a row of buttons. Positioned
   with `position: fixed`, computed from the trigger button's rect, so it
   never gets clipped by a scrollable table wrapper. */
function closeAllKebabMenus() {
  document.querySelectorAll('.kebab-menu.show').forEach(m => m.classList.remove('show'));
  document.querySelectorAll('.kebab-btn.active').forEach(b => b.classList.remove('active'));
}

function toggleKebabMenu(event, menuId) {
  event.stopPropagation();
  const btn = event.currentTarget;
  const menu = document.getElementById(menuId);
  if (!menu) return;
  const wasOpen = menu.classList.contains('show');
  closeAllKebabMenus();
  if (wasOpen) return;
  menu.classList.add('show');
  btn.classList.add('active');
  positionKebabMenu(btn, menu);
}

function positionKebabMenu(btn, menu) {
  const rect = btn.getBoundingClientRect();
  const menuWidth = menu.offsetWidth || 210;
  const menuHeight = menu.offsetHeight || 200;
  let left = rect.right - menuWidth;
  left = Math.min(Math.max(left, 8), window.innerWidth - menuWidth - 8);
  let top = rect.bottom + 6;
  if (top + menuHeight > window.innerHeight - 8) top = rect.top - menuHeight - 6;
  top = Math.max(8, top);
  menu.style.left = left + 'px';
  menu.style.top = top + 'px';
}

/* Demo-account shortcut: fills the real credential for that role, then
   runs it through the same auto-detect login as a normal sign-in. */
function quickLogin(role) {
  document.getElementById('loginEmail').value = ROLES[role].email;
  document.getElementById('loginPassword').value = '••••••••';
  login();
}

function switchRole(role) {
  currentRole = role;
  document.getElementById('roleSwitcherMenu').classList.remove('show');
  updateUserInfo();
  navigateTo('dashboard');
}

function roleCanAccess(page) {
  return (ROLE_ACCESS[currentRole] || []).includes(page);
}

function empName(e) {
  return `${e.firstName} ${e.lastName}`;
}

function getSelectedEmployee() {
  return EMPLOYEES.find(e => e.id === selectedEmployeeId) || null;
}

function getSelectedCycle() {
  return REVIEW_CYCLES.find(c => c.id === selectedCycleId) || null;
}

function getCycleGoals(cycleId) {
  return ASSIGNED_GOALS.filter(g => g.cycleId === cycleId);
}

/* ---------- Navigation flow: Employee → Cycles → Goals → Review ---------- */
function openEmployeeCycles(employeeId) {
  selectedEmployeeId = employeeId;
  selectedCycleId = null;
  navigateTo('review-cycles');
}

function openCycleGoals(cycleId) {
  selectedCycleId = cycleId;
  const cycle = getSelectedCycle();
  if (cycle) selectedEmployeeId = cycle.employeeId;
  navigateTo('employee-goals');
}

function openReviewFromGoals() {
  if (!selectedEmployeeId || !selectedCycleId) {
    alert('Select an employee and review cycle first.');
    return;
  }
  const goals = getCycleGoals(selectedCycleId);
  if (!goals.length) {
    alert('Assign at least one goal before starting a review.');
    return;
  }
  navigateTo('review');
}

/** Weighted final % for a cycle, reusing the same formula as the Score page.
    Employee self-score is informational only and is never counted towards
    the final score — only Team Lead / Manager / Admin weights apply,
    rebalanced proportionally to fill 100%. Returns null if none scored yet. */
function computeCycleFinalPct(cycle) {
  const goals = getCycleGoals(cycle.id);
  if (!goals.length) return null;
  const avg = (key) => {
    const scored = goals.filter(g => g[key] != null && g.maxScore);
    if (!scored.length) return null;
    return scored.reduce((a, g) => a + (g[key] / g.maxScore) * 100, 0) / scored.length;
  };
  const parts = [
    [avg('tlScore'), WEIGHTAGE.teamlead],
    [avg('managerScore'), WEIGHTAGE.manager],
    [avg('adminScore'), WEIGHTAGE.admin]
  ].filter(([v, w]) => v != null && w > 0);
  if (!parts.length) return null;
  const totalWeight = parts.reduce((a, [, w]) => a + w, 0);
  return +(parts.reduce((a, [v, w]) => a + v * w, 0) / totalWeight).toFixed(1);
}

/* ==================== Global page breadcrumb ====================
   Every page shows a single trail in the topbar (Home / Section / Current)
   instead of ad-hoc back-buttons scattered across pages. Middle segments
   are clickable; the last segment is always the current page (plain text). */
function getBreadcrumbTrail(page) {
  const emp = getSelectedEmployee();
  const cycle = getSelectedCycle();
  const employeesLabel = ['manager', 'teamlead'].includes(currentRole) ? 'My Team' : 'Employees';
  const historyLabel = { admin: 'Quarterly History', hr: 'My History', manager: 'Team History', teamlead: 'Team History', employee: 'Review History' }[currentRole] || 'History';

  const home = { label: 'Home', onclick: `navigateTo('dashboard')` };
  const employeesCrumb = { label: employeesLabel, onclick: `navigateTo('employees')` };
  const empCrumb = emp ? { label: empName(emp), onclick: `openEmployeeCycles(${emp.id})` } : null;
  const cycleCrumb = cycle ? { label: cycle.quarter, onclick: `openCycleGoals(${cycle.id})` } : null;

  switch (page) {
    case 'dashboard':
      return [{ label: 'Home' }];
    case 'departments':
      return [home, { label: 'Master Data' }, { label: 'Departments' }];
    case 'designations':
      return [home, { label: 'Master Data' }, { label: 'Designations' }];
    case 'goals':
      return [home, { label: 'Master Data' }, { label: 'Goals' }];
    case 'weightage':
      return [home, { label: 'Master Data' }, { label: 'Weightage' }];
    case 'employees':
      return [home, { label: employeesLabel }];
    case 'review-cycles':
      return [home, employeesCrumb, { label: emp ? empName(emp) : 'Employee Profile' }];
    case 'employee-goals':
      return [home, employeesCrumb, empCrumb, { label: cycle ? cycle.quarter : 'Goals List' }].filter(Boolean);
    case 'review':
      return [home, employeesCrumb, empCrumb, cycleCrumb, { label: 'Review' }].filter(Boolean);
    case 'score':
      if (currentRole === 'employee' || !emp) return [home, { label: 'My Score' }];
      return [home, employeesCrumb, empCrumb, cycleCrumb, { label: 'Score' }].filter(Boolean);
    case 'assign-goals':
      return [home, { label: 'Assign Goals' }];
    case 'my-goals':
      return [home, { label: 'My Goals' }];
    case 'self-assessment':
      return [home, { label: 'Self Assessment' }];
    case 'history':
      return [home, { label: historyLabel }];
    case 'leave-management': {
      const isHrAdmin = currentRole === 'admin' || currentRole === 'hr';
      const isTeamView = currentRole === 'manager' || currentRole === 'teamlead';
      const leaveLabel = isHrAdmin ? 'Leave Management' : (isTeamView ? 'Team Leave' : 'My Leave');
      const leaveEmp = (isHrAdmin || isTeamView) ? EMPLOYEES.find(e => e.id === selectedLeaveEmployeeId) : null;
      return [home, { label: leaveLabel }, leaveEmp ? { label: empName(leaveEmp) } : null].filter(Boolean);
    }
    case 'my-leave':
      return [home, { label: 'My Leave' }];
    default:
      return [home, { label: getPageTitle(page) }];
  }
}

function renderBreadcrumb(page) {
  const el = document.getElementById('pageBreadcrumb');
  if (!el) return;
  const trail = getBreadcrumbTrail(page);
  el.innerHTML = trail.map((seg, i) => {
    const isLast = i === trail.length - 1;
    const sep = i > 0 ? '<span class="breadcrumb-sep">/</span>' : '';
    if (!isLast && seg.onclick) {
      return `${sep}<span class="breadcrumb-item link" onclick="${seg.onclick}">${seg.label}</span>`;
    }
    return `${sep}<span class="breadcrumb-item ${isLast ? 'current' : ''}">${seg.label}</span>`;
  }).join('');
}

function statusSelect(current, options, onChangeFn = 'onStatusChange(this)') {
  const map = {
    Active: 'success', Inactive: 'gray', Draft: 'warning', Complete: 'success', Completed: 'success',
    'In Progress': 'warning', 'Pending Review': 'warning', Pending: 'warning',
    'Self Assessment Done': 'primary', Submitted: 'primary', Cancelled: 'danger',
    'Not Assessed': 'warning', Assessed: 'primary', Reviewed: 'success'
  };
  const cls = map[current] || 'gray';
  const opts = options.map(o => `<option value="${o}" ${o === current ? 'selected' : ''}>${o}</option>`).join('');
  return `<select class="status-select status-${cls}" onchange="${onChangeFn}" onclick="event.stopPropagation()" title="Change status">${opts}</select>`;
}

function onStatusChange(el) {
  const map = {
    Active: 'success', Inactive: 'gray', Draft: 'warning', Complete: 'success', Completed: 'success',
    'In Progress': 'warning', 'Pending Review': 'warning', Pending: 'warning',
    'Self Assessment Done': 'primary', Submitted: 'primary', Cancelled: 'danger',
    'Not Assessed': 'warning', Assessed: 'primary', Reviewed: 'success'
  };
  el.className = 'status-select status-' + (map[el.value] || 'gray');
  el.title = 'Status: ' + el.value;
}

function login() {
  const email = document.getElementById('loginEmail').value;
  const role = resolveRoleFromEmail(email);
  const errorEl = document.getElementById('loginError');

  if (!role) {
    errorEl.textContent = 'No account found for that email. Try one of the demo accounts below.';
    errorEl.style.display = 'block';
    return;
  }

  errorEl.style.display = 'none';
  currentRole = role;
  showApp();
}

function logout() {
  document.getElementById('screen-login').classList.add('active');
  document.getElementById('screen-app').classList.remove('active');
  exitPresentation();
}

function showApp() {
  document.getElementById('screen-login').classList.remove('active');
  document.getElementById('screen-app').classList.add('active');
  updateUserInfo();
  renderSidebar();
  navigateTo('dashboard');
}

function updateUserInfo() {
  const r = ROLES[currentRole];
  document.getElementById('userAvatar').textContent = r.avatar;
  document.getElementById('userName').textContent = r.user;
  document.getElementById('userRoleBadge').textContent = r.name;
  document.querySelectorAll('.role-switcher-item[data-role]').forEach(item => {
    item.classList.toggle('active', item.dataset.role === currentRole);
  });
}

function renderSidebar() {
  const nav = NAV[currentRole] || NAV.employee;
  const items = nav.flatMap(section => section.items);
  document.getElementById('sidebarNav').innerHTML = items.map(item => `
    <div class="nav-item ${item.id === currentPage ? 'active' : ''}" onclick="navigateTo('${item.id}')">
      <span class="icon">${item.icon}</span> ${item.label}
    </div>
  `).join('');
}

function navigateTo(page) {
  if (!roleCanAccess(page)) page = 'dashboard';
  currentPage = page;
  const p = PAGES[page];
  if (!p) return;
  document.getElementById('pageTitle').textContent = getPageTitle(page);
  renderBreadcrumb(page);
  document.getElementById('pageContent').innerHTML = p.render();
  renderSidebar();
}

function getPageTitle(page) {
  const emp = getSelectedEmployee();
  const cycle = getSelectedCycle();
  const overrides = {
    employees: { admin: 'Employees', hr: 'Employees', manager: 'My Team', teamlead: 'My Team' },
    history: { admin: 'Quarterly History', hr: 'My History', manager: 'Team History', teamlead: 'Team History', employee: 'Review History' },
    score: { employee: 'My Score', admin: 'Employee Score', manager: 'Employee Score' },
    'review-cycles': emp ? `Employee Profile — ${empName(emp)}` : 'Employee Profile',
    'assign-goals': emp && cycle
      ? `Assign Goals — ${empName(emp)} · ${cycle.quarter}`
      : ({ teamlead: 'Assign Goals (Standard)', manager: 'Assign Goals', admin: 'Assign Goals' }[currentRole] || 'Assign Goals'),
    'employee-goals': emp && cycle ? `Goals List — ${empName(emp)} · ${cycle.quarter}` : 'Goals List',
    review: emp && cycle ? `Review — ${empName(emp)} · ${cycle.quarter}` : 'Review Goals',
    'leave-management': { admin: 'Leave Management', hr: 'Leave Management', manager: 'Team Leave', teamlead: 'Team Leave', employee: 'My Leave' }
  };
  if (typeof overrides[page] === 'string') return overrides[page];
  return overrides[page]?.[currentRole] || PAGES[page].title;
}

function startPresentation() {
  presentationMode = true;
  flowStep = 0;
  document.getElementById('presentationBar').style.display = 'flex';
  showApp();
  applyFlowStep();
}

function exitPresentation() {
  presentationMode = false;
  document.getElementById('presentationBar').style.display = 'none';
}

function applyFlowStep() {
  const step = FLOW_STEPS[flowStep];
  currentRole = step.role;
  if (step.before) step.before();
  updateUserInfo();
  renderSidebar();
  navigateTo(step.page);
  document.getElementById('flowStepLabel').textContent = step.label;
  document.getElementById('flowStepDesc').textContent = step.desc;
}

function nextFlowStep() {
  if (flowStep < FLOW_STEPS.length - 1) { flowStep++; applyFlowStep(); }
}

function prevFlowStep() {
  if (flowStep > 0) { flowStep--; applyFlowStep(); }
}

function showModal(html) {
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('show');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
  document.getElementById('modalContent').classList.remove('modal-wide', 'modal-emp');
}

document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target.id === 'modalOverlay') closeModal();
});

function confirmDelete(message) {
  return window.confirm(message || 'Are you sure you want to delete this item?');
}

/* ==================== DEPARTMENTS CRUD ==================== */
function openDeptModal(mode = 'add', id = null) {
  const d = mode === 'edit' ? DEPARTMENTS.find(x => x.id === id) : null;
  showModal(`
    <div class="modal-header">
      <h3>${mode === 'add' ? 'Add' : 'Edit'} Department</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group"><label>Name</label><input class="form-control" id="deptName" value="${d ? d.name : ''}"></div>
      <div class="form-group"><label>Description</label><textarea class="form-control" id="deptDesc" rows="2">${d ? d.description : ''}</textarea></div>
      <div class="form-group"><label>Status</label>
        <select class="form-control" id="deptStatus">
          <option ${!d || d.status === 'Active' ? 'selected' : ''}>Active</option>
          <option ${d && d.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveDepartment('${mode}', ${id || 'null'})">Save</button>
    </div>
  `);
}

function saveDepartment(mode, id) {
  const name = document.getElementById('deptName').value.trim();
  const description = document.getElementById('deptDesc').value.trim();
  const status = document.getElementById('deptStatus').value;
  if (!name) { alert('Department name is required.'); return; }
  if (mode === 'add') {
    DEPARTMENTS.push({ id: nextId.dept++, name, description, employees: 0, status });
  } else {
    const d = DEPARTMENTS.find(x => x.id === id);
    if (d) { d.name = name; d.description = description; d.status = status; }
  }
  closeModal();
  navigateTo('departments');
}

function deleteDepartment(id) {
  if (!confirmDelete('Delete this department?')) return;
  DEPARTMENTS = DEPARTMENTS.filter(d => d.id !== id);
  navigateTo('departments');
}

function updateDeptStatus(id, el) {
  const d = DEPARTMENTS.find(x => x.id === id);
  if (d) d.status = el.value;
  onStatusChange(el);
}

/* ==================== DESIGNATIONS CRUD ==================== */
function openDesigModal(mode = 'add', id = null) {
  const d = mode === 'edit' ? DESIGNATIONS.find(x => x.id === id) : null;
  showModal(`
    <div class="modal-header">
      <h3>${mode === 'add' ? 'Add' : 'Edit'} Designation</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group"><label>Designation Name</label><input class="form-control" id="desigName" value="${d ? d.name : ''}" placeholder="e.g. Senior"></div>
      <div class="form-group"><label>Description</label><textarea class="form-control" id="desigDesc" rows="2">${d ? d.description : ''}</textarea></div>
      <div class="form-group"><label>Status</label>
        <select class="form-control" id="desigStatus">
          <option ${!d || d.status === 'Active' ? 'selected' : ''}>Active</option>
          <option ${d && d.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveDesignation('${mode}', ${id || 'null'})">Save</button>
    </div>
  `);
}

function saveDesignation(mode, id) {
  const name = document.getElementById('desigName').value.trim();
  const description = document.getElementById('desigDesc').value.trim();
  const status = document.getElementById('desigStatus').value;
  if (!name) { alert('Designation name is required.'); return; }
  if (mode === 'add') {
    DESIGNATIONS.push({ id: nextId.desig++, name, description, employees: 0, status });
  } else {
    const d = DESIGNATIONS.find(x => x.id === id);
    if (d) { d.name = name; d.description = description; d.status = status; }
  }
  closeModal();
  navigateTo('designations');
}

function deleteDesignation(id) {
  if (!confirmDelete('Delete this designation?')) return;
  DESIGNATIONS = DESIGNATIONS.filter(d => d.id !== id);
  navigateTo('designations');
}

function updateDesigStatus(id, el) {
  const d = DESIGNATIONS.find(x => x.id === id);
  if (d) d.status = el.value;
  onStatusChange(el);
}

/* ==================== GOALS LIBRARY CRUD ==================== */
function openGoalModal(mode = 'add', id = null) {
  const g = mode === 'edit' ? GOALS_LIB.find(x => x.id === id) : null;
  const isDept = g && g.scope === 'Department';
  const deptOpts = DEPARTMENTS.filter(d => d.status === 'Active').map(d =>
    `<option ${g && g.dept === d.name ? 'selected' : ''}>${d.name}</option>`
  ).join('');
  showModal(`
    <div class="modal-header">
      <h3>${mode === 'add' ? 'Create' : 'Edit'} Goal / KPI</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group"><label>Goal Title</label><input class="form-control" id="goalTitle" value="${g ? g.title : ''}" placeholder="e.g. Deliver projects on time"></div>
      <div class="form-group"><label>Description</label><textarea class="form-control" id="goalDesc" rows="3">${g ? g.description : ''}</textarea></div>
      <div class="form-group"><label>Goal Scope</label>
        <div style="display:flex;gap:1rem;margin-top:.5rem;flex-wrap:wrap">
          <label><input type="radio" name="gscope" value="Organization-wide" ${!isDept ? 'checked' : ''} onchange="document.getElementById('goalDeptSelect').disabled=true"> Organization-wide</label>
          <label><input type="radio" name="gscope" value="Department" ${isDept ? 'checked' : ''} onchange="document.getElementById('goalDeptSelect').disabled=false"> Department-specific</label>
        </div>
      </div>
      <div class="form-group"><label>Department</label>
        <select class="form-control" id="goalDeptSelect" ${!isDept ? 'disabled' : ''}>
          <option value="">— Select department —</option>
          ${deptOpts}
        </select>
      </div>
      <div class="grid-2">
        <div class="form-group"><label>Category</label>
          <select class="form-control" id="goalCategory">
            ${['Technical','Behavioral','Leadership','Business'].map(c => `<option ${g && g.category === c ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label>Max Score</label><input class="form-control" id="goalMax" type="number" value="${g ? g.maxScore : 100}" min="1"></div>
      </div>
      <div class="form-group"><label>Status</label>
        <select class="form-control" id="goalStatus">
          ${['Active','Inactive','Draft'].map(s => `<option ${g && g.status === s ? 'selected' : (!g && s === 'Active' ? 'selected' : '')}>${s}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveGoal('${mode}', ${id || 'null'})">Save Goal</button>
    </div>
  `);
}

function saveGoal(mode, id) {
  const title = document.getElementById('goalTitle').value.trim();
  const description = document.getElementById('goalDesc').value.trim();
  const scope = document.querySelector('input[name="gscope"]:checked').value;
  const dept = scope === 'Department' ? document.getElementById('goalDeptSelect').value : '';
  const category = document.getElementById('goalCategory').value;
  const maxScore = Number(document.getElementById('goalMax').value) || 100;
  const status = document.getElementById('goalStatus').value;
  if (!title) { alert('Goal title is required.'); return; }
  if (scope === 'Department' && !dept) { alert('Select a department.'); return; }
  if (mode === 'add') {
    GOALS_LIB.push({ id: nextId.goal++, title, description, scope, dept, category, maxScore, status });
  } else {
    const g = GOALS_LIB.find(x => x.id === id);
    if (g) Object.assign(g, { title, description, scope, dept, category, maxScore, status });
  }
  closeModal();
  navigateTo('goals');
}

function deleteGoal(id) {
  if (!confirmDelete('Delete this goal?')) return;
  GOALS_LIB = GOALS_LIB.filter(g => g.id !== id);
  navigateTo('goals');
}

function updateGoalStatus(id, el) {
  const g = GOALS_LIB.find(x => x.id === id);
  if (g) g.status = el.value;
  onStatusChange(el);
}

/* ==================== EMPLOYEES CRUD ==================== */

/* Add/Edit Employee mirrors the real app's EmployeeFormModal.tsx: a 4-step wizard —
   Personal → Work → Leave → Address — with an icon progress stepper, a photo uploader,
   and Back/Continue navigation. The "Leave" step (Planned/Unplanned/Optional Leave) is
   this mockup's addition, inserted between Work and Address. Each step's live inputs are
   captured into empModalDraft before moving on, so values survive Back/Continue. */
let empModalStep = 1;
let empModalDraft = {};
let empModalMode = 'add';
let empModalId = null;
let empModalErrors = {};

const EMP_MODAL_STEPS = [
  { n: 1, label: 'Personal', icon: 'user' },
  { n: 2, label: 'Work', icon: 'briefcase' },
  { n: 3, label: 'Leave', icon: 'calendar' },
  { n: 4, label: 'Address', icon: 'pin' }
];

const EMP_STEP_ICONS = {
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  pin: '<path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  check: '<path d="M4 12l5 5L20 6"/>',
  camera: '<path d="M4 8a2 2 0 0 1 2-2h1.5l1-2h7l1 2H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z"/><circle cx="12" cy="13" r="3.5"/>',
  x: '<path d="M5 5l14 14M19 5L5 19"/>'
};

function empIcon(name, size = 18) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${EMP_STEP_ICONS[name] || ''}</svg>`;
}

function openEmployeeModal(mode = 'add', id = null) {
  const e = mode === 'edit' ? EMPLOYEES.find(x => x.id === id) : null;
  empModalStep = 1;
  empModalMode = mode;
  empModalId = id;
  empModalErrors = {};
  empModalDraft = e
    ? {
        firstName: e.firstName, lastName: e.lastName, email: e.email, contactNumber: e.contactNumber || '',
        dateOfBirth: e.dateOfBirth || '', gender: e.gender || 'Male', avatar: e.avatar || null,
        joiningDate: e.joiningDate || new Date().toISOString().slice(0, 10), role: e.role, dept: e.dept, designation: e.designation,
        manager: e.manager, teamLead: e.teamLead, employmentType: e.employmentType || 'Permanent', isActive: e.isActive !== false,
        plannedLeave: e.plannedLeave ?? 0, unplannedLeave: e.unplannedLeave ?? 0, optionalLeave: e.optionalLeave ?? 0,
        address: e.address || ''
      }
    : {
        firstName: '', lastName: '', email: '', contactNumber: '', dateOfBirth: '', gender: 'Male', avatar: null,
        joiningDate: new Date().toISOString().slice(0, 10), role: 'Employee', dept: '', designation: '',
        manager: 'Mike Manager', teamLead: 'Tom TeamLead', employmentType: 'Permanent', isActive: true,
        plannedLeave: 0, unplannedLeave: 0, optionalLeave: 0, address: ''
      };
  renderEmployeeModal();
}

function renderEmployeeModal() {
  const mode = empModalMode;
  const isLast = empModalStep === EMP_MODAL_STEPS.length;
  document.getElementById('modalContent').classList.add('modal-emp');
  showModal(`
    <div class="modal-header">
      <div>
        <div class="modal-header-eyebrow">EMPLOYEE PROFILE</div>
        <h3>${mode === 'add' ? 'Add a new employee' : 'Update employee details'}</h3>
        <div class="modal-header-sub">Complete the information below to keep the directory accurate.</div>
      </div>
      <button class="modal-close" onclick="closeModal()">${empIcon('x', 20)}</button>
    </div>
    <div class="modal-body">
      ${renderEmpModalStepper()}
      ${renderEmpModalStepBody()}
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" ${empModalStep === 1 ? 'style="visibility:hidden"' : ''} onclick="empModalBack()">← Back</button>
      ${isLast
        ? `<button class="btn btn-primary" onclick="saveEmployee()">${mode === 'add' ? 'Add Employee' : 'Save Changes'}</button>`
        : `<button class="btn btn-primary" onclick="empModalNext()">Continue →</button>`}
    </div>
  `);
}

function renderEmpModalStepper() {
  const total = EMP_MODAL_STEPS.length;
  const fillPct = ((empModalStep - 1) / (total - 1)) * 100;
  return `
    <div class="emp-stepper" style="grid-template-columns:repeat(${total},1fr)">
      <div class="emp-stepper-track"><div class="emp-stepper-fill" style="width:${fillPct}%"></div></div>
      ${EMP_MODAL_STEPS.map(s => {
        const state = empModalStep === s.n ? 'active' : empModalStep > s.n ? 'complete' : '';
        const canJump = s.n <= empModalStep + 1;
        return `
        <button type="button" class="emp-stepper-step ${state}" ${canJump ? `onclick="empModalGoTo(${s.n})"` : 'disabled'}>
          <span class="emp-stepper-dot">${empModalStep > s.n ? empIcon('check', 16) : empIcon(s.icon, 18)}</span>
          <span class="emp-stepper-label">${s.label}</span>
        </button>`;
      }).join('')}
    </div>
  `;
}

function renderEmpModalStepBody() {
  switch (empModalStep) {
    case 1: return renderEmpModalStep1();
    case 2: return renderEmpModalStep2();
    case 3: return renderEmpModalStep3();
    case 4: return renderEmpModalStep4();
    default: return '';
  }
}

function empErr(field) {
  return empModalErrors[field] ? `<span class="emp-form-error">${empModalErrors[field]}</span>` : '';
}

function empField(id, label, opts = {}) {
  const err = empModalErrors[id];
  return `<label class="form-group" style="display:block">
    <span>${label} ${opts.optional ? '<span class="emp-optional">(optional)</span>' : '<span class="emp-required">*</span>'}</span>
    <input class="form-control ${err ? 'input-error' : ''}" id="emp_${id}" type="${opts.type || 'text'}" value="${opts.value ?? ''}" placeholder="${opts.placeholder || ''}" ${opts.attrs || ''}>
    ${empErr(id)}
  </label>`;
}

function renderEmpModalStep1() {
  const d = empModalDraft;
  return `
    <div class="emp-avatar-box">
      <div class="emp-avatar-wrap">
        <button type="button" class="emp-avatar-circle" onclick="document.getElementById('empAvatarInput').click()">
          ${d.avatar ? `<img src="${d.avatar}" alt="Profile preview">` : empIcon('user', 34)}
        </button>
        ${d.avatar ? `<button type="button" class="emp-avatar-remove" onclick="empRemoveAvatar()" title="Remove photo">${empIcon('x', 13)}</button>` : ''}
      </div>
      <div class="emp-avatar-title">Profile photo</div>
      <div class="emp-avatar-hint">JPG, PNG or GIF, up to 5 MB</div>
      <button type="button" class="btn btn-outline btn-sm emp-avatar-upload-btn" onclick="document.getElementById('empAvatarInput').click()">${d.avatar ? 'Change photo' : 'Upload photo'}</button>
      <input type="file" id="empAvatarInput" accept="image/*" style="display:none" onchange="empHandleAvatarChange(this)">
    </div>
    <div class="grid-2">
      ${empField('firstName', 'First Name', { value: d.firstName, placeholder: 'Andrew' })}
      ${empField('lastName', 'Last Name', { value: d.lastName, placeholder: 'Smith' })}
    </div>
    ${empField('email', 'Email Address', { value: d.email, type: 'email', placeholder: 'andrew@example.com' })}
    <div class="grid-2">
      ${empField('contactNumber', 'Contact Number', { value: d.contactNumber, type: 'tel', placeholder: '98765 43210', attrs: 'maxlength="10" inputmode="numeric"' })}
      ${empField('dateOfBirth', 'Date of Birth', { value: d.dateOfBirth, type: 'date' })}
    </div>
    <div class="form-group"><label>Gender <span class="emp-required">*</span></label>
      <select class="form-control" id="emp_gender">
        ${['Male', 'Female', 'Other'].map(g => `<option ${d.gender === g ? 'selected' : ''}>${g}</option>`).join('')}
      </select>
    </div>
  `;
}

function renderEmpModalStep2() {
  const d = empModalDraft;
  const deptOpts = DEPARTMENTS.filter(x => x.status === 'Active').map(x =>
    `<option ${d.dept === x.name ? 'selected' : ''}>${x.name}</option>`
  ).join('');
  const desigOpts = DESIGNATIONS.filter(x => x.status === 'Active').map(x =>
    `<option ${d.designation === x.name ? 'selected' : ''}>${x.name}</option>`
  ).join('');
  const hideTeamLead = d.role === 'Manager' || d.role === 'Team Lead';
  return `
    <div class="grid-2">
      <div class="form-group"><label>Joining Date <span class="emp-required">*</span></label>
        <input class="form-control" id="emp_joiningDate" type="date" value="${d.joiningDate}">
      </div>
      <div class="form-group"><label>Role <span class="emp-required">*</span></label>
        <select class="form-control" id="emp_role" onchange="empDraftRoleChanged(this.value)">
          ${['Employee','Team Lead','Manager','HR','Admin'].map(r => `<option ${d.role === r ? 'selected' : ''}>${r}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="grid-2">
      <div class="form-group"><label>Department <span class="emp-required">*</span></label><select class="form-control" id="emp_dept">${deptOpts}</select></div>
      <div class="form-group"><label>Designation <span class="emp-required">*</span></label><select class="form-control" id="emp_designation">${desigOpts}</select></div>
    </div>
    <div class="grid-2">
      <div class="form-group"><label>Reporting Manager <span class="emp-required">*</span></label><select class="form-control" id="emp_manager"><option>Mike Manager</option></select></div>
      ${hideTeamLead ? '<div></div>' : `<div class="form-group"><label>Team Lead <span class="emp-optional">(optional)</span></label><select class="form-control" id="emp_teamLead"><option>Tom TeamLead</option></select></div>`}
    </div>
    <div class="grid-2">
      <div class="form-group"><label>Employment Type <span class="emp-required">*</span></label>
        <select class="form-control" id="emp_employmentType">
          ${['Permanent','Contract','Intern'].map(t => `<option ${d.employmentType === t ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
      </div>
      <label class="emp-checkbox-field"><input type="checkbox" id="emp_isActive" ${d.isActive ? 'checked' : ''}> Active employee</label>
    </div>
  `;
}

function renderEmpModalStep3() {
  const d = empModalDraft;
  const fy = getCurrentFinancialYear();
  return `
    <p class="muted" style="margin-bottom:1rem">
      ${empModalMode === 'add'
        ? 'Opening leave balance for the current financial year. This credits each leave type once the employee is saved.'
        : 'Adjusts the employee’s current leave balance for this financial year.'}
    </p>
    <div class="form-group"><label>Financial Year</label>
      <input class="form-control" value="${fy.fromLabel} – ${fy.toLabel}" disabled>
    </div>
    <div class="grid-3">
      <div class="form-group"><label>Planned Leave</label><input class="form-control" id="emp_plannedLeave" type="number" min="0" step="0.5" value="${d.plannedLeave}"></div>
      <div class="form-group"><label>Unplanned Leave</label><input class="form-control" id="emp_unplannedLeave" type="number" min="0" step="0.5" value="${d.unplannedLeave}"></div>
      <div class="form-group"><label>Optional Leave</label><input class="form-control" id="emp_optionalLeave" type="number" min="0" step="0.5" value="${d.optionalLeave}"></div>
    </div>
  `;
}

function renderEmpModalStep4() {
  const d = empModalDraft;
  return `
    <div class="form-group"><label>Residential Address <span class="emp-optional">(optional)</span></label>
      <textarea class="form-control" id="emp_address" rows="6" placeholder="Street address, city, state, postal code...">${d.address}</textarea>
    </div>
  `;
}

function empDraftRoleChanged(role) {
  empModalDraft.role = role;
  renderEmployeeModal();
}

function empHandleAvatarChange(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { alert('Image must be 5 MB or smaller.'); input.value = ''; return; }
  const reader = new FileReader();
  reader.onload = () => { empModalDraft.avatar = reader.result; renderEmployeeModal(); };
  reader.readAsDataURL(file);
}

function empRemoveAvatar() {
  empModalDraft.avatar = null;
  renderEmployeeModal();
}

/** Pulls the given step's live inputs into empModalDraft. Step 1/2 validate their
    required fields and return false (with inline errors) if any are missing. */
function captureEmpModalStep(step) {
  empModalErrors = {};
  if (step === 1) {
    const firstName = document.getElementById('emp_firstName').value.trim();
    const lastName = document.getElementById('emp_lastName').value.trim();
    const email = document.getElementById('emp_email').value.trim();
    const contactNumber = document.getElementById('emp_contactNumber').value.trim();
    const dateOfBirth = document.getElementById('emp_dateOfBirth').value;
    if (!firstName) empModalErrors.firstName = 'First name is required.';
    if (!lastName) empModalErrors.lastName = 'Last name is required.';
    if (!email) empModalErrors.email = 'Email is required.';
    if (!contactNumber || contactNumber.length < 10) empModalErrors.contactNumber = 'Enter a valid 10-digit number.';
    if (!dateOfBirth) empModalErrors.dateOfBirth = 'Date of birth is required.';
    Object.assign(empModalDraft, { firstName, lastName, email, contactNumber, dateOfBirth, gender: document.getElementById('emp_gender').value });
  } else if (step === 2) {
    const dept = document.getElementById('emp_dept').value;
    const designation = document.getElementById('emp_designation').value;
    const teamLeadEl = document.getElementById('emp_teamLead');
    if (!dept) empModalErrors.dept = 'Department is required.';
    if (!designation) empModalErrors.designation = 'Designation is required.';
    Object.assign(empModalDraft, {
      joiningDate: document.getElementById('emp_joiningDate').value,
      role: document.getElementById('emp_role').value,
      dept, designation,
      manager: document.getElementById('emp_manager').value,
      teamLead: teamLeadEl ? teamLeadEl.value : null,
      employmentType: document.getElementById('emp_employmentType').value,
      isActive: document.getElementById('emp_isActive').checked
    });
  } else if (step === 3) {
    Object.assign(empModalDraft, {
      plannedLeave: Number(document.getElementById('emp_plannedLeave').value) || 0,
      unplannedLeave: Number(document.getElementById('emp_unplannedLeave').value) || 0,
      optionalLeave: Number(document.getElementById('emp_optionalLeave').value) || 0
    });
  } else if (step === 4) {
    Object.assign(empModalDraft, { address: document.getElementById('emp_address').value.trim() });
  }
  return Object.keys(empModalErrors).length === 0;
}

function empModalNext() {
  if (!captureEmpModalStep(empModalStep)) { renderEmployeeModal(); return; }
  empModalStep++;
  renderEmployeeModal();
}

function empModalBack() {
  captureEmpModalStep(empModalStep);
  empModalStep--;
  renderEmployeeModal();
}

/** Jump directly to a step from the stepper — only ever offered for steps already
    visited or the very next one (see canJump in renderEmpModalStepper). */
function empModalGoTo(step) {
  if (step > empModalStep && !captureEmpModalStep(empModalStep)) { renderEmployeeModal(); return; }
  empModalStep = step;
  renderEmployeeModal();
}

function saveEmployee() {
  if (!captureEmpModalStep(4)) { renderEmployeeModal(); return; }
  const {
    firstName, lastName, email, contactNumber, dateOfBirth, gender, avatar,
    joiningDate, role, dept, designation, manager, teamLead, employmentType, isActive,
    plannedLeave, unplannedLeave, optionalLeave, address
  } = empModalDraft;
  const common = { firstName, lastName, email, contactNumber, dateOfBirth, gender, avatar, joiningDate, role, dept, designation, manager, teamLead, employmentType, isActive, plannedLeave, unplannedLeave, optionalLeave, address };
  if (empModalMode === 'add') {
    const newId = nextId.emp++;
    const newEmp = { id: newId, ...common, status: 'Pending Review' };
    EMPLOYEES.push(newEmp);
    EMPLOYEE_WEIGHTAGES.push({ id: newId, name: `${firstName} ${lastName}`, email, dept, designation, employee: 0, teamlead: 30, manager: 50, admin: 20 });
    REVIEW_CYCLES.push({ id: nextId.cycle++, employeeId: newId, quarter: 'Q1 2026', period: 'Jan–Mar 2026', status: 'Draft', goalsCount: 0 });
    seedLeaveDataForEmployee(newEmp);
    closeModal();
    // Straight into the new employee's profile — Admin/HR land on Documents next,
    // instead of back on the list, so onboarding paperwork is the natural next step.
    if (currentRole === 'admin' || currentRole === 'hr') {
      justAddedEmployeeId = newId;
      openEmployeeCycles(newId);
      return;
    }
    navigateTo('employees');
  } else {
    const e = EMPLOYEES.find(x => x.id === empModalId);
    if (e) Object.assign(e, common);
    const w = EMPLOYEE_WEIGHTAGES.find(x => x.id === empModalId);
    if (w) Object.assign(w, { name: `${firstName} ${lastName}`, email, dept, designation });
    if (e) seedLeaveDataForEmployee(e);
    closeModal();
    navigateTo('employees');
  }
}

function deleteEmployee(id) {
  if (!confirmDelete('Delete this employee? This also removes their review cycles and assigned goals.')) return;
  EMPLOYEES = EMPLOYEES.filter(e => e.id !== id);
  EMPLOYEE_WEIGHTAGES = EMPLOYEE_WEIGHTAGES.filter(w => w.id !== id);
  const cycleIds = REVIEW_CYCLES.filter(c => c.employeeId === id).map(c => c.id);
  REVIEW_CYCLES = REVIEW_CYCLES.filter(c => c.employeeId !== id);
  ASSIGNED_GOALS = ASSIGNED_GOALS.filter(g => !cycleIds.includes(g.cycleId));
  if (selectedEmployeeId === id) { selectedEmployeeId = null; selectedCycleId = null; }
  navigateTo('employees');
}

function updateEmpStatus(id, el) {
  const e = EMPLOYEES.find(x => x.id === id);
  if (e) e.status = el.value;
  onStatusChange(el);
}

/* ==================== REVIEW CYCLES CRUD ==================== */
function openCycleModal(mode = 'add', id = null) {
  const c = mode === 'edit' ? REVIEW_CYCLES.find(x => x.id === id) : null;
  showModal(`
    <div class="modal-header">
      <h3>${mode === 'add' ? 'Add' : 'Edit'} Review Cycle</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group"><label>Quarter</label>
        <select class="form-control" id="cycleQuarter">
          ${['Q1 2026','Q2 2026','Q3 2026','Q4 2026','Q4 2025'].map(q => `<option ${c && c.quarter === q ? 'selected' : ''}>${q}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Period</label><input class="form-control" id="cyclePeriod" value="${c ? c.period : 'Jan–Mar 2026'}"></div>
      <div class="form-group"><label>Status</label>
        <select class="form-control" id="cycleStatus">
          ${['Draft','In Progress','Pending Review','Complete','Cancelled'].map(s => `<option ${c && c.status === s ? 'selected' : (!c && s === 'Draft' ? 'selected' : '')}>${s}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveCycle('${mode}', ${id || 'null'})">Save</button>
    </div>
  `);
}

function saveCycle(mode, id) {
  if (!selectedEmployeeId) { alert('No employee selected.'); return; }
  const quarter = document.getElementById('cycleQuarter').value;
  const period = document.getElementById('cyclePeriod').value.trim();
  const status = document.getElementById('cycleStatus').value;
  if (mode === 'add') {
    REVIEW_CYCLES.push({ id: nextId.cycle++, employeeId: selectedEmployeeId, quarter, period, status, goalsCount: 0 });
  } else {
    const c = REVIEW_CYCLES.find(x => x.id === id);
    if (c) Object.assign(c, { quarter, period, status });
  }
  closeModal();
  navigateTo('review-cycles');
}

function deleteCycle(id) {
  if (!confirmDelete('Delete this review cycle and its assigned goals?')) return;
  REVIEW_CYCLES = REVIEW_CYCLES.filter(c => c.id !== id);
  ASSIGNED_GOALS = ASSIGNED_GOALS.filter(g => g.cycleId !== id);
  if (selectedCycleId === id) selectedCycleId = null;
  navigateTo('review-cycles');
}

function updateCycleStatus(id, el) {
  const c = REVIEW_CYCLES.find(x => x.id === id);
  if (c) c.status = el.value;
  onStatusChange(el);
}

/* ==================== ASSIGNED GOALS CRUD ==================== */
/** Assign generic goals from Goals module library */
function openAssignLibraryGoalsModal() {
  if (!selectedEmployeeId || !selectedCycleId) {
    alert('Open a review cycle first, then assign goals.');
    return;
  }
  const emp = getSelectedEmployee();
  const cycle = getSelectedCycle();
  showModal(`
    <div class="modal-header">
      <h3>Assign Goals (from Goals library)</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <p class="muted" style="margin-bottom:1rem">${empName(emp)} · ${cycle.quarter} — select generic goals from the Goals module.</p>
      <div class="form-group"><label>Select Goals</label>
        <div class="checkbox-list" id="assignGoalChecks">
          ${GOALS_LIB.filter(x => x.status === 'Active').map(x => `
            <label>
              <input type="checkbox" value="${x.id}">
              <strong>${x.title}</strong>
              <span class="badge badge-gray">${x.scope === 'Organization-wide' ? 'Org-wide' : x.dept}</span>
              <span class="badge badge-primary">${x.category}</span>
              <span class="muted">Max ${x.maxScore}</span>
              <br><small class="muted">${x.description}</small>
            </label>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveLibraryGoals()">Assign Goals</button>
    </div>
  `);
}

/** Create a custom goal for this employee + quarter */
function openCustomGoalModal() {
  if (!selectedEmployeeId || !selectedCycleId) {
    alert('Open a review cycle first, then create a custom goal.');
    return;
  }
  const emp = getSelectedEmployee();
  const cycle = getSelectedCycle();
  showModal(`
    <div class="modal-header">
      <h3>Create Custom Goal</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <p class="muted" style="margin-bottom:1rem">Custom goal for ${empName(emp)} · ${cycle.quarter}</p>
      <div class="form-group"><label>Goal Name</label><input class="form-control" id="customTitle" placeholder="e.g. Learn new technology stack"></div>
      <div class="form-group"><label>Description</label><textarea class="form-control" id="customDesc" rows="3" placeholder="Detailed goal description..."></textarea></div>
      <div class="form-group"><label>KPI</label><input class="form-control" id="customKpi" placeholder="e.g. Certification completed"></div>
      <div class="form-group"><label>Max Score</label><input class="form-control" id="customMax" type="number" value="100" min="1"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveCustomGoal()">Create Custom Goal</button>
    </div>
  `);
}

function openAssignGoalModal(mode = 'add', goalId = null) {
  if (mode === 'edit' && goalId) {
    openEditAssignedGoalModal(goalId);
    return;
  }
  openAssignLibraryGoalsModal();
}

function openEditAssignedGoalModal(goalId) {
  const g = ASSIGNED_GOALS.find(x => x.id === goalId);
  if (!g) return;
  showModal(`
    <div class="modal-header">
      <h3>Edit Assigned Goal</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group"><label>Goal Name</label><input class="form-control" id="editGoalTitle" value="${g.title}"></div>
      <div class="form-group"><label>Description</label><textarea class="form-control" id="editGoalDesc" rows="2">${g.description}</textarea></div>
      <div class="form-group"><label>KPI</label><input class="form-control" id="editGoalKpi" value="${g.kpi || ''}"></div>
      <div class="form-group"><label>Max Score</label><input class="form-control" id="editGoalMax" type="number" value="${g.maxScore}"></div>
      <div class="form-group"><label>Status</label>
        <select class="form-control" id="editGoalStatus">
          ${['Not Assessed', 'Assessed', 'Reviewed', 'Complete'].map(s => `<option ${g.status === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveAssignedGoalEdit(${goalId})">Save</button>
    </div>
  `);
}

function saveLibraryGoals() {
  const empId = selectedEmployeeId;
  const cycleId = selectedCycleId;
  if (!empId || !cycleId) { alert('Select employee and review cycle.'); return; }
  const checks = [...document.querySelectorAll('#assignGoalChecks input:checked')];
  if (!checks.length) { alert('Select at least one goal.'); return; }
  checks.forEach(cb => {
    const lib = GOALS_LIB.find(x => x.id === Number(cb.value));
    if (!lib) return;
    ASSIGNED_GOALS.push({
      id: nextId.assign++, cycleId, employeeId: empId,
      title: lib.title, description: lib.description,
      kpi: lib.category + ' KPI',
      scope: lib.scope === 'Organization-wide' ? 'Org-wide' : lib.dept,
      type: 'Standard', maxScore: lib.maxScore,
      selfScore: null, selfRemark: '',
      tlScore: null, tlRemark: '',
      managerScore: null, managerRemark: '',
      adminScore: null, adminRemark: '',
      status: 'Not Assessed'
    });
  });
  refreshCycleGoalCount(cycleId);
  closeModal();
  navigateTo('employee-goals');
}

function saveCustomGoal() {
  const empId = selectedEmployeeId;
  const cycleId = selectedCycleId;
  if (!empId || !cycleId) { alert('Select employee and review cycle.'); return; }
  const title = document.getElementById('customTitle').value.trim();
  const description = document.getElementById('customDesc').value.trim();
  const kpi = document.getElementById('customKpi').value.trim() || 'Custom KPI';
  const maxScore = Number(document.getElementById('customMax').value) || 100;
  if (!title) { alert('Goal name is required.'); return; }
  ASSIGNED_GOALS.push({
    id: nextId.assign++, cycleId, employeeId: empId,
    title, description, kpi, scope: 'Custom', type: 'Custom',
    maxScore,
    selfScore: null, selfRemark: '',
    tlScore: null, tlRemark: '',
    managerScore: null, managerRemark: '',
    adminScore: null, adminRemark: '',
    status: 'Not Assessed'
  });
  refreshCycleGoalCount(cycleId);
  closeModal();
  navigateTo('employee-goals');
}

function refreshCycleGoalCount(cycleId) {
  const cycle = REVIEW_CYCLES.find(c => c.id === cycleId);
  if (cycle) {
    cycle.goalsCount = getCycleGoals(cycleId).length;
    if (cycle.status === 'Draft') cycle.status = 'In Progress';
  }
}

function saveAssignedGoalEdit(id) {
  const g = ASSIGNED_GOALS.find(x => x.id === id);
  if (!g) return;
  g.title = document.getElementById('editGoalTitle').value.trim();
  g.description = document.getElementById('editGoalDesc').value.trim();
  g.kpi = document.getElementById('editGoalKpi').value.trim();
  g.maxScore = Number(document.getElementById('editGoalMax').value) || 100;
  g.status = document.getElementById('editGoalStatus').value;
  if (!g.title) { alert('Goal name is required.'); return; }
  closeModal();
  navigateTo(currentPage === 'assign-goals' ? 'assign-goals' : 'employee-goals');
}

function deleteAssignedGoal(id) {
  if (!confirmDelete('Remove this assigned goal?')) return;
  const g = ASSIGNED_GOALS.find(x => x.id === id);
  ASSIGNED_GOALS = ASSIGNED_GOALS.filter(x => x.id !== id);
  if (g) refreshCycleGoalCount(g.cycleId);
  navigateTo(currentPage === 'assign-goals' ? 'assign-goals' : 'employee-goals');
}

function updateAssignedGoalStatus(id, el) {
  const g = ASSIGNED_GOALS.find(x => x.id === id);
  if (g) g.status = el.value;
  onStatusChange(el);
}

function toggleCustomGoal(show) {
  const std = document.getElementById('standardGoalBlock');
  const cust = document.getElementById('customGoalBlock');
  if (std) std.style.display = show ? 'none' : 'block';
  if (cust) cust.style.display = show ? 'block' : 'none';
}

function saveAssignGoals() {
  saveLibraryGoals();
}

/* ==================== WEIGHTAGE ==================== */
function startWeightageEdit(id) {
  const emp = EMPLOYEE_WEIGHTAGES.find(e => e.id === id);
  if (!emp) return;
  editingWeightageEmployeeId = id;
  weightageEditDraft = { teamlead: emp.teamlead, manager: emp.manager, admin: emp.admin };
  navigateTo('weightage');
}

function draftWeightageField(role, value) {
  if (!weightageEditDraft) return;
  const n = Math.max(0, Math.min(100, Number(value) || 0));
  weightageEditDraft[role] = n;
  const t = weightageEditDraft.teamlead + weightageEditDraft.manager + weightageEditDraft.admin;
  const badge = document.getElementById('inline-total-badge');
  if (badge) {
    badge.textContent = t + '%';
    badge.className = 'badge ' + (t === 100 ? 'badge-success' : 'badge-danger');
  }
}

function saveWeightageRow(id) {
  const emp = EMPLOYEE_WEIGHTAGES.find(e => e.id === id);
  if (!emp || !weightageEditDraft) return;
  const t = weightageEditDraft.teamlead + weightageEditDraft.manager + weightageEditDraft.admin;
  if (t !== 100) { alert('Total must equal 100%. Current total: ' + t + '%'); return; }
  emp.employee = 0;
  emp.teamlead = weightageEditDraft.teamlead;
  emp.manager = weightageEditDraft.manager;
  emp.admin = weightageEditDraft.admin;
  editingWeightageEmployeeId = null;
  weightageEditDraft = null;
  navigateTo('weightage');
}

function cancelWeightageEdit() {
  editingWeightageEmployeeId = null;
  weightageEditDraft = null;
  navigateTo('weightage');
}

/* Active review pipeline steps */
function workflowBar(activeStep) {
  const steps = [
    { key: 'assign', label: 'Goals Assigned' },
    { key: 'self', label: 'Self Assessment', weight: WEIGHTAGE.employee },
    { key: 'tl', label: 'Team Lead Review', weight: WEIGHTAGE.teamlead },
    { key: 'mgr', label: 'Manager Review', weight: WEIGHTAGE.manager },
    { key: 'admin', label: 'Admin Review', weight: WEIGHTAGE.admin },
    { key: 'final', label: 'Final Score' }
  ].filter(s => s.weight === undefined || s.weight > 0);

  return `<div class="workflow-steps">${steps.map((s, i) => {
    const cls = i < activeStep ? 'done' : i === activeStep ? 'active' : '';
    const connCls = i < activeStep ? 'done' : '';
    return `${i > 0 ? `<div class="step-connector ${connCls}"></div>` : ''}
    <div class="workflow-step">
      <div class="step-circle ${cls}">${i < activeStep ? '✓' : i + 1}</div>
      <span class="step-label">${s.label}${s.weight != null ? ` (${s.weight}%)` : ''}</span>
    </div>`;
  }).join('')}</div>`;
}

/* ==================== PAGE RENDERERS ==================== */
/* ==================== ADMIN ANALYTICS DASHBOARD ==================== */

/* Quarter strings look like "Q1 2026" — sortable chronologically via year*10 + quarter#. */
function quarterSortKey(q) {
  const m = /^Q(\d) (\d{4})$/.exec(q || '');
  return m ? parseInt(m[2], 10) * 10 + parseInt(m[1], 10) : 0;
}

function allQuarters() {
  return [...new Set(REVIEW_CYCLES.map(c => c.quarter))].sort((a, b) => quarterSortKey(a) - quarterSortKey(b));
}

/* Default to the quarter with the most fully-Complete cycles, so the first thing an admin
   sees has real data rather than an all-empty-state screen; falls back to the latest
   quarter if nothing has ever been completed. */
function defaultDashboardQuarter() {
  const quarters = allQuarters();
  if (!quarters.length) return null;
  let best = quarters[quarters.length - 1];
  let bestCount = -1;
  quarters.forEach(q => {
    const count = REVIEW_CYCLES.filter(c => c.quarter === q && c.status === 'Complete').length;
    if (count > bestCount) { bestCount = count; best = q; }
  });
  return best;
}

/* Mirrors the real API's weighted-final-score calc (GoalReviewManager.GetFinalScore):
   per role, average that role's per-goal percent scores, then weight by the employee's
   own weightage config and sum. `complete` requires the cycle itself to be Complete AND
   every goal to carry an Admin score — matching "IsReviewComplete" server-side, so a
   review still awaiting the Admin stage never counts toward an average. */
function calcEmployeeFinalScore(employeeId, quarter) {
  const cycle = REVIEW_CYCLES.find(c => c.employeeId === employeeId && c.quarter === quarter);
  if (!cycle) return null;

  const goals = ASSIGNED_GOALS.filter(g => g.cycleId === cycle.id);
  if (!goals.length) return { percent: null, complete: false, cycle };

  const w = EMPLOYEE_WEIGHTAGES.find(x => x.id === employeeId) || { employee: 0, teamlead: 0, manager: 0, admin: 0 };
  const roles = [
    { key: 'selfScore', weight: w.employee },
    { key: 'tlScore', weight: w.teamlead },
    { key: 'managerScore', weight: w.manager },
    { key: 'adminScore', weight: w.admin }
  ];

  let contribution = 0, weightUsed = 0;
  roles.forEach(r => {
    if (r.weight <= 0) return;
    const scored = goals.filter(g => g[r.key] != null);
    if (!scored.length) return;
    const avgPercent = scored.reduce((s, g) => s + (g[r.key] / g.maxScore * 100), 0) / scored.length;
    contribution += avgPercent * (r.weight / 100);
    weightUsed += r.weight;
  });

  const complete = cycle.status === 'Complete' && goals.every(g => g.adminScore != null);
  return { percent: weightUsed ? Math.round(contribution * 10) / 10 : null, complete, cycle };
}

/* All aggregation for the dashboard, computed fresh from the in-memory stores for the
   selected quarter — nothing here is cached, so editing scores/weightage elsewhere and
   coming back to the dashboard always reflects the latest data. */
function dashboardMetrics(quarter) {
  const cyclesThisQuarter = REVIEW_CYCLES.filter(c => c.quarter === quarter);

  const rows = EMPLOYEES.map(e => {
    const cycle = cyclesThisQuarter.find(c => c.employeeId === e.id);
    if (!cycle) return null;
    return { emp: e, ...calcEmployeeFinalScore(e.id, quarter) };
  }).filter(Boolean);

  const completedRows = rows.filter(r => r.complete && r.percent != null);

  const coverage = {
    complete: cyclesThisQuarter.filter(c => c.status === 'Complete').length,
    inProgress: cyclesThisQuarter.filter(c => c.status === 'In Progress' || c.status === 'Pending Review').length,
    notStarted: cyclesThisQuarter.filter(c => c.status === 'Draft').length
  };

  function groupBy(keyFn) {
    const map = new Map();
    rows.forEach(r => {
      const key = keyFn(r.emp);
      if (!key) return;
      if (!map.has(key)) map.set(key, { name: key, total: 0, completed: 0, sum: 0 });
      const g = map.get(key);
      g.total++;
      if (r.complete && r.percent != null) { g.completed++; g.sum += r.percent; }
    });
    return [...map.values()]
      .map(g => ({ name: g.name, total: g.total, completed: g.completed, avg: g.completed ? g.sum / g.completed : null }))
      .sort((a, b) => (b.avg ?? -1) - (a.avg ?? -1));
  }

  const departments = groupBy(e => e.dept);
  const managers = groupBy(e => e.manager);
  const teamLeads = groupBy(e => e.teamLead);

  const ranked = [...completedRows]
    .sort((a, b) => b.percent - a.percent)
    .map(r => ({ name: empName(r.emp), dept: r.emp.dept, manager: r.emp.manager, score: r.percent }));

  const high = ranked.slice(0, Math.min(dashboardTopN, ranked.length));
  /* Only show a Low Performers list once there are more completed reviews than the Top-N
     size — otherwise "top N" and "bottom N" are the same handful of people, which reads as
     a bug, not a real distinction. */
  const low = ranked.length > dashboardTopN ? [...ranked].slice(-dashboardTopN).reverse() : [];

  const avgScore = completedRows.length
    ? completedRows.reduce((s, r) => s + r.percent, 0) / completedRows.length
    : null;

  const buckets = [
    { label: '0-20%', min: 0, max: 20, count: 0 },
    { label: '21-40%', min: 20, max: 40, count: 0 },
    { label: '41-60%', min: 40, max: 60, count: 0 },
    { label: '61-80%', min: 60, max: 80, count: 0 },
    { label: '81-100%', min: 80, max: 101, count: 0 }
  ];
  completedRows.forEach(r => {
    const b = buckets.find(b => r.percent >= b.min && r.percent < b.max);
    if (b) b.count++;
  });

  return {
    quarter, coverage, departments, managers, teamLeads, high, low, avgScore, buckets,
    totalInScope: rows.length, completedCount: completedRows.length
  };
}

function setDashboardQuarter(q) {
  dashboardQuarter = q;
  document.getElementById('pageContent').innerHTML = renderDashboard();
}

function setDashboardTopN(n) {
  dashboardTopN = parseInt(n, 10);
  document.getElementById('pageContent').innerHTML = renderDashboard();
}

/* ---- Chart primitives (inline SVG — no charting library) ---- */

/* True pie (filled slices, no center hole) — a single 100%-share segment is drawn as a
   plain circle rather than a 360° arc path, since an SVG arc whose start and end point
   coincide doesn't reliably render as a full circle across browsers. */
function svgPie(segments, size) {
  size = size || 120;
  const r = size / 2 - 4, cx = size / 2, cy = size / 2;
  const total = segments.reduce((s, x) => s + x.value, 0);
  if (!total) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--gray-100)"/></svg>`;
  }
  const active = segments.filter(s => s.value > 0);
  if (active.length === 1) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${active[0].color}"/></svg>`;
  }
  let angle = -90;
  const slices = active.map(seg => {
    const sliceAngle = (seg.value / total) * 360;
    const largeArc = sliceAngle > 180 ? 1 : 0;
    const x1 = cx + r * Math.cos(angle * Math.PI / 180);
    const y1 = cy + r * Math.sin(angle * Math.PI / 180);
    const endAngle = angle + sliceAngle;
    const x2 = cx + r * Math.cos(endAngle * Math.PI / 180);
    const y2 = cy + r * Math.sin(endAngle * Math.PI / 180);
    const path = `M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${largeArc} 1 ${x2.toFixed(2)},${y2.toFixed(2)} Z`;
    angle = endAngle;
    return `<path d="${path}" fill="${seg.color}" stroke="white" stroke-width="1.5"/>`;
  }).join('');
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${slices}</svg>`;
}

function svgHistogram(buckets) {
  const w = 360, h = 160, padBottom = 26, padTop = 18, gap = 14;
  const max = Math.max(...buckets.map(b => b.count), 1);
  const barW = (w - gap * (buckets.length - 1)) / buckets.length;
  const bars = buckets.map((b, i) => {
    const barH = (b.count / max) * (h - padBottom - padTop);
    const x = i * (barW + gap);
    const y = h - padBottom - barH;
    return `
      <rect x="${x}" y="${y}" width="${barW}" height="${Math.max(barH, b.count ? 3 : 0)}" rx="5" fill="var(--primary)"
        opacity="${0.45 + 0.55 * (i / (buckets.length - 1))}"/>
      <text x="${x + barW / 2}" y="${h - padBottom + 16}" text-anchor="middle" font-size="10" fill="var(--gray-500)">${b.label}</text>
      ${b.count ? `<text x="${x + barW / 2}" y="${y - 6}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--gray-700)">${b.count}</text>` : ''}
    `;
  }).join('');
  return `<div class="chart-frame"><svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto">
    <line x1="0" y1="${h - padBottom}" x2="${w}" y2="${h - padBottom}" stroke="var(--gray-200)"/>
    ${bars}
  </svg></div>`;
}

function truncateLabel(s, n) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

/* Vertical bar chart for Department/Manager/Team-Lead-wise Performance — fixed 0-100%
   axis (not scaled to whichever bar is tallest) so a bar's height is directly readable as
   its score, and a group with zero completed reviews still gets its own flat gray bar with
   a "—" label rather than disappearing from the chart. `gradId` must be unique per chart
   instance on the page since SVG gradient ids are global to the document. */
function svgBarChart(rows, gradId, emptyText) {
  if (!rows.length) return `<p class="chart-empty">${emptyText}</p>`;

  const w = 300, h = 190, padBottom = 40, padTop = 22, gap = 16;
  const n = rows.length;
  const barW = Math.min(56, (w - gap * (n - 1)) / n);
  const totalW = barW * n + gap * (n - 1);
  const startX = (w - totalW) / 2;
  const plotH = h - padTop - padBottom;

  const grid = [0, 25, 50, 75, 100].map(g => {
    const y = padTop + plotH * (1 - g / 100);
    return `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="var(--gray-100)"/><text x="2" y="${y - 3}" font-size="8" fill="var(--gray-400)">${g}</text>`;
  }).join('');

  const bars = rows.map((r, i) => {
    const x = startX + i * (barW + gap);
    const val = r.avg;
    const barH = val == null ? 3 : Math.max((val / 100) * plotH, 3);
    const y = h - padBottom - barH;
    return `
      <rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="6" fill="${val == null ? 'var(--gray-200)' : `url(#${gradId})`}"/>
      <text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" font-size="11" font-weight="700"
        fill="${val == null ? 'var(--gray-400)' : 'var(--gray-700)'}">${val == null ? '—' : val.toFixed(1) + '%'}</text>
      <text x="${x + barW / 2}" y="${h - padBottom + 16}" text-anchor="middle" font-size="10" font-weight="600" fill="var(--gray-600)">${truncateLabel(r.name, 9)}</text>
      <text x="${x + barW / 2}" y="${h - padBottom + 28}" text-anchor="middle" font-size="9" fill="var(--gray-400)">${r.completed}/${r.total}</text>
    `;
  }).join('');

  return `<div class="chart-frame"><svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto">
    <defs><linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#9f7aea"/><stop offset="100%" stop-color="var(--primary)"/>
    </linearGradient></defs>
    ${grid}
    ${bars}
    <line x1="0" y1="${h - padBottom}" x2="${w}" y2="${h - padBottom}" stroke="var(--gray-300)"/>
  </svg></div>`;
}

function renderPerfList(rows, type, emptyText) {
  if (!rows.length) return `<p class="chart-empty">${emptyText}</p>`;
  return `<div class="perf-list">${rows.map((r, i) => {
    const rankClass = type === 'high' ? (['gold', 'silver', 'bronze'][i] || '') : (i === 0 ? 'low-worst' : '');
    return `
    <div class="perf-row">
      <div class="perf-rank ${rankClass}">${i + 1}</div>
      <div class="perf-info">
        <div class="perf-name">${r.name}</div>
        <div class="perf-meta">${r.dept} · ${r.manager}</div>
      </div>
      <div class="perf-score-wrap">
        <div class="perf-mini-track"><div class="perf-mini-fill ${type}" style="width:${Math.min(100, r.score)}%"></div></div>
        <span class="perf-score">${r.score.toFixed(1)}%</span>
      </div>
    </div>`;
  }).join('')}</div>`;
}

function renderDashboard() {
  if (currentRole === 'admin') {
    if (!dashboardQuarter) dashboardQuarter = defaultDashboardQuarter();
    const quarters = allQuarters();
    const m = dashboardMetrics(dashboardQuarter);
    const topDept = m.departments.find(d => d.avg != null);

    return `
      <div class="dash-toolbar">
        <div class="quarter-tabs" role="tablist" aria-label="Review cycle">
          ${quarters.map(q => `<button class="quarter-tab ${q === dashboardQuarter ? 'active' : ''}" onclick="setDashboardQuarter('${q}')">${q}</button>`).join('')}
        </div>
        <div class="dash-topn">
          <label for="dashTopN">High / Low Performers — Top</label>
          <select id="dashTopN" class="form-control" onchange="setDashboardTopN(this.value)">
            ${[1, 2, 3, 5, 10].map(n => `<option value="${n}" ${n === dashboardTopN ? 'selected' : ''}>${n}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card"><div class="label">Employees in Cycle</div><div class="value">${m.totalInScope}</div><div class="sub">${dashboardQuarter}</div></div>
        <div class="stat-card green"><div class="label">Reviews Completed</div><div class="value">${m.completedCount} / ${m.totalInScope}</div><div class="sub">Counted toward scores below</div></div>
        <div class="stat-card purple"><div class="label">Overall Avg Score</div><div class="value">${m.avgScore == null ? '—' : m.avgScore.toFixed(1) + '%'}</div><div class="sub">Weighted final score</div></div>
        <div class="stat-card orange"><div class="label">Top Department</div><div class="value" style="font-size:1.15rem">${topDept ? topDept.name : '—'}</div><div class="sub">${topDept ? topDept.avg.toFixed(1) + '% avg' : 'Not enough data'}</div></div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3>Review Coverage</h3></div>
          <div class="card-body">
            <div class="donut-wrap">
              ${svgPie([
                { value: m.coverage.complete, color: 'var(--accent)' },
                { value: m.coverage.inProgress, color: 'var(--warning)' },
                { value: m.coverage.notStarted, color: 'var(--gray-300)' }
              ])}
              <div class="donut-legend">
                <div class="legend-total">${m.totalInScope} review${m.totalInScope === 1 ? '' : 's'} this cycle</div>
                <div class="donut-legend-item"><span class="legend-dot" style="background:var(--accent)"></span>Completed <strong>${m.coverage.complete}</strong></div>
                <div class="donut-legend-item"><span class="legend-dot" style="background:var(--warning)"></span>In Progress <strong>${m.coverage.inProgress}</strong></div>
                <div class="donut-legend-item"><span class="legend-dot" style="background:var(--gray-300)"></span>Not Started <strong>${m.coverage.notStarted}</strong></div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h3>Score Distribution</h3></div>
          <div class="card-body">
            ${m.completedCount ? svgHistogram(m.buckets) : `<p class="chart-empty">No completed reviews yet for ${dashboardQuarter}.</p>`}
          </div>
        </div>
      </div>

      <div class="grid-3">
        <div class="card">
          <div class="card-header"><h3>Department-wise Performance</h3></div>
          <div class="card-body">${svgBarChart(m.departments, 'deptBarGrad', `No completed reviews yet for ${dashboardQuarter}.`)}</div>
        </div>
        <div class="card">
          <div class="card-header"><h3>Manager-wise Performance</h3></div>
          <div class="card-body">${svgBarChart(m.managers, 'mgrBarGrad', `No completed reviews yet for ${dashboardQuarter}.`)}</div>
        </div>
        <div class="card">
          <div class="card-header"><h3>Team-Lead-wise Performance</h3></div>
          <div class="card-body">${svgBarChart(m.teamLeads, 'tlBarGrad', `No employees with a team lead have a completed review yet for ${dashboardQuarter}.`)}</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3>High Performers</h3><span class="badge badge-success">Top ${dashboardTopN} by score</span></div>
          <div class="card-body">${renderPerfList(m.high, 'high', `No completed reviews yet for ${dashboardQuarter}.`)}</div>
        </div>
        <div class="card">
          <div class="card-header"><h3>Low Performers</h3><span class="badge badge-danger">Bottom ${dashboardTopN} by score</span></div>
          <div class="card-body">${renderPerfList(m.low, 'low', `Fewer than ${dashboardTopN + 1} completed reviews this cycle — not enough to separate high and low performers yet.`)}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h3>Quick Actions</h3></div>
        <div class="card-body action-stack">
          <button class="btn btn-primary" onclick="navigateTo('employees')">Employees → Profile</button>
          <button class="btn btn-success" onclick="openEmployeeCycles(1)">Demo: John Doe's Profile</button>
          <button class="btn btn-outline" onclick="navigateTo('weightage')">Configure Weightage</button>
          <button class="btn btn-outline" onclick="navigateTo('history')">Quarterly History</button>
        </div>
      </div>
    `;
  }

  if (currentRole === 'hr') {
    return `
      <div class="stats-grid">
        <div class="stat-card"><div class="label">Employees</div><div class="value">${EMPLOYEES.length}</div><div class="sub">Manage records (CRUD)</div></div>
        <div class="stat-card green"><div class="label">Active Quarter</div><div class="value">Q1 2026</div><div class="sub">Jan – Mar</div></div>
        <div class="stat-card orange"><div class="label">My Self Assessment</div><div class="value">Pending</div><div class="sub">Due Mar 15</div></div>
        <div class="stat-card purple"><div class="label">My Last Score</div><div class="value">81%</div><div class="sub">Q4 2025</div></div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Authorized Actions</h3></div>
        <div class="card-body action-stack">
          <button class="btn btn-primary" onclick="navigateTo('employees')">Manage Employees (CRUD)</button>
          <button class="btn btn-outline" onclick="navigateTo('my-goals')">View Assigned Goals</button>
          <button class="btn btn-outline" onclick="navigateTo('self-assessment')">Self Assessment</button>
        </div>
      </div>
    `;
  }

  if (currentRole === 'manager' || currentRole === 'teamlead') {
    const label = currentRole === 'manager' ? 'Manager' : 'Team Lead';
    const weight = currentRole === 'manager' ? WEIGHTAGE.manager : WEIGHTAGE.teamlead;
    return `
      <div class="stats-grid">
        <div class="stat-card"><div class="label">Team Size</div><div class="value">${EMPLOYEES.length}</div><div class="sub">Team members</div></div>
        <div class="stat-card orange"><div class="label">Pending My Review</div><div class="value">${EMPLOYEES.filter(e => e.status !== 'Complete').length}</div><div class="sub">${label} weightage ${weight}%</div></div>
        <div class="stat-card green"><div class="label">Reviews Done</div><div class="value">${EMPLOYEES.filter(e => e.status === 'Complete').length}</div><div class="sub">This quarter</div></div>
        <div class="stat-card purple"><div class="label">My Assessment</div><div class="value">Submitted</div><div class="sub">Own goals</div></div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Team — Click employee to start review flow</h3></div>
        <div class="card-body table-wrap">
          <table>
            <thead><tr><th>Employee</th><th>Department</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              ${EMPLOYEES.map(e => `
                <tr style="cursor:pointer" onclick="openEmployeeCycles(${e.id})">
                  <td><strong>${empName(e)}</strong></td>
                  <td>${e.dept}</td>
                  <td><span class="badge badge-${e.status === 'Complete' ? 'success' : 'warning'}">${e.status}</span></td>
                  <td><button class="btn btn-primary btn-sm" onclick="event.stopPropagation();openEmployeeCycles(${e.id})">View Profile</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  return `
    ${workflowBar(1)}
    <div class="stats-grid">
      <div class="stat-card"><div class="label">Assigned Goals</div><div class="value">5</div><div class="sub">Q1 2026</div></div>
      <div class="stat-card orange"><div class="label">Self Assessment</div><div class="value">Pending</div><div class="sub">Due Mar 15, 2026</div></div>
      <div class="stat-card green"><div class="label">Last Quarter Score</div><div class="value">84%</div><div class="sub">Q4 2025 weighted</div></div>
      <div class="stat-card purple"><div class="label">Your Weightage</div><div class="value">${WEIGHTAGE.employee}%</div><div class="sub">Of final score</div></div>
    </div>
    <div class="card">
      <div class="card-header"><h3>My Goals — Q1 2026</h3><button class="btn btn-primary btn-sm" onclick="navigateTo('self-assessment')">Start Self Assessment</button></div>
      <div class="card-body">
        <div class="goal-card"><div class="goal-card-header"><h4>Deliver projects on time</h4><span class="badge badge-primary">Technical</span></div><div class="goal-description">Complete assigned sprint tasks within deadlines.</div></div>
        <div class="goal-card"><div class="goal-card-header"><h4>Code quality &amp; peer reviews</h4><span class="badge badge-primary">Technical</span></div><div class="goal-description">Maintain code review participation.</div></div>
        <div class="goal-card"><div class="goal-card-header"><h4>Team collaboration</h4><span class="badge badge-purple">Behavioral</span></div><div class="goal-description">Active participation in team meetings.</div></div>
      </div>
    </div>
  `;
}

function renderDepartments() {
  return `
    <div class="search-bar">
      <input class="form-control" placeholder="Search departments...">
      <button class="btn btn-primary" onclick="openDeptModal('add')">+ Add Department</button>
    </div>
    <div class="card"><div class="card-body table-wrap">
      <table>
        <thead><tr><th>ID</th><th>Department Name</th><th>Employees</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${DEPARTMENTS.map(d => `
            <tr>
              <td>${d.id}</td><td>${d.name}</td><td>${d.employees}</td>
              <td>${statusSelect(d.status, ['Active', 'Inactive'], `updateDeptStatus(${d.id}, this)`)}</td>
              <td class="action-buttons">
                <button class="btn btn-outline btn-sm" onclick="openDeptModal('edit', ${d.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteDepartment(${d.id})">Delete</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div></div>
  `;
}

function renderDesignations() {
  return `
    <div class="search-bar">
      <input class="form-control" placeholder="Search designations...">
      <button class="btn btn-primary" onclick="openDesigModal('add')">+ Add Designation</button>
    </div>
    <div class="card"><div class="card-body table-wrap">
      <table>
        <thead><tr><th>ID</th><th>Designation</th><th>Employees</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${DESIGNATIONS.map(d => `
            <tr>
              <td>${d.id}</td><td>${d.name}</td><td>${d.employees}</td>
              <td>${statusSelect(d.status, ['Active', 'Inactive'], `updateDesigStatus(${d.id}, this)`)}</td>
              <td class="action-buttons">
                <button class="btn btn-outline btn-sm" onclick="openDesigModal('edit', ${d.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteDesignation(${d.id})">Delete</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div></div>
  `;
}

function renderGoals() {
  const scopeBadge = g => g.scope === 'Organization-wide'
    ? `<span class="badge badge-gray">Organization-wide</span>`
    : `<span class="badge badge-primary">${g.dept}</span>`;
  const catBadge = g => {
    const map = { Technical: 'primary', Behavioral: 'purple', Business: 'warning', Leadership: 'success' };
    return `<span class="badge badge-${map[g.category] || 'gray'}">${g.category}</span>`;
  };
  return `
    <div class="search-bar">
      <input class="form-control" placeholder="Search goals...">
      <button class="btn btn-primary" onclick="openGoalModal('add')">+ Create Goal</button>
    </div>
    <div class="card"><div class="card-body table-wrap">
      <table>
        <thead><tr><th>Goal</th><th>Scope / Department</th><th>Category</th><th>Max Score</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${GOALS_LIB.map(g => `
            <tr>
              <td><strong>${g.title}</strong><br><small class="muted">${g.description}</small></td>
              <td>${scopeBadge(g)}</td>
              <td>${catBadge(g)}</td>
              <td><strong>${g.maxScore}</strong></td>
              <td>${statusSelect(g.status, ['Active', 'Inactive', 'Draft'], `updateGoalStatus(${g.id}, this)`)}</td>
              <td class="action-buttons">
                <button class="btn btn-outline btn-sm" onclick="openGoalModal('edit', ${g.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteGoal(${g.id})">Delete</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div></div>
  `;
}

function renderWeightage() {
  return `
    <div class="card">
      <div class="card-header">
        <span class="badge badge-gray">${EMPLOYEE_WEIGHTAGES.length} employees</span>
      </div>
      <div class="card-body" style="padding-top:.75rem">
        <div class="search-bar">
          <input class="form-control" placeholder="Search employee...">
        </div>
        <div class="table-wrap">
          <table class="weightage-emp-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>TL %</th>
                <th>Manager %</th>
                <th>Admin %</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${EMPLOYEE_WEIGHTAGES.map(e => {
                const isEditing = editingWeightageEmployeeId === e.id;
                const d = isEditing && weightageEditDraft ? weightageEditDraft : e;
                const t = Number(d.teamlead) + Number(d.manager) + Number(d.admin);
                if (isEditing) {
                  return `<tr class="row-editing">
                    <td><strong>${e.name}</strong><br><small class="muted">${e.designation} · ${e.dept}</small></td>
                    <td><input type="number" class="form-control form-control-sm weightage-cell-input" min="0" max="100" value="${d.teamlead}" oninput="draftWeightageField('teamlead', this.value)"></td>
                    <td><input type="number" class="form-control form-control-sm weightage-cell-input" min="0" max="100" value="${d.manager}" oninput="draftWeightageField('manager', this.value)"></td>
                    <td><input type="number" class="form-control form-control-sm weightage-cell-input" min="0" max="100" value="${d.admin}" oninput="draftWeightageField('admin', this.value)"></td>
                    <td><span class="badge ${t === 100 ? 'badge-success' : 'badge-danger'}" id="inline-total-badge">${t}%</span></td>
                    <td class="action-buttons">
                      <button class="btn btn-primary btn-sm" onclick="saveWeightageRow(${e.id})">Save</button>
                      <button class="btn btn-secondary btn-sm" onclick="cancelWeightageEdit()">Cancel</button>
                    </td>
                  </tr>`;
                }
                return `<tr>
                  <td><strong>${e.name}</strong><br><small class="muted">${e.designation} · ${e.dept}</small></td>
                  <td>${e.teamlead}%</td><td>${e.manager}%</td><td>${e.admin}%</td>
                  <td><span class="badge ${t === 100 ? 'badge-success' : 'badge-danger'}">${t}%</span></td>
                  <td class="action-buttons"><button class="btn btn-link btn-sm" onclick="startWeightageEdit(${e.id})">Edit</button></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderEmployees() {
  const isHr = currentRole === 'hr';
  const isAdmin = currentRole === 'admin';
  const canCrud = isAdmin || isHr;
  // HR opens the profile too now — that's where Employee Documents lives (Admin/HR only).
  const canOpenCycles = isAdmin || isHr || currentRole === 'manager' || currentRole === 'teamlead';

  return `
    <div class="search-bar">
      <input class="form-control" placeholder="Search employees...">
      <select class="form-control" style="max-width:160px"><option>All Departments</option>${DEPARTMENTS.map(d => `<option>${d.name}</option>`).join('')}</select>
      ${canCrud ? `<button class="btn btn-primary" onclick="openEmployeeModal('add')">+ Add Employee</button>` : ''}
    </div>
    ${canOpenCycles ? `<p class="muted" style="margin-bottom:1rem">Click a row to view details, or use the <strong>⋮</strong> menu for quick actions.</p>` : ''}
    <div class="card"><div class="card-body table-wrap">
      <table>
        <thead><tr><th>Employee</th><th>Department</th><th>Designation</th>${!isHr ? '<th>Manager</th>' : ''}<th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${EMPLOYEES.map(e => {
            const menuId = `emp-kebab-${e.id}`;
            return `
            <tr ${canOpenCycles ? `style="cursor:pointer" onclick="openEmployeeCycles(${e.id})"` : ''}>
              <td><strong>${empName(e)}</strong><br><small class="muted">${e.email}</small></td>
              <td>${e.dept}</td><td>${e.designation}</td>
              ${!isHr ? `<td>${e.manager}</td>` : ''}
              <td>${statusSelect(e.status, ['Pending Review', 'Self Assessment Done', 'In Progress', 'Complete', 'Cancelled'], `updateEmpStatus(${e.id}, this)`)}</td>
              <td onclick="event.stopPropagation()">
                <div class="kebab-wrap">
                  <button class="kebab-btn" onclick="toggleKebabMenu(event, '${menuId}')" title="More actions">⋮</button>
                  <div class="kebab-menu" id="${menuId}">
                    ${canOpenCycles ? `<div class="kebab-menu-item" onclick="closeAllKebabMenus();openEmployeeCycles(${e.id})">👤 View Details</div>` : ''}
                    ${canOpenCycles && canCrud ? `<div class="kebab-menu-divider"></div>` : ''}
                    ${canCrud ? `<div class="kebab-menu-item" onclick="closeAllKebabMenus();openEmployeeModal('edit', ${e.id})">✎ Edit</div>` : ''}
                    ${canCrud ? `<div class="kebab-menu-item danger" onclick="closeAllKebabMenus();deleteEmployee(${e.id})">🗑 Delete</div>` : ''}
                  </div>
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div></div>
  `;
}

/** Single, contextual primary action per review cycle row — replaces the
    previous 4-option kebab (View Goals / Assign Goals / Review / View Score)
    with one clear next-step action. Housekeeping (Edit/Delete Cycle) lives
    in a small separate kebab next to it. */
function getCyclePrimaryAction(c, canAssign, canReview) {
  const count = getCycleGoals(c.id).length;
  const pct = computeCycleFinalPct(c);
  if (pct != null) {
    return { label: '🏆 View Score', cls: 'btn-outline', onclick: `selectedCycleId=${c.id};navigateTo('score')` };
  }
  if (count && canReview) {
    return { label: '✓ Review', cls: 'btn-success', onclick: `selectedCycleId=${c.id};openReviewFromGoals()` };
  }
  if (!count && canAssign) {
    return { label: '🎯 Assign Goals', cls: 'btn-primary', onclick: `selectedCycleId=${c.id};openAssignLibraryGoalsModal()` };
  }
  return { label: '📋 View Goals', cls: 'btn-outline', onclick: `openCycleGoals(${c.id})` };
}

/* Employee Profile hub: Details → Goals/Review history for the employee.
   Back-navigation is handled by the breadcrumb (Home / Employees / Name). */
function renderReviewCycles() {
  const emp = getSelectedEmployee();
  if (!emp) {
    return `<div class="empty-state"><div class="icon">👥</div><p>Select an employee first.</p>
      <button class="btn btn-primary" style="margin-top:1rem" onclick="navigateTo('employees')">Back to Employees</button></div>`;
  }

  const canAssign = ['admin', 'manager', 'teamlead'].includes(currentRole);
  const canReview = ['admin', 'manager', 'teamlead'].includes(currentRole);

  const cycles = REVIEW_CYCLES.filter(c => c.employeeId === emp.id);

  // Shown once, right after "+ Add Employee", to nudge Admin/HR into uploading onboarding
  // paperwork before they leave the profile. Consumed (cleared) after this render.
  const showOnboardingPrompt = justAddedEmployeeId === emp.id;
  if (showOnboardingPrompt) justAddedEmployeeId = null;

  return `
    <div class="card profile-card">
      <div class="card-body">
        <div class="profile-header">
          <div class="profile-avatar">${(emp.firstName[0] || '').toUpperCase()}${(emp.lastName[0] || '').toUpperCase()}</div>
          <div class="profile-name-block">
            <h2>${empName(emp)}</h2>
            <div class="muted">${emp.designation} · ${emp.dept}</div>
            <div class="goal-meta" style="margin-top:.6rem">
              ${statusSelect(emp.status, ['Pending Review', 'Self Assessment Done', 'In Progress', 'Complete', 'Cancelled'], `updateEmpStatus(${emp.id}, this)`)}
              <span class="badge badge-gray">ID: EMP-${String(emp.id).padStart(4, '0')}</span>
              <span class="badge badge-primary">${emp.role}</span>
            </div>
          </div>
        </div>
        <div class="profile-details-grid">
          <div><span class="muted">Email</span><div>${emp.email}</div></div>
          <div><span class="muted">Manager</span><div>${emp.manager}</div></div>
          <div><span class="muted">Team Lead</span><div>${emp.teamLead}</div></div>
          <div><span class="muted">Department</span><div>${emp.dept}</div></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>Goals &amp; Review History (Quarterly)</h3>
        <button class="btn btn-primary btn-sm" onclick="openCycleModal('add')">+ Add Cycle</button>
      </div>
      <div class="card-body table-wrap">
        <table>
          <thead><tr><th>Quarter</th><th>Period</th><th>Goals</th><th>Final Score</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${cycles.length ? cycles.map(c => {
              const count = getCycleGoals(c.id).length;
              const pct = computeCycleFinalPct(c);
              const menuId = `cycle-kebab-${c.id}`;
              const action = getCyclePrimaryAction(c, canAssign, canReview);
              return `
              <tr style="cursor:pointer" onclick="openCycleGoals(${c.id})">
                <td><strong>${c.quarter}</strong></td>
                <td>${c.period}</td>
                <td>${count} goals</td>
                <td>${pct != null ? `<strong>${pct}%</strong>` : '<span class="muted">—</span>'}</td>
                <td>${statusSelect(c.status, ['Draft', 'In Progress', 'Pending Review', 'Complete', 'Cancelled'], `updateCycleStatus(${c.id}, this)`)}</td>
                <td class="action-buttons" onclick="event.stopPropagation()">
                  <button class="btn ${action.cls} btn-sm" onclick="${action.onclick}">${action.label}</button>
                  <div class="kebab-wrap">
                    <button class="kebab-btn" onclick="toggleKebabMenu(event, '${menuId}')" title="More actions">⋮</button>
                    <div class="kebab-menu" id="${menuId}">
                      <div class="kebab-menu-item" onclick="closeAllKebabMenus();openCycleModal('edit', ${c.id})">✎ Edit Cycle</div>
                      <div class="kebab-menu-item danger" onclick="closeAllKebabMenus();deleteCycle(${c.id})">🗑 Delete Cycle</div>
                    </div>
                  </div>
                </td>
              </tr>`;
            }).join('') : `<tr><td colspan="6" class="muted" style="text-align:center;padding:2rem">No review cycles yet. Add one to get started.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>

    ${renderEmployeeDocumentsSection(emp, showOnboardingPrompt)}
  `;
}

/* ==================== EMPLOYEE DOCUMENTS ====================
   Admin and HR only — mirrors the API's EmployeeDocumentController, which gates every
   action (including GET) behind the Employee.Manage policy. Manager/TeamLead reach this
   profile page for goals, but never see this card at all. */
function renderEmployeeDocumentsSection(emp, showOnboardingPrompt) {
  const canManageDocs = currentRole === 'admin' || currentRole === 'hr';
  if (!canManageDocs) return '';

  const docs = EMPLOYEE_DOCUMENTS.filter(d => d.employeeId === emp.id);
  const uploadedTypes = new Set(docs.map(d => d.docType));
  const mandatoryTypes = DOCUMENT_TYPES.filter(t => t.mandatory).map(t => t.name);
  const missingMandatory = mandatoryTypes.filter(t => !uploadedTypes.has(t));
  const mandatoryDone = mandatoryTypes.length - missingMandatory.length;

  const feedback = lastDocFeedback && lastDocFeedback.employeeId === emp.id ? lastDocFeedback.message : null;
  if (feedback) lastDocFeedback = null;

  return `
    ${showOnboardingPrompt ? `
      <div class="callout callout-info">
        <strong>✅ ${empName(emp)} added.</strong> Upload their onboarding documents below — this step is optional and can be done any time from this profile.
        ${missingMandatory.length ? `Still missing: <strong>${missingMandatory.join(', ')}</strong>.` : ''}
      </div>
    ` : ''}
    ${feedback ? `<div class="callout callout-info">✅ ${feedback}</div>` : ''}
    <div class="card">
      <div class="card-header">
        <h3>Documents <span class="badge badge-gray" style="margin-left:.4rem">Admin/HR only</span></h3>
        <div style="display:flex;align-items:center;gap:.6rem">
          <span class="badge ${mandatoryDone === mandatoryTypes.length ? 'badge-success' : 'badge-warning'}" title="Mandatory: ${mandatoryTypes.join(', ')}">${mandatoryDone}/${mandatoryTypes.length} mandatory</span>
          <button class="btn btn-primary btn-sm" onclick="openDocumentModal('add', ${emp.id})">+ Upload Document</button>
        </div>
      </div>
      <div class="card-body table-wrap">
        <table>
          <thead><tr><th>Document Type</th><th>File</th><th>Size</th><th>Versions</th><th>Uploaded By</th><th>Uploaded</th><th>Actions</th></tr></thead>
          <tbody>
            ${docs.length ? docs.map(d => {
              const menuId = `doc-kebab-${d.id}`;
              const isMandatory = DOCUMENT_TYPES.find(t => t.name === d.docType)?.mandatory;
              // Version History is Admin-only in the real app (isAdmin(user)) — HR manages
              // documents but doesn't see the who-replaced-what audit trail.
              const canViewHistory = currentRole === 'admin';
              return `
              <tr>
                <td><span class="badge badge-primary">${d.docType}</span>${isMandatory ? ' <span class="badge badge-gray">Required</span>' : ''}</td>
                <td>${d.fileName}${d.description ? `<br><small class="muted">${d.description}</small>` : ''}</td>
                <td>${formatFileSize(d.sizeKb)}</td>
                <td>${canViewHistory && d.versionCount > 1 ? `<a href="#" onclick="event.preventDefault();openDocumentHistory(${d.id})">${d.versionCount} (view)</a>` : d.versionCount}</td>
                <td>${d.uploadedBy}</td>
                <td>${d.uploadedDate}</td>
                <td class="action-buttons">
                  <button class="btn btn-outline btn-sm" onclick="previewDocument(${d.id})">👁 Preview</button>
                  <button class="btn btn-outline btn-sm" onclick="downloadDocument(${d.id})">⬇ Download</button>
                  <div class="kebab-wrap">
                    <button class="kebab-btn" onclick="toggleKebabMenu(event, '${menuId}')" title="More actions">⋮</button>
                    <div class="kebab-menu" id="${menuId}">
                      <div class="kebab-menu-item" onclick="closeAllKebabMenus();openDocumentModal('replace', ${emp.id}, ${d.id})">⭯ Replace File</div>
                      ${canViewHistory ? `<div class="kebab-menu-item" onclick="closeAllKebabMenus();openDocumentHistory(${d.id})">🕘 Version History</div>` : ''}
                      <div class="kebab-menu-divider"></div>
                      <div class="kebab-menu-item danger" onclick="closeAllKebabMenus();deleteDocument(${emp.id}, ${d.id})">🗑 Delete</div>
                    </div>
                  </div>
                </td>
              </tr>`;
            }).join('') : `<tr><td colspan="7" class="muted" style="text-align:center;padding:2rem">No documents uploaded yet.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function formatFileSize(kb) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

function docExt(fileName) {
  const parts = (fileName || '').split('.');
  return parts.length > 1 ? '.' + parts.pop().toLowerCase() : '';
}

function openDocumentModal(mode, employeeId, docId = null) {
  const emp = EMPLOYEES.find(x => x.id === employeeId);
  if (!emp) return;
  const isReplace = mode === 'replace';
  const doc = isReplace ? EMPLOYEE_DOCUMENTS.find(x => x.id === docId) : null;

  showModal(`
    <div class="modal-header">
      <h3>${isReplace ? 'Replace File — ' + doc.docType : 'Upload Document'} · ${empName(emp)}</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      ${!isReplace ? `
        <div class="form-group"><label>Document Type</label>
          <select class="form-control" id="docType">
            ${DOCUMENT_TYPES.map(t => `<option>${t.name}${t.mandatory ? ' (Required)' : ''}</option>`).join('')}
          </select>
        </div>
      ` : `<p class="muted" style="margin-bottom:1rem">Uploading a new file keeps the previous version in history (currently v${doc.versionCount}).</p>`}
      <div class="form-group">
        <label>File</label>
        <input class="form-control" type="file" id="docFile" accept="${DOC_ALLOWED_EXTENSIONS.join(',')}" onchange="handleDocFileSelected(this)">
        <div class="muted" style="margin-top:.35rem">PDF, JPG or PNG · up to ${DOC_MAX_SIZE_MB} MB</div>
        <div class="doc-file-preview" id="docFilePreview"></div>
      </div>
      ${!isReplace ? `<div class="form-group"><label>Description (optional)</label><input class="form-control" id="docDescription" placeholder="e.g. Passport, valid till 2030"></div>` : ''}
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" id="docSaveBtn" onclick="saveDocument('${mode}', ${employeeId}, ${docId || 'null'})">${isReplace ? 'Replace' : 'Upload'}</button>
    </div>
  `);
}

/* Pre-upload preview: validates against the same rules as the API (size + extension) and,
   for images, renders an actual thumbnail from the local file via FileReader — no upload
   has happened yet, this all runs client-side against the picked File object. */
function handleDocFileSelected(input) {
  const preview = document.getElementById('docFilePreview');
  const saveBtn = document.getElementById('docSaveBtn');
  const file = input.files[0];

  if (!file) {
    preview.style.display = 'none';
    preview.innerHTML = '';
    saveBtn.disabled = false;
    return;
  }

  const ext = docExt(file.name);
  const sizeMb = file.size / (1024 * 1024);
  const errors = [];
  if (!DOC_ALLOWED_EXTENSIONS.includes(ext)) errors.push(`"${ext || 'unknown'}" isn't allowed — use PDF, JPG or PNG.`);
  if (sizeMb > DOC_MAX_SIZE_MB) errors.push(`File is ${sizeMb.toFixed(1)} MB — max is ${DOC_MAX_SIZE_MB} MB.`);

  const isImage = ['.jpg', '.jpeg', '.png'].includes(ext);
  preview.style.display = 'flex';
  preview.innerHTML = `
    <button type="button" class="doc-preview-clear" onclick="clearDocFile()" aria-label="Remove selected file" title="Remove selected file">✕</button>
    ${isImage ? `<img class="doc-preview-thumb" id="docPreviewThumb" alt="">` : `<div class="doc-preview-icon">${ext === '.pdf' ? '📄' : '📁'}</div>`}
    <div class="doc-preview-info">
      <div class="doc-preview-name">${file.name}</div>
      <div class="muted">${formatFileSize(Math.max(1, Math.round(file.size / 1024)))}</div>
      ${errors.length
        ? `<div class="doc-preview-error">⚠ ${errors.join(' ')}</div>`
        : `<a href="#" class="doc-preview-link" onclick="event.preventDefault();window.open(URL.createObjectURL(document.getElementById('docFile').files[0]), '_blank')">🔍 Open full preview ↗</a>`}
    </div>
  `;

  if (isImage && !errors.length) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.getElementById('docPreviewThumb');
      if (img) img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  saveBtn.disabled = errors.length > 0;
}

/* The ✕ on the preview panel — clears the picked file without closing the modal. */
function clearDocFile() {
  const fileInput = document.getElementById('docFile');
  const preview = document.getElementById('docFilePreview');
  const saveBtn = document.getElementById('docSaveBtn');
  if (fileInput) fileInput.value = '';
  if (preview) { preview.style.display = 'none'; preview.innerHTML = ''; }
  if (saveBtn) saveBtn.disabled = false;
}

function saveDocument(mode, employeeId, docId) {
  const fileInput = document.getElementById('docFile');
  const file = fileInput.files[0];
  if (!file) { alert('Choose a file to upload.'); return; }

  const ext = docExt(file.name);
  const sizeMb = file.size / (1024 * 1024);
  if (!DOC_ALLOWED_EXTENSIONS.includes(ext)) { alert(`"${ext || 'unknown'}" files aren't allowed — use PDF, JPG or PNG.`); return; }
  if (sizeMb > DOC_MAX_SIZE_MB) { alert(`File is too large — max ${DOC_MAX_SIZE_MB} MB.`); return; }

  const sizeKb = Math.max(1, Math.round(file.size / 1024));
  // A real, working blob: URL for the file just picked — lets Preview show the actual
  // file for the rest of this session, same as the pre-upload preview above did.
  const previewUrl = URL.createObjectURL(file);
  const today = new Date().toISOString().slice(0, 10);

  if (mode === 'add') {
    const docType = document.getElementById('docType').value.replace(' (Required)', '');
    const description = document.getElementById('docDescription').value.trim();
    EMPLOYEE_DOCUMENTS.push({
      id: nextId.doc++, employeeId, docType, fileName: file.name, sizeKb, description, previewUrl,
      versionCount: 1, uploadedBy: ROLES[currentRole].user, uploadedDate: today, history: []
    });
    lastDocFeedback = { employeeId, message: `"${file.name}" uploaded as ${docType}.` };
  } else {
    const d = EMPLOYEE_DOCUMENTS.find(x => x.id === docId);
    if (d) {
      if (d.previewUrl) URL.revokeObjectURL(d.previewUrl);
      d.history.unshift({ versionNumber: d.versionCount, fileName: d.fileName, sizeKb: d.sizeKb, replacedBy: d.uploadedBy, replacedOn: d.uploadedDate });
      Object.assign(d, { fileName: file.name, sizeKb, previewUrl, versionCount: d.versionCount + 1, uploadedBy: ROLES[currentRole].user, uploadedDate: today });
      lastDocFeedback = { employeeId, message: `"${file.name}" replaced ${d.docType} (now v${d.versionCount}).` };
    }
  }
  closeModal();
  navigateTo('review-cycles');
}

function deleteDocument(employeeId, docId) {
  const d = EMPLOYEE_DOCUMENTS.find(x => x.id === docId);
  if (!d) return;
  if (!confirmDelete(`Delete "${d.fileName}" (${d.docType})? This removes all its versions.`)) return;
  if (d.previewUrl) URL.revokeObjectURL(d.previewUrl);
  EMPLOYEE_DOCUMENTS = EMPLOYEE_DOCUMENTS.filter(x => x.id !== docId);
  lastDocFeedback = { employeeId, message: `"${d.fileName}" deleted.` };
  navigateTo('review-cycles');
}

function downloadDocument(docId) {
  const d = EMPLOYEE_DOCUMENTS.find(x => x.id === docId);
  if (!d) return;
  if (d.previewUrl) {
    const a = document.createElement('a');
    a.href = d.previewUrl;
    a.download = d.fileName;
    a.click();
  } else {
    alert(`Downloading "${d.fileName}" (mock — this demo-seeded row has no real bytes behind it).`);
  }
}

/* Post-upload preview: images/PDFs uploaded this session render inline from their real
   blob: URL: seeded demo rows (no bytes behind them) fall back to an explanatory note. */
/* Demo-seeded documents (John Doe's Offer Letter, etc.) have no real file behind them —
   there was never an actual upload. Rather than dead-ending Preview with a "not available"
   message, generate a one-time placeholder page on a <canvas> so Preview always shows
   *something*, clearly labeled as a mock so nobody mistakes it for the real file. Cached
   per document so re-opening Preview doesn't regenerate it. */
const mockPreviewCache = {};

function buildMockPreviewUrl(doc) {
  if (mockPreviewCache[doc.id]) return Promise.resolve(mockPreviewCache[doc.id]);

  const canvas = document.createElement('canvas');
  canvas.width = 700;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#e9e4f0';
  ctx.lineWidth = 3;
  ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

  ctx.fillStyle = '#6b46c1';
  ctx.fillRect(0, 0, canvas.width, 120);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px Arial';
  ctx.fillText(doc.docType, 40, 60);
  ctx.font = '15px Arial';
  ctx.fillText('MOCK PREVIEW — generated placeholder, not the real file', 40, 92);

  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 18px Arial';
  ctx.fillText(doc.fileName, 40, 165);
  ctx.fillStyle = '#6b7280';
  ctx.font = '13px Arial';
  ctx.fillText(`Uploaded by ${doc.uploadedBy} · ${doc.uploadedDate}`, 40, 188);

  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 2;
  for (let i = 0; i < 16; i++) {
    const y = 230 + i * 38;
    const shortLine = i % 4 === 3;
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(shortLine ? 380 : 660, y);
    ctx.stroke();
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      mockPreviewCache[doc.id] = url;
      resolve(url);
    }, 'image/png');
  });
}

async function previewDocument(docId) {
  const d = EMPLOYEE_DOCUMENTS.find(x => x.id === docId);
  if (!d) return;
  const ext = docExt(d.fileName);
  const isImage = ['.jpg', '.jpeg', '.png'].includes(ext);
  const isPdf = ext === '.pdf';
  const isMock = !d.previewUrl;

  showModal(`
    <div class="modal-header"><h3>Preview · ${d.fileName}</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body" id="previewModalBody">
      <div class="empty-state" style="padding:2rem"><div class="icon">⏳</div><p>Loading preview…</p></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="downloadDocument(${d.id})">⬇ Download</button>
    </div>
  `);
  document.getElementById('modalContent').classList.add('modal-wide');

  const url = isMock ? await buildMockPreviewUrl(d) : d.previewUrl;
  const body = document.getElementById('previewModalBody');
  if (!body) return; // modal was closed while the placeholder was generating

  if (isMock) {
    body.innerHTML = `
      <img class="doc-lightbox-img" src="${url}" alt="${d.fileName}">
      <p class="muted" style="text-align:center;margin-top:.75rem">🧪 This is a generated placeholder — this demo-seeded document has no real file behind it. Upload or Replace it with a real file to preview the actual content.</p>
    `;
  } else if (isImage) {
    body.innerHTML = `<img class="doc-lightbox-img" src="${url}" alt="${d.fileName}">`;
  } else if (isPdf) {
    body.innerHTML = `<iframe class="doc-lightbox-frame" src="${url}"></iframe>`;
  } else {
    body.innerHTML = `<div class="empty-state" style="padding:2rem"><div class="icon">📄</div><p>No inline preview for this file type.</p></div>`;
  }
}

function openDocumentHistory(docId) {
  const d = EMPLOYEE_DOCUMENTS.find(x => x.id === docId);
  if (!d) return;
  const rows = [
    { versionNumber: d.versionCount, fileName: d.fileName, sizeKb: d.sizeKb, replacedBy: d.uploadedBy, replacedOn: d.uploadedDate, current: true },
    ...d.history
  ];
  showModal(`
    <div class="modal-header"><h3>Version History · ${d.docType}</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body table-wrap">
      <table>
        <thead><tr><th>Version</th><th>File</th><th>Size</th><th>By</th><th>Date</th></tr></thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td>v${r.versionNumber}${r.current ? ' <span class="badge badge-success">Current</span>' : ''}</td>
              <td>${r.fileName}</td>
              <td>${formatFileSize(r.sizeKb)}</td>
              <td>${r.replacedBy}</td>
              <td>${r.replacedOn}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Close</button></div>
  `);
}

/* Review Cycle → Goals List for that quarter */
function renderEmployeeGoals() {
  const emp = getSelectedEmployee();
  const cycle = getSelectedCycle();
  if (!emp || !cycle) {
    return `<div class="empty-state"><div class="icon">📅</div><p>Select an employee and review cycle first.</p>
      <button class="btn btn-primary" style="margin-top:1rem" onclick="navigateTo('employees')">Back to Employees</button></div>`;
  }

  const goals = getCycleGoals(cycle.id);
  const canCustom = ['admin', 'manager'].includes(currentRole);
  const canReview = ['admin', 'manager', 'teamlead'].includes(currentRole);

  const rows = goals.map(g => `
    <tr>
      <td><strong>${g.title}</strong>
        ${g.type === 'Custom' ? ' <span class="badge badge-success">Custom</span>' : ' <span class="badge badge-gray">Library</span>'}
      </td>
      <td>${cycle.quarter}<br><small class="muted">${cycle.period}</small></td>
      <td style="max-width:220px">${g.description || '—'}</td>
      <td>${g.kpi || '—'}</td>
      <td>${statusSelect(g.status, ['Not Assessed', 'Assessed', 'Reviewed', 'Complete'], `updateAssignedGoalStatus(${g.id}, this)`)}</td>
      <td><strong>${g.maxScore}</strong></td>
      <td class="action-buttons">
        <button class="btn btn-danger btn-sm" onclick="deleteAssignedGoal(${g.id})">Delete</button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="search-bar" style="align-items:center">
      <button class="btn btn-outline btn-sm" onclick="openEmployeeCycles(${emp.id})">← Review Cycles</button>
      <div style="flex:1">
        <strong>${empName(emp)}</strong>
        <span class="muted"> · ${emp.designation} · ${emp.dept} · ${cycle.quarter}</span>
      </div>
      <button class="btn btn-primary" onclick="openAssignLibraryGoalsModal()">+ Assign Goals</button>
      ${canCustom ? `<button class="btn btn-outline" onclick="openCustomGoalModal()">+ Create Custom Goal</button>` : ''}
      ${canReview && goals.length ? `<button class="btn btn-success" onclick="openReviewFromGoals()">Review</button>` : ''}
    </div>

    <div class="card">
      <div class="card-header">
        <h3>Goals List — ${cycle.quarter}</h3>
        <span class="badge badge-primary">${goals.length} Goals</span>
      </div>
      <div class="card-body table-wrap">
        <table>
          <thead>
            <tr>
              <th>Goal Name</th>
              <th>Quarter Cycle</th>
              <th>Description</th>
              <th>KPIs</th>
              <th>Status</th>
              <th>Max Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows || `<tr><td colspan="7" class="muted" style="text-align:center;padding:2rem">
              No goals for this quarter yet. Use <strong>Assign Goals</strong> (from Goals library) or <strong>Create Custom Goal</strong>.
            </td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAssignGoals() {
  const rows = REVIEW_CYCLES.filter(c => c.goalsCount > 0).map(c => {
    const emp = EMPLOYEES.find(e => e.id === c.employeeId);
    if (!emp) return '';
    const goals = getCycleGoals(c.id);
    const scopes = [...new Set(goals.map(g => g.scope))];
    return `
      <tr>
        <td>${empName(emp)}</td>
        <td>${emp.dept}</td>
        <td>${goals.length} goals</td>
        <td>${scopes.map(s => `<span class="badge badge-gray">${s}</span>`).join(' ')}</td>
        <td>${c.quarter}</td>
        <td class="action-buttons">
          <button class="btn btn-outline btn-sm" onclick="openCycleGoals(${c.id})">View Goals</button>
          <button class="btn btn-primary btn-sm" onclick="openEmployeeCycles(${emp.id})">Profile</button>
        </td>
      </tr>`;
  }).join('');

  return `
    <div class="search-bar">
      <select class="form-control" style="max-width:200px"><option>Q1 2026 (Jan–Mar)</option><option>Q2 2026</option></select>
      <p class="muted" style="flex:1;margin:0">Open an employee → review cycle → quarter to assign goals for that cycle.</p>
      <button class="btn btn-primary" onclick="navigateTo('employees')">Go to Employees</button>
    </div>
    <div class="card">
      <div class="card-header"><h3>Goal Assignments</h3></div>
      <div class="card-body table-wrap">
        <table>
          <thead><tr><th>Employee</th><th>Department</th><th>Goals Assigned</th><th>Scope Mix</th><th>Cycle</th><th>Actions</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="6" class="muted" style="text-align:center;padding:2rem">No assignments yet.</td></tr>'}</tbody>
        </table>
      </div>
    </div>
  `;
}

function clearCycleGoals(cycleId) {
  if (!confirmDelete('Remove all goals from this review cycle?')) return;
  ASSIGNED_GOALS = ASSIGNED_GOALS.filter(g => g.cycleId !== cycleId);
  refreshCycleGoalCount(cycleId);
  navigateTo('employee-goals');
}

function renderMyGoals() {
  const showStepper = ['employee', 'hr', 'manager', 'teamlead'].includes(currentRole);
  const userName = ROLES[currentRole].user;
  return `
    ${showStepper ? workflowBar(0) : ''}
    <div class="card" style="border-left:4px solid var(--primary)">
      <div class="card-header"><h3>Assigned Goals — Q1 2026</h3><span class="badge badge-primary">5 Goals · ${userName}</span></div>
      <div class="card-body">
        <div class="goal-card">
          <div class="goal-card-header"><h4>1. Deliver projects on time</h4><span class="badge badge-gray">Org-wide · Standard</span></div>
          <div class="goal-description">Complete assigned sprint tasks within deadlines. Target: 95% on-time delivery rate.</div>
          <div class="goal-meta"><span class="badge badge-gray">Max: 100</span><span class="badge badge-warning">Not Assessed</span></div>
        </div>
        <div class="goal-card">
          <div class="goal-card-header"><h4>2. Team collaboration</h4><span class="badge badge-gray">Org-wide · Standard</span></div>
          <div class="goal-description">Active participation in standups, retrospectives, and knowledge sharing sessions.</div>
          <div class="goal-meta"><span class="badge badge-gray">Max: 200</span></div>
        </div>
        <div class="goal-card">
          <div class="goal-card-header"><h4>3. Code quality &amp; peer reviews</h4><span class="badge badge-primary">.NET · Standard</span></div>
          <div class="goal-description">Participate in code reviews and maintain quality standards.</div>
          <div class="goal-meta"><span class="badge badge-gray">Max: 100</span></div>
        </div>
        <div class="goal-card">
          <div class="goal-card-header"><h4>4. .NET sprint velocity</h4><span class="badge badge-primary">.NET · Standard</span></div>
          <div class="goal-description">Meet agreed story-point targets each sprint.</div>
          <div class="goal-meta"><span class="badge badge-gray">Max: 100</span></div>
        </div>
        <div class="goal-card">
          <div class="goal-card-header"><h4>5. Learn new technology stack</h4><span class="badge badge-success">Employee custom</span></div>
          <div class="goal-description">Complete React Advanced certification and apply in project work.</div>
          <div class="goal-meta"><span class="badge badge-gray">Max: 100</span></div>
        </div>
        <button class="btn btn-primary btn-block" onclick="navigateTo('self-assessment')">Proceed to Self Assessment →</button>
      </div>
    </div>
  `;
}

function renderSelfAssessment() {
  const goals = [
    ['Deliver projects on time', 100, 85, 'Completed 94% of sprint tasks on time.'],
    ['Team collaboration', 200, 160, 'Led 2 knowledge sharing sessions.'],
    ['Code quality & peer reviews', 100, 90, 'Reviewed 15 PRs this quarter.'],
    ['.NET sprint velocity', 100, 88, 'Met story-point targets in 5 of 6 sprints.'],
    ['Learn new technology stack', 100, 80, 'Completed React certification.']
  ];
  return `
    ${workflowBar(1)}
    <div class="card">
      <div class="card-header"><h3>Self Assessment — Q1 2026</h3><span class="badge badge-warning">Draft</span></div>
      <div class="card-body">
        ${goals.map(([title, max, score, comment], i) => `
          <div class="goal-card">
            <div class="goal-card-header"><h4>${i + 1}. ${title}</h4><span class="badge badge-primary">Max: ${max}</span></div>
            <div class="form-group"><label>Your Score (0 – ${max})</label>
              <input class="form-control" type="number" min="0" max="${max}" value="${score}" style="max-width:160px">
            </div>
            <div class="form-group"><label>Comments / Evidence</label><textarea class="form-control" rows="2">${comment}</textarea></div>
          </div>
        `).join('')}
        <div style="display:flex;gap:.75rem;justify-content:flex-end">
          <button class="btn btn-secondary" onclick="alert('Draft saved.')">Save Draft</button>
          <button class="btn btn-primary" onclick="alert('Self assessment submitted!');navigateTo('dashboard')">Submit Assessment</button>
        </div>
      </div>
    </div>
  `;
}

function reviewRoleKey() {
  return currentRole === 'teamlead' ? 'teamlead' : currentRole;
}

function reviewScoreField(role) {
  if (role === 'employee' || role === 'self') return 'selfScore';
  if (role === 'teamlead') return 'tlScore';
  if (role === 'manager') return 'managerScore';
  if (role === 'admin') return 'adminScore';
  return null;
}

function reviewRemarkField(role) {
  if (role === 'employee' || role === 'self') return 'selfRemark';
  if (role === 'teamlead') return 'tlRemark';
  if (role === 'manager') return 'managerRemark';
  if (role === 'admin') return 'adminRemark';
  return null;
}

/** Read-only or editable score/remark block for a role */
function roleReviewPanel(g, roleKey, label, color, editable) {
  const scoreKey = reviewScoreField(roleKey);
  const remarkKey = reviewRemarkField(roleKey);
  const score = g[scoreKey];
  const remark = g[remarkKey] || '';
  const hasValue = score != null && score !== '';

  if (editable) {
    const suggested = hasValue ? score : (g.selfScore != null ? Math.round(g.selfScore * 0.95) : 0);
    return `
      <div class="review-role-panel editable" style="border-left:3px solid ${color};padding:.75rem 1rem;background:#f8fafc;border-radius:6px;margin-top:.75rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem">
          <strong style="color:${color}">${label} Review (your input)</strong>
          <span class="badge badge-primary">Editable</span>
        </div>
        <div class="form-group" style="margin-bottom:.5rem">
          <label>Score (0 – ${g.maxScore})</label>
          <input class="form-control review-score-input" data-goal-id="${g.id}" data-role="${roleKey}"
            type="number" min="0" max="${g.maxScore}" value="${suggested}" style="max-width:160px">
        </div>
        <div class="form-group" style="margin-bottom:0">
          <label>Remarks</label>
          <textarea class="form-control review-remark-input" data-goal-id="${g.id}" data-role="${roleKey}" rows="2" placeholder="Add your remarks...">${remark}</textarea>
        </div>
      </div>`;
  }

  return `
    <div class="review-role-panel" style="border-left:3px solid ${color};padding:.75rem 1rem;background:#fff;border:1px solid var(--gray-200);border-left-width:3px;border-radius:6px;margin-top:.75rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.35rem">
        <strong style="color:${color}">${label}</strong>
        <span class="badge badge-gray">View only</span>
      </div>
      <div style="display:flex;gap:1.5rem;flex-wrap:wrap;font-size:.9rem">
        <div><span class="muted">Score:</span> <strong>${hasValue ? `${score} / ${g.maxScore}` : 'Not submitted'}</strong></div>
      </div>
      <div style="margin-top:.5rem;font-size:.85rem">
        <span class="muted">Remarks:</span>
        <div style="margin-top:.25rem;color:var(--gray-700)">${hasValue ? (remark || '—') : '—'}</div>
      </div>
    </div>`;
}

function renderReview() {
  if (!roleCanAccess('review')) {
    return `<div class="empty-state"><div class="icon">🔒</div><p>You don't have access to review goals.</p></div>`;
  }

  const reviewerKey = reviewRoleKey();
  const weight = WEIGHTAGE[reviewerKey] || 0;
  const reviewerRole = ROLES[currentRole].name;
  const emp = getSelectedEmployee();
  const cycle = getSelectedCycle();

  if (weight <= 0) {
    return `
      <div class="empty-state">
        <div class="icon">⚖️</div>
        <h3>${reviewerRole} review is disabled</h3>
        <p>Weightage for ${reviewerRole} is <strong>0%</strong>.</p>
        ${currentRole === 'admin' ? '<button class="btn btn-primary" style="margin-top:1rem" onclick="navigateTo(\'weightage\')">Open Weightage Config</button>' : ''}
      </div>`;
  }

  if (!emp || !cycle) {
    return `<div class="empty-state"><div class="icon">👥</div>
      <p>Start from an employee → review cycle → goals list to open a review.</p>
      <button class="btn btn-primary" style="margin-top:1rem" onclick="navigateTo('employees')">Go to Employees</button></div>`;
  }

  const goals = getCycleGoals(cycle.id);
  const stepIndex = currentRole === 'teamlead' ? 2 : currentRole === 'manager' ? 3 : 4;
  const isAdmin = currentRole === 'admin';
  const isManager = currentRole === 'manager';
  const isTL = currentRole === 'teamlead';

  return `
    ${workflowBar(stepIndex)}
    <div class="search-bar" style="align-items:center">
      <button class="btn btn-outline btn-sm" onclick="openCycleGoals(${cycle.id})">← Goals List</button>
      <div style="flex:1"></div>
      <button class="btn btn-secondary btn-sm" onclick="saveReviewDraft()">Save Draft</button>
      <button class="btn btn-success" onclick="submitReview()">Submit ${reviewerRole} Review</button>
    </div>
    <div class="card" style="margin-bottom:1rem">
      <div class="card-body" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
        <div><strong>Reviewing:</strong> ${empName(emp)} · ${emp.designation} · ${emp.dept} · ${cycle.quarter}</div>
        <div>
          <span class="badge badge-success">Self Assessment submitted</span>
          · Your weightage: <strong>${weight}%</strong>
          ${isAdmin ? ' · <span class="muted">You can view all roles; edit Admin only</span>' : ''}
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>${reviewerRole} Review — Goal Scores</h3><span class="badge badge-primary">${goals.length} Goals</span></div>
      <div class="card-body">
        ${goals.length ? goals.map(g => `
          <div class="goal-card">
            <div class="goal-card-header">
              <h4>${g.title}</h4>
              <span class="badge badge-gray">Max: ${g.maxScore}</span>
              ${g.type === 'Custom' ? '<span class="badge badge-success">Custom</span>' : '<span class="badge badge-gray">Library</span>'}
            </div>
            <p class="muted" style="font-size:.85rem;margin-bottom:.25rem">${g.description || ''}</p>
            <p style="font-size:.85rem;margin-bottom:.5rem"><strong>KPI:</strong> ${g.kpi || '—'}</p>

            ${roleReviewPanel(g, 'self', 'Self Assessment', 'var(--primary)', false)}
            ${WEIGHTAGE.teamlead > 0 ? roleReviewPanel(g, 'teamlead', 'Team Lead', 'var(--warning)', isTL) : ''}
            ${WEIGHTAGE.manager > 0 ? roleReviewPanel(g, 'manager', 'Manager', 'var(--accent)', isManager) : ''}
            ${WEIGHTAGE.admin > 0 ? roleReviewPanel(g, 'admin', 'Admin', 'var(--purple)', isAdmin) : ''}
          </div>
        `).join('') : '<p class="muted">No goals to review for this cycle. Go back and assign goals first.</p>'}
        ${goals.length ? `
        <div style="display:flex;gap:.75rem;justify-content:flex-end;margin-top:1rem">
          <button class="btn btn-secondary" onclick="saveReviewDraft()">Save Draft</button>
          <button class="btn btn-success" onclick="submitReview()">Submit ${reviewerRole} Review</button>
        </div>` : ''}
      </div>
    </div>
  `;
}

function collectReviewInputs(markSubmitted) {
  const role = reviewRoleKey();
  const scoreKey = reviewScoreField(role);
  const remarkKey = reviewRemarkField(role);
  document.querySelectorAll('.review-score-input').forEach(input => {
    if (input.dataset.role !== role) return;
    const g = ASSIGNED_GOALS.find(x => x.id === Number(input.dataset.goalId));
    if (!g) return;
    g[scoreKey] = Number(input.value);
    if (markSubmitted) g.status = 'Reviewed';
  });
  document.querySelectorAll('.review-remark-input').forEach(input => {
    if (input.dataset.role !== role) return;
    const g = ASSIGNED_GOALS.find(x => x.id === Number(input.dataset.goalId));
    if (g) g[remarkKey] = input.value;
  });
}

function saveReviewDraft() {
  collectReviewInputs(false);
  alert('Draft saved.');
  navigateTo('review');
}

function submitReview() {
  collectReviewInputs(true);
  const cycle = getSelectedCycle();
  const emp = getSelectedEmployee();
  /* Mark cycle complete only when admin submits (final step) */
  if (currentRole === 'admin') {
    if (cycle) cycle.status = 'Complete';
    if (emp) emp.status = 'Complete';
    getCycleGoals(cycle.id).forEach(g => { g.status = 'Complete'; });
  } else if (cycle && cycle.status === 'Draft') {
    cycle.status = 'In Progress';
  }
  alert(`${ROLES[currentRole].name} review submitted successfully!`);
  navigateTo('score');
}

function renderScore() {
  const isOwnScore = currentRole === 'employee';
  const emp = getSelectedEmployee();
  const cycle = getSelectedCycle();
  const subjectName = isOwnScore ? ROLES.employee.user : (emp ? empName(emp) : 'John Doe');
  const quarter = cycle ? cycle.quarter : 'Q1 2026';
  const headerTitle = isOwnScore ? `My Final Score — ${quarter}` : `Final Score — ${subjectName} · ${quarter}`;

  const goals = cycle ? getCycleGoals(cycle.id) : [];

  /* Compute simple % from assigned goal scores when available */
  function avgPct(scoreKey) {
    const scored = goals.filter(g => g[scoreKey] != null && g.maxScore);
    if (!scored.length) return null;
    const sum = scored.reduce((a, g) => a + (g[scoreKey] / g.maxScore) * 100, 0);
    return +(sum / scored.length).toFixed(1);
  }
  const tlPct = avgPct('tlScore') ?? 78.0;
  const mgrPct = avgPct('managerScore') ?? 80.5;
  const adminPct = avgPct('adminScore') ?? 79.0;

  /* Employee self-score is informational only (see Goal-wise breakdown source
     data) and is never counted towards the final score. Team Lead / Manager /
     Admin weights are rebalanced proportionally so they total 100%. */
  const roleParts = [
    { role: 'Team Lead', pct: tlPct, weight: WEIGHTAGE.teamlead, color: 'var(--warning)' },
    { role: 'Manager', pct: mgrPct, weight: WEIGHTAGE.manager, color: 'var(--accent)' },
    { role: 'Admin', pct: adminPct, weight: WEIGHTAGE.admin, color: 'var(--purple)' }
  ].filter(p => p.weight > 0);
  const totalWeight = roleParts.reduce((a, p) => a + p.weight, 0) || 1;
  const final = +(roleParts.reduce((a, p) => a + p.pct * p.weight, 0) / totalWeight).toFixed(1);

  return `
    ${workflowBar(5)}
    <div class="card">
      <div class="card-header"><h3>${headerTitle}</h3><span class="badge badge-success">Review Complete</span></div>
      <div class="card-body">
        <div class="score-breakdown">
          ${roleParts.map(p => {
            const normWeight = +(p.weight / totalWeight * 100).toFixed(1);
            return `<div class="score-item"><div class="role">${p.role}</div><div class="score" style="color:${p.color}">${p.pct}%</div><div class="weight">× ${normWeight}% = ${(p.pct * normWeight / 100).toFixed(1)}</div></div>`;
          }).join('')}
        </div>
        <div class="final-score">
          <div class="label">Weighted Final Score (normalized %)</div>
          <div class="value">${final}%</div>
          <div style="opacity:.8;margin-top:.5rem;font-size:.85rem">Performance Rating: <strong>Exceeds Expectations</strong></div>
        </div>
        ${goals.length ? `
        <div class="card" style="margin-top:1.5rem;box-shadow:none;border:1px solid var(--gray-200)">
          <div class="card-header"><h3>Goal-wise Breakdown</h3></div>
          <div class="card-body table-wrap">
            <table>
              <thead><tr><th>Goal</th><th>KPI</th><th>Max</th><th>TL</th><th>Manager</th><th>Admin</th></tr></thead>
              <tbody>
                ${goals.map(g => `<tr>
                  <td>${g.title}</td><td>${g.kpi || '—'}</td><td>${g.maxScore}</td>
                  <td>${g.tlScore ?? '—'}</td>
                  <td>${g.managerScore ?? '—'}</td><td>${g.adminScore ?? '—'}</td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>` : ''}
      </div>
    </div>
  `;
}

function renderHistory() {
  const showTeamTable = ['admin', 'manager', 'teamlead'].includes(currentRole);

  return `
    <div class="quarter-tabs">
      <div class="quarter-tab" onclick="this.parentElement.querySelectorAll('.quarter-tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">Q4 2025</div>
      <div class="quarter-tab active" onclick="this.parentElement.querySelectorAll('.quarter-tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">Q1 2026</div>
      <div class="quarter-tab" onclick="this.parentElement.querySelectorAll('.quarter-tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">Q2 2026</div>
    </div>
    ${showTeamTable ? `
    <div class="card">
      <div class="card-header"><h3>Quarterly Review History — Q1 2026</h3></div>
      <div class="card-body table-wrap">
        <table>
          <thead><tr><th>Employee</th><th>Department</th><th>Goals</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${EMPLOYEES.map(e => {
              const cycle = REVIEW_CYCLES.find(c => c.employeeId === e.id && c.quarter === 'Q1 2026');
              const goals = cycle ? getCycleGoals(cycle.id) : [];
              return `<tr>
                <td>${empName(e)}</td><td>${e.dept}</td><td>${goals.length}</td>
                <td>${statusSelect(e.status, ['In Progress', 'Complete', 'Cancelled'], `updateEmpStatus(${e.id}, this)`)}</td>
                <td class="action-buttons">
                  <button class="btn btn-outline btn-sm" onclick="openEmployeeCycles(${e.id})">Profile</button>
                  ${cycle ? `<button class="btn btn-primary btn-sm" onclick="openCycleGoals(${cycle.id})">Goals</button>` : ''}
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}
    <div class="card">
      <div class="card-header"><h3>Review Timeline — ${showTeamTable ? (getSelectedEmployee() ? empName(getSelectedEmployee()) : 'John Doe') : ROLES[currentRole].user}</h3></div>
      <div class="card-body">
        <div class="timeline-item"><div class="timeline-dot" style="background:var(--accent)"></div><div class="timeline-content"><h5>Final Score Calculated — 81.0%</h5><p>Weighted from roles with weightage &gt; 0</p><div class="date">Mar 28, 2026</div></div></div>
        ${WEIGHTAGE.admin > 0 ? `<div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><h5>Admin Review Submitted</h5><p>Score: 8.0 avg · weight ${WEIGHTAGE.admin}%</p><div class="date">Mar 25, 2026</div></div></div>` : ''}
        ${WEIGHTAGE.manager > 0 ? `<div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><h5>Manager Review Submitted</h5><p>Mike Manager — weight ${WEIGHTAGE.manager}%</p><div class="date">Mar 20, 2026</div></div></div>` : ''}
        ${WEIGHTAGE.teamlead > 0 ? `<div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><h5>Team Lead Review Submitted</h5><p>Tom TeamLead — weight ${WEIGHTAGE.teamlead}%</p><div class="date">Mar 15, 2026</div></div></div>` : ''}
        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><h5>Self Assessment Submitted</h5><p>Employee self-score · weight ${WEIGHTAGE.employee}%</p><div class="date">Mar 10, 2026</div></div></div>
        <div class="timeline-item"><div class="timeline-dot" style="background:var(--gray-300)"></div><div class="timeline-content"><h5>Goals Assigned</h5><p>Goals assigned for Q1 2026</p><div class="date">Jan 5, 2026</div></div></div>
      </div>
    </div>
  `;
}

/* ==================== LEAVE MANAGEMENT PAGE ==================== */

const LEAVE_STATUS_BADGE = { Pending: 'badge-warning', Approved: 'badge-success', Rejected: 'badge-danger', Cancelled: 'badge-gray' };
const DAY_STATE_BADGE = { 'Full Day': 'badge-success', 'First Half': 'badge-warning', 'Second Half': 'badge-purple', 'Multi Day': 'badge-primary' };

function renderLeaveManagement() {
  if (currentRole === 'admin' || currentRole === 'hr') return renderLeaveManagementHrAdmin();
  if (currentRole === 'manager' || currentRole === 'teamlead') return renderLeaveManagementTeam();
  return renderLeaveManagementSelf();
}

/** Employees reporting to the current Manager/Team Lead, by the EMPLOYEES.manager /
    .teamLead fields (their reporting hierarchy). Read-only scope — see renderLeaveManagementTeam. */
function getMyTeamEmployees() {
  const user = ROLES[currentRole]?.user;
  if (currentRole === 'manager') return EMPLOYEES.filter(e => e.manager === user);
  if (currentRole === 'teamlead') return EMPLOYEES.filter(e => e.teamLead === user);
  return [];
}

function renderLeaveManagementHrAdmin() {
  const fy = getCurrentFinancialYear();
  const dept = selectedLeaveDeptFilter;
  const deptEmployees = EMPLOYEES.filter(e => !dept || e.dept === dept);
  if (selectedLeaveEmployeeId && !deptEmployees.some(e => e.id === selectedLeaveEmployeeId)) selectedLeaveEmployeeId = null;

  const filterBar = `
    <div class="card">
      <div class="card-body">
        <div class="leave-filter-grid">
          <div class="form-group" style="margin-bottom:0"><label>Select Company</label><select class="form-control" disabled><option>ALL</option></select></div>
          <div class="form-group" style="margin-bottom:0"><label>Select Department</label>
            <select class="form-control" onchange="selectedLeaveDeptFilter=this.value;selectedLeaveEmployeeId=null;navigateTo('leave-management')">
              <option value="">ALL</option>
              ${DEPARTMENTS.filter(d => d.status === 'Active').map(d => `<option ${dept === d.name ? 'selected' : ''}>${d.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="margin-bottom:0"><label>Select Employee</label>
            <select class="form-control" onchange="selectedLeaveEmployeeId=Number(this.value)||null;navigateTo('leave-management')">
              <option value="">— Select —</option>
              ${deptEmployees.map(e => `<option value="${e.id}" ${selectedLeaveEmployeeId === e.id ? 'selected' : ''}>${e.id.toString().padStart(5, '0')} - ${empName(e)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="margin-bottom:0"><label>Financial Year From</label><input class="form-control" value="${fy.fromLabel}" disabled></div>
          <div class="form-group" style="margin-bottom:0"><label>To Year</label><input class="form-control" value="${fy.toLabel}" disabled></div>
        </div>
      </div>
    </div>
  `;

  const emp = EMPLOYEES.find(e => e.id === selectedLeaveEmployeeId);
  if (!emp) {
    return `${filterBar}<div class="empty-state"><div class="icon">🗓️</div><p>Select a department and employee to view their leave data.</p></div>`;
  }

  return `${filterBar}${renderLeaveTables(emp, { canManage: true })}`;
}

/** Manager / Team Lead: read-only view of leave data for employees under their own
    reporting hierarchy only — no approve/reject, no credit/encash, no applying on
    someone else's behalf. */
function renderLeaveManagementTeam() {
  const team = getMyTeamEmployees();
  if (selectedLeaveEmployeeId && !team.some(e => e.id === selectedLeaveEmployeeId)) selectedLeaveEmployeeId = null;
  const fy = getCurrentFinancialYear();

  const pickerBar = `
    <div class="card">
      <div class="card-body">
        <div class="grid-2" style="max-width:560px">
          <div class="form-group" style="margin-bottom:0"><label>Select Team Member</label>
            <select class="form-control" onchange="selectedLeaveEmployeeId=Number(this.value)||null;navigateTo('leave-management')">
              <option value="">— Select —</option>
              ${team.map(e => `<option value="${e.id}" ${selectedLeaveEmployeeId === e.id ? 'selected' : ''}>${e.id.toString().padStart(5, '0')} - ${empName(e)} · ${e.dept}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="margin-bottom:0"><label>Financial Year</label><input class="form-control" value="${fy.fromLabel} – ${fy.toLabel}" disabled></div>
        </div>
        <p class="muted" style="margin-top:.75rem">Read-only — view only. Leave is approved by HR.</p>
      </div>
    </div>
  `;

  if (!team.length) {
    return `${pickerBar}<div class="empty-state"><div class="icon">🗓️</div><p>No employees found under your reporting hierarchy.</p></div>`;
  }
  const emp = EMPLOYEES.find(e => e.id === selectedLeaveEmployeeId);
  if (!emp) {
    return `${pickerBar}<div class="empty-state"><div class="icon">🗓️</div><p>Select a team member to view their leave data.</p></div>`;
  }
  return `${pickerBar}${renderLeaveTables(emp, { canManage: false, canApply: false })}`;
}

function renderLeaveManagementSelf() {
  const emp = getCurrentEmployee();
  if (!emp) return `<div class="empty-state"><div class="icon">🗓️</div><p>No employee record found for this account.</p></div>`;
  const fy = getCurrentFinancialYear();
  const header = `
    <div class="card">
      <div class="card-body" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
        <div>
          <strong>${empName(emp)}</strong>
          <div class="muted">${emp.dept} · ${emp.designation} — Financial Year ${fy.fromLabel} – ${fy.toLabel}</div>
        </div>
        <button class="btn btn-primary" onclick="openApplyLeaveModal(${emp.id})">🗓️ Avail Leave</button>
      </div>
    </div>
  `;
  return `${header}${renderLeaveTables(emp, { canManage: false, canApply: true })}`;
}

/** Shared 3-table layout (Leave Balance / Leave Transactions / Leave Requests) used by the
    HR/Admin picker view, the Manager/Team Lead read-only team view, and the Employee self
    view. `canManage` gates Approve/Reject, Credit Leave and Encash Leave (HR/Admin only).
    `canApply` additionally allows cancelling one's own pending request (Employee self view
    only) — Manager/Team Lead get neither, so their view is strictly read-only. */
function renderLeaveTables(emp, { canManage, canApply = false }) {
  const balances = getEmployeeLeaveBalances(emp.id);
  const ledger = getEmployeeLeaveLedger(emp.id);
  const requests = getEmployeeLeaveRequests(emp.id);

  const totals = { AL: 0, CR: 0, CF: 0, EN: 0, DB: 0 };
  ledger.forEach(l => { totals[l.type] = (totals[l.type] || 0) + l.days; });
  requests.filter(r => r.status === 'Approved').forEach(r => { totals.AL += r.days; });

  const actionBar = canManage ? `
    <div style="display:flex;justify-content:flex-end;gap:.5rem;margin-bottom:1rem">
      <button class="btn btn-outline" onclick="openEncashLeaveModal(${emp.id})">💷 Encash Leave</button>
      <button class="btn btn-primary" onclick="openApplyLeaveModal(${emp.id})">🗓️ Avail Leave</button>
    </div>
  ` : '';

  return `
    ${actionBar}
    <div class="leave-tables-grid">
      <div>
        <div class="card">
          <div class="card-header"><h3>Leave Requests</h3></div>
          <div class="card-body table-wrap">
            <table>
              <thead><tr><th>Code</th><th>Date</th><th>Days</th><th>State</th><th>Status</th><th>Reason</th><th>Action By</th><th>Requested</th><th>Approved</th>${(canManage || canApply) ? '<th>Action</th>' : ''}</tr></thead>
              <tbody>
                ${requests.length ? requests.map(r => `
                  <tr>
                    <td>${r.code}</td>
                    <td>${r.fromDate === r.toDate ? formatLeaveDate(r.fromDate) : `${formatLeaveDate(r.fromDate)} – ${formatLeaveDate(r.toDate)}`}</td>
                    <td>${r.days}</td>
                    <td><span class="badge ${DAY_STATE_BADGE[r.dayState] || 'badge-gray'}">${r.dayState}</span></td>
                    <td><span class="badge ${LEAVE_STATUS_BADGE[r.status] || 'badge-gray'}">${r.status}</span></td>
                    <td>${r.reason}</td>
                    <td>${r.actionBy || '—'}</td>
                    <td>${formatLeaveDate(r.requestedDate)}</td>
                    <td>${r.actionDate ? formatLeaveDate(r.actionDate) : '—'}</td>
                    ${(canManage || canApply) ? `<td style="white-space:nowrap">
                      ${canManage
                        ? (r.status === 'Pending'
                            ? `<button class="btn btn-success btn-sm" onclick="approveLeaveRequest('${r.id}')" title="Approve">✓</button>
                               <button class="btn btn-danger btn-sm" onclick="rejectLeaveRequest('${r.id}')" title="Reject">✕</button>`
                            : `<button class="btn btn-outline btn-sm" onclick="deleteLeaveRequest('${r.id}')" title="Remove">🗑</button>`)
                        : (r.status === 'Pending'
                            ? `<button class="btn btn-outline btn-sm" onclick="deleteLeaveRequest('${r.id}')" title="Cancel request">Cancel</button>`
                            : '')}
                    </td>` : ''}
                  </tr>
                `).join('') : `<tr><td colspan="${(canManage || canApply) ? 10 : 9}" class="muted" style="text-align:center;padding:1.5rem">No leave requests yet.</td></tr>`}
              </tbody>
            </table>
          </div>
          <div class="card-body" style="padding-top:0;display:flex;gap:1.5rem;flex-wrap:wrap;border-top:1px solid var(--gray-100)">
            ${Object.entries({ AL: 'Avail Leave', CR: 'Credit Leave', CF: 'Carry Forward', EN: 'Encash Leave', DB: 'Debit Leave' }).map(([k, label]) => `
              <span class="muted"><span class="badge badge-gray">${totals[k] || 0}</span> ${k} - ${label}</span>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h3>Leave Balance</h3></div>
        <div class="card-body table-wrap">
          <table>
            <thead><tr><th>Leave Code</th><th>Assign Type</th><th>Balance</th></tr></thead>
            <tbody>
              ${balances.map(b => `<tr><td>${b.code}</td><td>${b.assignType}</td><td><strong>${b.balance}</strong></td></tr>`).join('')}
            </tbody>
          </table>
        </div>
        ${canManage ? `
          <div class="card-body" style="border-top:1px solid var(--gray-100)">
            <h4 style="font-size:.9rem;margin-bottom:.75rem">Credit Leave</h4>
            <div class="form-group"><label>Leave Code</label>
              <select class="form-control" id="creditLeaveCode">
                ${LEAVE_TYPES.map(lt => `<option value="${lt.code}">${lt.code} - ${lt.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group"><label>Credit Leave Date</label><input class="form-control" id="creditLeaveDate" type="date" value="${new Date().toISOString().slice(0, 10)}"></div>
            <div class="form-group"><label>Credit Leave Day(s)</label><input class="form-control" id="creditLeaveDays" type="number" min="0.5" step="0.5" placeholder="Enter leave days"></div>
            <button class="btn btn-primary btn-block" onclick="creditLeave(${emp.id})">Credit Leave</button>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function formatLeaveDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/* ---------- Apply / Credit / Encash / Approve actions ---------- */

/** Looks up an "employee" for leave-modal purposes — a real EMPLOYEES row, or (for
    Admin/HR/Manager/Team Lead applying on their own My Leave page) their SELF_LEAVE_PROFILES
    stand-in, since those 4 roles aren't in EMPLOYEES. */
function findLeaveEmployeeById(employeeId) {
  return EMPLOYEES.find(e => e.id === employeeId) || Object.values(SELF_LEAVE_PROFILES).find(e => e.id === employeeId) || null;
}

function openApplyLeaveModal(employeeId) {
  const emp = findLeaveEmployeeById(employeeId);
  if (!emp) return;
  const balances = getEmployeeLeaveBalances(employeeId).filter(b => b.balance > 0);
  showModal(`
    <div class="modal-header">
      <h3>Avail Leave — ${empName(emp)}</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group"><label>Leave Code</label>
        <select class="form-control" id="applyLeaveCode">
          ${balances.length ? balances.map(b => `<option value="${b.code}">${b.code} - ${b.name} (Balance: ${b.balance})</option>`).join('') : `<option value="">No balance available</option>`}
        </select>
      </div>
      <div class="grid-2">
        <div class="form-group"><label>From Date</label><input class="form-control" id="applyLeaveFrom" type="date"></div>
        <div class="form-group"><label>To Date</label><input class="form-control" id="applyLeaveTo" type="date"></div>
      </div>
      <div class="form-group"><label>Day State (for a single-day request)</label>
        <select class="form-control" id="applyLeaveDayState">
          <option>Full Day</option>
          <option>First Half</option>
          <option>Second Half</option>
        </select>
      </div>
      <div class="form-group"><label>Reason</label><textarea class="form-control" id="applyLeaveReason" rows="3" placeholder="Reason for leave..."></textarea></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveLeaveRequest(${employeeId})">Submit Request</button>
    </div>
  `);
}

function saveLeaveRequest(employeeId) {
  const code = document.getElementById('applyLeaveCode').value;
  const fromDate = document.getElementById('applyLeaveFrom').value;
  const toDate = document.getElementById('applyLeaveTo').value || fromDate;
  const dayStateSel = document.getElementById('applyLeaveDayState').value;
  const reason = document.getElementById('applyLeaveReason').value.trim();
  if (!code) { alert('No leave code with an available balance.'); return; }
  if (!fromDate) { alert('From date is required.'); return; }
  if (!reason) { alert('Reason is required.'); return; }
  if (toDate < fromDate) { alert('To date cannot be before From date.'); return; }

  const isMultiDay = toDate !== fromDate;
  const dayState = isMultiDay ? 'Multi Day' : dayStateSel;
  const dayCount = (new Date(toDate) - new Date(fromDate)) / 86400000 + 1;
  const days = isMultiDay ? dayCount : (dayState === 'Full Day' ? 1 : 0.5);

  const request = {
    id: `req-${nextId.leaveReq++}`, employeeId, code, fromDate, toDate, days, dayState, reason,
    status: 'Pending', requestedDate: new Date().toISOString().slice(0, 10), actionBy: '', actionDate: ''
  };
  LEAVE_REQUESTS.push(request);
  onLeaveApplied(request);
  closeModal();
  navigateTo('leave-management');
}

function deleteLeaveRequest(id) {
  if (!confirmDelete('Remove this leave request?')) return;
  LEAVE_REQUESTS = LEAVE_REQUESTS.filter(r => r.id !== id);
  navigateTo('leave-management');
}

function approveLeaveRequest(id) {
  const r = LEAVE_REQUESTS.find(x => x.id === id);
  if (!r) return;
  r.status = 'Approved';
  r.actionBy = ROLES[currentRole].user;
  r.actionDate = new Date().toISOString().slice(0, 10);
  applyBalanceDeduction(r);
  navigateTo('leave-management');
}

function rejectLeaveRequest(id) {
  const r = LEAVE_REQUESTS.find(x => x.id === id);
  if (!r) return;
  r.status = 'Rejected';
  r.actionBy = ROLES[currentRole].user;
  r.actionDate = new Date().toISOString().slice(0, 10);
  navigateTo('leave-management');
}

function creditLeave(employeeId) {
  const code = document.getElementById('creditLeaveCode').value;
  const date = document.getElementById('creditLeaveDate').value || new Date().toISOString().slice(0, 10);
  const days = Number(document.getElementById('creditLeaveDays').value);
  if (!days || days <= 0) { alert('Enter the number of leave days to credit.'); return; }
  const fy = getCurrentFinancialYear().year;
  let bal = LEAVE_BALANCES.find(b => b.employeeId === employeeId && b.financialYear === fy && b.code === code);
  if (!bal) { bal = { id: `${employeeId}-${code}-${fy}`, employeeId, financialYear: fy, code, balance: 0 }; LEAVE_BALANCES.push(bal); }
  bal.balance += days;
  LEAVE_LEDGER.push({ id: `led-${nextId.leaveLedger++}`, employeeId, financialYear: fy, type: 'CR', code, date, days, note: 'Manual credit' });
  navigateTo('leave-management');
}

function openEncashLeaveModal(employeeId) {
  const emp = EMPLOYEES.find(e => e.id === employeeId);
  if (!emp) return;
  const balances = getEmployeeLeaveBalances(employeeId).filter(b => b.balance > 0);
  showModal(`
    <div class="modal-header">
      <h3>Encash Leave — ${empName(emp)}</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group"><label>Leave Code</label>
        <select class="form-control" id="encashLeaveCode">
          ${balances.length ? balances.map(b => `<option value="${b.code}">${b.code} - ${b.name} (Balance: ${b.balance})</option>`).join('') : `<option value="">No balance available</option>`}
        </select>
      </div>
      <div class="form-group"><label>Days to Encash</label><input class="form-control" id="encashLeaveDays" type="number" min="0.5" step="0.5"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveEncashLeave(${employeeId})">Encash</button>
    </div>
  `);
}

function saveEncashLeave(employeeId) {
  const code = document.getElementById('encashLeaveCode').value;
  const days = Number(document.getElementById('encashLeaveDays').value);
  if (!code) { alert('No leave code with an available balance.'); return; }
  if (!days || days <= 0) { alert('Enter the number of days to encash.'); return; }
  const fy = getCurrentFinancialYear().year;
  const bal = LEAVE_BALANCES.find(b => b.employeeId === employeeId && b.financialYear === fy && b.code === code);
  if (!bal || bal.balance < days) { alert('Not enough balance to encash.'); return; }
  bal.balance -= days;
  LEAVE_LEDGER.push({ id: `led-${nextId.leaveLedger++}`, employeeId, financialYear: fy, type: 'EN', code, date: new Date().toISOString().slice(0, 10), days, note: 'Encashed' });
  closeModal();
  navigateTo('leave-management');
}

/* ==================== Leave Management: seed demo data ====================
   Runs once at load, after all EMPLOYEES are defined, so the page isn't empty
   on first visit — mirrors how ASSIGNED_GOALS is pre-seeded for the review flow. */
(function seedLeaveDemoData() {
  EMPLOYEES.forEach(seedLeaveDataForEmployee);
  Object.values(SELF_LEAVE_PROFILES).forEach(seedLeaveDataForEmployee);

  const fy = getCurrentFinancialYear().year;
  const demoRequests = [
    { employeeId: 1, code: 'PL', fromDate: `${fy}-02-18`, toDate: `${fy}-02-19`, days: 2, dayState: 'Multi Day', reason: 'Family function', status: 'Approved', requestedDate: `${fy}-02-10`, actionBy: 'Sarah HR', actionDate: `${fy}-02-11` },
    { employeeId: 1, code: 'PL', fromDate: `${fy}-04-09`, toDate: `${fy}-04-09`, days: 1, dayState: 'Full Day', reason: 'Water unavailability at office.', status: 'Approved', requestedDate: `${fy}-04-08`, actionBy: 'Sarah HR', actionDate: `${fy}-04-08` },
    { employeeId: 1, code: 'UL', fromDate: `${fy}-05-28`, toDate: `${fy}-05-28`, days: 0.5, dayState: 'Second Half', reason: 'Personal work', status: 'Approved', requestedDate: `${fy}-05-27`, actionBy: 'Sarah HR', actionDate: `${fy}-05-27` },
    { employeeId: 1, code: 'UL', fromDate: `${fy}-06-02`, toDate: `${fy}-06-02`, days: 0.5, dayState: 'First Half', reason: 'Medical appointment', status: 'Pending', requestedDate: `${fy}-06-01`, actionBy: '', actionDate: '' },
    { employeeId: 2, code: 'PL', fromDate: `${fy}-03-05`, toDate: `${fy}-03-06`, days: 2, dayState: 'Multi Day', reason: 'Travel', status: 'Pending', requestedDate: `${fy}-03-01`, actionBy: '', actionDate: '' }
  ];
  demoRequests.forEach(r => LEAVE_REQUESTS.push({ id: `req-${nextId.leaveReq++}`, ...r }));

  // Approved demo requests should already show as debits on the ledger/balance, matching
  // what Phase 2's applyBalanceDeduction() will do automatically going forward.
  LEAVE_REQUESTS.filter(r => r.status === 'Approved').forEach(r => {
    const bal = LEAVE_BALANCES.find(b => b.employeeId === r.employeeId && b.financialYear === fy && b.code === r.code);
    if (bal) bal.balance = Math.max(0, bal.balance - r.days);
    LEAVE_LEDGER.push({ id: `led-${nextId.leaveLedger++}`, employeeId: r.employeeId, financialYear: fy, type: 'DB', code: r.code, date: r.fromDate, days: r.days, note: 'Leave availed' });
  });
})();
