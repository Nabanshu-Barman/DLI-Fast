# **App Name**: Velocity Points

## Core Features:

- Parallax Hero Section: A dynamic full-screen hero section featuring a WebP animation whose playback is directly synchronized with scroll position, overlayed with a bold text and action buttons. This provides an immersive entry point to the platform.
- Member & Admin Authentication: A centralized login interface with distinct tabs for 'Member Login' and 'Admin Login,' including email/password inputs and simulated authentication states with loading indicators.
- Dynamic Navigation & Theming: A sticky top navigation bar enabling seamless SPA navigation between core views and featuring a user-toggleable dark/light mode switch.
- Course Catalogue: A responsive grid display of available courses, each with a card showing title, description, 'Points Required,' and a 'Request Course' button, complemented by skeleton loading animations.
- Member Dashboard: A personalized view for authenticated members displaying current points (with radial progress animation), active course progress, and a history of redeemed codes and requested courses with status, all featuring skeleton loading states.
- Admin Panel: A restricted interface for administrators to view global statistics (members, points issued, pending requests), manage course requests with 'Approve'/'Reject' actions, and a form to issue points to users, with simulated loading states.
- Animated UI Interactions: Integrate Framer Motion for smooth fade-in/slide-up transitions between main views, subtle glassmorphism on UI elements, and interactive hover states (lifts, glowing box-shadows) on all interactive components.

## Style Guidelines:

- Primary accent: A vibrant, glowing 'NVIDIA Green' (#76B900) for buttons, active states, progress bars, and interactive highlights, as explicitly requested to align with NVIDIA's branding.
- Default background (dark mode): Pure black (#000000) to create a deep, tech-forward aesthetic as per user specifications.
- Alternative background (light mode): Clean white (#FFFFFF), maintaining crisp readability while ensuring the NVIDIA Green remains prominent.
- Card backgrounds: In dark mode, graphite/dark grey cards (#1A1A1A); in light mode, light grey cards (#F3F4F6) for visual segmentation and subtle contrast.
- Text colors: Crisp white text (#FFFFFF) on dark mode backgrounds and dark charcoal text (e.g., #333333) on light mode backgrounds for optimal readability.
- Secondary accent: A bright, tech-forward yellow (#F7DB5D) derived to be analogous to the primary green, providing contrast for secondary highlights and subtle glow effects.
- Headline font: 'Space Grotesk' (sans-serif) for a modern, tech-inspired feel in prominent titles and hero text.
- Body font: 'Inter' (sans-serif) for clean, objective readability across all text content and UI elements.
- Icons: 'Lucide React' will be utilized for its extensive, modern, and easily customizable set of SVG icons, supporting the tech-forward aesthetic.
- Glassmorphism: Subtle backdrop-blur effects applied to floating UI elements like the navigation bar and overlay cards, contributing to a premium, layered aesthetic.
- Responsiveness: The design will be fully responsive, ensuring optimal display and functionality across all devices, from mobile to desktop.
- View transitions: Framer Motion will provide smooth fade-in and slide-up animations when navigating between the four main application views, enhancing the SPA experience.
- Interactive elements: Hover states will feature subtle lifting and increasing green box-shadow/glow effects on all interactive elements to provide clear visual feedback.