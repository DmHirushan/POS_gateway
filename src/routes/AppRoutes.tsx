import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import Items from "../pages/Items";
import Customer from "../pages/Customer";
import Transaction from "../pages/Transaction";
import History from "../pages/OrderHistory";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/home" element={<Home/>} />
            <Route path="/items" element={<Items/>} />
            <Route path="/customer" element={<Customer/>} />
            <Route path="/transaction" element={<Transaction/>} />
            <Route path="/history" element={<History/>} />
        </Routes>
    )
}

export default AppRoutes;