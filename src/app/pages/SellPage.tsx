import { SellItem } from "../components/SellItem";

export const SellPage = () => {
    return(
        <div>
            <div className="grid grid-cols-2 gap-4 p-2">
                <SellItem image="" title="Title" colors={["#FFFFFF", "#FFFFFF", "#FFFFFF"]} extraColors={4} discount={0} previousPrice={0} price={0} checked={false} />
                <SellItem image="" title="Title" colors={["#FFFFFF", "#FFFFFF", "#FFFFFF"]} extraColors={15} discount={0} previousPrice={0} price={0} checked={true} />
                <SellItem image="" title="Title" colors={["#FFFFFF", "#FFFFFF", "#FFFFFF"]} extraColors={4} discount={0} previousPrice={0} price={0} checked={false} />
                <SellItem image="" title="Title" colors={["#FFFFFF", "#FFFFFF", "#FFFFFF"]} extraColors={15} discount={0} previousPrice={0} price={0} checked={false} />
            </div>
        </div>
    );
}