import { useState } from "react";
import CurrencyInput from "react-currency-input-field";

import ImageUpload from "../forms/imageUpload";
import AddressAutocomplete from "../forms/address"
//make 80000 to 80,000 insert comma in currency

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function AdForm({ action, type }) {
  // state
  const [ad, setAd] = useState({
    photos: [],
    uploading: false,
    price: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    carpark: "",
    landsize: "",
    city: "",
    title:"",
    description: "",
    loading: false,
    type,
    action,
  });

  const navigate = useNavigate();

  const handleClick = async () => {
    //e.preventDefault();
    try {
      setAd({ ...ad, loading: true });
      //const { data } = await axios.post("/ad", ad);

      console.log("ad create response => ");
      //  //axios error ke case me pura link daldo
      const { data } = await axios.post("http://localhost:8000/adapi/ad",ad);
      // yaha par route ko string ke form me likha hai isliye pura endpoint hit karna padh rha hai
      //"http://localhost:8000/adapi/ad" yaha par pura endpoint kyu hit karna padh rha hai

      console.log("ad create response => ", data);
      if (data?.error) {
        toast.error(data.error);
        setAd({ ...ad, loading: false });
      } else {
        toast.success("Ad created successfully");
        setAd({ ...ad, loading: false });
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
      setAd({ ...ad, loading: false });
    }
  };

  return (
    <>
<div>
      
      <ImageUpload ad={ad} setAd={setAd} />

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter City"
        value={ad.city}
        onChange={(e) => setAd({ ...ad, city: e.target.value })}
      />

      <AddressAutocomplete  address={ad.address} setAddress={(newAddress) => setAd({ ...ad, address: newAddress })} />

      <CurrencyInput
        placeholder="Enter price"
        defaultValue={ad.price}
        className="form-control mb-3"
        onValueChange={(value) => setAd({ ...ad, price: value })}
      />

      
      {type === "House" ? (
        <>
          <input
            type="number"
            min="0"
            className="form-control mb-3"
            placeholder="Enter how many bedrooms"
            value={ad.bedrooms}
            onChange={(e) => setAd({ ...ad, bedrooms: e.target.value })}
          />

          <input
            type="number"
            min="0"
            className="form-control mb-3"
            placeholder="Enter how many bathrooms"
            value={ad.bathrooms}
            onChange={(e) => setAd({ ...ad, bathrooms: e.target.value })}
          />

          <input
            type="number"
            min="0"
            className="form-control mb-3"
            placeholder="Enter how many carpark"
            value={ad.carpark}
            onChange={(e) => setAd({ ...ad, carpark: e.target.value })}
          />
        </>
      ) : (
        ""
      )}

      <input
        type="number"
        className="form-control mb-3"
        placeholder="Size of land"
        value={ad.landsize}
        onChange={(e) => setAd({ ...ad, landsize: e.target.value })}
      />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter Title"
        value={ad.title}
        onChange={(e) => setAd({ ...ad, title: e.target.value })}
      />

      <textarea
        className="form-control mb-3"
        placeholder="Enter description"
        value={ad.description}
        onChange={(e) => setAd({ ...ad, description: e.target.value })}
      />

      <button
               onClick={handleClick}
                disabled={ad?.loading}
                className="btn btn-primary col-12 mb-4"
              >
                {ad?.loading ? "Saving..." : "Submit"}
       </button>
</div>

         <pre>{JSON.stringify(ad, null, 4)}</pre> 
      </>
  );
}
