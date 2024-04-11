import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import AdCard from "../../components/Cards/adcards";
//import SearchForm from "../components/forms/SearchForm";

export default function Buy() {
  // context
  const [auth, setAuth] = useAuth();
  // state
  const [ads, setAds] = useState();

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/adapi/ads-for-sell");
      setAds(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
     
      <h1 className="display-1 bg-primary text-light p-5">For Sell</h1>
      <div className="container">
        <div className="row">
          {ads?.map((ad) => (
            <AdCard ad={ad} key={ad._id} />
          ))}
        </div>
      </div>
    </div>
  );
}

// <SearchForm />