export const ImageNameComponent = ({
    id,
  image,
  name,
}: {
    id: number;
  image: string;
  name: string;
}) => {
  return (
    <div
      id="image-name-component"
      className="w-full p-2 bg-primary flex justify-between items-center"
    >
      <div className="flex space-x-2 items-center">
        <img
          id="image-name-component-image"
          src={image}
          alt=""
          className="size-14 border border-neutral-900"
        />
        <p id="image-name-component-name" className="text-base">
          {name}
        </p>
      </div>
      <div className="flex space-x-1 items-center">
        <input type="number" className="w-10 h-fit border border-neutral-900 p-1 rounded"/>
        <p>%</p>
      </div>
    </div>
  );
};
