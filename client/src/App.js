import {Routes,Route} from "react-router-dom"
import Home from "./Pages/Home";
import About from "./Pages/About";
import Cart from "./Pages/Cart";
import Categories from "./Pages/Categories";
import Contact from "./Pages/Contact";
import PageNotFound from "./Pages/PageNotFound";
import Privacy from "./Pages/Privacy";
import Dashboard  from "./Pages/User/Dashboard";
import PrivateRoute from "./Components/Routes/Private";
import Login from "./Pages/AuthPage/Login";
import Registration from "./Pages/AuthPage/Registration";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminPrivateRoute from "./Components/Routes/AdminPrivateRoute";
import CreateProducts from "./Pages/Admin/CreateProducts";
import CreateCategories from "./Pages/Admin/CreateCategories";
import UserProfile from "./Pages/User/UserProfile";
import UserOrders from "./Pages/User/UserOrders";
import Products from "./Pages/Admin/Products";
import UpdateProduct from "./Pages/Admin/UpdateProduct";
import ProductDetails from "./Pages/ProductDetails";
import SearchInput from "./Pages/SearchInput";
import CategoriesProducts from "./Pages/CategoriesProducts";
import AllOrders from "./Pages/Admin/AllOrders";
import Wishlist from "./Pages/Wishlist";
import ForgetPassword from "./Pages/AuthPage/ForgetPassword";
import VerifyOtp from "./Pages/AuthPage/VerifyOtp";
import NewPassword from "./Pages/AuthPage/NewPassword";



function App() {
  return (
    <>

  <Routes>
       
    <Route path="/" element={<Home/>}  />
    <Route path="/product-details/:slug" element={<ProductDetails/>}  />
    <Route path="/Search" element={<SearchInput/>}  />

    <Route path="/dashboard" element={<PrivateRoute/>}>
        <Route path="user" element={<Dashboard/>}/>
        <Route path="user/Profile" element={<UserProfile/>}/>
        <Route path="user/Orders" element={<UserOrders/>}/>
        </Route>

    <Route path="/dashboard" element={<AdminPrivateRoute/> }>
      <Route path="admin" element={<AdminDashboard/> } />
      <Route path="admin/Create-Products" element={<CreateProducts/>} />
      <Route path="admin/Create-Categories" element={<CreateCategories/> } />
      <Route path="admin/Products/:slug" element={<UpdateProduct/> } />
      <Route path="admin/Orders" element={<AllOrders/> } />
      <Route path="admin/Products" element={<Products/> } />
    </Route>

    <Route path="/About" element={<About/>}  />
    <Route path="/Cart" element={<Cart/>}  />
    <Route path="/Wishlist/get-list" element={<Wishlist/>}  />
    <Route path="/Categories" element={<Categories/>}  />
    <Route path="/Categories-products/:slug" element={<CategoriesProducts/>}  />
   
    <Route path="/ForgetPassword" element={<ForgetPassword/>}  />
    <Route path="/Verify-Otp" element={<VerifyOtp/>}  />
    <Route path="/NewPassword" element={<NewPassword/>}  />

    <Route path="/Contact" element={<Contact/>}  />
    <Route path="/Login" element={<Login/> } />
    <Route path="*" element={<PageNotFound/>}  />
    <Route path="/Privacy" element={<Privacy/> } />
    <Route path="/Registration" element={<Registration/>}  />
    
</Routes>
    
    </>
    
  )
}

export default App;
