import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  SwiperCore.use([Navigation]);

  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingID}`);
        if (!res.ok) {
          console.error(res);
          setLoading(false);
          setError(res.status);
          return;
        }
        const data = await res.json();
        console.log(data);
        setListing(data.data.listing);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.log("[Listing] Error: ", err);
        setLoading(false);
        setError(err);
      }
    };

    fetchListing();
  }, [params.listingID]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Something Went Wrong!</p>}
      {listing && !error && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[500px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  );
};

export default Listing;
