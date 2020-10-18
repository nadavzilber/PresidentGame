import React from 'react';
import axios from 'axios';
import './button.css';
const Button = () => {
    const onClickHandler = () => {
        // axios.get(`/express_backend`)
        //     .then(res => {
        //         //console.log('res:',JSON.stringify(res))
        //         const data = res.data;
        //         console.log('data:',data)
        //     })
    }
    return (
        <div className="button" onClick={() => onClickHandler()}>
            Play selected
        </div>
    )
}
export default Button;