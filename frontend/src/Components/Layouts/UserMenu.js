import React from 'react'
import { NavLink } from 'react-router-dom'

const UserMenu = () => {
  return (
    <>
    <div className="list-group">

    <NavLink to="/dashboard/user/Profile" className="list-group-item list-group-item-action"><h4>PROFILE</h4> </NavLink>
     <NavLink to="/dashboard/user/Orders" className="list-group-item list-group-item-action">
     <h4>ORDERS</h4>
    </NavLink>
    
  
  </div>
  </>
  )
}

export default UserMenu