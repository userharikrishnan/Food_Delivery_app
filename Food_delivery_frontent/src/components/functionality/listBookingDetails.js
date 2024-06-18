import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import checkAuth from '../auth/checkAuth';

function BookingListByUser() {
    const user = useSelector(state => state.auth.user);
    const [bookings, setBookings] = useState([]);
    

    useEffect(() => {
        if (user && user.userId) {
            fetchBookingsByUser(user.userId);
        }
    }, [user]);

    const fetchBookingsByUser = (userId) => {
        axios.get(`http://localhost:8000/list-bookings/${userId}/`)
            .then(response => {
                console.log(response.data)
                setBookings(response.data);
                
            })
            .catch(error => {
                console.error('Error fetching bookings by user:', error);
                
            });
    };

    const downloadPDF = (bookingId) => {
        axios({
            url: `http://localhost:8000/booking-pdf/${bookingId}/`,
            method: 'GET',
            responseType: 'blob', 
        })
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `booking_${bookingId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
        .catch(error => {
            console.error('Error downloading PDF:', error);
        });
    };



    return (
        <div>
            <Link to="/home" className="btn btn-info btn-sm m-2">Home</Link>
            <table className="table table-bordered bg-white ">
                <thead className='thead-dark'>
                    <tr>
                        <th>Booking ID</th>
                        <th>Name</th>
                        <th>Booking Date</th>
                        <th>Restaurant</th>
                        <th>Quantity</th>
                        
                        <th>Total Price</th>
                        <th>QR Link</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(booking => (
                        <tr key={booking.booking_id}>
                            <td>{booking.booking_id}</td>
                            <td>{booking.name} <img src={booking.Image_url} style={{width:"60px",}}/> </td>
                            <td>{booking.booking_date}</td>
                            <td>{booking.restaurantName}</td>
                            <td>{booking.count}</td>
                            
                            <td>{booking.sumTotal}</td>
                            <td>
                                <button 
                                    className='btn btn-primary btn-sm'
                                    onClick={() => downloadPDF(booking.booking_id)}
                                >
                                    Download pdf
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default checkAuth(BookingListByUser);
