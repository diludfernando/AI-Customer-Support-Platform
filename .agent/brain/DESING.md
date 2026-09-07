AI Customer Support Platform — UI Design System

1. Design Overview

The AI Customer Support Platform should use a modern, clean, professional SaaS-style interface.

The design should communicate:

Trust

Simplicity

Intelligence

Professionalism

Speed

Reliability

The interface should remain visually clean because support agents may spend long periods using the dashboard.

Design direction: Soft neutral backgrounds + white cards + indigo primary color + subtle AI accent colors.

Avoid excessive gradients, bright backgrounds, heavy shadows, or unnecessary animations.

2. Color Palette

Primary Colors

Purpose

Color

Hex

Primary

Indigo Blue

#4F46E5

Primary Hover

Dark Indigo

#4338CA

Secondary

Violet

#7C3AED

AI Accent

Cyan

#06B6D4

Use Primary for primary buttons, active navigation, links, selected elements, important actions, and focus indicators.

Use Secondary and AI Accent sparingly for AI features, AI icons, AI badges, knowledge retrieval, processing states, and AI-generated content.

Neutral Colors

Purpose

Hex

Main Background

#F8FAFC

Card Background

#FFFFFF

Border

#E2E8F0

Main Text

#0F172A

Secondary Text

#64748B

Muted Text

#94A3B8

The majority of the interface should use neutral colors. Do not make entire pages blue or purple.

Background #F8FAFC
        ↓
White Cards #FFFFFF
        ↓
Dark Text #0F172A
        ↓
Indigo Actions #4F46E5

Semantic Colors

Status

Color

Hex

Success / Resolved

Green

#22C55E

Warning / Waiting

Amber

#F59E0B

Error / Urgent

Red

#EF4444

Information

Blue

#3B82F6

Suggested ticket statuses:

OPEN → Blue

IN_PROGRESS → Indigo

WAITING_CUSTOMER → Amber

RESOLVED → Green

CLOSED → Gray

Suggested priorities:

LOW → Gray / Green

MEDIUM → Blue

HIGH → Amber

URGENT → Red

Do not rely only on color. Always include a text label or icon.

3. Typography

Recommended Font

Use Inter as the primary application font.

font-family:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;

Typography Scale

Element

Size

Weight

Page Title

28–32px

600–700

Section Heading

20–24px

600

Card Heading

16–18px

600

Body

14–16px

400

Labels / Status

12–14px

500

4. Main Layout

Use a standard SaaS dashboard layout with a sidebar, top navigation, and content area.

┌──────────────────────────────────────────────────────────┐
│ Top Navigation                         🔔  Agent  Avatar │
├──────────────┬───────────────────────────────────────────┤
│              │                                           │
│ Dashboard    │ Support Dashboard                         │
│ Tickets      │                                           │
│ Messages     │ ┌────────┐ ┌────────┐ ┌────────┐         │
│ Customers    │ │ Metric │ │ Metric │ │ Metric │         │
│              │ └────────┘ └────────┘ └────────┘         │
│ AI Assistant │                                           │
│ Knowledge    │ Recent Tickets                            │
│              │ ┌──────────────────────────────────────┐  │
│ Analytics    │ │ #1024 Payment issue       Urgent    │  │
│ Reports      │ │ #1023 Login problem       Medium    │  │
│              │ │ #1022 Refund request      Low       │  │
│ Settings     │ └──────────────────────────────────────┘  │
│              │                                           │
└──────────────┴───────────────────────────────────────────┘

Keep the interface spacious. Avoid overcrowding dashboards with too many cards or charts.

5. Sidebar

Suggested navigation:

Logo

Dashboard

SUPPORT
Tickets
Messages
Customers

AI
AI Assistant
Knowledge Base

INSIGHTS
Analytics
Reports

SYSTEM
Settings

Active Navigation

Use a subtle light-indigo background with:

Text: #4F46E5
Icon: #4F46E5

A white or very light sidebar is preferred over a fully saturated blue sidebar.

6. Cards

Recommended card style:

background: #FFFFFF;
border: 1px solid #E2E8F0;
border-radius: 12px;

Use subtle shadows only when needed.

Example:

┌─────────────────────────┐
│ Open Tickets            │
│                         │
│ 124                     │
│                         │
│ ↑ 12% from last month   │
└─────────────────────────┘

Recommended border radius: 10px–12px.

7. Buttons

Primary

Background: #4F46E5
Text: #FFFFFF
Hover: #4338CA

Use for the most important action:

[ Create Ticket ]

Secondary

Background: #FFFFFF
Text: #0F172A
Border: #E2E8F0

Destructive

Background: #EF4444
Text: #FFFFFF

Reserve destructive buttons for actions such as deleting a user, removing an agent, or deleting a knowledge document.

8. Forms

Recommended input style:

background: #FFFFFF;
border: 1px solid #CBD5E1;
border-radius: 8px;

Focus state:

Border: #4F46E5
Focus Ring: subtle Indigo

Always show validation errors clearly and close to the relevant field.

9. AI Components

AI functionality should be visually distinguishable without making it feel disconnected from the rest of the application.

Use Indigo, Violet, and Cyan accents.

Example:

┌──────────────────────────────────────────────┐
│ ✨ AI Suggested Response                    │
│                                              │
│ Based on the available knowledge, the       │
│ customer's payment may still be processing. │
│                                              │
│                [ Edit ] [ Use Response ]     │
└──────────────────────────────────────────────┘

Recommended AI labels:

✨ AI Suggested
✨ AI Summary
✨ AI Generated
✨ AI Classification

Avoid large AI gradients. If a gradient is used, reserve it for small AI-specific elements:

background: linear-gradient(
  135deg,
  #4F46E5,
  #7C3AED,
  #06B6D4
);

10. Ticket UI

Ticket lists should make status, priority, assignee, and customer information easy to scan.

┌──────────────────────────────────────────────────────┐
│ #1024   Payment deducted but order pending           │
│ John Silva                           🔴 URGENT        │
│ Billing • Assigned to Agent Sarah                    │
│ Updated 5 minutes ago                                │
└──────────────────────────────────────────────────────┘

Ticket details should prioritize:

Customer message

Ticket status and priority

Conversation history

AI summary

AI suggested response

Agent actions

11. Chat Interface

Customer and agent messages should be visually distinct.

Customer
┌──────────────────────────────────────┐
│ My payment was deducted but my       │
│ order still says payment pending.    │
└──────────────────────────────────────┘

                          AI Assistant ✨
              ┌──────────────────────────────┐
              │ I found information related │
              │ to pending payments...      │
              └──────────────────────────────┘

Clearly identify whether a message came from:

Customer

Support Agent

AI Assistant

System

12. Dashboard Metrics

Recommended dashboard cards:

Total Tickets

Open Tickets

In Progress

Urgent Tickets

Resolved Today

Average Resolution Time

AI Resolution Rate

Customer Satisfaction

Use charts only when they help answer a meaningful question.

13. Icons

Use one consistent icon library across the application.

Recommended style:

Simple outline icons

Consistent stroke width

Minimal decorative icons

Icons paired with labels for important actions

Avoid mixing several unrelated icon styles.

14. Spacing

Use a consistent spacing system.

Recommended base spacing:

4px
8px
12px
16px
24px
32px
48px

Typical usage:

Small element gap     → 8px
Input/button spacing  → 12px
Card padding          → 16–24px
Section gap           → 24–32px
Page padding          → 24–32px

15. Responsive Design

The interface must support desktop, tablet, and mobile layouts.

Desktop

Full sidebar

Multi-column dashboard

Ticket table/list with full metadata

Tablet

Collapsible sidebar

Reduced dashboard columns

Preserve primary actions

Mobile

Drawer navigation

Single-column cards

Stacked ticket details

Touch-friendly buttons and inputs

Do not simply shrink the desktop interface.

16. Accessibility

The UI should:

Maintain sufficient text/background contrast.

Show visible keyboard focus states.

Use labels for form fields.

Support keyboard navigation.

Avoid using color as the only status indicator.

Use descriptive button labels.

Provide accessible names for icon-only buttons.

Keep body text readable.

Use semantic HTML where possible.

17. Design Rules

Do

Keep screens clean and spacious.

Use neutral backgrounds.

Use Indigo for important actions.

Use consistent spacing.

Use consistent border radii.

Keep AI elements visually identifiable.

Make ticket status and priority easy to scan.

Maintain clear visual hierarchy.

Design reusable components.

Avoid

Excessive gradients.

Too many colors on one screen.

Large heavy shadows.

Excessive animations.

Overly rounded components.

Very dense dashboards.

Different styles for the same component.

Using red for normal actions.

Making every AI element flashy.

18. CSS Design Tokens

:root {
  /* Brand */
  --color-primary: #4F46E5;
  --color-primary-hover: #4338CA;
  --color-secondary: #7C3AED;
  --color-ai-accent: #06B6D4;

  /* Background */
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;

  /* Text */
  --color-text-primary: #0F172A;
  --color-text-secondary: #64748B;
  --color-text-muted: #94A3B8;

  /* Borders */
  --color-border: #E2E8F0;

  /* Semantic */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;

  /* Radius */
  --radius-input: 8px;
  --radius-card: 12px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
}

19. Overall Visual Direction

The finished product should feel like a modern professional customer-support SaaS platform rather than a generic admin template.

The visual hierarchy should be:

Neutral Application UI
        +
Strong Indigo Primary Actions
        +
Subtle Violet/Cyan AI Identity
        +
Clear Semantic Ticket Colors
        =
Professional AI Support Platform

Core Design Principle

Keep normal support workflows simple and professional, and use AI styling as a subtle enhancement rather than the dominant visual theme.