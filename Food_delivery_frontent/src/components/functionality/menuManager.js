import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import checkAuth from '../auth/checkAuth';

function MenuManagement({ restaurantId, restaurantName }) {
    const user = useSelector(state => state.auth.user);
    const [newMenuItem, setNewMenuItem] = useState({ name: '', description: '', price: '',Image_url:'',restaurant: restaurantId ,restaurantName: restaurantName });
    console.log(restaurantId , restaurantName);

    const addMenuItem = () => {
        axios.post(`http://localhost:8000/restaurants/${restaurantId}/menu_add/`, newMenuItem, {
            headers: { 'Authorization': `Token ${user.token}` }
        })
        .then(response => {
            setNewMenuItem({ name: '', description: '', price: '', Image_url: '' });
            alert("menu item added")
        })
        .catch(error => {
            console.error('Error adding menu item:', error);
        });
    };

    return (
        <div >
            <h2>Menu for {restaurantName}</h2>
            <input className='input-group'
                type="text" 
                placeholder="Provide Image Link" 
                value={newMenuItem.Image_url} 
                onChange={e => setNewMenuItem({ ...newMenuItem, Image_url: e.target.value })} 
            /><br />
            <input className='input-group'
                type="text" 
                placeholder="Name" 
                value={newMenuItem.name} 
                onChange={e => setNewMenuItem({ ...newMenuItem, name: e.target.value })} 
            /><br />
            <input className='input-group'
                type="text" 
                placeholder="Description" 
                value={newMenuItem.description} 
                onChange={e => setNewMenuItem({ ...newMenuItem, description: e.target.value })} 
            /><br />
            <input className='input-group' 
                type="number" 
                placeholder="Price" 
                value={newMenuItem.price} 
                onChange={e => setNewMenuItem({ ...newMenuItem, price: e.target.value })} 
            /><br />
            <button className='btn btn-warning float-right' onClick={addMenuItem}>Add</button>
            <hr className='mt-5'></hr>
        </div>
    );
}

export default checkAuth(MenuManagement);
