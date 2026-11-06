import { useSelector } from "react-redux";
import {
  useGetAllPropertiesQuery,
  useLazyGetAllPropertiesQuery,
} from "../../services/properties.services";
import {
  useGetBookingsBySellerQuery,
  useUpdateBookingStatusMutation,
} from "../../services/booking.services";
import { useLazyGetuserbyidQuery } from "../../services/auth.services";
import { imageUrl } from "../../services/api";
import "./Requests.css";
function Requests() {
  const user = useSelector((state) => state.uReducer.id);

  const { data: properties } = useGetAllPropertiesQuery();
  const [refreshProperties] = useLazyGetAllPropertiesQuery();

  const {
    data: propertyrequests,
    isLoading,
    isFetching,
    refetch: refreshBookings,
  } = useGetBookingsBySellerQuery(user, {
    skip: !user,
  });

  const [buyerfn] = useLazyGetuserbyidQuery();

  const [updateBookingStatus, { isLoading: isUpdating }] =
    useUpdateBookingStatusMutation();

  async function buyerdetailshandler(id) {
    const res = await buyerfn(id);
    const buyer = res.data;

    if (buyer) {
      alert(
        `Name: ${buyer.name}\nEmail: ${buyer.email}\nPhone: ${buyer.phone}`,
      );
    } else {
      alert("Buyer details not found");
    }
  }

  async function bookingstatushandler(bookingId, status) {
    if (status === "Confirmed") {
      const confirmAccept = window.confirm(
        "Accept this buyer? All other pending requests for this property will be rejected.",
      );

      if (!confirmAccept) {
        return;
      }
    } else {
      const confirmReject = window.confirm(
        "Are you sure you want to reject this request?",
      );

      if (!confirmReject) {
        return;
      }
    }

    const res = await updateBookingStatus({
      id: bookingId,
      status,
      seller: user,
    });

    if (res.data) {
      alert(res.data.message);

      await Promise.all([refreshBookings(), refreshProperties()]);
    } else {
      alert(res.error?.data?.message || "Unable to update booking");
    }
  }

  const Arequests = propertyrequests?.length || 0;

  const Prequests =
    propertyrequests?.filter((p) => p.status === "Pending").length || 0;

  const Confirmed =
    propertyrequests?.filter((p) => p.status === "Confirmed").length || 0;

  const Rejected =
    propertyrequests?.filter((p) => p.status === "Rejected").length || 0;

  if (isLoading) {
    return <div className="requests-page">Loading requests...</div>;
  }

  return (
    <div className="requests-page">
      <div className="requests-header">
        <div>
          <h2>Property Requests</h2>
          <p>Manage buyers interested in your properties.</p>
        </div>
      </div>

      <div className="requests-summary">
        <div className="summary-card">
          <span>All Requests</span>
          <h3>{Arequests}</h3>
        </div>

        <div className="summary-card pending-summary">
          <span>Pending</span>
          <h3>{Prequests}</h3>
        </div>

        <div className="summary-card confirmed-summary">
          <span>Confirmed</span>
          <h3>{Confirmed}</h3>
        </div>

        <div className="summary-card rejected-summary">
          <span>Rejected</span>
          <h3>{Rejected}</h3>
        </div>
      </div>

      <div className="requests-list">
        {Arequests === 0 && (
          <div className="requests-empty">No property requests found.</div>
        )}

        {propertyrequests?.map((r) => {
          const prop = properties?.properties?.find(
            (p) => p._id === r.property,
          );

          if (!prop) return null;

          return (
            <div className="request-card" key={r._id}>
              <div className="request-property">
                <img
                  className="request-property-image"
                  src={imageUrl(prop.images?.[0])}
                  alt={prop.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/no-image.png";
                  }}
                />

                <div className="request-property-info">
                  <h3>{prop.title}</h3>

                  <p className="request-location">
                    {prop.address?.locality} · {prop.address?.city}
                  </p>

                  <div className="request-property-meta">
                    <span>{prop.propertyType}</span>

                    <span>
                      {prop.bedrooms ? `${prop.bedrooms} BHK` : "Property"}
                    </span>
                  </div>

                  <div className="request-price">
                    ₹{Number(prop.price).toLocaleString("en-IN")}
                  </div>

                  <p>Property status: {prop.status}</p>

                  <p>
                    Availability:{" "}
                    {prop.isAvailable ? "Available" : "Unavailable"}
                  </p>
                </div>
              </div>

              <div className="request-buyer">
                <span className="request-section-label">BUYER</span>

                <p className="request-buyer-id">{r.buyer}</p>

                <p className="request-message">
                  {r.message || "No message provided."}
                </p>

                <button
                  className="contact-button"
                  onClick={() => buyerdetailshandler(r.buyer)}
                >
                  Contact Buyer
                </button>
              </div>

              <div className="request-actions">
                <span
                  className={`request-status status-${r.status?.toLowerCase()}`}
                >
                  {r.status}
                </span>

                {r.status === "Pending" && (
                  <div className="request-action-buttons">
                    <button
                      className="accept-button"
                      disabled={isUpdating || !prop.isAvailable}
                      onClick={() => bookingstatushandler(r._id, "Confirmed")}
                    >
                      Accept
                    </button>

                    <button
                      className="reject-button"
                      disabled={isUpdating}
                      onClick={() => bookingstatushandler(r._id, "Rejected")}
                    >
                      Reject
                    </button>
                  </div>
                )}

                {r.status === "Confirmed" && (
                  <button
                    className="reject-button"
                    disabled={isUpdating}
                    onClick={() => bookingstatushandler(r._id, "Rejected")}
                  >
                    Reject
                  </button>
                )}

                {r.status === "Rejected" && (
                  <button
                    className="accept-button"
                    disabled={isUpdating || !prop.isAvailable}
                    onClick={() => bookingstatushandler(r._id, "Confirmed")}
                  >
                    Accept
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isFetching && <p>Refreshing requests...</p>}
    </div>
  );
}

export default Requests;
