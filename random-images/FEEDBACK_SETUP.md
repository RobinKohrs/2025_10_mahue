# Feedback System Setup Guide

## 📝 Current Implementation

The feedback system is now implemented with:

- ✅ **Floating feedback button** (bottom-right corner)
- ✅ **Modal form** with text area
- ✅ **"Zu dieser Grafik" checkbox** (includes current filter state)
- ✅ **API endpoint** at `/api/feedback`
- ✅ **Temporary file storage** (development mode)

## 🚀 Database Integration Options

### Option 1: Supabase (Recommended - Free & Simple)

1. **Create account** at [supabase.com](https://supabase.com)
2. **Create new project**
3. **Create feedback table**:

```sql
CREATE TABLE feedback (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  feedback text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  server_timestamp timestamptz DEFAULT now(),
  user_agent text,
  ip_address text,
  filter_state jsonb,
  created_at timestamptz DEFAULT now()
);
```

4. **Install Supabase client**:

```bash
npm install @supabase/supabase-js
```

5. **Update the API endpoint** (`src/routes/api/feedback/+server.ts`):

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY')

export const POST: RequestHandler = async ({ request }) => {
	const feedbackData = await request.json()

	const { data, error } = await supabase.from('feedback').insert([
		{
			feedback: feedbackData.feedback,
			timestamp: feedbackData.timestamp,
			server_timestamp: new Date().toISOString(),
			user_agent: request.headers.get('user-agent'),
			ip_address: request.headers.get('x-forwarded-for'),
			filter_state: feedbackData.filterState
		}
	])

	if (error) throw error
	return json({ success: true })
}
```

### Option 2: Simple JSON File (Current - Development Only)

Currently saves to `feedback-data/feedback-{timestamp}.json` files.
**Note**: Only works in development, not in production deployment.

### Option 3: Email Integration

Replace database with email notifications:

1. **Install email service**:

```bash
npm install @sendgrid/mail
# or
npm install nodemailer
```

2. **Update API to send emails** instead of storing in database.

## 📊 Feedback Data Structure

```typescript
{
  feedback: string,           // User's feedback text
  timestamp: string,          // Client timestamp (ISO)
  serverTimestamp: string,    // Server timestamp (ISO)
  userAgent: string,          // Browser info
  ip: string,                 // User IP (if available)
  filterState?: {             // Only if "zu dieser Grafik" checked
    inputs: {
      jahr: { filter: "alle", selected: [] },
      parteiId: { filter: "ein", selected: ["ÖVP"] },
      // ... other filters
    },
    blockDecision: { ... }
  }
}
```

## 🎨 Customization

### Change Button Position

In `FeedbackButton.svelte`, modify:

```svelte
<div class="fixed bottom-4 right-4 z-50">
<!-- Change to: bottom-4 left-4, top-4 right-4, etc. -->
```

### Change Button Style

```svelte
<Button
  size="lg"
  color="primary"
  class="shadow-lg rounded-full">  <!-- Add rounded-full for circle -->
```

### Add More Form Fields

In `FeedbackButton.svelte`, add after the checkbox:

```svelte
<div class="mb-4">
	<label class="mb-2 block text-sm font-medium text-gray-700">
		E-Mail (optional)
	</label>
	<input
		type="email"
		bind:value={userEmail}
		placeholder="ihre.email@example.com"
		class="sm:text-sm w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
</div>
```

## 🔒 Security Considerations

- Add rate limiting to prevent spam
- Sanitize input data
- Consider CAPTCHA for public deployment
- Set up proper CORS if needed
- Use environment variables for database credentials

## 📈 Analytics

Track feedback metrics by querying your database:

- Most common feedback themes
- Filter state patterns when issues occur
- User engagement with specific chart configurations
