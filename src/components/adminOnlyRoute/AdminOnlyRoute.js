import React from 'react'
import { useSelector } from 'react-redux'
import {selectEmail} from '../../redux/slice/authSlice'
import { Link } from 'react-router-dom'

function AdminOnlyRoute({children}) {
  const userEmail = useSelector(selectEmail)

  if(userEmail === "dubbeezventureslimited@gmail.com") {
    return children
  } 
    return  (
      <section style={{height: "80vh"}}>
        <div className="container">
        <h2>Permission Denied.</h2>
        <p>This page can only be view by an Admin user.</p>
        <br/>
        <Link to="/">
        <button>&larr; Back To Home</button>
        </Link>
        </div>
      </section>
    )
 
}

export function AdminOnlyLink({children}) {
  const userEmail = useSelector(selectEmail)

  if(userEmail === "dubbeezventureslimited@gmail.com") {
    return children
  } 
    return null
 
}

export default AdminOnlyRoute
