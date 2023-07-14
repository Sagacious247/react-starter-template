import React, { useEffect } from 'react'
import styles from './Home.module.scss'
import Slider from '../../components/slider/Slider'
import Product from '../../components/product/Product'

function Home() {
  const url = window.location.href;

  const scrollToProduct = () => {
    if(url.includes("#product")) {
      window.scrollTo({
        top: 800,
        behavior: "smooth"
      })
    }
  }
  useEffect(() => {
    scrollToProduct()
  }, [])
  return (
    <div>
      <Slider/>
      <Product/>
    </div>
  )
}

export default Home
