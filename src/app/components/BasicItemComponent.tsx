export const BasicItemComponent = ({name, image}: {name: string, image: string}) => {
    return(
        <div id="basic-item" className="flex bg-primary border border-neutral-900 rounded space-x-2">
            <img id="basic-item-image" src={image} alt={name} className="size-16"/>
            <p id="basic-item-name" className="text-lg">{name}</p>
        </div>
    )
}