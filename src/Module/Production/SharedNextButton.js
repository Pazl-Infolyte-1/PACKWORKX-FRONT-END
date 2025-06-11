import { useNextHandler } from "../../Context/ProductionNextHandlerContext";

export default function SharedNextButton() {
  const { triggerNext } = useNextHandler();

  const handleClick = async () => {
    const success = await triggerNext();
  };

  return (
    <button 
    className="h-8 rounded-md flex text-xs items-center justify-center px-4 py-2 shadow-md border-none cursor-pointer bg-red-600 text-white"
    onClick={handleClick}>Next Step</button>
  );
}
