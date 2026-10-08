# Catat Keuangan

Aplikasi pencatat keuangan mobile first berbasis Next.js, TypeScript, Tailwind CSS, Zustand, Recharts, Prisma, dan Supabase.

## Fitur MVP

- Dashboard saldo, pemasukan, pengeluaran, tabungan, budget, dan transaksi terbaru.
- Tambah transaksi pemasukan, pengeluaran, dan transfer dengan update wallet/budget lokal.
- Budget bulanan per kategori.
- Target tabungan.
- Hutang dan piutang.
- Laporan grafik kategori dan ringkasan.
- Export report UI untuk Excel/PDF.
- Scan struk OCR UI dengan hasil deteksi contoh.
- Prisma schema sesuai rancangan database.

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Integrasi Supabase

1. Salin `.env.example` menjadi `.env.local`.
2. Isi `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Jalankan migrasi Prisma setelah database Supabase siap.

```bash
npx prisma generate
npx prisma migrate dev
```
