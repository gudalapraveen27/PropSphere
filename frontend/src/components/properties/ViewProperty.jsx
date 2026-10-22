
import { useParams, useNavigate } from "react-router-dom"
import { useGetPropertyByIdQuery } from "../../services/propertyApi"
import "./ViewProperty.css"
import { useGetUserByIdQuery } from "../../services/registrationApi"

function ViewProperty() {
    const { id } = useParams()
    const navigate = useNavigate()
    

    const {
        isLoading,
        data,
        isError,
        error,
    } = useGetPropertyByIdQuery(id)

    const property = data?.property || data

    const {
        data: sellerData,
        isLoading: isSellerLoading,
        isError: isSellerError,
    } = useGetUserByIdQuery(property?.listedBy, {
        skip: !property?.listedBy,
    })

    const seller = sellerData?.user || sellerData

    if (isLoading) {
        return (
            <div className="view-property-status">
                <p>Loading property details...</p>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="view-property-status view-property-error">
                <h2>Unable to load property</h2>
                <p>
                    {error?.data?.message ||
                        error?.data?.msg ||
                        "Something went wrong while fetching the property."}
                </p>

                <button onClick={() => navigate("/home/properties")}>
                    Back to Properties
                </button>
            </div>
        )
    }

    // Support either a direct property object or a wrapped response.

    if (!property || !property.title) {
        return (
            <div className="view-property-status">
                <h2>Property not found</h2>
                <p>The requested property could not be found.</p>

                <button onClick={() => navigate("/home/properties")}>
                    Back to Properties
                </button>
            </div>
        )
    }

    const formatPrice = (price, listingType) => {
        const formatted = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price || 0)

        return listingType === "Rent"
            ? `${formatted} / month`
            : formatted
    }

    return (
        <div className="view-property-page">
            <button
                className="view-property-back"
                onClick={() => navigate("/home/properties")}
            >
                ← Back to Properties
            </button>

            <div className="view-property-card">
                {property.images?.length > 0 ? (
                    <img
                        className="view-property-image"
                        src={property.images[0]}
                        alt={property.title}
                    />
                ) : (
                    <div className="view-property-placeholder">
                        <span>⌂</span>
                        <p>No property image available</p>
                    </div>
                )}

                <div className="view-property-content">
                    <div className="view-property-badges">
                        <span>
                            For {property.listingType || "Sale"}
                        </span>

                        <span>
                            {property.propertyType || "Property"}
                        </span>
                    </div>

                    <h1>{property.title}</h1>

                    <p className="view-property-location">
                        ⌖{" "}
                        {[
                            property.address?.street,
                            property.address?.locality,
                            property.address?.city,
                            property.address?.state,
                            property.address?.pincode,
                        ]
                            .filter(Boolean)
                            .join(", ") || "Location unavailable"}
                    </p>

                    <h2 className="view-property-price">
                        {formatPrice(property.price, property.listingType)}
                    </h2>

                    <div className="view-property-features">
                        <div>
                            <strong>{property.bedrooms ?? "—"}</strong>
                            <span>Bedrooms</span>
                        </div>

                        <div>
                            <strong>{property.bathrooms ?? "—"}</strong>
                            <span>Bathrooms</span>
                        </div>

                        <div>
                            <strong>
                                {property.area ?? "—"}{" "}
                                {property.areaUnit || ""}
                            </strong>
                            <span>Area</span>
                        </div>
                    </div>

                    <section className="view-property-section">
                        <h3>Description</h3>
                        <p>
                            {property.description ||
                                "No description available."}
                        </p>
                    </section>

                    <section className="view-property-section">
                        <h3>Property Details</h3>

                        <div className="view-property-details-grid">
                            <p>
                                <strong>Property Type:</strong>{" "}
                                {property.propertyType || "Not specified"}
                            </p>

                            <p>
                                <strong>Listing Type:</strong>{" "}
                                {property.listingType || "Not specified"}
                            </p>

                            <p>
                                <strong>Furnishing:</strong>{" "}
                                {property.furnishing || "Not specified"}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {property.status || "Not specified"}
                            </p>
                        </div>
                    </section>

                    {property.amenities?.length > 0 && (
                        <section className="view-property-section">
                            <h3>Amenities</h3>

                            <div className="view-property-amenities">
                                {property.amenities.map((amenity, index) => (
                                    <span key={`${amenity}-${index}`}>
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                    <section className="view-property-section">
                        <h3>Seller Details</h3>

                        {isSellerLoading && <p>Loading seller details...</p>}

                        {isSellerError && (
                            <p>Unable to load seller details. Please try again.</p>
                        )}

                        {!isSellerLoading && !isSellerError && seller && (
                            <div className="view-property-details-grid">
                                <p>
                                    <strong>Name:</strong>{" "}
                                    {seller.name || "Not available"}
                                </p>

                                <p>
                                    <strong>Email:</strong>{" "}
                                    {seller.email || "Not available"}
                                </p>

                                <p>
                                    <strong>Mobile:</strong>{" "}
                                    {seller.mobile || "Not available"}
                                </p>
                            </div>
                        )}

                        {!isSellerLoading && !isSellerError && !seller && (
                            <p>Seller information is unavailable.</p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
}

export default ViewProperty
