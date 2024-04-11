import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Logo from "../../logo.svg";
//import ContactSeller from "../../components/forms/contactSeller"

import ImageGallery from "../../components/misc/ImageGallery";
import AdFeatures from "../../components/Cards/AdFeatures";
import formatNumber from "../../components/helpers/ad";
import ContactSeller from "../../components/forms/contactSeller";
import LikeUnlike from "../../components/misc/LikeUnlike";
import AdCard from "../../components/Cards/adcards";
import MapCard from "../../components/Cards/MapCard";

import HTMLRenderer from "react-html-renderer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import "./Add.css";

dayjs.extend(relativeTime);

//import { Image } from "antd";
// const photos = [
//     {
//       src: "https://t4.ftcdn.net/jpg/02/79/95/39/360_F_279953994_TmVqT7CQhWQJRLXev4oFmv8GIZTgJF1d.jpg",
//       width: 4,
//       height: 3,
//     },
//     {
//         src: "https://t4.ftcdn.net/jpg/02/79/95/39/360_F_279953994_TmVqT7CQhWQJRLXev4oFmv8GIZTgJF1d.jpg",
//          width: 1,
//          height: 1,
//        },
//        {
//            src: "https://t4.ftcdn.net/jpg/02/79/95/39/360_F_279953994_TmVqT7CQhWQJRLXev4oFmv8GIZTgJF1d.jpg",
//            width: 4,
//            height: 3,
//          },
//          {
//           src: "https://t4.ftcdn.net/jpg/02/79/95/39/360_F_279953994_TmVqT7CQhWQJRLXev4oFmv8GIZTgJF1d.jpg",
//            width: 1,
//            height: 1,
//          },
//   ];

export default function AdView() {
  const [ad, setAd] = useState({});
  const [related, setRelated] = useState([]);
  const params = useParams();

  useEffect(() => {
    if (params?.slug) fetchAd();
  }, [params?.slug]);

  const fetchAd = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/adapi/ad/${params.slug}`
      );
      setAd(data?.ad);
      setRelated(data?.related);
      // console.log("hello");
      // console.log(ad?.photos);
    } catch (err) {
      console.log(err);
    }
  };

  const generatePhotosArray = (photos) => {
    console.log("Original Photos Array:", photos);

    if (photos?.length > 0) {
      const x = photos?.length === 1 ? 2 : 4;
      let arr = [];

      photos.forEach((photo, index) => {
        // Log the entire photo object to inspect its structure
        console.log(`Photo object at index ${index}:`, photo);

        // Assuming each item in the 'photos' array is a URL
        const imageUrl = photo;

        if (imageUrl) {
          arr.push({
            src: imageUrl,
            width: x,
            height: x,
          });
        } else {
          console.error(`Invalid photo URL at index ${index}:`, imageUrl);
          // Use fallback image
          arr.push({
            src:"https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTJ8fHxlbnwwfHx8fHw%3D", // Replace with your fallback image URL
            width: x,
            height: x,
          });
        }
      });

      console.log("Generated Photos Array:", arr);
      return arr;
    } else {
      // Return a default image if there are no photos
      return [
        {
          src: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTJ8fHxlbnwwfHx8fHw%3D", // Replace with your fallback image URL
          width: 2,
          height: 1,
        },
      ];
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row mt-2">
          <div className="col-lg-4">
            <div className="d-flex justify-content-between">
              <button className="btn btn-primary disabled mt-2">
                {ad.type} for {ad.action}
              </button>
              <LikeUnlike ad={ad} />
            </div>
            <div className="mt-4 mb-4">
              {ad?.sold ? "❌ Off market" : "✅ In market"}
            </div>
            <h1>{ad.address}</h1>
            <AdFeatures ad={ad} />
            <h3 className="mt-3 h2">${formatNumber(ad.price)}</h3>
            <p className="text-muted">{dayjs(ad?.createdAt).fromNow()}</p>
          </div>



          <div className="col-lg-8">
            <ImageGallery photos={generatePhotosArray(ad?.photos)} />
          </div>



        </div>
      </div>

      <div className="container mb-5">
        <div className="row">
          <div className="col-lg-8 offset-lg-2 mt-3">
            <br />

            <h1>
              {ad?.type} in {ad?.address} for {ad?.action} ${ad?.price}
            </h1>

            <AdFeatures ad={ad} />

            <hr />

            <h3 className="fw-bold">{ad?.title}</h3>

            <HTMLRenderer
              html={ad?.description?.replaceAll(".", "<br/><br/>")}
            />
          </div>
        </div>
      </div>

      <div className="container">
        <ContactSeller ad={ad} />
      </div>

      <div className="container-fluid">
        <h4 className="text-center mb-3">Related Properties</h4>
        <hr style={{ width: "33%" }} />

        <div className="row">
          {related?.map((ad) => (
            <AdCard key={ad._id} ad={ad} />
          ))}
        </div>
      </div>

      <div className="container mb-5">
        <div className="row">
          <div className="mapContainer">
            <MapCard ad={ad} />
          </div>
        </div>
      </div>
    </>
  );
}
