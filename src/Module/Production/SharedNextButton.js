import { useNextHandler } from "../../Context/ProductionNextHandlerContext";

export default function SharedNextButton() {
  const { triggerNext } = useNextHandler();

  const handleClick = async () => {
    const success = await triggerNext();
    if (success) {
      // navigate to next step here
    }
  };

  return (
    <button onClick={handleClick}>Next</button>
  );
}
