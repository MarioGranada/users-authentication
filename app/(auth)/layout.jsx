import '../globals.css';
import { logout } from '@/actions/auth-actions';

export const metadata = {
  title: 'Next Auth',
  description: 'Next.js Authentication',
};

const AuthLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <header id="auth-header">
          <p>Welcombe back!</p>
          <form action={logout}>
            <button>Logout</button>
          </form>
        </header>
        {children}
      </body>
    </html>
  );
};

export default AuthLayout;
