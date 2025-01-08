import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { ShoppingCartItemComponent } from '../components/ShoppingCartItemComponent';
import { Manager } from '../classes/Manager';
import { Link } from 'react-router-dom';

export const ShoppingCartPage = () => {
    const [items, setItems] = useState<CartItem[]>([]);

    const removeItemFromCart = (index: number,) => {
        items.splice(index, 1)
        setItems([...items]);
        Cookies.set('cartItems', JSON.stringify(items));
    }

    const loadItems = async () => {
        const existingCart = Cookies.get('cartItems');
        let cartItems: CartItem[] = existingCart ? JSON.parse(existingCart) : [];
    
        const updates = cartItems.map(async (cartItem) => {
            const result = await Manager.getInstance().getItemFromIdColor(cartItem.id, cartItem.color);
            return {
                ...cartItem,
                image: result.image,
                name: result.name,
                price: result.price
            };
        });
    
        const updatedItems = await Promise.all(updates); // Espera a que todos los items se actualicen
        setItems(updatedItems);
    }
    
    useEffect(()=>{
        loadItems();
    }, [])

    return (
        <div className='p-2 bg-neutral-300 min-h-screen'>
            <div className='text-center my-5 mx-2 p-2 bg-neutral-100 rounded'>
                <p className='text-2xl'>¡Excelente!</p>
                <p className='text-2xl'>La venta está lista para finalizar</p>
                <p className='text-sm'>Por favor revisa los detalles antes de continuar</p>
            </div>
            <div className='grid grid-cols-10 items-center p-2 text-sm divide-x bg-neutral-100'>
                <p className="col-span-2 text-center"></p>
                <p className="text-center font-bold">Uds</p>
                <p className="col-span-4 text-center font-bold">Nombre</p>
                <p className="col-span-2 text-center font-bold">Precio</p>
                <p className="text-center"></p>
            </div>
            {items.length > 0 ? (
                items.map((item, index) => (
                    <ShoppingCartItemComponent key={index} index={index} item={item} removeItemFromCart={removeItemFromCart}/>
                ))
            ) : (
                <p className='p-2'>Parece que todavía no tienes items en el carrito de compras, <strong><Link to={'/sell'}>haz click aquí</Link></strong> para seleccionar items para vender.</p>
            )}
        </div>
    );
}