import React from 'react'
import { NavLink ,Link } from 'react-router-dom';
import { useAuth } from '../../Context/Auth';
import toast,{Toaster} from 'react-hot-toast';
import Search from './Forms/Search';
import useCategory from '../../Hooks/useCategory';
import {useCart} from '../../Context/CartContext'
import { Badge } from 'antd';
import {HeartFilled } from '@ant-design/icons'


const Header = () => {

const categories = useCategory();
const [auth, setAuth]= useAuth();
const [cart] = useCart()

const logoutButton = ()=>{
  setAuth({
    ...auth,
    user:null,
    token:''
  })

  localStorage.removeItem('auth');

  toast.success("User Loged Out!")
}

  return (
    <>
 <nav className="navbar navbar-expand-lg navbar-dark bg-info" aria-label="Offcanvas navbar large">
  <div className="container-fluid">
  <img style={{width:"2%"}} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpD8cirrbgyCl69qM1AsYaNBoaEt6hNJv9Y7WToPUvAwVSXObB' 
  alt='contact_us'></img>
  
    <Link to={'/'} className="navbar-brand text-warning p-2" >BICEPS</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar2" aria-controls="offcanvasNavbar2" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon" />
    </button>
    <div className="offcanvas offcanvas-end text-bg-dark" tabIndex={-1} id="offcanvasNavbar2" aria-labelledby="offcanvasNavbar2Label">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasNavbar2Label">BICEPS</h5>
        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close" />
      </div>


      <div className="offcanvas-body">
      <Search/>
        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
        
          <li className="nav-item">
            <NavLink to={'/'} className="nav-link " aria-current="page" >Home</NavLink>
          </li>

{ auth.user ? <>
  <li className="nav-item">
            <NavLink to={'/Wishlist/get-list'} className="nav-link "  ><HeartFilled />  </NavLink>
          </li>
</> : ""}
         


        
          <div>
             <li className="nav-item dropdown">
            <Link className="nav-link dropdown-toggle" to={'/Categories'} role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Categories
            </Link>
            <ul className="dropdown-menu">
            <li>
            <Link to={'/Categories'} className="dropdown-item">All Products</Link>
          </li>


          <li>
       {categories?.map((c)=>(
        
            <Link key={c?._id}  to={`/Categories-products/${c?.slug}`} className="dropdown-item">{c?.name}</Link>
         
         ))}
         </li>

         
            </ul>
          </li> 
          </div>

         
          {!auth.user ? ( <>
          <li className="nav-item">
            <NavLink to={'/Registration'} className="nav-link" >Registration</NavLink>
          </li>

          <li className="nav-item">
            <NavLink to={'/Login'} className="nav-link">Login</NavLink>
          </li>
          </>) : (<>
<div>
             <li className="nav-item dropdown">
            <NavLink className="nav-link dropdown-toggle" to={'/login'} role="button" data-bs-toggle="dropdown" aria-expanded="false">
            {auth.user.name}
            </NavLink>
            <ul className="dropdown-menu">
            <li>
            <NavLink to={`/dashboard/${auth.user.role === 1 ? "admin" : "user" }`} className="dropdown-item">Dashboard</NavLink>
          </li>
              <li>
            <NavLink onClick={logoutButton} to={'/login'} className="dropdown-item">Logout</NavLink>
          </li>
            </ul>
          </li> 
          </div>
          </>
          
          ) }

         

          <li className="nav-item"> 

     <Badge count={cart?.length} showZero>
          <NavLink to={'/Cart'} className="nav-link">Cart</NavLink>
    </Badge>
          
          </li>
        </ul>
      </div>
    </div>
  </div>
</nav>
<Toaster/>
    </>
  )
}

export default Header