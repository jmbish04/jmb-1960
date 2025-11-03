# Career Search Assistant - Joe Bishop

A comprehensive job search assistant built on Cloudflare Workers with Mantine UI, designed specifically for Joe Bishop's job search needs.

## Features

- **AI-Powered Chat Interface**: Professional recruiter expert powered by GPT-OSS-120b
- **Speech-to-Text**: Voice input using Whisper-large-v3-turbo
- **Thread Management**: Multiple conversation threads with full context
- **Job Tracking**: Track job applications, fit scores, and application dates
- **Resume & Cover Letter Generation**: AI-generated tailored documents
- **PDF Export**: Convert resumes and cover letters to PDF using Browser Rendering API
- **Email Integration**: Forward recruiter emails for easy job analysis
- **D1 Database**: Persistent storage for all conversations, jobs, and documents
- **Durable Objects**: State management for chat context and question tracking

## Setup

1. Install dependencies:
```bash
npm install
```

2. Generate TypeScript types (IMPORTANT - run this after any config changes):
```bash
npm run generate-types
```

This generates `worker-configuration.d.ts` with types based on your Worker's configuration (bindings, compatibility date, flags).

3. Create D1 database:
```bash
npx wrangler d1 create job-search-db
```

4. Update `wrangler.jsonc` with your database ID and other binding IDs:
- `database_id` in `d1_databases`
- `id` in `kv_namespaces` (create a KV namespace first)
- Ensure R2 bucket exists

5. Run migrations:
```bash
npm run db:migrate:local  # for local development
npm run db:migrate        # for production
```

6. Initialize user profile with LinkedIn data:
```bash
# Update via API or manually in D1
```

7. Start development server:
```bash
npm run dev
```

## TypeScript Configuration

This project uses `wrangler types` to generate TypeScript types based on your Worker configuration. The generated `worker-configuration.d.ts` file includes:
- Runtime types based on your `compatibility_date` and `compatibility_flags`
- `Env` interface based on your bindings (D1, KV, R2, Durable Objects, etc.)

**Important**: Run `npm run generate-types` whenever you:
- Change your `wrangler.jsonc` configuration
- Add or modify bindings
- Update compatibility flags or dates

The types are automatically included in your `tsconfig.json`.

## Configuration

Update `wrangler.jsonc` with:
- D1 database ID
- KV namespace ID
- R2 bucket configuration
- Durable Objects namespace

## Models Used

- **AI Model**: `@cf/openai/gpt-oss-120b` - Main conversational AI
- **Speech-to-Text**: `@cf/openai/whisper-large-v3-turbo` - Voice transcription

## API Endpoints

- `GET /api/chat/threads` - List all chat threads
- `POST /api/chat/threads` - Create new thread
- `GET /api/chat/threads/:id/messages` - Get thread messages
- `POST /api/chat/threads/:id/stream` - Stream chat response
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Add new job (with URL or email content)
- `POST /api/resume/generate` - Generate resume or cover letter
- `GET /api/resume/pdf/:key` - Download PDF

## Deployment

```bash
npm run deploy
```

## Notes

- Job URLs must be from company websites, not LinkedIn (scraping restrictions)
- All conversations and context are logged to D1 for full recall
- Questions are tracked to avoid repetition
- Fit scores are calculated brutally and honestly (0-100 scale)
