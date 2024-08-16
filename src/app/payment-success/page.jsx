export default function PaymentSuccess({ searchParams }) {
    const { amount } = searchParams;

    return (
        <main>
            <h1>Thank you!</h1>
            <h2>You have successfully sent</h2>
            <h2>DKK{amount}</h2>
        </main>
    );
}
