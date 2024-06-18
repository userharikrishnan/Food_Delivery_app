import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import checkAuth from '../auth/checkAuth';
import { Link } from "react-router-dom";
import MenuManagement from './menuManager'; 

function Home() {
    const user = useSelector(state => state.auth.user);
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [newRestaurant, setNewRestaurant] = useState({ name: '', location: '' });
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [menuItems, setMenuItems] = useState({});

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = () => {
        axios.get('http://localhost:8000/restaurants/')
            .then(response => {
                setRestaurants(response.data);
                setFilteredRestaurants(response.data);
                response.data.forEach(restaurant => {
                    fetchMenuItems(restaurant.id);
                });
            })
            .catch(error => {
                console.error('Error fetching restaurants:', error);
            });
    };

    const addRestaurant = () => {
        axios.post('http://localhost:8000/restaurants/add/', newRestaurant, {
            headers: { 'Authorization': `Token ${user.token}` }
        })
        .then(response => {
            setRestaurants([...restaurants, response.data]);
            setFilteredRestaurants([...restaurants, response.data]);
            setNewRestaurant({ name: '', location: '' });
        })
        .catch(error => {
            console.error('Error adding restaurant:', error);
        });
    };

    const deleteRestaurant = (id) => {
        axios.delete(`http://localhost:8000/restaurants/${id}/`, {
            headers: { 'Authorization': `Token ${user.token}` }
        })
        .then(() => {
            const updatedRestaurants = restaurants.filter(restaurant => restaurant.id !== id);
            setRestaurants(updatedRestaurants);
            setFilteredRestaurants(updatedRestaurants);
            setSelectedRestaurant(null);
            alert("Restaurant removed successfully");
        })
        .catch(error => {
            console.error('Error deleting restaurant:', error);
        });
    };

    const handleAddMenuItemClick = (restaurant) => {
        setSelectedRestaurant(restaurant);
    };


    const fetchMenuItems = (restaurantId) => {
        axios.get(`http://localhost:8000/restaurants/${restaurantId}/menu/`, {
          headers: { 'Authorization': `Token ${user.token}` }
        })
          .then(response => {
            setMenuItems((prevMenuItems) => ({ ...prevMenuItems, [restaurantId]: response.data }));
          })
          .catch(error => {
            console.error('Error fetching menu items:', error);
          });
      };

    // Search mechanism
    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = (event) => {
        if (event) {
            event.preventDefault();
        }
        const term = searchTerm.toLowerCase();
        if (term.trim() === "") {
            setFilteredRestaurants(restaurants);
        } else {
            const filteredItems = restaurants.filter((restaurant) => {
                const restaurantName = restaurant.name.toLowerCase();
                const restaurantLocation = restaurant.location.toLowerCase();
                const restaurantMenu = menuItems[restaurant.id]?.map((menuItem) => menuItem.name.toLowerCase()) || [];
                return restaurantName.startsWith(term) || restaurantLocation.startsWith(term) || restaurantMenu.includes(term);
              });

            if (filteredItems.length === 0) {
                alert("No match found");
                setSearchTerm("");
            } else {
                setFilteredRestaurants(filteredItems);
            }
        }
    };

    return (
        <div>
            <Navbar />
            <br />
            <br />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 d-flex align-items-center"
                        style={{ height: "300px", backgroundImage: "url(https://media.gettyimages.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=612x612&w=0&k=20&c=eaKRSIAoRGHMibSfahMyQS6iFADyVy1pnPdy1O5rZ98=)",backgroundRepeat:"no-repeat",backgroundSize:"cover" }}>
                        <div className="input-group mr-5" style={{ width: "60%" }}>
                            <input type="text" className="form-control" placeholder="Search with Dish, Restaurants or location" value={searchTerm} onChange={handleSearchInputChange} />
                            <div className="input-group-append">
                                <button className="btn btn-warning p-auto" onClick={handleSearch}><i className="fas fa-search"></i></button>
                            </div>
                        </div>
                        
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <h4 className="text-center my-4 now-running-text">Explore your tastebuds!!</h4>
                    </div>
                </div>
                <div className="row d-flex justify-content-center">
                    {user.userId === 2 ? (
                    <div className='col-8'>
                        <div className='card my-4 mx-2 bg-primary'>
                            <h2>Restaurants</h2>
                            {filteredRestaurants.map(restaurant => (
                                <div className='card bg-warning m-2' key={restaurant.id}>
                                    <div className='card-body'>
                                        <div className='card-header'>
                                            {restaurant.name} - {restaurant.location}
                                        </div>
                                        <br />
                                        <Link to={`/manager/${restaurant.id}/viewmenu`} className="btn btn-primary btn-sm btn-outline-light float-right">View Menu</Link>
                                        {user && user.userId === 2 && (
                                            <span>
                                                <button className='btn btn-primary btn-sm btn-outline-light' onClick={() => deleteRestaurant(restaurant.id)}>Delete</button>
                                                <button className='btn btn-primary btn-sm btn-outline-light float-right mr-1' onClick={() => handleAddMenuItemClick(restaurant)}>Add Menu</button>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    ) : (
                    <div className='col-10'>
                        <div className='card my-4 mx-2 bg-primary'>
                            <h2 className="d-flex justify-content-center">Restaurants</h2>
                            {filteredRestaurants.map(restaurant => (
                                <div className='card bg-warning m-2' key={restaurant.id}>
                                    <div className='card-body'>
                                        <div className='card-header'>
                                            {restaurant.name} - {restaurant.location}
                                        </div>
                                        <br />
                                        <Link to={`/manager/${restaurant.id}/viewmenu`} className="btn btn-primary btn-sm btn-outline-light float-right">View Menu</Link>
                                        {user && user.userId === 2 && (
                                            <span>
                                                <button className='btn btn-primary btn-sm btn-outline-light' onClick={() => deleteRestaurant(restaurant.id)}>Delete</button>
                                                <button className='btn btn-primary btn-sm btn-outline-light float-right mr-1' onClick={() => handleAddMenuItemClick(restaurant)}>Add Menu</button>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>)}

                    <div className='col-4'>
                    {user && user.userId === 2 && (
                        <div>
                            <h3>Add Restaurant</h3>
                            <input className='input-group'
                                type="text"
                                placeholder="Name"
                                value={newRestaurant.name}
                                onChange={e => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                            /><br />
                            <input
                                type="text"
                                className='input-group'
                                placeholder="Location"
                                value={newRestaurant.location}
                                onChange={e => setNewRestaurant({ ...newRestaurant, location: e.target.value })}
                            /><br/>
                            <button className='btn btn-small btn-warning float-right' onClick={addRestaurant}>Add</button>
                            <hr className='mt-5'></hr>
                        </div>)}
                        
                        {selectedRestaurant && (
                            <MenuManagement
                                restaurantId={selectedRestaurant.id}
                                restaurantName={selectedRestaurant.name}
                            />
                        )}
                    </div>
                </div>
                <div className="row bg-info">
                <div className="content">
                    
                    <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mr-auto">
                        <div className="mb-5">
                            <h3 className="text-white mb-4">Contact Info</h3>
                            <p className="text-white">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus blanditiis, perferendis aliquam.</p>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                            <h3 className="text-white h5 mb-3">London</h3>
                            <ul className="list-unstyled mb-5">
                                <li className="d-flex text-white mb-2">
                                <span className="mr-3"><span class="icon-map"></span></span> 34 Street Name, City Name Here, United States
                                </li>
                                <li className="d-flex text-white mb-2"><span class="mr-3"><span class="icon-phone"></span></span> +1 (222) 345 6789</li>
                                <li className="d-flex text-white"><span class="mr-3"><span class="icon-envelope-o"></span></span> info@mywebsite.com </li>
                            </ul>
                            </div>
                            <div className="col-md-6">
                            <h3 className="text-white h5 mb-3">New York</h3>
                            <ul className="list-unstyled mb-5">
                                <li className="d-flex text-white mb-2">
                                <span className="mr-3"><span class="icon-map"></span></span> 34 Street Name, City Name Here, United States
                                </li>
                                <li className="d-flex text-white mb-2"><span class="mr-3"><span class="icon-phone"></span></span> +1 (222) 345 6789</li>
                                <li className="d-flex text-white"><span class="mr-3"><span class="icon-envelope-o"></span></span> info@mywebsite.com </li>
                            </ul>
                            </div>
                        </div>
                        </div>

                        <div className="col-lg-6">
                        <div className="box">
                            <h3 className="heading">Send us a message</h3>
                            <form className="mb-5" method="post" id="contactForm" name="contactForm">
                            <div className="row">
                                
                                <div className="col-md-12 form-group">
                                <label for="name" class="col-form-label">Name</label>
                                <input type="text" class="form-control" placeholder="This is a sample contactus form" name="name" id="name"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 form-group">
                                <label for="email" class="col-form-label">Email</label>
                                <input type="text" class="form-control" name="email" id="email"/>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-12 form-group">
                                <label for="message" class="col-form-label">Message</label>
                                <textarea className="form-control" name="message" id="message" cols="30" rows="7"></textarea>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                <input type="submit" value="Send Message" class="btn btn-block btn-primary rounded-0 py-2 px-4"/>
                                <span className="submitting"></span>
                                </div>
                            </div>
                            </form>

                            
                        </div>
                        </div>
                        </div>
                    </div>
                </div>
                    
                </div>
            </div>
        </div>
    );
}

export default checkAuth(Home);
