import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../components/card/Card'
import styles from './auth.module.scss'
import registerImg from '../../assets/register.png'
import { toast } from 'react-toastify'
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {auth, db} from '../../firebase/config'
import Loader from '../../components/loader/Loader'
import { doc, setDoc } from 'firebase/firestore'


function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState('')
  const [cPassword, setCPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const registerUser = async (e) => {
    e.preventDefault()

    if(password !== cPassword) {
      toast.error("Password do not match")
    }
     setIsLoading(true)
     try{
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      setIsLoading(false)
      toast.success("Registration successful...")
      navigate("/login")
     }catch(error) {
      toast.error(error.message)
      setIsLoading(false)
     }
  }

  return (
    <section className={`container ${styles.auth}`}>
      {isLoading && <Loader/>}
       <Card>
     <div className={styles.form}>
       <h2>Register</h2>

       <form onSubmit={registerUser}>
       
        <input 
        type='email' 
        id='email'
        placeholder='Email' 
        value={email}
        required 
        onChange={(e) => setEmail(e.target.value)}/>
        <input 
        type='password' 
        placeholder='Confirm Password'
        required 
        value={password}
        onChange={(e) => setPassword(e.target.value)}/>
        <input 
        type='password' 
        placeholder='Confirm Password' 
        required
        value={cPassword}
        onChange={(e) => setCPassword(e.target.value)}/>
        <button type='submit' className='--btn --btn-primary --btn-block'>Register</button>
    
       </form>
        <span className={styles.register}>
          <p>Already have an account? </p>
        <Link to="/login">Login</Link>
        </span>
     </div>
        </Card>
        <div className={styles.img}>
      <img width="400px" src={registerImg} alt='register'/>
     </div>
    </section>
  )
}

export default Register
