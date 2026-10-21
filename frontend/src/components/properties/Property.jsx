import { useState } from "react"
import { useGetPropertiesQuery } from "../../services/propertyApi"
import { useNavigate } from "react-router-dom"
import "./Property.css"

function Property() {
    const { isLoading, data, isError, error } = useGetPropertiesQuery()
    const [search, setSearch] = useState("")
    const [propertyType, setPropertyType] = useState("All")
    const [listingType, setListingType] = useState("All")
    const navigate = useNavigate()

    const properties = Array.isArray(data)
        ? data
        : data?.properties || []

    const filteredProperties = properties.filter((property) => {
        const searchText = search.toLowerCase()

        const matchesSearch = [
            property.title,
            property.description,
            property.address?.city,
            property.address?.locality,
            property.address?.state,
        ].some((value) => value?.toLowerCase().includes(searchText))

        const matchesType =
            propertyType === "All" ||
            property.propertyType === propertyType

        const matchesListing =
            listingType === "All" ||
            property.listingType === listingType

        return matchesSearch && matchesType && matchesListing
    })

    function formatPrice(price, type) {
        const formatted = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price || 0)

        return type === "Rent" ? `${formatted} / month` : formatted
    }

    function details(id) {
        navigate(`/home/properties/${id}`)
    }

    if (isLoading) {
        return (
            <div className="property-status">
                <div className="property-loader"></div>
                <p>Finding properties for you...</p>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="property-status property-error">
                <h3>Unable to load properties</h3>
                <p>
                    {error?.data?.message ||
                        error?.data?.msg ||
                        "Please check your connection and try again."}
                </p>
            </div>
        )
    }

    return (
        <div className="properties-page">
            <div className="properties-heading">
                <div>
                    <span className="properties-eyebrow">
                        DISCOVER PROPSPHERE
                    </span>
                    <h2>Find Your Perfect Place</h2>
                    <p>
                        Explore homes and properties that fit your lifestyle.
                    </p>
                </div>

                <div className="properties-count">
                    <strong>{filteredProperties.length}</strong>
                    <span>
                        {filteredProperties.length === 1
                            ? "Property found"
                            : "Properties found"}
                    </span>
                </div>
            </div>

            <div className="properties-toolbar">
                <div className="property-search">
                    <span className="property-search-icon">⌕</span>
                    <input
                        type="search"
                        placeholder="Search by title, city or locality..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Search properties"
                    />
                </div>

                <select
                    className="property-filter"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    aria-label="Filter by property type"
                >
                    <option value="All">All Property Types</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                    <option value="Commercial">Commercial</option>
                </select>

                <select
                    className="property-filter"
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value)}
                    aria-label="Filter by listing type"
                >
                    <option value="All">Sale & Rent</option>
                    <option value="Sale">For Sale</option>
                    <option value="Rent">For Rent</option>
                </select>
            </div>

            {filteredProperties.length === 0 ? (
                <div className="properties-empty">
                    <div className="properties-empty-icon">⌂</div>
                    <h3>No properties found</h3>
                    <p>Try another search term or change your filters.</p>
                    <button
                        className="property-reset-button"
                        onClick={() => {
                            setSearch("")
                            setPropertyType("All")
                            setListingType("All")
                        }}
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="property-grid">
                    {filteredProperties.map((property) => (
                        <article
                            className="property-card"
                            key={property._id || property.id}
                        >
                            <div className="property-card-image">
                                {property.images?.[0] ? (
                                    <img
                                        src={property.images[0]}
                                        alt={property.title}
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="property-image-placeholder">
                                        <span>⌂</span>
                                        <p>Property image coming soon</p>
                                    </div>
                                )}

                                <span
                                    className={`property-listing-badge ${property.listingType === "Rent"
                                            ? "rent-badge"
                                            : "sale-badge"
                                        }`}
                                >
                                    For {property.listingType || "Sale"}
                                </span>

                                <span className="property-type-badge">
                                    {property.propertyType}
                                </span>
                            </div>

                            <div className="property-card-content">
                                <p className="property-card-location">
                                    <span>⌖</span>
                                    {[
                                        property.address?.locality,
                                        property.address?.city,
                                    ]
                                        .filter(Boolean)
                                        .join(", ") || "Location unavailable"}
                                </p>

                                <h3 className="property-card-title">
                                    {property.title}
                                </h3>

                                <p className="property-card-description">
                                    {property.description}
                                </p>

                                <div className="property-features">
                                    {property.bedrooms != null && (
                                        <span>
                                            <strong>{property.bedrooms}</strong>
                                            {" "}Beds
                                        </span>
                                    )}

                                    {property.bathrooms != null && (
                                        <span>
                                            <strong>{property.bathrooms}</strong>
                                            {" "}Baths
                                        </span>
                                    )}

                                    {property.area != null && (
                                        <span>
                                            <strong>{property.area}</strong>
                                            {" "}{property.areaUnit || "sqft"}
                                        </span>
                                    )}
                                </div>

                                <div className="property-card-footer">
                                    <div className="property-price">
                                        <strong>
                                            {formatPrice(
                                                property.price,
                                                property.listingType
                                            )}
                                        </strong>
                                    </div>

                                    <button
                                        className="property-details-button"
                                        onClick={() =>
                                            details(property._id || property.id)
                                        }
                                    >
                                        View Details <span>→</span>
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Property
