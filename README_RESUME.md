# Resume Page Setup Instructions

## 1. Run Database Migrations

First, apply the new migration for resume data tables:

```bash
wrangler d1 migrations apply DB --remote
```

## 2. Import Resume Data

Import the resume data from `resume.json` into D1:

```bash
wrangler d1 execute DB --remote --file=./scripts/import-resume-data-sql.sql
```

This will populate:
- `resume_experiences` table with 5 job experiences
- `resume_education` table with 2 education entries
- `resume_skills` table with 20 skills

## 3. Set Up Environment Variables

### Local Development (.dev.vars)

The `.dev.vars` file has been created with placeholders. Update it with your actual Cloudflare credentials:

```bash
# Get these from: https://dash.cloudflare.com/profile/api-tokens
CLOUDFLARE_ACCOUNT_ID=your_actual_account_id
CLOUDFLARE_API_TOKEN=your_actual_api_token
```

### Production Secrets

For production, set secrets using:

```bash
wrangler secret put CLOUDFLARE_ACCOUNT_ID
wrangler secret put CLOUDFLARE_API_TOKEN
```

## 4. Resume Data CRUD API

The resume data can be managed via API endpoints:

### Get All Resume Data
```
GET /api/resume-data
```

### Experiences
- `GET /api/resume-data/experiences` - List all experiences
- `POST /api/resume-data/experiences` - Create new experience
- `PUT /api/resume-data/experiences/{id}` - Update experience
- `DELETE /api/resume-data/experiences/{id}` - Soft delete (marks as deleted)

### Education
- `GET /api/resume-data/education` - List all education entries
- `POST /api/resume-data/education` - Create new education entry
- `PUT /api/resume-data/education/{id}` - Update education entry
- `DELETE /api/resume-data/education/{id}` - Soft delete

### Skills
- `GET /api/resume-data/skills` - List all skills
- `POST /api/resume-data/skills` - Create new skill
- `PUT /api/resume-data/skills/{id}` - Update skill
- `DELETE /api/resume-data/skills/{id}` - Soft delete

## 5. Job Scraping

The resume page includes job URL scraping functionality:

1. Enter a job URL (preferably from company website, not LinkedIn)
2. Click "Go" to scrape the job posting
3. The AI will analyze the job against the resume data
4. Chat with the AI to customize the resume for that job

If scraping fails, the AI will instruct the user to paste the job description directly into the chat.

## 6. Resume Customization Flow

1. User enters job URL or pastes job description
2. AI analyzes job requirements against resume data
3. AI provides:
   - Fit score (0-100)
   - Specific customization recommendations
   - Questions to improve fit score if needed
4. User chats with AI to refine resume
5. Resume preview updates in real-time on the right side

## Notes

- All resume data operations use soft delete (`is_deleted = 1`) to preserve history
- The resume preview renders using the same HTML template as `default_resume.html`
- The AI has access to all resume data and can make recommendations
- Job scraping uses Cloudflare Browser Rendering API via Puppeteer

