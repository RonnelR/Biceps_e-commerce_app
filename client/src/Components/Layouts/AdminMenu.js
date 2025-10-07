import React from 'react'
import { NavLink  } from 'react-router-dom'

const AdminMenu = () => {
  return (
    <>
    <div className="list-group">
    <NavLink to="/dashboard/admin/Create-Products" className="list-group-item list-group-item-action">
      <h4>CREATE PRODUCT</h4>
    </NavLink>
    <NavLink to="/dashboard/admin/Create-Categories" className="list-group-item list-group-item-action"><h4>CREATE CATEGORIES</h4></NavLink>

    <NavLink to="/dashboard/admin/Products" className="list-group-item list-group-item-action"><h4>PRODUCTS</h4></NavLink>

    <NavLink to="/dashboard/admin/Orders" className="list-group-item list-group-item-action"><h4>ORDERS</h4></NavLink>
    
  </div>
  </>
  )
}

export default AdminMenu