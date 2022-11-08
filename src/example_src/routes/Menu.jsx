import ItemCard from "../components/ItemCard.jsx";
import {useEffect, useState} from "react";

export default function Menu() {
    const [items, setItems] = useState([])

    useEffect(() => {
        fetchItems()
    }, [])

    async function fetchItems() {
        const res = await fetch('http://localhost:8080/example_data')
        const items = await res.json()
        console.log({items})
        setItems(items)
    }

    return (
        <div className={`w-screen h-screen bg-gradient-to-r from-amber-300 to-orange-500 p-32`}>
            <h1 className={`text-5xl text-white font-bold m-0`}>Menu</h1>

            <div className={`flex mt-5`}>
                {items.map(item =>
                    <ItemCard itemData={item} key={item.name}/>
                )}
            </div>
        </div>
    )
}