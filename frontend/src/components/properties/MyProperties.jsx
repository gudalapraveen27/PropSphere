
import { useSelector } from "react-redux";
import { useGetMyPropertiesQuery } from "../../services/propertyApi";
import "./MyProperties.css";

function MyProperties() {
  const userId = useSelector((state) => state.uReducer.id);

  const { isLoading, data, isError } = useGetMyPropertiesQuery(userId, {
    skip: !userId,
  });

  const properties = Array.isArray(data) ? data : data?.properties || [];

  if (isLoading) return <h3 className="my-properties-message">Loading properties...</h3>;
  if (isError) return <h3 className="my-properties-message">Failed to load properties</h3>;

  return (
    <div className="my-properties-container">
      <h2 className="my-properties-title">My Properties</h2>

      {properties.length === 0 ? (
        <p className="my-properties-message">No properties found.</p>
      ) : (
        properties.map((property) => (
          <div className="my-property-card" key={property._id}>
            <h3 className="my-property-name">{property.title}</h3>

            <p>
              <strong>Location:</strong> {property.address?.city},{" "}
              {property.address?.state}
            </p>

            <p>
              <strong>Price:</strong> ₹
              {property.price?.toLocaleString("en-IN")}
            </p>

            <p><strong>Listing Type:</strong> {property.listingType}</p>
            <p><strong>Property Type:</strong> {property.propertyType}</p>
            <p>
              <strong>Area:</strong> {property.area} {property.areaUnit}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="my-property-status">{property.status}</span>
            </p>

            <div className="my-property-actions">
              <button
                className="my-property-btn view-btn"
                onClick={() =>
                  (window.location.href = `/home/properties/${property._id}`)
                }
              >
                View
              </button>

              <button
                className="my-property-btn update-btn"
                onClick={() =>
                  (window.location.href = `/home/updateproperty/${property._id}`)
                }
              >
                Update
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyProperties;
