import React, { useState } from 'react'
import styles from './auth.module.scss'
import loginImg from '../../assets/login.png'
import { Link, useNavigate } from 'react-router-dom';
import {FaGoogle} from 'react-icons/fa'
import Card from '../../components/card/Card';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { toast } from 'react-toastify';
import Loading from '../../components/loader/Loader'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { selectPreviousURL } from '../../redux/slice/cartSlice';

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const previousURL = useSelector(selectPreviousURL)
  const navigate = useNavigate()

  const redirectUser = () => {
    if(previousURL.includes("cart")) {
      return navigate("/cart")
    } else {
      navigate("/")
    }
  }


  const loginUser = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try{
     const userCredential = await signInWithEmailAndPassword(auth, email, password)
     const user = userCredential.user
     setIsLoading(false)
     toast.success("Login successful...")
     redirectUser()
    }catch(error) {
     toast.error(error.message)
     setIsLoading(false)
    }
  }

  // Login with Google
  const provider = new GoogleAuthProvider()
  const signInWithGoogle = async () => {
    try{
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      toast.success("Login successfully...")
      redirectUser()
    } catch(error) {
      toast.error(error.message)
    }
  }

  // const handleLogin = async (e) => {
  //    e.preventDefault()
  //    setIsLoading(true)

  //    try{
  //      const userCredential = await signInWithEmailAndPassword(auth, email, password)
  
  //      if(userCredential.user) {
  //        setIsLoading(false)
  //        toast.success("Login successful...")
  //       navigate('/')
  //      }
  //    } catch(error) {
  //     setIsLoading(false)
  //     toast.error(error.message)
  //    }
  // }

  // const signInWithGoogle = async () => {
  //    try{
  //      const provider = new GoogleAuthProvider()

  //      const result = await signInWithPopup(auth, provider)
  //       const user = result.user

  //       const docRef = doc(db, "users", user.uid)
  //       const docSnap = await getDoc(docRef)

  //       if(!docSnap.exists()) {
  //         await setDoc(doc(db, "users", user.uid), {
  //           name: user.displayName,
  //           email: user.email,
  //           TimeRanges: new Date().toString()
  //         })
  //       }
        
  //       toast.success("Login successfully")
  //       navigate('/')
  //    } catch(error) {
  //       toast.error('Could not authorize with google')
  //    }
  // }

    return (
      <>
      {isLoading && <Loading />}
    <section className={`container ${styles.auth}`}>
     <div className={styles.img}>
      <img width="400px" src={loginImg} alt=''/>
     </div>

       <Card>
     <div className={styles.form}>
       <h2>Login</h2>

       <form onSubmit={loginUser}>
        <input type='text' 
        placeholder='Email' 
        required 
        value={email}
        id='email'
        onChange={(e) => setEmail(e.target.value)}
        />
        <input type='password' 
        placeholder='password'
        value={password}
        required 
        onChange={(e) => setPassword(e.target.value)}/>
        <button type='submit'
        className='--btn --btn-primary --btn-block'>
          Login
          </button>
        <div className={styles.links}>
            <Link to="/reset">
            Reset Password
            </Link>
        </div>

        <p>-- or --</p>
       </form >
       <button 
       className='--btn --btn-danger --btn-block'
        onClick={signInWithGoogle}
       >
        <FaGoogle color="#fff" /> 
       Login With Google
       </button>
        <span className={styles.register}>
          <p>Don't have an account? </p>
        <Link to="/register">Register</Link>
        </span>
     </div>
        </Card>
    </section>
    </>
    )

}

export default Login;