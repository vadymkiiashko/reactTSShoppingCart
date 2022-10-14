import { createContext, ReactNode, useContext, useState } from "react";
import {ShopingCart} from '../components/ShoppingCart'
import  { useLocalStorage } from '../hooks/useLocalSotrage'

type ShopingCartProviderProps = {
    children : ReactNode    
}

type ShopingCartContext = {
    openCart: () => void
    closeCart : () => void
    getItemQuantity : (id : number) => number
    increaseCartQuantity : (id : number) => void
    decreaseCartQuantity : (id : number) => void
    removeFromCart : (id : number) => void
    cartQuantity : number
    cartItems : CartItem[]

}

type CartItem = {
    id : number 
    quantity : number
}
const ShopingCartContext = createContext({} as ShopingCartContext);

export function useShopingCart() {
    return useContext(ShopingCartContext)
}

export function ShopingCartProvider({children} : ShopingCartProviderProps) {
    const [cartItems , setCartItems] = useLocalStorage<CartItem[]>('shoping-cart',[])
    const [isOpen, setIsOpen] = useState(false)

    const openCart = ()=> setIsOpen(true)

    const closeCart = ()=> setIsOpen(false)

    function getItemQuantity(id:number) {
        return cartItems.find(item => item.id === id)?.quantity || 0
    }

    function increaseCartQuantity(id:number) {
        setCartItems( currItems => {
            if (currItems.find(item =>  item.id === id) == null) {
                return [...currItems, {id , quantity : 1}]
            } else {
                return currItems.map(item => {
                    if (item.id === id) {
                        return {...item, quantity : item.quantity+1}
                    } else {
                        return item
                    }
                })
            }
        })
    }

    function decreaseCartQuantity(id:number) {
        setCartItems( currItems => {
            if (currItems.find(item =>  item.id === id)?.quantity === 1) {
                return currItems.filter(item => item.id !== id)
            } else {
                return currItems.map(item => {
                    if (item.id === id) {
                        return {...item, quantity : item.quantity - 1}
                    } else {
                        return item
                    }
                })
            }
        })
    }

    function removeFromCart (id:number) {
        setCartItems( currItems  => {
            return currItems.filter ( item => item.id !== id)
        })
    }

    const cartQuantity = cartItems.reduce((quantity , item) => item.quantity + quantity, 0)

    
    return <ShopingCartContext.Provider value={{
        getItemQuantity, 
        increaseCartQuantity , 
        decreaseCartQuantity ,
        removeFromCart ,
        cartItems,
        cartQuantity,
        openCart,
        closeCart
    }}> {children} 
        <ShopingCart isOpen ={isOpen}/>
    
    </ShopingCartContext.Provider>
}