const { Stripe } = window;

export default Stripe(process.env.REACT_APP_STRIPE_PK);
