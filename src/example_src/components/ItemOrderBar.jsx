import {useState} from "react";

export default function ItemOrderBar(props) {
    const item = props.itemData
    const [quantity, setQuantity] = useState(0)

    return (
        <div className={`flex p-2 items-center`}>
            <div className={`flex`}>
                <button
                    className={`bg-orange-400 shadow text-white font-bold  hover:shadow-lg w-8 h-8 transition-all duration-300`}
                    onClick={() => setQuantity(quantity - 1)}
                >
                    -
                </button>
                <input
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className={`w-[40px] p-1 mx-2 rounded outline-0 box-border border border-gray-200`}/>
                <button
                    className={`bg-green-400 shadow text-white font-bold  hover:shadow-lg w-8 h-8 transition-all duration-300`}
                    onClick={() => setQuantity(quantity + 1)}
                >
                    +
                </button>
            </div>

            <div className={`p-2`}>
                {item.price} đ
            </div>
        </div>
    )
}