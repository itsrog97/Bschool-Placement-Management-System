-- ====================================================================
-- IIFT Delhi Placement Committee (PlaceComm) Database Architecture
-- PostgreSQL DDL with Foreign Keys, Compound B-Tree Indexes & Triggers
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users & RBAC
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'PLACEMENT_COORDINATOR', 'ADMIN', 'VIEWER');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'PLACEMENT_COORDINATOR',
    roll_number VARCHAR(64),
    phone VARCHAR(32),
    avatar VARCHAR(512),
    title VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- 2. Companies CRM
CREATE TYPE company_status AS ENUM (
    'PROSPECT', 'CONTACTED', 'INTERESTED', 'DISCUSSION', 'NEGOTIATION',
    'CONFIRMED', 'SCHEDULE_FINALIZED', 'HIRING_ACTIVE', 'PROCESS_COMPLETED',
    'OFFER_RELEASED', 'CONVERTED', 'ON_HOLD', 'DECLINED'
);
CREATE TYPE cycle_type AS ENUM ('SUMMER', 'FINAL', 'BOTH');

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    industry VARCHAR(128) NOT NULL,
    company_type VARCHAR(64) DEFAULT 'MNC',
    website VARCHAR(255),
    location VARCHAR(255),
    pc_owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    recruitment_type cycle_type DEFAULT 'BOTH',
    status company_status DEFAULT 'PROSPECT',
    expected_visit_date DATE,
    hiring_intent TEXT,
    notes TEXT,
    historical_hires INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_recruitment_type ON companies(recruitment_type);
CREATE INDEX idx_companies_visit_date ON companies(expected_visit_date);

-- 3. HR Contacts
CREATE TABLE hr_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(128) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    alternate_phone VARCHAR(32),
    linkedin VARCHAR(255),
    preferred_channel VARCHAR(32) DEFAULT 'Email',
    relationship_owner VARCHAR(255),
    last_contact_date DATE,
    next_follow_up_date DATE,
    is_primary BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hr_company_id ON hr_contacts(company_id);
CREATE INDEX idx_hr_email ON hr_contacts(email);
CREATE INDEX idx_hr_next_follow_up ON hr_contacts(next_follow_up_date);

-- 4. Students Master
CREATE TYPE program_type AS ENUM ('MBA_IB', 'MBA_BA');
CREATE TYPE campus_type AS ENUM ('DELHI');
CREATE TYPE specialization_type AS ENUM (
    'FINANCE', 'MARKETING', 'STRATEGY_CONSULTING',
    'TRADE_LOGISTICS', 'IT_ANALYTICS', 'OPERATIONS_SUPPLY_CHAIN'
);
CREATE TYPE placement_status AS ENUM ('UNPLACED', 'SHORTLISTED', 'INTERVIEWING', 'PLACED', 'OPTED_OUT');

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roll_number VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32) NOT NULL,
    gender VARCHAR(16) DEFAULT 'Male',
    program program_type NOT NULL,
    campus campus_type DEFAULT 'DELHI',
    batch VARCHAR(32) NOT NULL,
    specialization specialization_type NOT NULL,
    work_exp_months INTEGER DEFAULT 0,
    ug_degree VARCHAR(128) NOT NULL,
    ug_college VARCHAR(255) NOT NULL,
    cgpa NUMERIC(4,2) NOT NULL,
    tenth_percent NUMERIC(5,2) NOT NULL,
    twelfth_percent NUMERIC(5,2) NOT NULL,
    is_eligible BOOLEAN DEFAULT TRUE,
    skills TEXT[] DEFAULT '{}',
    cv_url VARCHAR(512),
    resume_summary TEXT,
    
    -- Summer Outcomes
    summer_status placement_status DEFAULT 'UNPLACED',
    summer_company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    summer_stipend NUMERIC(10,2),
    summer_ppo BOOLEAN DEFAULT FALSE,
    
    -- Final Placement Outcomes
    final_status placement_status DEFAULT 'UNPLACED',
    final_company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    final_ctc NUMERIC(6,2),
    final_fixed NUMERIC(6,2),
    final_variable NUMERIC(6,2),
    final_joining_bonus NUMERIC(6,2),
    
    -- Synchronized Metric Counters
    shortlists_count INTEGER DEFAULT 0,
    interviews_count INTEGER DEFAULT 0,
    offers_count INTEGER DEFAULT 0,
    
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_batch_prog ON students(batch, program);
CREATE INDEX idx_students_roll ON students(roll_number);
CREATE INDEX idx_students_final_status ON students(final_status);
CREATE INDEX idx_students_summer_status ON students(summer_status);
CREATE INDEX idx_students_specialization ON students(specialization);
CREATE INDEX idx_students_cgpa ON students(cgpa);

-- 5. Recruitment Drives (Per Company, Cycle & Profile)
CREATE TYPE drive_status AS ENUM (
    'DRAFT', 'APPLICATIONS_OPEN', 'SHORTLISTING',
    'INTERVIEWS_SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
);

CREATE TABLE recruitment_drives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    cycle VARCHAR(64) NOT NULL,
    cycle_type cycle_type DEFAULT 'FINAL',
    job_profile VARCHAR(128) NOT NULL,
    job_description TEXT,
    expected_hires INTEGER DEFAULT 1,
    ctc_lpa NUMERIC(6,2),
    stipend_per_month NUMERIC(10,2),
    fixed_lpa NUMERIC(6,2),
    variable_lpa NUMERIC(6,2),
    joining_bonus_lpa NUMERIC(6,2),
    ppo_opportunity BOOLEAN DEFAULT FALSE,
    min_work_exp_months INTEGER,
    max_work_exp_months INTEGER,
    allowed_programs TEXT[] DEFAULT '{}',
    allowed_specializations TEXT[] DEFAULT '{}',
    min_cgpa NUMERIC(4,2) DEFAULT 0.0,
    application_deadline TIMESTAMP WITH TIME ZONE,
    shortlist_date DATE,
    interview_date DATE,
    offer_date DATE,
    status drive_status DEFAULT 'DRAFT',
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_drives_cycle ON recruitment_drives(cycle, cycle_type);
CREATE INDEX idx_drives_company ON recruitment_drives(company_id);
CREATE INDEX idx_drives_status ON recruitment_drives(status);
CREATE INDEX idx_drives_interview_date ON recruitment_drives(interview_date);

-- 6. Shortlists
CREATE TABLE shortlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drive_id UUID NOT NULL REFERENCES recruitment_drives(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    round_name VARCHAR(64) DEFAULT 'Round 1',
    imported_by VARCHAR(255),
    shortlisted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(drive_id, student_id, round_name)
);

CREATE INDEX idx_shortlists_drive ON shortlists(drive_id);
CREATE INDEX idx_shortlists_student ON shortlists(student_id);

-- 7. Interviews
CREATE TYPE interview_round AS ENUM ('GD', 'TECHNICAL_1', 'TECHNICAL_2', 'CASE_INTERVIEW', 'HR', 'PARTNER_ROUND', 'FINAL');
CREATE TYPE interview_status AS ENUM ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'RESCHEDULED', 'NO_SHOW');
CREATE TYPE interview_result AS ENUM ('PENDING', 'SELECTED', 'REJECTED', 'WAITLISTED');

CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drive_id UUID NOT NULL REFERENCES recruitment_drives(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    round interview_round DEFAULT 'TECHNICAL_1',
    date DATE NOT NULL,
    start_time VARCHAR(8) NOT NULL,
    end_time VARCHAR(8) NOT NULL,
    mode VARCHAR(32) DEFAULT 'Online',
    venue_or_link VARCHAR(512) NOT NULL,
    interviewer_name VARCHAR(255),
    status interview_status DEFAULT 'SCHEDULED',
    result interview_result DEFAULT 'PENDING',
    feedback TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interviews_date_status ON interviews(date, status);
CREATE INDEX idx_interviews_drive ON interviews(drive_id);
CREATE INDEX idx_interviews_student ON interviews(student_id);

-- 8. Offers
CREATE TYPE offer_status AS ENUM ('PENDING', 'RELEASED', 'ACCEPTED', 'DECLINED', 'WITHDRAWN');
CREATE TYPE offer_type AS ENUM ('SUMMER_INTERNSHIP', 'FINAL_PLACEMENT', 'PPO');

CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drive_id UUID NOT NULL REFERENCES recruitment_drives(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    profile VARCHAR(128) NOT NULL,
    offer_type offer_type DEFAULT 'FINAL_PLACEMENT',
    offer_date DATE DEFAULT CURRENT_DATE,
    ctc_lpa NUMERIC(6,2),
    stipend_per_month NUMERIC(10,2),
    fixed_lpa NUMERIC(6,2),
    variable_lpa NUMERIC(6,2),
    joining_bonus_lpa NUMERIC(6,2),
    ppo_opportunity BOOLEAN DEFAULT FALSE,
    status offer_status DEFAULT 'RELEASED',
    accepted_at TIMESTAMP WITH TIME ZONE,
    valid_till DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_offers_student_status ON offers(student_id, status);
CREATE INDEX idx_offers_company ON offers(company_id);

-- 9. Follow-Ups CRM
CREATE TYPE priority_level AS ENUM ('HIGH', 'MEDIUM', 'LOW');
CREATE TYPE followup_status AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

CREATE TABLE follow_ups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    hr_contact_id UUID REFERENCES hr_contacts(id) ON DELETE SET NULL,
    pc_owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    priority priority_level DEFAULT 'MEDIUM',
    due_date DATE NOT NULL,
    status followup_status DEFAULT 'PENDING',
    action_type VARCHAR(64) DEFAULT 'Call',
    notes TEXT NOT NULL,
    last_contact_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_followups_due_status ON follow_ups(due_date, status);
CREATE INDEX idx_followups_pc_owner ON follow_ups(pc_owner_id);

-- 10. Communication Log & Company Activities
CREATE TABLE company_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    outcome VARCHAR(128),
    notes TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activities_company_time ON company_activities(company_id, timestamp DESC);

-- 11. Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(64) NOT NULL,
    entity VARCHAR(64) NOT NULL,
    entity_id VARCHAR(128) NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_entity_time ON audit_logs(entity, timestamp DESC);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
