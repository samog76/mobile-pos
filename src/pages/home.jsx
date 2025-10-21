import styles from './home.module.css';
import {Link} from 'react-router-dom';

function Home() {
  return (
    <>
      <div className={styles['home-container']}>
        <h1>Welcome to Quicktap</h1>
        <p>Select your preferred payment method:</p>
      </div>
      <div className={styles['payment-methods']}>
        <Link to="/card" className={styles['payment-button']}>Debit Card</Link>
        <Link to="/transfer" className={styles['payment-button']}>Bank Transfer</Link>
      </div>
      <p>
        <div className={styles['History']}>

          <h1>History</h1>
          {/* i'll see if i can use js */}
        </div>
      </p>
    </>
  );
}

export default Home;
