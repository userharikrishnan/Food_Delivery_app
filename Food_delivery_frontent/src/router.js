import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./components/auth/Login";
import Home from "./components/functionality/home";
import UserProfile from "./components/functionality/profile"
import ViewMenu from "./components/functionality/viewMenu";
import CartList from "./components/functionality/Cart"
import BookingListByUser from "./components/functionality/listBookingDetails";




const router = createBrowserRouter([
    { path: '', element: <App/> },
    { path: 'Login', element:<Login/>},
    { path: 'home', element:<Home/>},
    { path: 'userprofile', element:<UserProfile/>},
    { path: '/manager/:restaurantId/viewmenu', element: <ViewMenu/>},
    { path: 'cart', element:<CartList/>},
    { path: '/userbookings', element:<BookingListByUser/>},
]);

export default router;