
# FinanceBloom

## Project Overview

FinanceBloom is a personal finance application designed to help users manage their budgets, track their financial goals, and make informed investment decisions. It provides a user-friendly interface with various tools and calculators to empower users to achieve their financial aspirations.

## Features

*   **Budgeting:**
    *   Track income and expenses.
    *   Categorize expenses for better insights.
    *   Visualize spending patterns with charts and summaries.
    *   Edit and update income entries through a dialog interface.
        *   Uses a `<Dialog>` component from Shadcn-UI for editing income.
        *   Displays a "Updating..." state while the update is in progress.
*   **Goal Setting:**
    *   Define financial goals (e.g., buying a house, retirement).
    *   Track progress towards goals.
    *   Dynamically calculate goal progress based on current amount and target amount.
    *   Update goal details, including:
        *   Name
        *   Target Amount
        *   Current Amount
        *   Target Date
        *   Monthly Contribution
        *   Expected Return
        *   Icon Type
    *   The `goalsStore` uses a flexible `updatePayload` object to send only the changed goal properties to the backend.
*   **Smart Reminders:**
    *   Create custom reminders with specific dates and times.
    *   Track financial deadlines and important events.
    *   Manage reminder priorities and types (one-time, recurring).
    *   Automated reminders for SIP contributions, goal deadlines, and portfolio reviews.
*   **Calculators:**
    *   CAGR Calculator
    *   FD Calculator
    *   FIRE Calculator
    *   Goal SIP Calculator
    *   HRA Calculator
    *   IRR Calculator
    *   MF Calculator
    *   NSC Calculator
    *   RD Calculator
    *   SIP Calculator
    *   SSY Calculator
*   **User Authentication:**
    *   Secure user registration and login.
    *   Protected routes for authenticated users.
*   **Modern UI:**
    *   Built with React and Shadcn-UI for a responsive and accessible user interface.
    *   Styled with Tailwind CSS for rapid and consistent styling.
*   **Backend API (Express/TypeScript/Supabase):**
    *   A separate backend project (`my-backend`) provides a secure API gateway for the frontend.
    *   Handles user authentication and data access.
    *   Uses Supabase as a backend-as-a-service for database and authentication.
    *   Supabase project ID: `niwoaxqveoliutdvatcu`

## Technology Stack

*   **Frontend:**
    *   React
    *   Vite
    *   TypeScript
    *   Shadcn-UI
    *   Tailwind CSS
    *   Zustand (likely, for state management in `src/store/goalsStore.ts`)
*   **Backend:**
    *   Node.js
    *   Express
    *   TypeScript
    *   Supabase
