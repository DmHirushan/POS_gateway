import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import Items from "../pages/Items";
import Customer from "../pages/Customer";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/Home" element={<Home/>} />
            <Route path="/items" element={<Items/>} />
            <Route path="/customer" element={<Customer/>} />
        </Routes>
    )
}

export default AppRoutes;