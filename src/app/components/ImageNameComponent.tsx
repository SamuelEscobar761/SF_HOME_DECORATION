export const ImageNameComponent = ({image, name}:{image: string, name: string}) =>{
    return(
        <div id="image-name-component" className="w-full p-2 bg-primary flex space-x-2">
            <img id="image-name-component-image" src={image} alt="" className="size-14 border border-neutral-900"/>
            <p id="image-name-component-name" className="text-base">{name}</p>
        </div>
    );
}