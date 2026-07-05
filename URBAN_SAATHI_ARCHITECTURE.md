# Urban Saathi - Architecture & Context Document

## Context
This document serves to provide context to any AI agents interacting with the "Urban Saathi" repository.
The user's goal is to build a production-ready service marketplace (like Uber, Rapido, Urban Company) where customers can book local professionals (plumbers, electricians, etc.).
The system is transitioning from a basic college-style project into a highly scalable, real-world application.

## Tech Stack
- **Frontend**: React 19, Vite, React Router DOM, Tailwind CSS, Leaflet.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JWT, Cookies.

## Core Rules for Agents
1. **Never rush to code**: Analyze before modifying.
2. **Production-level standards**: Write scalable, clean code. Implement validation, error handling, logging, and security best practices.
3. **UI/UX Guidelines**: Uber-inspired simplicity. Minimalist, clean typography, neutral colors, professional shadows, mobile-first. No oversized cards or generic templates.
4. **Step-by-Step**: Follow the established 11-Phase roadmap located in the `implementation_plan.md`. Finish one feature completely before moving to the next.
5. **No Duplicate Code**: Reuse existing components.
6. **Explanation**: Always explain major changes before implementation.

## Database Schema Highlights (Current)
- `Customer`: Name, email, mobile, address list, profile image.
- `Professional`: Name, email, mobile, profession, experience, service_area, location coordinates (needed), rating, isVerified, working hours.
- `Booking`: References Customer and Professional, service details, price, location, dates, status (pending -> accepted -> on_the_way -> in_progress -> completed -> cancelled), payment details.

## Current Roadmap Phase
Check `task.md` and `implementation_plan.md` in the artifacts directory for the exact current progress.
