import { useGetAllPropertiesQuery } from "../../services/properties.services";
import {
  useGetFavoritesQuery,
  useDeleteFavoriteMutation,
  useLazyGetFavoritesQuery,
} from "../../services/favorite.services";
import { useDispatch, useSelector } from "react-redux";
import { viewproperty } from "../../features/user.slice";
import { useNavigate } from "react-router-dom";
import { imageUrl } from "../../services/api";
import "./PropertyCards.css";

import "./Favorites.css";
function Favorites() {
  const user = useSelector((state) => state.uReducer.id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: propertyData } = useGetAllPropertiesQuery();

  const { data: favoriteData } = useGetFavoritesQuery(user);

  const [deleteFavorite] = useDeleteFavoriteMutation();
  const [favlazyfn] = useLazyGetFavoritesQuery();

  const favoriteIds = favoriteData?.favorites?.properties || [];

  const favoriteProperties =
    propertyData?.properties?.filter((property) =>
      favoriteIds.includes(property._id),
    ) || [];

  const handleRemove = async (propertyId) => {
    await deleteFavorite({
      user,
      property: propertyId,
    }).unwrap();
    await favlazyfn(user);
  };

  if (!user) {
    return (
      <div className="properties-container">
        <h2 className="properties-heading">My Favorites</h2>
        <p>Please log in to view your favorites.</p>
      </div>
    );
  }

  return (
    <div className="properties-container">
      <h2 className="properties-heading">My Favorites</h2>

      {favoriteProperties.length === 0 ? (
        <p>You haven't added any properties to your favorites yet.</p>
      ) : (
        <div className="properties-grid">
          {favoriteProperties.map((property) => (
            <div className="property-card" key={property._id}>
              <div className="property-image-wrapper">
                <img
                  className="property-image"
                  src={imageUrl(property.images?.[0])}
                  alt={property.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/no-image.png";
                  }}
                />
              </div>

              <div className="property-top">
                <div className="property-badges">
                  <span
                    className={`property-status ${
                      property.isAvailable ? "available" : "sold"
                    }`}
                  >
                    {property.isAvailable ? "Available" : "Sold"}
                  </span>

                  <span className="property-listing-type">
                    For {property.listingType}
                  </span>
                </div>

                <button onClick={() => handleRemove(property._id)}>♥</button>
              </div>

              <div className="property-content">
                <h3 className="property-title">{property.title}</h3>

                <p className="property-location">
                  {property.address?.locality}, {property.address?.city}
                </p>

                <h3 className="property-price">₹ {property.price}</h3>

                <div className="property-features">
                  <div className="property-feature">
                    <strong>{property.bedrooms}</strong>
                    <span>Bedrooms</span>
                  </div>

                  <div className="property-feature">
                    <strong>{property.bathrooms}</strong>
                    <span>Bathrooms</span>
                  </div>

                  <div className="property-feature">
                    <strong>{property.area}</strong>
                    <span>{property.areaUnit}</span>
                  </div>
                </div>

                <p className="property-amenities">
                  {property.furnishing}
                  {property.amenities?.length
                    ? ` · ${property.amenities.join(" · ")}`
                    : ""}
                </p>

                {property.isAvailable ? (
                  <button
                    onClick={() => {
                      window.localStorage.setItem("property", property._id);
                      dispatch(viewproperty(property._id));
                      navigate("/home/viewprop");
                    }}
                    className="property-button"
                  >
                    View Details
                  </button>
                ) : (
                  <button className="property-button" disabled>
                    Sold
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
