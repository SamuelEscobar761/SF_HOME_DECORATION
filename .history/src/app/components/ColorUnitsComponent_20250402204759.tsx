export const ColorUnitsComponent = ({
  colorImages,
  colorUnits,
  handleColorUnitChange
}: {
  colorImages: ImageColor[];
  colorUnits: Map<string, number>;
  handleColorUnitChange: (
    color: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}) => {
  console.log('in colorUnits')
  console.log(colorUnits);
  return (
    <div className="grid grid-cols-2 gap-2">
      {Array.from(new Set(colorImages.map((item) => item.color))).map(
        (color, index) => (
          <div key={index} className="flex space-x-2 items-center">
            <div
              className="size-8 border border-neutral-900"
              style={{ background: color }}
            ></div>
            <input
              id="new-item-units"
              type="number"
              placeholder="Unds."
              className="w-20 p-2 rounded border border-neutral-900"
              value={colorUnits.get(color) || ""}
              onChange={(e) => handleColorUnitChange(color, e)}
            />
          </div>
        )
      )}
    </div>
  );
};
