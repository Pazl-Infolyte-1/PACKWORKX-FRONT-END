import { useGroupLayers } from "../../Context/GroupLayersContext";

export default function AddGroupButton() {
  const { groups,addGroup } = useGroupLayers();

  const handleClick = async () => {
    const success = await addGroup();
  };

  return (
    <button 
    className="h- rounded-md flex text-xs items-center justify-center px-4 py-2 shadow-md border-none cursor-pointer bg-[#8761e5] text-white"
    onClick={handleClick}>Add Group</button>
  );
}