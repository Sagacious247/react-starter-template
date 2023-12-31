import { loadStripe } from '@stripe/stripe-js'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectBillingAddress, selectShippingAddress } from '../../redux/slice/checkoutSlice'
import { CALCULATE_SUBTOTAL, CALCULATE_TOTAL_QUANTITY, selectCartItems, selectCartTotalAmount } from '../../redux/slice/cartSlice'
import { selectEmail } from '../../redux/slice/authSlice'
import { toast } from 'react-toastify'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from '../../components/checkoutForm/CheckoutForm'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK)

function Checkout() {
    const [message, setMessage] = useState("Initializing checkout...")
    const [clientSecret, setClientSecret] = useState("")

    const cartItems = useSelector(selectCartItems)
    const totalAmount = useSelector(selectCartTotalAmount)
    const customerEmail = useSelector(selectEmail)

    const shippingAddress = useSelector(selectShippingAddress)
    const billingAddress = useSelector(selectBillingAddress)

    const dispatch = useDispatch()

    useEffect(() => {
      dispatch(CALCULATE_SUBTOTAL())
      dispatch(CALCULATE_TOTAL_QUANTITY())
    }, [dispatch, cartItems])

    const description = `Dubbeez Ventures payment: email: ${customerEmail}, Amount: ${totalAmount}`

    useEffect(() => {
        fetch("/http://localhost:4242/create-payment-intent", {
          method: "POST",
          headers: {"Content-type": "application/json"},
          body: JSON.stringify({
            items: cartItems,
            userEmail: customerEmail,
            shipping: shippingAddress,
            billing: billingAddress,
            description,
          })
        })
        .then((res) => {
          if(res.ok) {
            return res.json()
          }
          return res.json().then((json) => Promise.reject(json))
        })
        .then((data) => {
          setClientSecret(data.clientSecret)
        })
        .catch((error) => {
          setMessage("Fail to initialize checkout")
          toast.error("Something went wrong!!!")
        })
    }, [])

    const appearance = {
      theme: "stripe",
    };
    const options = {
      clientSecret,
      appearance,
    }
  return (
    <>
     <section>
      <div className='container'>
       {!clientSecret && <h3>{message}</h3>}
      </div>
     </section>

     {clientSecret && (
      <Elements options={options} 
      stripe={stripePromise}>
        <CheckoutForm/>
      </Elements>
     )}
    </>
  )
}

export default Checkout
