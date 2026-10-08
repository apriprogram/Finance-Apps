# CLAUDE.md

# Aplikasi Pencatat Keuangan (SaaS)

## Project Overview

Aplikasi pencatat keuangan berbasis Next.js yang bersifat Mobile First,
PWA, Multi User SaaS.

## Tujuan

-   Mencatat pemasukan, pengeluaran, transfer.
-   Mengelola multi-wallet.
-   Budget bulanan.
-   Target tabungan.
-   Hutang & piutang.
-   Laporan grafik.
-   Export Excel/PDF.
-   Scan struk OCR.

------------------------------------------------------------------------

# Tech Stack

## Frontend

-   Next.js (App Router)
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   React Hook Form
-   Zod
-   TanStack Query
-   Zustand
-   Recharts

## Backend

-   Supabase
-   PostgreSQL
-   Prisma ORM
-   Supabase Auth
-   Supabase Storage

## Deployment

-   Vercel
-   PWA

------------------------------------------------------------------------

# Design System

Style: - Minimalist Modern - Fintech Dashboard - Mobile First -
Responsive

Primary Color: - Indigo / Violet

Border Radius: - rounded-xl

Icons: - Lucide React

Typography: - Inter

------------------------------------------------------------------------

# Modules

1.  Authentication
2.  Dashboard
3.  Wallet
4.  Categories
5.  Transactions
6.  Budget
7.  Savings Goals
8.  Debt & Receivable
9.  Reports
10. Export
11. Receipt OCR
12. Settings

------------------------------------------------------------------------

# Database Tables

-   users
-   wallets
-   categories
-   transactions
-   budgets
-   savings_goals
-   savings_transactions
-   debts
-   debt_payments
-   receipt_scans
-   export_logs

Semua tabel memiliki: - id UUID - created_at - updated_at - user_id
(kecuali auth)

------------------------------------------------------------------------

# Folder Structure

    app/
    components/
    features/
      auth/
      dashboard/
      wallet/
      transaction/
      budget/
      savings/
      debt/
      report/
      receipt/
      settings/
    lib/
    hooks/
    types/
    prisma/
    public/

------------------------------------------------------------------------

# Business Rules

-   Semua data diisolasi menggunakan user_id.
-   Gunakan Row Level Security Supabase.
-   Soft delete bila memungkinkan.
-   Semua nominal menggunakan DECIMAL(15,2).
-   Currency default IDR.
-   Transfer memperbarui dua wallet.
-   Pengeluaran memperbarui budget.
-   Setoran tabungan memperbarui wallet dan target tabungan.
-   Pembayaran hutang memperbarui sisa hutang.

------------------------------------------------------------------------

# Dashboard Widgets

-   Total Saldo
-   Total Pemasukan
-   Total Pengeluaran
-   Total Tabungan
-   Budget Progress
-   Grafik Bulanan
-   Riwayat Terakhir
-   Hutang Jatuh Tempo
-   Target Tabungan

------------------------------------------------------------------------

# MVP Roadmap

## Phase 1

-   Authentication
-   Dashboard
-   Wallet
-   Category
-   Transaction
-   Budget
-   Savings
-   Debt
-   Reports

## Phase 2

-   OCR
-   Export
-   Notification
-   PWA
-   Settings

## Phase 3

-   Subscription
-   Open Banking
-   AI Insight
-   Auto Categorization
-   Multi Currency

------------------------------------------------------------------------

# Coding Standards

-   TypeScript Strict Mode
-   ESLint
-   Prettier
-   Conventional Commits
-   Feature-based architecture
-   Reusable Components
-   Server Actions jika memungkinkan
-   Validasi menggunakan Zod
-   React Hook Form untuk seluruh form
-   TanStack Query untuk server state

------------------------------------------------------------------------

# Definition of Done

Setiap fitur harus: - Responsive - Mobile First - Dark Mode Ready -
Loading State - Empty State - Error State - Success Toast - Unit Test
(opsional) - Clean Code - Dokumentasi

------------------------------------------------------------------------

# Future Features

-   AI Financial Assistant
-   Smart Budget Recommendation
-   Investment Tracker
-   Shared Family Wallet
-   Recurring Transaction
-   Calendar View
-   QRIS Receipt Scanner
-   WhatsApp Reminder
-   Email Report
-   Push Notification
