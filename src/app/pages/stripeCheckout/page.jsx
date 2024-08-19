"use client";
import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "@/app/pages/stripeCheckout/checkoutPage";
import convertToSubcurrency from "@/app/lib/convertToSubcurrency";
import { useShoppingBag } from "@/app/contexts/shopping_bag_context";
import Collapsible from 'react-collapsible';
import Image from "next/image";
import styles from '@/app/css/checkout.module.scss';
import Menu from "@/app/components/menu";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function StripeCheckout() {
    const { bag } = useShoppingBag(); 
    const [clientSecret, setClientSecret] = useState("");

   
    const amount = bag.reduce((total, { product }) => total + product.price, 0);

    useEffect(() => {
        if (amount > 0) { 
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
                    console.error("Failed to load client secret");
                }
            })
            .catch((error) => {
                console.error("Error fetching payment intent:", error);
            });
        }
    }, [amount]);

    return (
        <>
            <Menu
    primary="red"
    secondary="#00F135"
    />
    
    <div className={styles.background}></div>
        <main className={styles.checkout_main_container}>
            <div className={styles.order_summary_container}>
      <Collapsible
          className={styles.triggers}
          trigger='Show order Summary'
          triggerStyle={{ color: 'red', cursor: 'pointer', fontSize: '15px' }}
          contentContainerTagName="article"
          transitionTime={300}
          easing="ease-in-out"
          open={false}
          classParentString={styles.MyCollapsible}
        >
      <ul>
        {bag.map(({ product }) => (
          <li key={product.id} className={styles.li_container}>
            <Image 
            src={product.productFrontImage.url} alt="" height="70" width="70"
            />
            <div>
              <h3>{product.category} - {product.paintCombo}</h3>
              <p>{product.size}</p>
            </div>
            <p>${product.price}</p>
          </li>
        ))}
      </ul>
      </Collapsible>
      </div>
      <div className={styles.total}>
      <h2>Total: DKK {amount}</h2>
      </div>
            {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutPage amount={amount} />
                </Elements>
            )}
        </main>
        </>
    );
}
