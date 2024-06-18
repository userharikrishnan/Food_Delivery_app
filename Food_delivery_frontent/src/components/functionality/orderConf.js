import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmation = ({ bookingId, totalAmount }) => {
    return (
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-8'>
                    <div className='card mt-5'>
                        <div className='card-header bg-success text-white text-center'>
                            Order Confirmation
                        </div>
                        <div className='card-body'>
                            <h5 className='card-title'>Thank you for your order!</h5>
                            <p className='card-text'>
                                Your order has been successfully placed.
                            </p>
                            <ul className='list-group'>
                                <li className='list-group-item'>
                                    <strong>Booking ID:</strong> {bookingId}
                                </li>
                                <li className='list-group-item'>
                                    <strong>Total Amount:</strong> ₹{totalAmount}
                                </li>
                            </ul>
                        </div>
                        <div className='card-footer text-center'>
                        <Link to="/home" className="btn btn-info btn-sm m-2">Home</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
