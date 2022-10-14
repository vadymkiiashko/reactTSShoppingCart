import {Offcanvas, Stack} from 'react-bootstrap'
import { useShopingCart } from '../context/ShopingCartContext'
import { formatCurrency } from '../utilities/formatCurrency'
import { CartItem } from './CartItem'
import storeItems from '../data/items.json'

type ShopingCartProps = {
    isOpen : boolean
}

export function ShopingCart ({isOpen} : ShopingCartProps ) {
    const { closeCart, cartItems } = useShopingCart()
    return (

        <Offcanvas show={isOpen} onHide={closeCart} placement='end'>
        <Offcanvas.Header closeButton>
            <Offcanvas.Title>
                Cart
            </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <Stack gap={3}>
                {cartItems.map(item => {
                    return <CartItem key={item.id} {...item} />
                })}
            {
                cartItems!== null && 
                <div className="ma-auto fw-bold fs-5">

                    <span> Total: 
                        {formatCurrency(
                            cartItems.reduce((total,cartItem) => 
                        {
                            const item = storeItems.find( i => i.id === cartItem.id )
                            return total + (item?.price || 0) * cartItem.quantity
                        },0)
                        )}
                    </span>
                </div>
            }
            </Stack>
        </Offcanvas.Body>
    </Offcanvas>
        )
}