export const SellItem = ({onClick, image, title, colors, extraColors, discount, previousPrice, price, checked}:{onClick: (event: React.MouseEvent) => void, image: string, title: string, colors: string[], extraColors: number, discount: number, previousPrice: number, price: number, checked: boolean}) => {
    return(
        <div className="bg-neutral-300 p-2 text-neutral-900 rounded" onClick={onClick}>
            <div className="relative">
            {checked &&(
                <div id="checkbox" className="w-5 h-5 absolute top-0 right-0 bg-success rounded"></div>
            )}
            <div className="h-52 bg-neutral-100 rounded">
                <img src={image}/>
            </div>
            <div className="bg-neutral-100 mt-2 p-2 rounded">
                <p className="text-xl mb-2">{title}</p>
                <div id="colors" className="flex justify-between items-center mb-2">
                    {colors.map((color, index) => (
                        <div className="rounded-full border border-neutral-900 h-5 w-5" key={index} style={{ backgroundColor: color }}></div>
                    ))}
                    {extraColors > 0 &&(
                        <p className="underline text-xs">+{extraColors}</p>
                    )}
                </div>
                <div id="price" className="flex justify-between">
                    <div id="discount" className="flex flex-col">
                        <p className="text-xs text-tertiary">{discount}%</p>
                        <p className="text-xs text-neutral-400 line-through">{previousPrice}</p>
                    </div>
                    <div className="flex items-baseline">
                        <p className="text-2xl">{price}</p>
                        <p className="text-xs ml-1">Bs</p>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}