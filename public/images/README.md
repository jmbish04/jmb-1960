# Frontend Images

This directory contains images used in the frontend React application.

## Usage in Components

Reference images in your React components like this:

```tsx
<img src="/images/step1_resume_info.png" alt="Resume Info" />
```

Or with React imports:

```tsx
import resumeInfoImg from './images/step1_resume_info.png';

<img src={resumeInfoImg} alt="Resume Info" />
```

## Current Images

- `step1_resume_info.png` - Reference image for resume/profile information structure

## Adding New Images

When adding new frontend images:
1. Place them in this `public/images/` directory
2. Use descriptive, lowercase filenames with underscores
3. Reference them in components using `/images/filename.png`

## Image Naming Convention

- Use descriptive prefixes: `step1_`, `step2_`, `icon_`, `screenshot_`, etc.
- Follow with descriptive name: `resume_info`, `job_analysis`, `chat_ui`, etc.
- Use lowercase with underscores
- Keep file extensions lowercase: `.png`, `.jpg`, `.svg`, `.webp`

