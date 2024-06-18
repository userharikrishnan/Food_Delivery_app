import React, { useEffect, useState } from 'react';
import axios from 'axios';
import checkAuth from '../auth/checkAuth';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function UserProfile() {
    const user = useSelector(state => state.auth.user);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        mobile: '',
        address: '',
        image: "",
    });
    const [showModal, setShowModal] = useState(false);

    function fetchProfile(){
        console.log(user);
        if (user && user.token) {
            axios.get(`http://localhost:8000/profile/${user.userId}/`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            .then(response => {
                setFormData(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Fetch profile error:', error);
            });
        }
        
    }

    useEffect(() => {
        fetchProfile()
    }, [user]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
                data.append(key, formData[key]);
            }
        }
        if (user && user.token) {
            axios.post(`http://localhost:8000/profile/${user.userId}/edit/`, data, {
                headers: {
                    'Authorization': `Token ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                console.log('Profile updated:', response.data);
                setShowModal(false);
                fetchProfile()
            })
            .catch(error => {
                console.error('Profile update error:', error);
            });
        }
    };
    const profileImage = formData.image ? `http://localhost:8000${formData.image}` : '';
    return (
        <div className='container-fluid'>
             <Link to="/home" className="btn btn-info  m-2">Home</Link>
            <div className='row d-flex justify-content-center '>
            <div className="col-sm-5 col-md-3 card d-block text-center">
                <div className="card-body d-flex flex-column align-items-center">
                    <div style={{width:"150px",height:"150px",borderRadius:"50%",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <img className='card-img-top' src={profileImage} style={{ height: '100%', objectFit: 'cover', marginBottom:"20px",width:"100%" }} alt="Profile"/>
                    </div>
                    <p className="card-text">{formData.username}</p>
                    <p className="card-text">{formData.email}</p>
                    <p className="card-text">{formData.mobile}</p>
                    <p className="card-text">{formData.address}</p>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>Edit</button>
                </div>
            </div>

            {showModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'flex' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-align-center">Edit Profile</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body card">
                                
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <label>Username</label>
                                    <input className='form-control' type="text" name="username" value={formData.username} onChange={handleChange} required />
                                    <label>Email</label>
                                    <input className='form-control' type="email" name="email" value={formData.email} onChange={handleChange} required />
                                    <label>Mobile</label>
                                    <input className='form-control' type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />
                                    <label>Address</label>
                                    <input className='form-control' type="text" name="address" value={formData.address} onChange={handleChange} required />
                                    <label>Profile Image</label>
                                    <input className='input-group' type="file" name="image" onChange={handleChange} />
                                    <div className='d-flex'>
                                    <button className='mt-2 btn btn-primary' type="submit">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default checkAuth(UserProfile);
