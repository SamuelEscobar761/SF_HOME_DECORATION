import { useState } from "react";

export const OptionsButtonComponent = ({
  settings,
}: {
  settings: { text: string; action: () => void }[];
}) => {
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);
  return (
    <div id="options-button-component" className="border">
      <button
        onClick={() => setOptionsOpen(!optionsOpen)}
        className="flex flex-col justify-center items-center w-8 h-8 bg-transparent rounded focus:outline-none space-y-1"
      >
        <span className="block w-1 h-1 bg-black rounded-full"></span>
        <span className="block w-1 h-1 bg-black rounded-full"></span>
        <span className="block w-1 h-1 bg-black rounded-full"></span>
      </button>
      {optionsOpen && (
        <div id="options-open" className="w-screen h-screen fixed inset-0 z-40 p-2" onClick={()=>{setOptionsOpen(false)}}>
          <div id="" className="flex flex-col border border-neutral-900 size-fit justify-self-end bg-primary divide-neutral-500 divide-y rounded">
            {settings.map((setting, index) => (
              <button key={index} className="p-2 text-left min-w-36" onClick={setting.action}>{setting.text}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
