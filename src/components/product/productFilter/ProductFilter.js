import React, { useEffect, useState } from 'react'
import styles from './ProductFilter.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { selectMaxPrice, selectProducts, selecteMinPrice } from '../../../redux/slice/productSlice'
import { FILETR_BY_PRICE, FILTER_BY_BRAND, FILTER_BY_CATEGORY } from '../../../redux/slice/filterSlice'

function ProductFilter() {
  const [category, setCategory] = useState("All")
  const [brand, setBrand] = useState("All")
  const [price, setPrice] = useState(3000)
  const products = useSelector(selectProducts)
  const minPrice = useSelector(selecteMinPrice)
  const maxPrice = useSelector(selectMaxPrice)

  const dispatch = useDispatch()

  const allCategories = [
  "All",
    ...new Set(products.map((product) => product.category))
  ]

  const allBrands= [
    "All",
      ...new Set(products.map((product) => product.brand))
    ]

    useEffect(() => {
      dispatch(FILTER_BY_BRAND({products, brand}))
    }, [dispatch, products, brand])

    useEffect(() => {
      dispatch(FILETR_BY_PRICE({products, price}))
    }, [dispatch, products, price])


  const filterProducts = (cat) => {
    setCategory(cat)
    dispatch(FILTER_BY_CATEGORY({products, category: cat}))
  }

  const clearFilters = () => {
    setCategory("All")
    setBrand("All")
    setPrice(maxPrice)
  }
  return (
    <div className={styles.filter}>
      <h4>Categories</h4>
      <div className={styles.category}>
        {allCategories.map((cat, index) => {
          return (
            <button
             type='button' 
             key={index}
             className={`${category }` === cat ? `${styles.active}` : null}
             onClick={() => filterProducts(cat)}>
              &#8250; {cat}</button>
          )
        })}
        </div>
        <h4>Brand</h4>
        <div className={styles.brand}>
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            {allBrands.map((brand, index) =>  {
              return (
                <option key={index} value={brand}>{brand}</option>
              )
            })}
          </select>
          <h4>Price</h4>
          <p>{`$${price}`}</p>
          <div className={styles.price}>
           <input type='range' value={price} 
           onChange={(e) => setPrice(e.target.value)} 
           min={minPrice}
           max={maxPrice}/>
          </div>
          <br></br>
          <button className='--btn --btn-danger' 
          onClick={clearFilters}>
            Clear Filter
          </button>
      </div>
    </div>
  )
}

export default ProductFilter
