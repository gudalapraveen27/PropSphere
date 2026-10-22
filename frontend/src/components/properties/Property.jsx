
import { useState } from "react";
import { useGetPropertiesQuery } from "../../services/propertyApi";
import { useNavigate } from "react-router-dom";
import "./Property.css";

function Property() {
    const { isLoading, data, isError, error } = useGetPropertiesQuery();
    const [search, setSearch] = useState("");
    const [propertyType, setPropertyType] = useState("All");
    const [listingType, setListingType] = useState("All");
    const [favourites, setFavourites] = useState([]);
    const navigate = useNavigate();

    const properties = Array.isArray(data)
        ? data
        : data?.properties || [];

    const filtered = properties.filter((p) =>
        [
            p.title,
            p.description,
            p.address?.city,
            p.address?.locality,
            p.address?.state,
        ].some((value) =>
            value?.toLowerCase().includes(search.toLowerCase())
        ) &&
        (propertyType === "All" || p.propertyType === propertyType) &&
        (listingType === "All" || p.listingType === listingType)
    );

    const formatPrice = (price, type) =>
        `${new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price || 0)}${type === "Rent" ? " / month" : ""}`;

    const toggleFavourite = (id) =>
        setFavourites((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );

    if (isLoading) {
        return (
            <div className="property-status">
                Finding properties...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="property-status">
                Unable to load properties:{" "}
                {error?.data?.message ||
                    error?.data?.msg ||
                    "Please try again."}
            </div>
        );
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
                    <strong>{filtered.length}</strong>
                    <span>Properties found</span>
                </div>
            </div>

            <div className="properties-toolbar">
                <input
                    className="property-search"
                    type="search"
                    placeholder="Search title, city or locality..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="property-filter"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                >
                    {[
                        "All",
                        "Apartment",
                        "Independent House",
                        "Villa",
                        "Plot",
                        "Commercial",
                    ].map((type) => (
                        <option key={type} value={type}>
                            {type === "All" ? "All Property Types" : type}
                        </option>
                    ))}
                </select>

                <select
                    className="property-filter"
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value)}
                >
                    <option value="All">Sale & Rent</option>
                    <option value="Sale">For Sale</option>
                    <option value="Rent">For Rent</option>
                </select>
            </div>

            {filtered.length === 0 ? (
                <div className="properties-empty">
                    <h3>No properties found</h3>
                    <p>
                        Try another search or change your filters.
                    </p>
                    <button
                        className="property-reset-button"
                        onClick={() => {
                            setSearch("");
                            setPropertyType("All");
                            setListingType("All");
                        }}
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="property-grid">
                    {filtered.map((p) => {
                        const id = p._id || p.id;
                        const liked = favourites.includes(id);

                        return (
                            <article className="property-card" key={id}>
                                <div className="property-card-image">
                                    {p.images?.[0] ? (
                                        <img
                                            src={p.images[0]}
                                            alt={p.title}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="property-image-placeholder">
                                            <span>⌂</span>
                                            <p>Property image coming soon</p>
                                        </div>
                                    )}

                                    <button
                                        className={`property-favourite-button ${liked ? "favourited" : ""
                                            }`}
                                        onClick={() => toggleFavourite(id)}
                                        aria-label={
                                            liked
                                                ? "Remove from favourites"
                                                : "Add to favourites"
                                        }
                                    >
                                        {liked ? "♥" : "♡"}
                                    </button>

                                    <span
                                        className={`property-listing-badge ${p.listingType === "Rent"
                                                ? "rent-badge"
                                                : "sale-badge"
                                            }`}
                                    >
                                        For {p.listingType || "Sale"}
                                    </span>

                                    <span className="property-type-badge">
                                        {p.propertyType}
                                    </span>
                                </div>

                                <div className="property-card-content">
                                    <p className="property-card-location">
                                        ⌖{" "}
                                        {[
                                            p.address?.locality,
                                            p.address?.city,
                                        ]
                                            .filter(Boolean)
                                            .join(", ") ||
                                            "Location unavailable"}
                                    </p>

                                    <h3 className="property-card-title">
                                        {p.title}
                                    </h3>

                                    <p className="property-card-description">
                                        {p.description}
                                    </p>

                                    <div className="property-features">
                                        {p.bedrooms != null && (
                                            <span>
                                                <strong>{p.bedrooms}</strong> Beds
                                            </span>
                                        )}

                                        {p.bathrooms != null && (
                                            <span>
                                                <strong>{p.bathrooms}</strong> Baths
                                            </span>
                                        )}

                                        {p.area != null && (
                                            <span>
                                                <strong>{p.area}</strong>{" "}
                                                {p.areaUnit || "sqft"}
                                            </span>
                                        )}
                                    </div>

                                    <div className="property-card-footer">
                                        <strong className="property-price">
                                            {formatPrice(
                                                p.price,
                                                p.listingType
                                            )}
                                        </strong>

                                        <button
                                            className="property-details-button"
                                            onClick={() =>
                                                navigate(
                                                    `/home/properties/${id}`
                                                )
                                            }
                                        >
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Property;
