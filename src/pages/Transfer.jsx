import styles from './home.module.css';
import {Link} from 'react-router-dom';
import React, {useState} from 'react';
import { PaystackButton } from 'react-paystack';

function Transfer() {
  const [amount, setAmount] = useState("");
  const [ email, setEmail ] = useState("");

  const publicKey = "pk_test_5d044ba49e93d99d24b559440d0f8fde74aef9ed";

  const componentProps = {
    email,
    amount: amount * 100,
    publicKey,
    text: "Pay Now",
    onSuccess: () => alert("Thanks for your payment!"),
    onClose: () => alert("Wait! You need to complete your payment."),
  };

  return (
    <div>
      <h1>Bank Transfer Payment</h1>
      <p>Enter the amount you want to transfer:</p>
      <input type="number" placeholder="Amount" className={styles['payment-button']} value={amount} onChange={(e) => setAmount(e.target.value)} />
      <input type="email" placeholder="Email" className={styles['payment-button']} value={email} onChange={(e) => setEmail(e.target.value)} />
      <PaystackButton {...componentProps} />
      <p>
      <Link to="/home" className={styles['payment-button']}>Back to home</Link>
      </p>
    </div>
  );
}

export default Transfer;
