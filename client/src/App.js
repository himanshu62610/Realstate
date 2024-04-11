import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { Toaster } from "react-hot-toast";
import { SearchProvider } from "./context/search";

import Navbar from "./components/Navbar";
import Home from "./pages/more/Home";
import Login from "./pages/more/Login";
import Register from "./pages/more/Register";
import AccountActivate from "./pages/auth/AccountActivate"
import ForgotPassword from "./pages/auth/ForgotPassword"
import AccessAccount from "./pages/auth/AccessAccount";
import Dashboard from "./pages/user/Dashboard";
import AdCreate from "./pages/ad/AdCreate";
import PrivateRoute from "./components/routes/PrivateRoute";
import SellHouse from "./pages/ad/SellHouse";
import SellLand from "./pages/ad/SellLand";
import RentHouse from "./pages/ad/RentHouse";
import RentLand from "./pages/ad/RentLand";
import Profile from "./pages/user/profile";
import Settings from "./pages/user/setting";
import Footer from "./components/footer";
import AdEdit from "./pages/ad/AdEdit"
import AdView from "./pages/ad/AdView"
import Wishlist from "./pages/more/Wishlist";
import Enquiries from "./pages/more/Enquiries";
import Buy from "./pages/more/Buy";
import Rent from "./pages/more/Rent";
//import Header from "./components/Header";
import Agents from "./pages/user/Agents";
import Agent from "./pages/user/Agent";
import Search from "./pages/more/Search";

function App() {
  return (
    <>
   
    <BrowserRouter>
    <AuthProvider>
    <SearchProvider>

    <Navbar/>
    <Toaster/>

      { <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
            path="/auth/account-activate/:token"
            element={<AccountActivate />}
          />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/auth/access-account/:token"
            element={<AccessAccount />}
          />
            <Route path="/" element={<PrivateRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="ad/create" element={<AdCreate />} />
            <Route path="ad/create/sell/house" element={<SellHouse />} />
            <Route path="ad/create/sell/land" element={<SellLand />} />
            <Route path="ad/create/rent/house" element={<RentHouse />} />
            <Route path="ad/create/rent/land" element={<RentLand />} />


            <Route path="user/profile" element={<Profile/>} />
            <Route path="user/settings" element={<Settings/>} />

            <Route path="user/ad/:slug" element={<AdEdit />} />

            <Route path="user/wishlist" element={<Wishlist />} />
            <Route path="user/enquiries" element={<Enquiries />} />
          </Route>

          <Route path="/ad/:slug" element={<AdView />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agent/:username" element={<Agent />} />


          <Route path="/buy" element={<Buy />} />
            <Route path="/rent" element={<Rent />} />

            <Route path="/search" element={<Search />} />
      </Routes> }

     <Footer/>


     </SearchProvider>
    </AuthProvider>
    </BrowserRouter>
    </>
  );
}
export default App;
