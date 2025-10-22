# Yemen Diabetes Association (YDA) - Bilingual Website + CMS

A full-featured bilingual (Arabic/English) website with complete admin CMS for the Yemen Diabetes Association.

**URL**: https://lovable.dev/projects/9d48099a-c55c-4ddf-ad78-663cc1c7c65f

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Routing**: React Router v6 with locale-aware routes (/ar/*, /en/*)
- **UI**: TailwindCSS + Radix UI (shadcn/ui)
- **Backend**: Lovable Cloud (Supabase)
- **i18n**: i18next + react-i18next
- **Forms**: React Hook Form + Zod
- **Date handling**: date-fns

## Features

### Public Website
- ✅ Bilingual Support (Arabic RTL / English LTR)
- ✅ Home Page with hero, mission/vision/values, KPIs
- ✅ Events list with filters + detail with registration & Add-to-Calendar
- ✅ Programs showcase
- ✅ Resources/Blog with search
- ✅ Contact form
- ✅ Get Involved (Volunteer/Donate/Partner)

### Admin CMS
- ✅ Email/password authentication
- ✅ Role-based access (SUPERADMIN, EDITOR, VIEWER)
- ✅ Dashboard with statistics
- ✅ Events, Programs, Posts management
- ✅ Form submissions viewer
- ✅ Settings management

## Quick Start

```sh
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:8080/ar` for Arabic or `http://localhost:8080/en` for English.

## First Admin User

1. Navigate to `/admin/login`
2. Click "Sign Up" and create an account
3. **The first user automatically becomes SUPERADMIN**
4. Subsequent users need role assignment

## Database Schema

Content uses bilingual JSONB fields (`{"ar": "...", "en": "..."}`):

- `page` + `block` - Pages with content blocks
- `event` - Events with registration
- `program` - YDA programs  
- `post` - Blog articles
- `kpi` - Key performance indicators
- `submission` - Form submissions
- `user_roles` - Access control

## Deployment

Click **Share → Publish** in Lovable to deploy your site.

## Custom Domain

Navigate to **Project > Settings > Domains** to connect your domain.

[Read more](https://docs.lovable.dev/features/custom-domain)

---

© 2024 Yemen Diabetes Association. Built with Lovable.
