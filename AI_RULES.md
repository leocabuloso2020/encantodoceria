# AI Rules for Doces da Paty Application

This document outlines the core technologies used in this project and provides guidelines for library usage to ensure consistency, maintainability, and best practices.

## Tech Stack Overview

*   **React**: The primary library for building interactive user interfaces.
*   **TypeScript**: Used for type safety across the entire codebase, enhancing code quality and developer experience.
*   **Vite**: The build tool providing a fast and efficient development environment.
*   **Tailwind CSS**: A utility-first CSS framework for styling, ensuring responsive and consistent designs.
*   **shadcn/ui**: A collection of beautifully designed, accessible, and customizable UI components built with Radix UI and Tailwind CSS.
*   **React Router DOM**: Manages client-side routing and navigation within the application.
*   **TanStack Query (React Query)**: Handles server state, data fetching, caching, and synchronization.
*   **Lucide React**: Provides a comprehensive set of customizable SVG icons.
*   **Zod & React Hook Form**: Used together for robust form validation and management.
*   **Sonner**: A modern toast notification library for user feedback.

## Library Usage Rules

To maintain a consistent and efficient codebase, please adhere to the following rules when implementing features:

*   **UI Components**: Always prioritize `shadcn/ui` components for all user interface elements. If a specific component is not available in `shadcn/ui` or requires significant custom behavior, create a new component in `src/components/` and style it using Tailwind CSS. **Do not modify files within `src/components/ui` directly.**
*   **Styling**: All styling must be done using **Tailwind CSS** utility classes. Avoid writing custom CSS in separate files for components. Ensure all designs are inherently responsive.
*   **Routing**: Use `react-router-dom` for all application navigation. The main routes should be defined in `src/App.tsx`.
*   **State Management & Data Fetching**: For managing server state, data fetching, caching, and synchronization, use **TanStack Query**. For simple, local component state, `useState` and `useReducer` are appropriate.
*   **Icons**: All icons should be sourced from **Lucide React**.
*   **Forms**: For building and validating forms, use **React Hook Form** for form management and **Zod** for schema-based validation.
*   **Notifications**: For displaying toast notifications to users, use **Sonner**.
*   **Date Handling**: For date manipulation and formatting, use `date-fns`. For date input components (e.g., calendars), use `react-day-picker`.
*   **Carousels**: For any carousel or slider functionalities, use `embla-carousel-react`.