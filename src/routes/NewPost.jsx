import React, {useEffect, useState} from 'react'

import '../App.css'


export default function NewPost() {

    useEffect(() => {

    }, [])

    const [NewPost, setNewPost] = useState([]);

    class NameForm extends React.Component {
        constructor(props) {
            super(props);
            this.state = {value: ''};

            this.handleChange = this.handleChange.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleChange(event) {
            this.setState({value: event.target.value});
        }

        handleSubmit(event) {
            alert('post created');
            event.preventDefault();
            // const rawResponse = await fetch('http://localhost:8080/newpost', {
            //     method: "POST",
            //     headers: {
            //         'Accept': 'application/json',
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(info)
            // })
            // const content = await rawResponse.json();
            //
            // console.log(content);
        }

    }


    return (
        <div className="heading">
            <p className="createpost">Create post </p>
            <button className="cancel"> X</button>
        </div>,
            <div className="body">
                <h1 id="username" className="name">Đậu</h1>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <input type="text" placeholder="Write something here" name="createpost" className="input"
                               id="text"/>
                    </label>
                    <input type="submit" value="Submit" className="submit"/>
                </form>
            </div>

    )

}