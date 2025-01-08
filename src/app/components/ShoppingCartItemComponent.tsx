import TrashCanIcon from "../../assets/Trash-Can-Icon.svg"

const calculateTotal = (item: CartItem) => {
    const total = item.units * (item.price! - item.rebajaUnidad) - item.rebajaTotal;
    return total.toFixed(2);
}

export const ShoppingCartItemComponent = ({index, item, removeItemFromCart}: {index: number, item: CartItem, removeItemFromCart: (index: number)=>void}) => {
    
    return(
        <div className="grid grid-cols-10 items-center p-2 text-sm divide-x bg-neutral-100">
            <img src={item.image} className="p-1 col-span-2 object-cover h-full"/>
            <p className="text-center">{item.units}</p>
            <p className="p-1 col-span-4">{item.name}</p>
            <p className="col-span-2 text-center">{calculateTotal(item)}</p>
            <button className="bg-tertiary p-2 rounded" onClick={()=>removeItemFromCart(index)}>
                <img src={TrashCanIcon} alt="Remove item" className="icon-white" />
            </button>
        </div>
    )
}
