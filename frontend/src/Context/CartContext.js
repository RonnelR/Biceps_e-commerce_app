import {useState ,createContext ,useContext ,useEffect} from 'react'

const CartContext = createContext();

const CartProvider = ({children}) =>{
    const [cart,setCart] = useState([]);

  
    useEffect(()=>{
        let existingCarItem = localStorage.getItem('cart');
        if(existingCarItem) setCart(JSON.parse(existingCarItem))
    },[])

    return(
        <CartContext.Provider value={[cart,setCart]}>
            {children}
        </CartContext.Provider>
    )

}

const useCart = () => useContext(CartContext);

export {useCart,CartProvider}