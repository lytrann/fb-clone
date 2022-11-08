import ItemCard from "../components/ItemCard.jsx";
import {useState} from "react";

export default function Menu() {
    const [items, setItems] = useState([
        {
            name: 'Thịt xiên nướng',
            image: 'skewer.jpeg',
            description: 'Juicy meat',
            price: 5000
        },
        {
            name: 'Xúc xích',
            image: 'hotdog.jpeg',
            description: 'Juicy meat',
            price: 3000
        },
        {
            name: 'Thịt chó',
            image: 'dog.jpg',
            description: 'Juicy meat',
            price: 2000
        }
    ])

    return (
        <div className={`w-screen h-screen bg-gradient-to-r from-amber-300 to-orange-500 p-32`}>
            <h1 className={`text-5xl text-white font-bold m-0`}>Menu</h1>

            <div className={`flex mt-5`}>
                {items.map(item =>
                    <ItemCard itemData={item}/>
                )}
            </div>
        </div>
    )
}