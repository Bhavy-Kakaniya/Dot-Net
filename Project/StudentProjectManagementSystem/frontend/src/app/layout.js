import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import './globals.css';

export const metadata = {
  title: 'SPMS - Student Project Management System',
  description: 'Admin dashboard for managing student projects, tasks, and users',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
