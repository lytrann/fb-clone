import ItemOrderBar from "./ItemOrderBar.jsx";

export default function ItemCard(props) {
    const item = props.itemData

    return (
        <div
            className={`rounded-lg shadow bg-white w-[300px] overflow-hidden cursor-pointer mr-8 hover:translate-y-0.5 hover:shadow-none transition-all duration-300`}>
            <img src={item.image} className={` w-full h-[300px] object-cover`}/>

            <div className={`p-3`}>
                <h2 className={`font-semibold`}>{item.name}</h2>
                <div>{item.description}</div>
            </div>

            <ItemOrderBar
                itemData={item}
            />
        </div>
    )
}