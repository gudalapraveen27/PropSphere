import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useAddBookingMutation,
  useGetBookingsByBuyerQuery,
  useLazyGetBookingsByBuyerQuery,
} from "../../services/booking.services";
import { useState } from "react";
import { useFilterPropertiesQuery } from "../../services/properties.services";
import { imageUrl } from "../../services/api";
import "./Viewproperty.css";
function Viewproperty() {
  const [message, setmessage] = useState("");
  const property_id = useSelector((state) => state.uReducer.property);
  const { data } = useFilterPropertiesQuery({ property: property_id });
  const property = data?.properties[0];
  const user = useSelector((state) => state.uReducer.id);
  const { data: bookings } = useGetBookingsByBuyerQuery(user);
  const existing = bookings?.find((booking) => {
    return (
      String(booking.property?._id || booking.property) ===
      String(property?._id)
    );
  });

  const navigate = useNavigate();
  const [addBooking] = useAddBookingMutation();
  const [lazyfn] = useLazyGetBookingsByBuyerQuery();
  const handleBooking = async () => {
    const booking = {
      property: property._id,
      buyer: user,
      seller: property.listedBy,
      message,
    };

    const result = await addBooking(booking);
    console.log(result);

    if (result.data) {
      await lazyfn(user);
      alert(result.data.message);
    } else {
      alert(result.data.message);
    }
    setmessage("");
  };

  if (!property) {
    return (
      <div className="property-details-empty">
        <h2>Property Not Found</h2>
        <p>Please select a property to view its details.</p>
        <button className="details-back-btn" onClick={() => navigate("/home")}>
          Go Back
        </button>
      </div>
    );
  }

  const isOwner = String(user) === String(property.listedBy);

  const location = [
    property.address?.locality,
    property.address?.city,
    property.address?.state,
    property.address?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="property-details-page">
      <div className="property-details-breadcrumb">
        <button onClick={() => navigate("/home")}>Home</button>
        <span>/</span>
        <span>Property Details</span>
      </div>

      <div className="property-details-header">
        <div className="property-details-heading">
          <span className="property-details-eyebrow">
            {property.listingType} · {property.propertyType}
          </span>

          <h1>{property.title}</h1>

          <p className="property-details-location">
            <span className="location-symbol">⌖</span>
            {location || "Location not provided"}
          </p>
        </div>

        <div className="property-details-price">
          <span>
            {property.listingType === "Rent"
              ? "Monthly Rent"
              : "Property Price"}
          </span>
          <h2>{formatPrice(property.price)}</h2>
        </div>
      </div>

      <section className="property-details-gallery">
        {property.images?.length > 0 ? (
          property.images.slice(0, 5).map((image, index) => (
            <div
              className={`property-gallery-image ${
                index === 0 ? "property-gallery-main" : ""
              }`}
              key={`${image}-${index}`}
            >
              <img
                src={imageUrl(image)}
                alt={`${property.title} - Image ${index + 1}`}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/no-image.png";
                }}
              />
            </div>
          ))
        ) : (
          <div className="property-gallery-placeholder">
            <span>⌂</span>
            <p>No property images available</p>
          </div>
        )}
      </section>

      <div className="property-details-layout">
        <main className="property-details-main">
          {/* Property overview */}
          <section className="property-details-card">
            <h3>Property Overview</h3>

            <div className="property-overview-grid">
              <div className="property-overview-item">
                <span className="overview-icon">⌂</span>
                <div>
                  <span>Property Type</span>
                  <strong>{property.propertyType}</strong>
                </div>
              </div>

              <div className="property-overview-item">
                <span className="overview-icon">▦</span>
                <div>
                  <span>Area</span>
                  <strong>
                    {property.area} {property.areaUnit || "sqft"}
                  </strong>
                </div>
              </div>

              <div className="property-overview-item">
                <span className="overview-icon">▤</span>
                <div>
                  <span>Bedrooms</span>
                  <strong>{property.bedrooms ?? 0}</strong>
                </div>
              </div>

              <div className="property-overview-item">
                <span className="overview-icon">♨</span>
                <div>
                  <span>Bathrooms</span>
                  <strong>{property.bathrooms ?? 0}</strong>
                </div>
              </div>

              <div className="property-overview-item">
                <span className="overview-icon">▣</span>
                <div>
                  <span>Furnishing</span>
                  <strong>{property.furnishing || "Unfurnished"}</strong>
                </div>
              </div>

              <div className="property-overview-item">
                <span className="overview-icon">✓</span>
                <div>
                  <span>Availability</span>
                  <strong>
                    {property.isAvailable ? "Available" : "Unavailable"}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          <section className="property-details-card">
            <h3>About This Property</h3>
            <p className="property-description">
              {property.description || "No description available."}
            </p>
          </section>

          <section className="property-details-card">
            <h3>Property Location</h3>

            <div className="property-address-list">
              {property.address?.street && (
                <div className="property-address-row">
                  <span>Street</span>
                  <strong>{property.address.street}</strong>
                </div>
              )}

              <div className="property-address-row">
                <span>Locality</span>
                <strong>{property.address?.locality || "N/A"}</strong>
              </div>

              <div className="property-address-row">
                <span>City</span>
                <strong>{property.address?.city || "N/A"}</strong>
              </div>

              <div className="property-address-row">
                <span>State</span>
                <strong>{property.address?.state || "N/A"}</strong>
              </div>

              <div className="property-address-row">
                <span>Pincode</span>
                <strong>{property.address?.pincode || "N/A"}</strong>
              </div>
            </div>
          </section>

          <section className="property-details-card">
            <h3>Amenities & Features</h3>

            {property.amenities?.length > 0 ? (
              <div className="property-amenities-list">
                {property.amenities.map((amenity, index) => (
                  <span
                    className="property-amenity"
                    key={`${amenity}-${index}`}
                  >
                    <span>✓</span>
                    {amenity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="property-muted-text">
                No amenities listed for this property.
              </p>
            )}
          </section>
        </main>

        <aside className="property-details-sidebar">
          <div className="property-details-card property-contact-card">
            <span className="property-details-eyebrow">
              PROPERTY INFORMATION
            </span>

            <h3>{property.title}</h3>

            <p className="property-contact-location">
              {location || "Location not provided"}
            </p>

            <div className="property-contact-price">
              {formatPrice(property.price)}
            </div>

            <div className="property-address-row">
              <span>Listing Type</span>
              <strong>{property.listingType}</strong>
            </div>

            <div className="property-address-row">
              <span>Status</span>
              <strong className="property-status-value">
                {property.status || "Pending"}
              </strong>
            </div>

            <div className="property-address-row">
              <span>Availability</span>
              <strong>
                {property.isAvailable ? "Available" : "Unavailable"}
              </strong>
            </div>
            {!isOwner && !existing && (
              <div className="property-address-row">
                <span>Any Message to buyer</span>
                <input
                  name="message"
                  value={message}
                  onChange={(e) => {
                    setmessage(e.target.value);
                  }}
                  className="property-message-input"
                ></input>
              </div>
            )}

            <div className="property-details-actions">
              {isOwner ? (
                <button
                  className="property-details-back-btn"
                  onClick={() => navigate("/home")}
                >
                  Go Back
                </button>
              ) : (
                <div>
                  {existing && (
                    <div className="property-details-book-btn">Booked</div>
                  )}
                  {!existing && (
                    <button
                      className="property-details-book-btn"
                      disabled={!property.isAvailable}
                      onClick={handleBooking}
                    >
                      {property.isAvailable ? "Book Property" : "Unavailable"}
                    </button>
                  )}
                </div>
              )}
            </div>

            <p className="property-details-note">
              {isOwner
                ? "You are viewing your own property listing."
                : "Review the property details before proceeding."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Viewproperty;
