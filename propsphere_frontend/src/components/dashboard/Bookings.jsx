import { useSelector } from "react-redux";
import {
  useGetBookingsByBuyerQuery,
  useLazyGetBookingsByBuyerQuery,
  useCancelBookingMutation,
} from "../../services/booking.services";
import {
  useGetAllPropertiesQuery,
  useLazyGetAllPropertiesQuery,
} from "../../services/properties.services";
import { useLazyGetuserbyidQuery } from "../../services/auth.services";
import { imageUrl } from "../../services/api";

import "./Bookings.css";
function Bookings() {
  const [sellerfn] = useLazyGetuserbyidQuery();
  const user = useSelector((state) => state.uReducer.id);

  const {
    data: bookings,
    isLoading,
    isFetching,
    isError,
  } = useGetBookingsByBuyerQuery(user, {
    skip: !user,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: properties,
    isLoading: propertiesLoading,
    isError: propertiesError,
  } = useGetAllPropertiesQuery();

  const [cancelBooking] = useCancelBookingMutation();
  const [lazyfn] = useLazyGetBookingsByBuyerQuery();
  const [refreshProperties] = useLazyGetAllPropertiesQuery();

  async function deletehandler(bookingId) {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmCancel) {
      return;
    }

    const res = await cancelBooking({
      id: bookingId,
      buyer: user,
    });

    if (res.data) {
      alert(res.data.message || "Booking cancelled successfully");

      await Promise.all([lazyfn(user), refreshProperties()]);
    } else {
      alert(res.error?.data?.message || "Error cancelling booking");
    }
  }
  async function sellerdetailshandler(id) {
    const res = await sellerfn(id);
    const seller = res.data;

    if (seller) {
      alert(
        `Name: ${seller.name}\nEmail: ${seller.email}\nPhone: ${seller.phone}`,
      );
    } else {
      alert("Buyer details not found");
    }
  }

  if (!user) {
    return (
      <div className="bookings-page">
        <div className="bookings-empty">
          <div className="bookings-empty-icon">⌂</div>
          <h2>Please Log In</h2>
          <p>Log in to view your property booking requests.</p>
        </div>
      </div>
    );
  }

  if (isLoading || isFetching || propertiesLoading) {
    return (
      <div className="bookings-loading">
        <div className="bookings-spinner"></div>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bookings-page">
        <div className="bookings-empty">
          <h2>Unable to Load Bookings</h2>
          <p>Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  const myBookings = Array.isArray(bookings)
    ? bookings
    : bookings?.bookings || [];

  const propertyList = Array.isArray(properties)
    ? properties
    : properties?.properties || properties?.data || [];

  const getProperty = (booking) => {
    return propertyList.find(
      (item) =>
        String(item._id) === String(booking.property?._id || booking.property),
    );
  };

  const pendingCount = myBookings.filter(
    (booking) => booking.status === "Pending",
  ).length;

  const confirmedCount = myBookings.filter(
    (booking) => booking.status === "Confirmed",
  ).length;

  const rejectedCount = myBookings.filter(
    (booking) => booking.status === "Rejected",
  ).length;

  const cancelledCount = myBookings.filter(
    (booking) => booking.status === "Cancelled",
  ).length;

  const formatPrice = (price) => {
    if (price == null || price === "") {
      return "Price unavailable";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bookings-page">
      {/* Header */}
      <div className="bookings-header">
        <div>
          <span className="bookings-eyebrow">propsphere</span>
          <h1>My Bookings</h1>
          <p>Manage your property booking requests in one place.</p>
        </div>

        <div className="bookings-count">
          <span>Total Bookings</span>
          <strong>{myBookings.length}</strong>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="bookings-summary">
        <div className="booking-summary-card">
          <span className="booking-summary-icon">◷</span>
          <div>
            <p>Pending</p>
            <h3>{pendingCount}</h3>
          </div>
        </div>

        <div className="booking-summary-card">
          <span className="booking-summary-icon">✓</span>
          <div>
            <p>Confirmed</p>
            <h3>{confirmedCount}</h3>
          </div>
        </div>

        <div className="booking-summary-card">
          <span className="booking-summary-icon">⌁</span>
          <div>
            <p>Rejected</p>
            <h3>{rejectedCount}</h3>
          </div>
        </div>

        <div className="booking-summary-card">
          <span className="booking-summary-icon">×</span>
          <div>
            <p>Cancelled</p>
            <h3>{cancelledCount}</h3>
          </div>
        </div>
      </div>

      {/* Booking List Heading */}
      <div className="bookings-list-header">
        <h2>Your Property Requests</h2>
        <span>
          {myBookings.length} {myBookings.length === 1 ? "request" : "requests"}
        </span>
      </div>

      {/* Booking Cards */}
      {myBookings.length > 0 ? (
        <div className="bookings-list">
          {myBookings.map((booking) => {
            const property = getProperty(booking);

            const location = [
              property?.address?.locality,
              property?.address?.city,
              property?.address?.state,
            ]
              .filter(Boolean)
              .join(", ");

            const statusClass = (booking.status || "Pending").toLowerCase();

            const canCancel = ["Pending", "Confirmed"].includes(
              booking.status || "Pending",
            );

            return (
              <div className="booking-card" key={booking._id}>
              
                {/* Property Image */}
                <div className="booking-property-image">
                  {property?.images?.length > 0 ? (
                    <img
                      src={imageUrl(property.images[0])}
                      alt={property.title || "Property"}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                        event.currentTarget.parentElement.innerHTML =
                          '<div class="booking-no-image"><span>⌂</span><p>Property image unavailable</p></div>';
                      }}
                    />
                  ) : (
                    <div className="booking-no-image">
                      <span>⌂</span>
                      <p>Property image unavailable</p>
                    </div>
                  )}
                </div>
                
                {/* Property Information */}
                <div className="booking-card-content">
                  <div className="booking-card-top">
                    <span className="booking-type">
                      {property
                        ? `${property.listingType || "PROPERTY"}${
                            property.propertyType
                              ? ` · ${property.propertyType}`
                              : ""
                          }`
                        : "PROPERTY"}
                    </span>

                    <span className={`booking-status ${statusClass}`}>
                      <span className="booking-status-dot"></span>
                      {booking.status || "Pending"}
                    </span>
                  </div>

                  <h3>{property?.title || "Property details unavailable"}</h3>

                  <p className="booking-location">
                    <span>⌖</span>
                    {location || "Location unavailable"}
                  </p>

                  {/* Property Features */}
                  <div className="booking-property-details">
                    {property?.bedrooms != null && (
                      <span>
                        <strong>{property.bedrooms}</strong> Bedrooms
                      </span>
                    )}

                    {property?.bathrooms != null && (
                      <span>
                        <strong>{property.bathrooms}</strong> Bathrooms
                      </span>
                    )}

                    {property?.area != null && (
                      <span>
                        <strong>{property.area}</strong>{" "}
                        {property.areaUnit || "sqft"}
                      </span>
                    )}

                    {property?.furnishing && <span>{property.furnishing}</span>}
                  </div>

                  {/* Price and Cancel Booking */}
                  <div className="booking-card-footer">
                    <div className="booking-price">
                      <span>
                        {property?.listingType === "Rent"
                          ? "Monthly Rent"
                          : "Property Price"}
                      </span>
                      <strong>{formatPrice(property?.price)}</strong>
                    </div>

                    <div className="booking-request-info">
                      <span>Seller Details</span>
                      <button
                        className="contact-button"
                        onClick={() => sellerdetailshandler(property?.listedBy)}
                      >
                        Contact
                      </button>
                    </div>
                    <div className="booking-request-info">
                      <span>
                        {canCancel ? "Cancel Booking" : "Booking Status"}
                      </span>

                      {canCancel ? (
                        <button
                          className="booking-cancel-button"
                          onClick={() => deletehandler(booking._id)}
                        >
                          Cancel
                        </button>
                      ) : (
                        <span>{booking.status}</span>
                      )}
                    </div>
                  </div>

                  {!property && (
                    <p className="booking-property-warning">
                      {propertiesError
                        ? "Unable to load property information."
                        : "The property could not be matched with this booking."}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bookings-empty">
          <div className="bookings-empty-icon">⌂</div>
          <h2>No Bookings Yet</h2>
          <p>
            You haven't requested any properties yet. Explore available
            properties and book a place that feels like home.
          </p>
        </div>
      )}
    </div>
  );
}

export default Bookings;
