-- Import script for resume data
-- Run with: wrangler d1 execute DB --remote --file=./scripts/import-resume-data-sql.sql
-- Or use individual INSERT statements

-- Import Experiences
INSERT INTO resume_experiences (id, title, organization, tasks, is_deleted, created_at, updated_at)
VALUES 
('exp-1', 'Purchasing Specialist', 'Toyota Motor Engineering & Manufacturing North America (TMNA)', 
 '["Develop and implement sourcing strategies optimizing the global supply base.", "Select and qualify suppliers focusing on quality, delivery, and sustainable cost structure.", "Perform detailed cost analysis of parts and materials through the full project life cycle.", "Lead annual cost reduction negotiations, achieving multi-million-dollar savings each fiscal year.", "Manage supplier relationships and monitor performance to ensure on-time delivery, cost, and quality KPIs.", "Collaborate with design, engineering, and quality departments to ensure component sourcing aligns with program milestones.", "Establish standardized raw-material adjustment methodology (e.g., EPDM) to stabilize annual budgeting and forecasts.", "Resolve supplier crisis issues and implement countermeasures to ensure continuity of operations.", "Coordinate 600F/640F and North American engine program sourcing, achieving 100 % on-time KPI delivery.", "Standardize cost and RFQ sourcing templates for 3PL and manufacturing programs."]', 
 0, 1735689600000, 1735689600000),
('exp-2', 'Purchasing Manager', 'Newell Rubbermaid Office Products Inc.', 
 '["Direct purchasing responsibilities exceeding $90 million annually across multiple commodities.", "Lead a team of 4 direct reports in procurement and contract management.", "Negotiate and procure 85 million pounds of resin annually, achieving >$3 million in savings per year.", "Rationalize contract injection-molding supply base from 15 to 8 suppliers, increasing efficiency.", "Establish and implement qualification and standardization processes for resin utilization enterprise-wide.", "Source and negotiate international finished-goods supply and scheduling.", "Support new-product development by directing raw-material and machine-rate pricing."]', 
 0, 1735689600000, 1735689600000),
('exp-3', 'Purchasing Supervisor', 'O''Sullivan Corporation', 
 '["Manage total purchasing of $60 million annually across 5 plants for automotive injection-molded products.", "Purchase resins, color concentrates, paints, metals, and plastic components.", "Negotiate long-term raw-material contracts, achieving >$700,000 in savings annually.", "Implement ABC analysis for raw-materials inventory, reducing carrying cost by $1.5 million per year.", "Administer day-to-day supplier and contract management and problem resolution."]', 
 0, 1735689600000, 1735689600000),
('exp-4', 'Senior Buyer', 'Atlantic Research Corporation', 
 '["Procure materials and components for $120 million manufacturer of solid-propellant rocket motors.", "Negotiate supplier agreements and ensure compliance with aerospace and defense quality standards.", "Coordinate procurement schedules supporting production and testing."]', 
 0, 1735689600000, 1735689600000),
('exp-5', 'Senior Merchandise Manager', 'JC Penney Company', 
 '["Manage merchandising operations including supplier negotiations, category planning, and purchasing oversight.", "Develop and execute seasonal buying strategies to optimize profitability and inventory performance."]', 
 0, 1735689600000, 1735689600000);

-- Import Education
INSERT INTO resume_education (id, level, field_of_study, location, is_deleted, created_at, updated_at)
VALUES 
('edu-1', 'Bachelor''s Degree', 'B.B.A. — Business Administration (Georgetown College, KY)', NULL, 0, 1735689600000, 1735689600000),
('edu-2', 'Professional Certification', 'Certified Purchasing Manager (C.P.M.)', NULL, 0, 1735689600000, 1735689600000);

-- Import Skills
INSERT OR REPLACE INTO resume_skills (id, name, basis, rationale, manual, is_deleted, created_at, updated_at)
VALUES 
('skill-1', 'Strategic Sourcing', 'Toyota Motor Engineering & Manufacturing North America', 'Led development of global sourcing strategies optimizing multi-commodity supply base across North America.', 0, 0, 1735689600000, 1735689600000),
('skill-2', 'Cost Analysis', 'Toyota Motor Engineering & Manufacturing North America', 'Performed detailed cost modeling on parts and materials through design and production cycles.', 0, 0, 1735689600000, 1735689600000),
('skill-3', 'Supplier Relationship Management', 'Toyota Motor Engineering & Manufacturing North America', 'Managed supplier KPIs for cost, delivery, and quality across $600 million annual spend.', 0, 0, 1735689600000, 1735689600000),
('skill-4', 'Contract Negotiation', 'Toyota and Newell Rubbermaid', 'Negotiated multi-year, multi-million-dollar supply contracts achieving recurring savings.', 0, 0, 1735689600000, 1735689600000),
('skill-5', 'Process Standardization', 'Toyota Motor Engineering & Manufacturing North America', 'Implemented standardized cost-tracking and RFQ templates for 3PL and supplier sourcing processes.', 0, 0, 1735689600000, 1735689600000),
('skill-6', 'Continuous Improvement', NULL, NULL, 1, 0, 1735689600000, 1735689600000),
('skill-7', 'Budget Management', NULL, NULL, 1, 0, 1735689600000, 1735689600000),
('skill-8', 'Supply Chain Optimization', NULL, NULL, 1, 0, 1735689600000, 1735689600000),
('skill-9', 'Commodity Management', NULL, NULL, 1, 0, 1735689600000, 1735689600000),
('skill-10', 'Global Sourcing', NULL, NULL, 1, 0, 1735689600000, 1735689600000),
('skill-11', 'Team Leadership', NULL, NULL, 1, 0, 1735689600000, 1735689600000),
('skill-12', 'Cross-Functional Collaboration', NULL, NULL, 1, 0, 1735689600000, 1735689600000),
('skill-13', 'Problem Solving & Root Cause Analysis', NULL, NULL, 1, 0, 1735689600000, 1735689600000),
('skill-14', 'Negotiation Strategy', NULL, NULL, 1, 0, 1735689600000, 1735689600000),
('skill-15', 'Forecasting & Demand Planning', NULL, NULL, 1, 0, 1735689600000, 1735689600000),
('skill-16', 'Data Analysis', NULL, NULL, 1, 0, 1735689600000, 1735689600000),
('skill-17', 'Cost Reduction Planning', NULL, NULL, 1, 0, 1735689600000, 1735689600000),
('skill-18', 'Supplier Qualification', NULL, NULL, 1, 0, 1735689600000, 1735689600000),
('skill-19', 'Procurement Systems & RFQ Tools', NULL, NULL, 1, 0, 1735689600000, 1735689600000),
('skill-20', 'KPI Tracking and Reporting', NULL, NULL, 1, 0, 1735689600000, 1735689600000);

