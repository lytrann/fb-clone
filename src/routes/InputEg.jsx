import {useState} from "react";

export default function InputEg() {
    const [name, setName] = useState('')

    function onChangeName(event) {
        setName(event.target.value)
    }

    function onSubmitForm(event) {
        event.preventDefault()
        alert(`Your name is ${name}!`)
    }

    return (
        <div className={`flex m-auto p-6`}>
            <form onSubmit={onSubmitForm}>
                <input
                    className={`bg-gray-300 p-4`}
                    type="text"
                    value={name}
                    onChange={onChangeName}
                />

                <button className={`bg-blue-50 p-4 border border-black border-solid ml-4`} type="submit">Submit</button>
            </form>
        </div>
    )
}