#Demo From here : https://iift-placecomm-placement-committee-operations-sys.ai.studio


#just a demo project for helping Placement team , its not real College management system, its just a **Demo MVP project created to showcase for Interview**

A production-grade, centralized **Placement Committee Management System** built for the, replacing fragmented Excel sheets, WhatsApp updates, and manual email threads with a unified operational command center.

---

## 1. Key Capabilities & Modules

1. **Placement Command Center (Executive Dashboard)**
   - Real-time student placement funnel (Eligible → Shortlisted → Interviewed → Offered → Accepted).
   - Real-time company outreach pipeline (Prospect → Contacted → Interested → Confirmed → Hiring Active → Converted).
   - Today's live interview lineup with virtual room links and campus boardroom allocation.
   - Overdue HR follow-up alerts with 1-tap call triggers.
   - Comprehensive compensation analytics (Average/Highest Final CTC, Average/Highest Summer Stipend).

2. **Student Master Directory**
   - High-density Excel-like table with multi-filter by Program (`MBA-IB`, `MBA-BA`, `MA-Economics`), Campus (`Delhi`, `Kolkata`), Batch (`2024-26`, `2025-27`), Specialization, Work Experience, and Placement Status.
   - Deep-dive student profiles with Verified CV previews, company interaction timelines, interview histories, and internal committee notes.

3. **Corporate Recruiter CRM & HR Directory**
   - Multi-cycle tracking: Summer Internship, Final Placement, or Both.
   - Rapid 20-Second HR Call Logger (`Log Call` modal with outcome dropdown, conversation notes, next follow-up date scheduling, and company status updates).
   - Recruiter directory with primary contacts, direct phone/email channels, and designated Placement Coordinator relationship owners.

4. **Recruitment Drives & Compensation**
   - Profile-level drives per firm with detailed CTC breakdowns (Fixed pay, Variable pay, Joining bonus, Summer stipend).
   - Strict eligibility enforcement (Minimum CGPA, allowed specializations, work experience ranges).

5. **Dedicated Workspaces**
   - **Summer Placements (2025-27)**: Stipends, highest/median benchmarks, 8-week internship tracking, PPO opportunity tracking.
   - **Final Placements (2024-26)**: CTC packages, unplaced candidate focus, multi-offer tracking, offer acceptance engine.

6. **Interviews & Automated Scheduling**
   - Multi-round tracking: GD, Case Interview, Technical 1 & 2, Partner Round, HR.
   - Calendar and list views for Today's and Upcoming interviews.
   - Status transitions (Scheduled, Confirmed, In Progress, Completed, Rescheduled, No Show) and real-time result marking.

7. **Offers & Conversion Automation**
   - Business Rule Automation: When a candidate accepts an offer, the system automatically updates the student's status to **Placed**, links the company and compensation details, updates institutional placement counters, and logs the change to the tamper-evident audit trail.

8. **Shortlist Management & Distribution**
   - Candidate shortlist tracking across corporate drives.
   - Distribution analytics: Zero Shortlists (priority intervention), 1-3 Shortlists, and 5+ Shortlists.
   - Bulk Excel/CSV upload with validation preview.

9. **Follow-Up Queue**
   - Segmented queues: **OVERDUE**, **DUE TODAY**, **UPCOMING**, and **ALL TASKS**.
   - Priority tagging (`HIGH`, `MEDIUM`, `LOW`) and 1-tap "Mark as contacted" workflow.

10. **Excel / CSV Import & Export Engine**
    - Multi-step guided wizard: Upload → Column Auto-Detection → Field Mapping → Validation Checks (Roll number matching & duplicate warnings) → Preview → Ingestion.
    - 1-click export for all student records, company CRM data, shortlists, and official executive placement reports.

11. **Audit Logs & Security**
    - Complete change log recording actor name, timestamp, action type, target entity, and modification descriptions.
    - Role-Based Access Control (`SUPER_ADMIN`, `PLACEMENT_COORDINATOR`, `ADMIN`, `VIEWER`).

---

## 2. Technology Stack & Database Architecture

- **Frontend**: Next.js / React 19 SPA, Tailwind CSS v4, Lucide Icons, Plus Jakarta Sans typography, tabular monospace numerals (`JetBrains Mono`).
- **Database Engine**: PostgreSQL with Prisma ORM (`prisma/schema.prisma`) and raw DDL (`schema.sql`).
- **Query Optimization**:
  - Compound indexes on `(batch, program)` and `(roll_number)`.
  - Filter indexes on `final_status`, `summer_status`, `specialization`, and `is_eligible`.
  - Date and priority compound indexes on `(due_date, status)` for instant follow-up queue retrieval.
  - Foreign key cascades ensuring referential integrity across drives, shortlists, and offers.
- **CI/CD Integration**: Automated GitHub Actions pipeline (`.github/workflows/deploy.yml`) validating linting, TypeScript strict mode, build verification, and container packaging.

---

## 3. Quick Start & Local Execution

```bash
# 1. Install dependencies
npm install

# 2. Run lint and type checking
npm run lint

# 3. Start development server (Port 3000)
npm run dev

# 4. Build for production
npm run build
```

---

## 4. Default Demonstration Personas

Switch personas instantly using the user menu in the top bar:
- **Aditya Sheetal** (`SUPER_ADMIN`): Senior Placement Coordinator (Strategy & Consulting Lead).
- **Tanya Verma** (`PLACEMENT_COORDINATOR`): Corporate Relations Coordinator (FMCG & International Trade Lead).
- **Rahul Mehta** (`PLACEMENT_COORDINATOR`): Corporate Relations Coordinator (BFSI & Analytics Lead).
- **Dr. R. K. Wadhwa** (`ADMIN`): Professor & Chairperson, Corporate Relations & Placement Division.
- **Auditor & Observer** (`VIEWER`): Institutional Placement Observer (Read-only access).
