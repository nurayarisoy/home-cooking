// components/Navbar/Navbar.js

import Link from 'next/link';
import styles from './Navbar.css';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className="container mx-auto flex justify-between items-center py-4">
        <div>
          <Link href="/">
            <a className={styles.logo}>Home Cooking</a>
          </Link>
        </div>
        <div>
          <Link href="/customer-login">
            <a className={styles.link}>Login as Customer</a>
          </Link>
          <Link href="/chef-login">
            <a className={styles.link}>Login as Chef</a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
