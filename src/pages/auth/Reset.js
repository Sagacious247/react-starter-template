import React, { useState } from 'react'
import resetImg from '../../assets/forgot.png'
import styles from './auth.module.scss'
import Card from '../../components/card/Card'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../firebase/config'
import { toast } from 'react-toastify'
import Loading from '../../components/loader/Loader'

function Reset() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const resetPassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
     await sendPasswordResetEmail(auth, email)
     setIsLoading(false)
     toast.success("Check your email for a reset link")
    } catch(error) {
      setIsLoading(false)
      toast.error(error.message)
    }
  }

  return (
    <>
    {isLoading && <Loading />}
     <section className={`container ${styles.auth}`}>
    <div className={styles.img}>
      <img width="400px" src={resetImg} alt='Reset Password'/>
     </div>

       <Card>
     <div className={styles.form}>
       <h2>Reset Password</h2>

       <form onSubmit={resetPassword}>
        <input 
        type='email' 
        id='email'
        placeholder='Email' 
        required
         value={email}
         onChange={(e) => setEmail(e.target.value)}
        />
        <button type='submit' className='--btn --btn-primary --btn-block'>Reset Password</button>

        <div className={styles.links}>
          <p>
            <Link to="/login">
            - Login
            </Link>
          </p>
          <p>
            <Link to="/register">
           - Register
            </Link>
          </p>
        </div>
    
       </form>
     </div>
        </Card>
      
    </section>
    </>

  )
}

export default Reset
