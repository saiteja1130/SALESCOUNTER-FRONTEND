# Conversly AI — WhatsApp AI Sales Assistant SaaS Dashboard

Conversly AI is a SaaS platform engineered to help businesses manage WhatsApp leads, automate sales qualification, coordinate sales representatives with round-robin routing, schedule follow-ups, and track conversions.

## 🌟 Key Features & Architected Workflows

### 1. Multi-Role Experience & Interactive Switcher
- **Owner (Elena Vance · Artisan Living Decor)**:
  - Complete control: Executive Dashboard, Shared WhatsApp Inbox, All Leads CRM, Teach Your AI, Sales Team & Round-Robin, Follow-up Automations, Broadcast Campaigns, Subscription Plans, and Business Settings.
- **Salesperson (Marcus Chen · Senior Sales Rep)**:
  - Focused work queue: Personal Dashboard, My Inbox, My Assigned Leads, Follow-ups, and Profile. Restricted from company-wide administrative controls (with built-in Access Denied guard and configurable demo permission toggle).
- **Platform Administrator (Devon Miller · Operations Admin)**:
  - Platform-wide console: Cross-tenant metrics, Organizations Directory, Users & Roles, Subscription Tiers & MRR, Broadcast Telemetry, and Audit Activity Log.
- **1-Click Role Switcher**: Available in the top bar and profile menus to effortlessly preview all three roles.

### 2. WhatsApp Shared Inbox (`/inbox`)
- Inspired by WhatsApp Web with a 3-panel layout:
  1. **Conversation List**: Real-time search, filter tabs (All, Needs Attention, AI Active, Human Taken Over), unread badges, lead stage tags.
  2. **Chat Stream**: WhatsApp speech bubbles, delivery checkmarks, "AI Replying" indicator, instant "Take Over Chat" / "Resume AI" control, quick preset inquiry simulator chips.
  3. **Lead Intelligence Sidebar**: Sales pipeline status selector, salesperson assignment, estimated deal value editor, AI-extracted qualification variables, and internal notes log.
- Full mobile responsiveness: smoothly switches between conversation list and active chat view with a back button.

### 3. Comprehensive Leads CRM (`/leads`)
- **Table View**: High-density data grid with selection checkboxes, bulk status update, bulk salesperson assignment, and CSV export.
- **Kanban Board**: Drag/move leads across pipeline stages (New, Contacted, Interested, Follow-up, Converted, Lost) with column deal summaries.
- **Slide-out Lead Drawer**: Deep inspection of qualification data, notes, and direct chat shortcut.
- **Add / Edit Modal**: Form validation for new inbound leads.
- **Real CSV Export**: Generates and downloads actual `.csv` files client-side.

### 4. Teach Your AI (`/teach-ai`)
- System prompt and persona tone configuration (Consultative Expert, Professional, High-Energy Sales, Casual).
- Inbound WhatsApp welcome message template with dynamic variables.
- Knowledge base document indexing (PDF spec sheets).
- Product & pricing catalog management with SKUs and inventory tracking.
- Qualification requirements definition.
- **Interactive Test Chat Sandbox**: Simulated WhatsApp chat testing the AI assistant against active catalog rules without making external API calls.

### 5. Follow-ups & Automation Rules (`/follow-ups`)
- Rule builder for inactive delays, stage transitions, and AI reminders.
- Quiet Hours protection (holds automated messages between 9 PM and 8 AM).
- Scheduled queue with "Trigger Now", "Postpone 24h", and "Cancel" controls.

### 6. Broadcast Campaigns (`/campaigns`)
- Marketing add-on preview with active/locked toggle.
- Audience segmentation (interested, cold leads, past converted).
- Broadcast creation wizard with delivery metrics (98.2% delivered, 28.6% reply rate).

### 7. Plans, Usage & Settings (`/plans`, `/settings`)
- Usage meters for monthly leads, AI message quota, and team seats.
- Basic ($49), Growth ($149), and Enterprise ($399) tier simulation with instant upgrade/downgrade.
- WhatsApp Business simulated device status (+1 555-839-2041).
- Google Gemini 2.5 Flash API Key simulation with latency verification test.
- Full data export (JSON) and Reset Demo Data to initial seed.

## 🛠️ Technology Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 with Inter typography and custom tabular numeral discipline
- **Icons**: Lucide React
- **Routing**: React Router DOM v7
- **State & Persistence**: React Context + localStorage with fallback seed data

## 🚀 Running Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
