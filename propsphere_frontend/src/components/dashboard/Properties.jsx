import {
  useGetAllPropertiesQuery,
  useLazyFilterPropertiesQuery,
} from "../../services/properties.services";
import {
  useAddFavoriteMutation,
  useDeleteFavoriteMutation,
  useGetFavoritesQuery,
  useLazyGetFavoritesQuery,
} from "../../services/favorite.services";
import { useDispatch, useSelector } from "react-redux";
import { viewproperty } from "../../features/user.slice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { imageUrl } from "../../services/api";
import "./PropertyCards.css";

import "./Properties.css";
function Properties() {
  const user = useSelector((state) => state.uReducer.id);
  const { data } = useGetAllPropertiesQuery();
  const { data: favoriteData } = useGetFavoritesQuery(user);

  const [addFavorite] = useAddFavoriteMutation();
  const [deleteFavorite] = useDeleteFavoriteMutation();
  const [favlazyfn] = useLazyGetFavoritesQuery();

  const [filterfn, { data: filteredData, isFetching }] =
    useLazyFilterPropertiesQuery();

  const [city, setcity] = useState("");
  const [price, setprice] = useState("");
  const [availability, setavailability] = useState("");
  const [status, setstatus] = useState("");
  const [listingType, setlistingType] = useState("");
  const [propertyType, setpropertyType] = useState("");
  const [furnishing, setfurnishing] = useState("");
  const [hasSearched, sethasSearched] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const favorites = favoriteData?.favorites?.properties || [];
  const properties = data?.properties || [];
  const featuredProperties = filteredData?.properties || [];

  const handleFilter = () => {
    let params = {};

    if (city) {
      params.city = city;
    }

    if (price) {
      params.priceRange = price;
    }

    if (availability !== "") {
      params.isAvailable = availability;
    }

    if (status) {
      params.status = status;
    }

    if (listingType) {
      params.listingType = listingType;
    }

    if (propertyType) {
      params.propertyType = propertyType;
    }

    if (furnishing) {
      params.furnishing = furnishing;
    }

    sethasSearched(true);
    filterfn(params);
  };

  const handleClearFilters = () => {
    setcity("");
    setprice("");
    setavailability("");
    setstatus("");
    setlistingType("");
    setpropertyType("");
    setfurnishing("");
    sethasSearched(false);
  };

  const handleFavorite = async (propertyId) => {
    if (favorites.includes(propertyId)) {
      await deleteFavorite({
        user,
        property: propertyId,
      }).unwrap();
    } else {
      await addFavorite({
        user,
        property: propertyId,
      }).unwrap();
    }

    await favlazyfn(user);
  };

  const displayedProperties = hasSearched ? featuredProperties : properties;

  return (
    <div className="properties-page">
      {/* Featured Filters */}
      <div className="featured-section">
        <h2 className="properties-heading">Featured</h2>

        <div className="featured-controls">
          <div className="featured-filters">
            <select value={city} onChange={(e) => setcity(e.target.value)}>
              <option value="">Select City</option>

              {data?.properties?.map((p, i) => {
                if (
                  data.properties.findIndex(
                    (item) => item.address?.city === p.address?.city,
                  ) === i
                ) {
                  return (
                    <option key={p._id} value={p.address.city}>
                      {p.address.city}
                    </option>
                  );
                }
                return null;
              })}
            </select>

            <input
              type="number"
              placeholder="Price upto"
              value={price}
              onChange={(e) => setprice(e.target.value)}
            />

            <select value={status} onChange={(e) => setstatus(e.target.value)}>
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Sold">Sold</option>
              <option value="Rented">Rented</option>
            </select>

            <select
              value={listingType}
              onChange={(e) => setlistingType(e.target.value)}
            >
              <option value="">Listing Type</option>
              <option value="Sale">Sale</option>
              <option value="Rent">Rent</option>
            </select>

            <select
              value={propertyType}
              onChange={(e) => setpropertyType(e.target.value)}
            >
              <option value="">Property Type</option>
              <option value="Apartment">Apartment</option>
              <option value="Independent House">Independent House</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
              <option value="Commercial">Commercial</option>
            </select>

            <select
              value={furnishing}
              onChange={(e) => setfurnishing(e.target.value)}
            >
              <option value="">Select Furnishing</option>

              {data?.properties?.map((p, i) => {
                if (
                  data.properties.findIndex(
                    (item) => item.furnishing === p.furnishing,
                  ) === i
                ) {
                  return (
                    <option key={p._id} value={p.furnishing}>
                      {p.furnishing}
                    </option>
                  );
                }
                return null;
              })}
            </select>
          </div>

          <div className="featured-filter-actions">
            <button onClick={handleFilter}>Apply Filters</button>
            <button onClick={handleClearFilters}>Clear Filters</button>
          </div>
        </div>
      </div>

      {/* Property Results */}
      <div className="properties-container">
        <h2 className="properties-heading">
          {hasSearched ? "Featured Search" : "Properties"}
        </h2>

        {hasSearched && isFetching ? (
          <p className="no-featured-properties">Searching properties...</p>
        ) : hasSearched && featuredProperties.length === 0 ? (
          <p className="no-featured-properties">
            No properties satisfy those conditions.
          </p>
        ) : (
          <div className="properties-grid">
            {displayedProperties.map((property) => {
              const isFavorite = favorites.includes(property._id);

              return (
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
                    {property.isAvailable && (
                      <button onClick={() => handleFavorite(property._id)}>
                        {isFavorite ? "♥" : "♡"}
                      </button>
                    )}
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Properties;
