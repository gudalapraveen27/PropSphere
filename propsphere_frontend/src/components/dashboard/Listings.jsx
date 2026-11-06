import { useState } from "react";
import {
  useAddPropertyMutation,
  useFilterPropertiesQuery,
  useLazyFilterPropertiesQuery,
  useDeletePropertyMutation,
} from "../../services/properties.services";
import { useSelector } from "react-redux";
import "./Listings.css";
function Listings() {
  const id = useSelector((state) => state.uReducer.id);

  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

  const [addProperty, { isLoading }] = useAddPropertyMutation();
  const [lazyfn] = useLazyFilterPropertiesQuery();
  const { data } = useFilterPropertiesQuery({ id: id });

  const initialForm = {
    title: "",
    description: "",
    propertyType: "",
    listingType: "",
    price: "",
    street: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
    bedrooms: 0,
    bathrooms: 0,
    area: "",
    areaUnit: "sqft",
    furnishing: "Unfurnished",
    amenities: [],
  };

  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        amenities: checked
          ? [...prev.amenities, value]
          : prev.amenities.filter((item) => item !== value),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Select property images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const validImages = [];
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError("Please select only JPG, PNG, or WEBP images.");
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Each image must be smaller than 5 MB.");
        continue;
      }

      validImages.push(file);
    }

    setSelectedImages((prev) => {
      const combined = [...prev, ...validImages];
      const uniqueImages = combined.filter(
        (image, index, images) =>
          images.findIndex(
            (item) =>
              item.name === image.name &&
              item.size === image.size &&
              item.lastModified === image.lastModified,
          ) === index,
      );

      if (uniqueImages.length > 10) {
        setError("You can select a maximum of 10 images.");
        return uniqueImages.slice(0, 10);
      }

      return uniqueImages;
    });

    e.target.value = "";
  };

  // Remove a selected image
  const removeSelectedImage = (indexToRemove) => {
    setSelectedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  async function addPropertyToListing(e) {
    e.preventDefault();
    setError("");

    if (selectedImages.length === 0) {
      alert("Please select at least one property image");
      return;
    }

    if (!id) {
      setError("Please login first.");
      return;
    }

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.propertyType ||
      !formData.listingType ||
      !formData.locality.trim() ||
      !formData.city.trim() ||
      !formData.state.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (
      formData.price === "" ||
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      setError("Please enter a valid price.");
      return;
    }

    if (
      formData.area === "" ||
      !Number.isFinite(Number(formData.area)) ||
      Number(formData.area) <= 0
    ) {
      setError("Please enter a valid area.");
      return;
    }

    const propertyData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      propertyType: formData.propertyType,
      listingType: formData.listingType,
      price: Number(formData.price),
      address: {
        street: formData.street.trim(),
        locality: formData.locality.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
      },
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      area: Number(formData.area),
      areaUnit: formData.areaUnit,
      furnishing: formData.furnishing,
      amenities: formData.amenities,
      listedBy: id,
    };

    try {
      // Images are not uploaded to the backend in this step.
      const res = await addProperty({
        propertyData: propertyData,
        images: selectedImages,
      }).unwrap();

      await lazyfn({ id }).unwrap();

      console.log(res);

      setShowForm(false);
      setFormData(initialForm);
      setSelectedImages([]);
    } catch (err) {
      setError(err?.data?.message || "Failed to add property.");
    }
  }

  const [deleteProperty, { isLoading: isDeleting }] =
    useDeletePropertyMutation();

  async function deletePropertyFromListing(propertyId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property and its bookings?",
    );

    if (!confirmDelete) {
      return;
    }

    setError("");

    try {
      const res = await deleteProperty({
        property: propertyId,
        id: id,
      }).unwrap();

      if (res.msg === "Property and related bookings deleted successfully") {
        await lazyfn({ id }).unwrap();
      } else {
        setError(res.msg || "Failed to delete property.");
      }
    } catch (err) {
      setError(
        err?.data?.msg || "Failed to delete property and related bookings.",
      );
    }
  }

  return (
    <div className="listings-page">
      <div className="listings-header">
        <div className="listings-heading">
          <span className="listings-eyebrow">PROPERTY MANAGEMENT</span>
          <h3>Your Properties</h3>
          <p>Manage and keep track of your property listings.</p>
        </div>

        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Property
          </button>
        )}
      </div>

      {error && (
        <p className="listings-error" role="alert">
          {error}
        </p>
      )}

      {showForm && (
        <form className="property-form" onSubmit={addPropertyToListing}>
          <div className="form-header">
            <div>
              <span className="listings-eyebrow">NEW LISTING</span>
              <h3>Add Property</h3>
              <p>Enter the details of your property below.</p>
            </div>
          </div>

          <div className="form-section">
            <h4>Basic Information</h4>

            <div className="form-grid">
              <div className="form-field form-field-full">
                <label htmlFor="title">Title *</label>
                <input
                  id="title"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Modern 3 BHK Apartment"
                  required
                />
              </div>

              <div className="form-field form-field-full">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control form-textarea"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your property..."
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="propertyType">Property Type *</label>
                <select
                  id="propertyType"
                  name="propertyType"
                  className="form-control"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select property type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Villa">Villa</option>
                  <option value="Plot">Plot</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="listingType">Listing Type *</label>
                <select
                  id="listingType"
                  name="listingType"
                  className="form-control"
                  value={formData.listingType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select listing type</option>
                  <option value="Sale">Sale</option>
                  <option value="Rent">Rent</option>
                </select>
              </div>

              <div className="form-field form-field-full">
                <label htmlFor="price">Price *</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  className="form-control"
                  min="0"
                  step="any"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter property price"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Property Address</h4>

            <div className="form-grid">
              <div className="form-field form-field-full">
                <label htmlFor="street">Street Address</label>
                <input
                  id="street"
                  className="form-control"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Street Address"
                />
              </div>

              <div className="form-field">
                <label htmlFor="locality">Locality *</label>
                <input
                  id="locality"
                  className="form-control"
                  name="locality"
                  value={formData.locality}
                  onChange={handleChange}
                  placeholder="Locality"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="city">City *</label>
                <input
                  id="city"
                  className="form-control"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="state">State *</label>
                <input
                  id="state"
                  className="form-control"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="pincode">Pincode</label>
                <input
                  id="pincode"
                  className="form-control"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Property Details</h4>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="bedrooms">Bedrooms</label>
                <input
                  id="bedrooms"
                  type="number"
                  name="bedrooms"
                  className="form-control"
                  min="0"
                  step="1"
                  value={formData.bedrooms}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="bathrooms">Bathrooms</label>
                <input
                  id="bathrooms"
                  type="number"
                  name="bathrooms"
                  className="form-control"
                  min="0"
                  step="1"
                  value={formData.bathrooms}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="area">Area *</label>
                <input
                  id="area"
                  type="number"
                  name="area"
                  className="form-control"
                  min="0.01"
                  step="any"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Enter area"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="areaUnit">Area Unit</label>
                <select
                  id="areaUnit"
                  name="areaUnit"
                  className="form-control"
                  value={formData.areaUnit}
                  onChange={handleChange}
                >
                  <option value="sqft">Square Feet</option>
                  <option value="sqm">Square Meters</option>
                  <option value="sqyd">Square Yards</option>
                </select>
              </div>

              <div className="form-field form-field-full">
                <label htmlFor="furnishing">Furnishing</label>
                <select
                  id="furnishing"
                  name="furnishing"
                  className="form-control"
                  value={formData.furnishing}
                  onChange={handleChange}
                >
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Fully-Furnished">Fully-Furnished</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Image Upload */}
          <div className="form-section">
            <h4>Property Images</h4>

            <p className="section-description">
              Select up to 10 images. JPG, PNG, and WEBP formats are supported.
              Maximum 5 MB per image.
            </p>

            <div className="form-field form-field-full">
              <label htmlFor="propertyImages">Choose Property Images</label>

              <input
                type="file"
                multiple
                accept="image/*"
                required={selectedImages.length === 0}
                onChange={handleImageChange}
              />
            </div>

            {selectedImages.length > 0 && (
              <div className="selected-images-section">
                <h4>Selected Images ({selectedImages.length}/10)</h4>

                <div className="selected-images-grid">
                  {selectedImages.map((image, index) => (
                    <div
                      className="selected-image-card"
                      key={`${image.name}-${image.size}-${image.lastModified}`}
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Selected property ${index + 1}`}
                      />

                      <div className="selected-image-info">
                        <span title={image.name}>
                          {image.name.length > 20
                            ? `${image.name.slice(0, 17)}...`
                            : image.name}
                        </span>

                        <button
                          type="button"
                          className="btn btn-delete"
                          onClick={() => removeSelectedImage(index)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-section">
            <h4>Amenities</h4>

            <p className="section-description">
              Select the facilities available at your property.
            </p>

            <div className="amenities-grid">
              {["parking", "lift", "swimming pool", "gym"].map((amenity) => (
                <label className="amenity-option" key={amenity}>
                  <input
                    type="checkbox"
                    name="amenities"
                    value={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onChange={handleChange}
                  />

                  <span>
                    {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Adding Property..." : "Add Property"}
            </button>

            <button
              className="btn btn-secondary"
              type="button"
              disabled={isLoading}
              onClick={() => {
                setShowForm(false);
                setError("");
                setSelectedImages([]);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {data?.properties && (
        <div className="property-listings">
          <div className="property-listings-header">
            <h3>Your Listings</h3>

            <span className="property-count">
              {data.properties.length} Properties
            </span>
          </div>

          <div className="property-cards">
            {data.properties.map((property) => (
              <div className="listing-property-card" key={property._id}>
                <div className="property-card-info">
                  <p className="property-card-title">{property.title}</p>

                  <p className="property-card-location">
                    <span className="location-icon">⌖</span>
                    {property.address.locality}, {property.address.city}
                  </p>
                </div>

                <div className="property-card-actions">
                  <span
                    className={`property-status ${
                      property.isAvailable ? "status-pending" : "status-sold"
                    }`}
                  >
                    {property.status}
                  </span>

                  <button
                    className="btn btn-delete"
                    type="button"
                    disabled={isDeleting}
                    onClick={() => deletePropertyFromListing(property._id)}
                  >
                    {isDeleting ? "DELETING..." : "DELETE"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!data?.properties && (
        <div className="empty-listings">
          <div className="empty-listings-icon">⌂</div>

          <h3>Your Listings Are Empty</h3>

          <p>
            You haven't added any properties yet. Start by adding your first
            property listing.
          </p>

          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              + Add Your First Property
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Listings;
