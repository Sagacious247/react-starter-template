import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useEffect, useState } from 'react'
import styles from './CheckoutForm.module.scss'
import CheckoutSummary from '../checkoutSummary/CheckoutSummary'
import Card from '../card/Card'
import spinnerImg from '../../assets/spinner.jpg'
import { toast } from 'react-toastify'

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if(!stripe) {
      return
    }
    const clientSecret = new URLSearchParams(window.location.search).get(
      "Payment_intent_client_secret"
      );
      if(!clientSecret) {
        return
      }

  }, [stripe])

  const saveOrder = () => {
    console.log("order Saved")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    if(!stripe || !elements) {
      return
    }
    setIsLoading(true)

    const confirmPayment = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/checkout-success"
      },
      redirect: "if_required"
    })
    .then((result) => {
      if(result.error) {
        toast.error(result.error.message)
        setMessage(result.error.message)
        return
      }
      if(result.paymentIntent) {
        if(result.paymentIntent.status === 'succeeded') {
          setIsLoading(false)
          toast.success("Payment successful.")
          saveOrder()
        }
      }
    });
    setIsLoading(false)
  }

  return (
    <section>
      <div className={`container ${styles.checkout}`}>
        <h2>Checkout</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <Card cardClass={styles.card}>
               <CheckoutSummary/>
            </Card>
          </div>

          <div >
           <Card cardClass={`${styles.card} ${styles.pay}` }> 
             <h3>Stripe Checkout</h3>

             <PaymentElement id={styles["payment-element"]}/>
             <button disabled={isLoading || !stripe || !elements}
             id='submit'
             className={styles.button}>
              <span id='button-text'>
                {isLoading ? (
                  <img src={spinnerImg} alt="" style={{width: "20px"}}/>
                ) : "Pay now"}
              </span>
             </button>
             {message && <div id={styles["payment-message"]}>
              {message}
              </div>}
           </Card>
          </div>
        </form>
      </div>
    </section>
  )
}

export default CheckoutForm
