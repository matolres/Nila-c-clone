"use client";
import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "@/app/pages/stripeCheckout/checkoutPage";
import convertToSubcurrency from "@/app/lib/convertToSubcurrency";
import { useShoppingBag } from "@/app/contexts/shopping_bag_context";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function StripeCheckout() {
    const { bag } = useShoppingBag(); // Get the shopping bag context
    const [clientSecret, setClientSecret] = useState("");

    // Calculate the total amount from the shopping bag
    const amount = bag.reduce((total, { product }) => total + product.price, 0);

    useEffect(() => {
        if (amount > 0) { // Only fetch if there's a positive amount
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
        <main>
            <h2>Total: DKK {amount}</h2>
            {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutPage amount={amount} />
                </Elements>
            )}
        </main>
    );
}
