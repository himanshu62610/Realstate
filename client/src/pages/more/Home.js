import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import AdCard from "../../components/Cards/adcards";
import Homecard from "../../components/Cards/Homecard";
import HomeCrousel from "../../components/Cards/HomeCrousel";
//import SearchForm from "../components/forms/SearchForm";

export default function Home() {
  // context
  const [auth, setAuth] = useAuth();
  // state
  const [adsForSell, setAdsForSell] = useState();
  const [adsForRent, setAdsForRent] = useState();

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/adapi/ads");
      // console.log(data);
      setAdsForSell(data.adsForSell);
      setAdsForRent(data.adsForRent);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {/* <h1 className="display-1 bg-primary text-light p-5">For Sell</h1>
      <div className="container">
        <div className="row">
          {adsForSell?.map((ad) => (
            <AdCard ad={ad} key={ad._id} />
          ))}
        </div>
      </div> */}
      <div>
        <HomeCrousel></HomeCrousel>
      </div>
      <center>
      <h1> For sale</h1>
      </center>
      <div>
        {/* {console.log(adsForSell)} */}
        <div className="row gx-5">
            <div className="col-md-4">
            <Homecard></Homecard>
            </div>
            <div className="col-md-4">
            <Homecard></Homecard>
            </div>
            <div className="col-md-4">
            <Homecard></Homecard>
            </div>
            <div className="col-md-4">
            <Homecard></Homecard>
            </div>
            <div className="col-md-4">
            <Homecard></Homecard>
            </div>
        </div>
      </div>

      {/* <h1 className="display-1 bg-primary text-light p-5">For Rent</h1>
      <div className="container">
        <div className="row">
          {adsForRent?.map((ad) => (
            <AdCard ad={ad} key={ad._id} />
          ))}
        </div>
      </div> */}
      <div>
      <center>
        <h1> For Rent</h1>
        </center>
      <div>
        {/* {console.log(adsForRent)} */}
        <div className="row gx-5">
            <div className="col-md-4">
            <Homecard></Homecard>
            </div>
            <div className="col-md-4">
            <Homecard></Homecard>
            </div>
            <div className="col-md-4">
            <Homecard></Homecard>
            </div>
            <div className="col-md-4">
            <Homecard></Homecard>
            </div>
            <div className="col-md-4">
            <Homecard></Homecard>
            </div>
        </div>
      </div>
      </div>
    </div>
  );
}