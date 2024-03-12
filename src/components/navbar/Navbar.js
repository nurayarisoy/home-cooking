import styles from './Navbar.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className="container mx-auto flex justify-between items-center py-4">
        <div>
          <a href="/" className={styles.logo}>Home Cooking</a>
        </div>
        <div>
          <a href="/customer-login" className={styles.link}>Login as Customer</a>
          <a href="/chef-login" className={styles.link}>Login as Chef</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
