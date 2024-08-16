"use client"

import { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/app/lib/convertToSubcurrency";


const CheckoutPage = ({amount}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);
    

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
        <form action="" onSubmit={handleSubmit}>
            {errorMessage && <div>{errorMessage}</div>}
            {stripe && elements && clientSecret && <PaymentElement />}
            <button disabled={!stripe || loading}>
                {!loading ? `Pay ${amount}` : "Processing..."}
            </button>
        </form>
    );
    
}

export default CheckoutPage;