"use client"

import { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/app/lib/convertToSubcurrency";
import styles from '@/app/css/checkout.module.scss';
import { usePageColor } from '@/app/contexts/page_color_context';



const CheckoutPage = ({amount}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const { setColors } = usePageColor();

    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      cardNumber: '',
      cardExpiry: '',
      cardCVC: ''
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };

    useEffect(() => {
        setColors({ text: 'red', background: '#00F135' });
    
        return () => setColors({ text: 'defaultTextColor', background: 'defaultBackgroundColor' });
    }, [setColors]);
    

    useEffect(() => {
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data?.clientSecret) {
                setClientSecret(data.clientSecret);
            } else {
                setErrorMessage("Failed to load client secret");
            }
        })
        .catch((error) => {
            setErrorMessage("Error fetching payment intent: " + error.message);
        });
    }, [amount]);


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
    
        if (!stripe || !elements) {
            return;
        }

        const {error: submitError} = await elements.submit();

        if (submitError) {
            setErrorMessage(submitError.message);
            setLoading(true);
            return
        }
        const {error} = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `http://www.localhost:3000/payment-success?amount=${amount}`,
            },
        })

        if (error) {
            setErrorMessage(error.message);
        } else {

        }

        setLoading(false);

    }
    
    return (
        <>
        <div className={styles.container}>
        <form action="" onSubmit={handleSubmit} className={styles.checkoutForm}>
        <h3>Contact Information</h3>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone Number (optional)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <h3>Delivery Address</h3>
        <div className={styles.formGroup}>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="zip">ZIP Code</label>
          <input
            type="text"
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            required
          />
        </div>
        <h3>Payment information</h3>
        <div className={styles.formGroup}>
            {errorMessage && <div>{errorMessage}</div>}
            {stripe && elements && clientSecret && <PaymentElement />}
            </div>
            <button disabled={!stripe || loading} className={styles.pay_button}>
                {!loading ? `Pay ${amount}` : "Processing..."}
            </button>
        </form>
        </div>
        </>
    );
    
}

export default CheckoutPage;