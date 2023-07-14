import React from 'react'
import styles from './AddProducts.module.scss'
import { useState } from 'react'
import Card from '../../card/Card'
import { db, storage } from '../../../firebase/config'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { toast } from 'react-toastify'
import { Timestamp, addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../../loader/Loader'
import { useSelector } from 'react-redux'
import { selectProducts } from '../../../redux/slice/productSlice'

const categories = [
  {
    id: 1,
    name: "Laptop"
  }, 
  {
    id: 2,
    name: "Electronics"
  },
  {
    id: 3,
    name: "Fashion"
  },
  {
    id: 4,
    name: "Phone"
  }
]

const inititalState = {
  name: "",
  imageURL: "",
  category: "",
  price: 0,
  brand: "",
  desc: "",
}

function AddProduct() {
  const {id} = useParams()

  const products = useSelector(selectProducts)
  const productEdit = products.find((item) => item.id === id)

  const [product, setProduct] = useState(() => {
    const newState = detectForm(
      id,
      {...inititalState},
      productEdit
    )
    return newState;
  });

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const [uploadProgress, setUploadProgress] = useState(0)

  function detectForm(id, f1, f2) {
    if(id === "ADD") {
      return f1
    }
    return f2
  }

  const handleInputChange = (e) => {
    const {name, value} = e.target
    setProduct({...product, [name]: value})
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    const storageRef = ref(storage, `DubbeezVentures/${Date.now()}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
  (snapshot) => {
   
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setUploadProgress(progress)
  }, 
  (error) => {
    toast.error(error.message)
  }, 
  () => {
   
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      setProduct({
        ...product,
        imageURL: downloadURL
      })
      toast.success("Image uploaded successfully.")
    });
  }
);

  }

  const addProduct = async (e) => {
    e.preventDefault()
    console.log(product)

    try {
            const docRef = await addDoc(collection(db, "products"), {
              name: product.name,
               imageURL: product.imageURL,
               price: Number(product.price),
               category: product.category,
               brand: product.brand,
               desc: product.desc,
               createdAt: Timestamp.now().toDate()
             });
             setIsLoading(false)
             setUploadProgress(0)
             setProduct({...inititalState})
             toast.success("Product uploaded successfully.")
      
             navigate("/admin/all-products")
      
            }catch(error) {
              toast.error(error.message)
              setIsLoading(false)
            }
         }

         const editProduct = (e) => {
           e.preventDefault()
           setIsLoading(true)

           if(product.imageURL !== productEdit.imageURL) {
            const storageRef = ref(storage, productEdit.imageURL);
             deleteObject(storageRef)
           }

           try{
             setDoc(doc(db, "products", id), {
              name: product.name,
              imageURL: product.imageURL,
              price: Number(product.price),
              category: product.category,
              brand: product.brand,
              desc: product.desc,
              createdAt: productEdit.createdAt,
              editedAt: Timestamp.now().toDate()
            });
            setIsLoading(false)
            toast.success("Product edited successfully")
            navigate("/admin/all-products")
           }catch(error) {
            setIsLoading(false)
            toast.error(error.message)
           }
         }

  return (
    <>
    {isLoading && <Loader/>}
    <div className={styles.product}>
      <h2>{detectForm(id, "Add New Product", "Edit Product")}</h2>
      <Card cardClass={styles.card}>
        <form onSubmit={detectForm(id, addProduct, editProduct)}>
       <label>Product Name:</label>
       <input 
       type='text'
       placeholder='Product Name'
       required
       name='name'
       value={product.name}
       onChange={(e) => handleInputChange(e)}
       />

       <label>Product image:</label>
       <Card cardClass={styles.group}>
        {uploadProgress === 0 ? null : (
        <div className={styles.progress}>
         <div className={styles["progress-bar"]} 
         style={{width: `${uploadProgress}%`}}>
          {uploadProgress < 100 ? `Uploading 
          ${uploadProgress}` : 
          `Upload Complete ${uploadProgress}%`}
         </div>
        </div>
        )}
        
       <input type='file'
        placeholder='Product Image'
        accept='image/*'
        name='image'
        onChange={(e) => handleImageChange(e)}
        />

        {product.imageURL === "" ? null : (
          <input 
           type='text'
          //  required
           name='imageURL'
           disabled
           value={product.imageURL}
           placeholder='Image URL'
          />
        )}
       </Card>

       <label>Product price:</label>
       <input 
       type='number'
       placeholder='Product Price'
       required
       name='price'
       value={product.price}
       onChange={(e) => handleInputChange(e)}
       />

    <label>Product Category:</label>
       <select 
       name='category' 
       required
       value={product.category}
       onChange={(e) => handleInputChange(e)}
       >
        <option value="" disabled>
          -- choose product category --
        </option>
         {categories.map((cat) => {
          return(
            <option key={cat.id} value={cat.name}>
             {cat.name}
            </option>
          )
         })}
        </select>

        <label>Product Company/Brand:</label>
       <input 
       type='text'
       placeholder='Product brand'
       required
       name='brand'
       value={product.brand}
       onChange={(e) => handleInputChange(e)}
       />

     <label>Product Description:</label>
       <textarea name='desc'
       value={product.desc}
       required
       cols="30" rows="10"
       onChange={(e) => handleInputChange(e)}>
       </textarea>
       <button className='--btn --btn-primary'>{detectForm(id, "Save Product", "Edit Product")}</button>
       </form>
      </Card>
    </div>
    </>
  )
}

export default AddProduct