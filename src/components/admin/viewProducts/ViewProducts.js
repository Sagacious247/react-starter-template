import React, { useEffect} from 'react'
import { toast } from 'react-toastify'
import {deleteDoc, doc} from 'firebase/firestore' 
import {db, storage} from '../../../firebase/config'
import { Link } from 'react-router-dom'
import {FaEdit, FaTrashAlt} from 'react-icons/fa'
import Loader from '../../../components/loader/Loader'
import styles from './ViewProducts.module.scss'
import { deleteObject, ref } from 'firebase/storage'
import Notiflix from 'notiflix'
import { useDispatch, useSelector } from 'react-redux'
import { STORE_PRODUCTS, selectProducts } from '../../../redux/slice/productSlice'
import useFetchCollection from '../../../customHooks/useFetchCollection'

function ViewProducts() {
  const {data, isLoading} = useFetchCollection("products")

  const products = useSelector(selectProducts)
 
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
         STORE_PRODUCTS({
           products: data
         })
       )
  }, [dispatch, data])

  const confirmDelete = (id, imageURL) => {
    Notiflix.Confirm.show(
      'Delete Product!!!',
      'Are you sure you want to delete this product?',
      'Delete',
      'Cancel',
      function okCb() {
        deleteProduct(id, imageURL)

      },
      function cancelCb() {
        alert('If you say so...');
      },
      {
        width: '320px',
        borderRadius: '3px',
        titleColor: "orangered",
        okButtonBackground: "orangered",
        sccAnimationStyle: "zoom"
        // etc...
      },
    );
  }

  const deleteProduct = async (id, imageURL) => {
    try{
       await deleteDoc(doc(db, "products", id))

       const storageRef = ref(storage, imageURL);
       await deleteObject(storageRef)
       toast.success("Product deleted successfully")
    }catch(error) {
      toast.error(error.message)
    }
  }
  return (
    <>
    {isLoading && <Loader/>}
    <div className={styles.table}>
     <h2>All Products</h2>
     {products.length === 0 ? (
      <p>No products found</p>
     ) : (
       <table>
        <thead>
        <tr>
          <th>s/n</th>
          <th>Image</th>
          <th>name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {products.map((product, index) => {
          const {name, category, imageURL, price, id} = product
          return (
            <tr key={id}>
             <td>
              {index + 1}
             </td>
             <td>
              <img src={imageURL} alt={name} style={{width: "100px"}}/>
             </td>
             <td>
              {name}
             </td>
             <td>
              {category}
             </td>
             <td>
              {`$${price}`}
             </td>
             <td className={styles.icons}>
              <Link to={`/admin/add-product/${id}`}>
              <FaEdit size={20} color='green'/>
              </Link>
              &nbsp;
              <FaTrashAlt
              onClick={() => confirmDelete(id, imageURL)}
               size={18} color='red'/>
             </td>
            </tr>
          )
        })}
        </tbody>
       </table>
     )}
    </div>
     
    </>
  )
}

export default ViewProducts
