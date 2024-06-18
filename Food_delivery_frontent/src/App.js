import axios from "axios";
import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import "./App.css"

function Register() {
    const [currentPage, setCurrentPage] = useState(1);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [image, setImage] = useState(null); // Change to null to handle file input correctly

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    function nextPage() {
        setCurrentPage(currentPage + 1);
    }

    function registerUser() {
        const formData = new FormData();
        formData.append('username', name);
        formData.append('email', email);
        formData.append('password1', password);
        formData.append('password2', passwordConf);
        formData.append('mobile', mobile);
        formData.append('address', address);
        formData.append('image', image);

        axios.post('http://localhost:8000/register', formData)
        .then(response=>{
            setErrorMessage('');
            navigate('/Login');
        }).catch(error=>{
            console.log('Error:', error);
            if (error.response && error.response.data) {
                setErrorMessage(Object.values(error.response.data).flat().join(' '));
            } else {
                setErrorMessage('Failed to connect to api');
            }
        });
    }

    const seePassword = () => {
        const passwordInput = document.getElementById('password');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    }

    const seePassword2 = () => {
        const passwordInput = document.getElementById('passwordconf');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    }

    return (
        <div>
            <div className="container-fluid">
                <div className="row d-flex justify-content-center">
                    <div className="col-sm-6 col-md-4" style={{ border: "1px ridge rgba(0,0,0,0.3)", borderRadius: "10px", marginTop:"120px" }}>
                        <h1 style={{ textAlign: "center", marginBottom:"25px"}}>Sign Up</h1>
                        {errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : ''}
                        {currentPage === 1 && (
                            <>
                                <div className="form-group">
                                    <label><b>Name:</b></label><br />
                                    <input
                                        type="text"
                                        value={name}
                                        onInput={(event)=>setName(event.target.value)}
                                        style={{border:"1px solid black",
                                            borderTop:"none",
                                            borderLeft:"none",
                                            borderRight:"none",
                                            width:"100%",
                                            height:"15px",
                                            background:"transparent",
                                            outline:"none"
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label><b>Email:</b></label><br />
                                    <input
                                        type="email"
                                        value={email}
                                        onInput={(event)=>setEmail(event.target.value)}
                                        style={{border:"1px solid black",
                                            borderTop:"none",
                                            borderLeft:"none",
                                            borderRight:"none",
                                            width:"100%",
                                            height:"15px",
                                            background:"transparent",
                                            outline:"none"
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label><b>Password:</b></label><br />
                                    <div className="input-group" style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onInput={(event)=>setPassword(event.target.value)}
                                            style={{border:"1px solid black",
                                                borderTop:"none",
                                                borderLeft:"none",
                                                borderRight:"none",
                                                width:"86%",
                                                height:"15px",
                                                background:"transparent",
                                                outline:"none",
                                                flex: "1"
                                            }}
                                        />
                                        <div className="input-group-append" style={{ flexShrink: 0 }}>
                                            <span onClick={seePassword} style={{height:"15px",border: "1px solid black", borderTop:"none",borderLeft:"none", borderRight:"none", background:"transparent", borderRadius:"0px",display:"inline-flex",alignItems:"center"}} className="input-group-text btn passwordBtn" id="basic-addon2"><i className="fas fa-eye"></i></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label><b>Confirm password:</b></label><br />
                                    <div className="input-group" style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            id="passwordconf"
                                            type="password"
                                            value={passwordConf}
                                            onInput={(event)=>setPasswordConf(event.target.value)}
                                            style={{border:"1px solid black",
                                                borderTop:"none",
                                                borderLeft:"none",
                                                borderRight:"none",
                                                width:"86%",
                                                height:"15px",
                                                background:"transparent",
                                                outline:"none",
                                                flex: "1"
                                            }}
                                        />
                                        <div className="input-group-append" style={{ flexShrink: 0 }}>
                                            <span onClick={seePassword2} style={{height:"15px",border: "1px solid black", borderTop:"none",borderLeft:"none", borderRight:"none", background:"transparent", borderRadius:"0px",display:"inline-flex",alignItems:"center"}} className="input-group-text btn passwordBtn" id="basic-addon2"><i className="fas fa-eye"></i></span>
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-primary mb-2 float-right" onClick={nextPage}>Next</button>
                            </>
                        )}
                        {currentPage === 2 && (
                            <>
                                <div className="form-group">
                                    <label><b>Contact Number:</b></label><br />
                                    <input
                                        type="text"
                                        value={mobile}
                                        onChange={(event) => setMobile(event.target.value)}
                                        style={{border:"1px solid black",
                                            borderTop:"none",
                                            borderLeft:"none",
                                            borderRight:"none",
                                            width:"100%",
                                            height:"15px",
                                            background:"transparent",
                                            outline:"none"
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label><b>Delivery Address:</b></label><br />
                                    <textarea
                                        value={address}
                                        onChange={(event) => setAddress(event.target.value)}
                                        style={{border:"1px solid black",
                                            borderTop:"none",
                                            borderLeft:"none",
                                            borderRight:"none",
                                            width:"100%",
                                            height:"75px",
                                            background:"transparent",
                                            outline:"none"
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label><b>Profile Image:</b></label><br />
                                    <input
                                        className="btn btn-success"
                                        type="file"
                                        onChange={(event) => setImage(event.target.files[0])}
                                    />
                                </div>
                                <button className="btn btn-primary mb-2 float-right" onClick={registerUser}>Submit</button>
                            </>
                        )}
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
