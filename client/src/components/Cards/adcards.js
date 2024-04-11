import { Badge } from "antd";
import {Link} from "react-router-dom";
import AdFeatures from "../../components/Cards/AdFeatures"

export default function AdCard({ ad }) {
    //formatNumber is a code to insert comma after every three digit
    //price stored in mongodb do not contain comma
  function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
  }
  return (
    <div className="col-lg-4 p-4 gx-4 gy-4">
      <Link to={`/ad/${ad.slug}`}>
      <Badge.Ribbon
        text={`${ad?.type} for ${ad?.action}`}
        color={`${ad?.action === "Sell" ? "blue" : "red"}`}
        
      >
        <div className="card hoverable shadow">
         
        <img
              src={(ad?.photos?.[0])?(ad?.photos?.[0]):("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQSLXuNfy5-WQUG0e9oty_aA1KpCVG8HwUsQ&usqp=CAU")}
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
