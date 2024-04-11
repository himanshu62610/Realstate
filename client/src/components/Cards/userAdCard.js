import { Badge } from "antd";
import {Link} from "react-router-dom";
import AdFeatures from "../../components/Cards/AdFeatures"


const defaultImage = "https://example.com/default-image.jpg";
export default function UserAdCard({ ad }) {
    //formatNumber is a code to insert comma after every three digit
    //price stored in mongodb do not contain comma
  function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
  }
  console.log(ad?.photos?.[0]);
  return (
    <div className="col-lg-4 p-4 gx-4 gy-4" key={ad._id}>
      <Link to={`/ad/${ad.slug}`}>
      <Badge.Ribbon
        text={`${ad?.type} for ${ad?.action}`}
        color={`${ad?.action === "Sell" ? "blue" : "red"}`}
        
      >
        <div className="card hoverable shadow">
        

        <img
              src={ad?.photos?.[0]}
              alt={`${ad?.type}-${ad?.address}-${ad?.action}-${ad?.price}`}
              style={{ height: "250px", objectFit: "cover" }}
            />


          <div className="card-body">

            <h3>Rs{formatNumber(ad?.price)}</h3>

            <p className="card-text">{ad?.address}</p>
          <AdFeatures ad={ad}/>
           
          </div>
        </div>
      </Badge.Ribbon>
      </Link>
    </div>
  );
}
