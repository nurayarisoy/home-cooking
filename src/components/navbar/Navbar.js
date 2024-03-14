import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className="container mx-auto flex justify-between items-center py-4">
        <div>
          <Link href="/">
            Home Cooking
          </Link>
        </div>
        <div>
          <Link href="pages/customer/login">
            Login as Customer
          </Link>
          <Link href="pages/chef/login">
            Login as Chef
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
