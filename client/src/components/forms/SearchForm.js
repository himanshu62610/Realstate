import { useSearch } from "../../context/search";
import AddressAutocomplete from "../forms/address"
import { sellPrices, rentPrices } from "../helpers/PriceList";

import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SearchForm() {
  // context
  const [search, setSearch, innitialState ] = useSearch();

  console.log(sellPrices, rentPrices);
  const navigate = useNavigate();


  const handleSearch = async () => {
    setSearch({ ...search, loading: false });
    try {
      const { results, page, price, ...rest } = search;
      const query = queryString.stringify(rest);
       
      //axios me hamesa pura endpoint likhna nahi to kam nahi karega
      const { data } = await axios.get(`http://localhost:8000/adapi/search?${query}`);
      //console.log("hello");
      if (search?.page !== "/search") {
        setSearch((prev) => ({ ...prev, results: data, loading: false }));
        navigate("/search");
      } else {
        setSearch((prev) => ({
          ...prev,
          results: data,
          page: window.location.pathname,
          loading: false,
        }));
      }
    } catch (err) {
      console.log(err);
      setSearch({ ...search, loading: false });
    }
  };

  return (
    <>
      <div className="container">

    {/* can use address autocomplete dropdown menu */}
      <div className="row ml-5 mb-5">
          <div className="col-lg-11 form-control">
             <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter your address"
        value={search.address}
        onChange={(e) => setSearch({ ...search, address: e.target.value })}
      />
          </div>
        </div>


        <div className="d-flex justify-content-center mt-3">
        {/*<AddressAutocomplete  address={search.address} setAddress={(newAddress) => setSearch({ ...search, address: newAddress })} />*/}
        <button
        onClick={() => setSearch({ ...search, action: "Buy", price: "" })}
        className="btn btn-primary col-lg-2 square">
           {search.action === "Buy" ? "✅ Buy" : "Buy"}
          </button>

          <button 
          onClick={() => setSearch({ ...search, action: "Rent", price: "" })}
          className="btn btn-primary col-lg-2 square">
            {search.action === "Rent" ? "✅ Rent" : "Rent"}
            </button>

          <button
          onClick={() => setSearch({ ...search, type: "House", price: "" })}
          className="btn btn-primary col-lg-2 square">
           {search.type === "House" ? "✅ House" : "House"}
            </button>

          <button
          onClick={() => setSearch({ ...search, type: "Land", price: "" })}
          className="btn btn-primary col-lg-2 square">
            {search.type === "Land" ? "✅ Land" : "Land"}
            </button>
    
          <div className="dropdown">
            <button 
            className="btn btn-primary dropdown-toggle square"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            >
            &nbsp; {search?.price ? search.price : "Price"}  
            </button>
           
            <ul className="dropdown-menu">
            {search.action === "Buy" ? (
                <>
          {sellPrices.map((item)=>(
            <li key={item._id}>
              <a 
               onClick={() => {
                setSearch({
                  ...search,
                  price: item.name,
                  priceRange: item.array,
                });
              }}

              className="dropdown-item">
                {item.name}</a>
            </li>
          ))};
          </>
            ):(
              <>
          {rentPrices.map((item)=>(
            <li key={item._id}>
              <a 
               onClick={() => {
                setSearch({
                  ...search,
                  price: item.name,
                  priceRange: item.array,
                });
              }}

              className="dropdown-item">
                {item.name}</a>
            </li>
          ))};
          </>
            )}
            
            </ul>
          </div>


          <button  
           onClick={handleSearch}
          className="btn btn-danger col-lg-2 square">
            Search
            </button>
         
         </div>
         {/*<pre>{JSON.stringify(search, null, 4)}</pre>*/}
      </div>
    </>
  );
}