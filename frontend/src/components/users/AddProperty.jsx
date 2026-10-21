
import { useState } from "react"
import { useCreatePropertyMutation } from "../../services/propertyApi"
import "./AddProperty.css"
import { useSelector } from "react-redux"


const initialFormData = {
    title: "",
    description: "",
    propertyType: "",
    listingType: "",
    price: "",
    address: {
        street: "",
        locality: "",
        city: "",
        state: "",
        pincode: "",
    },
    bedrooms: "",
    bathrooms: "",
    area: "",
    areaUnit: "",
    furnishing: "",
    images: [],
    amenities: "",
}

function AddProperty() {
    const listedByid = useSelector((state) => state.uReducer.id)
    const [createProperty, { isLoading }] = useCreatePropertyMutation()
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("")
    const [formData, setFormData] = useState(initialFormData)
    const [imageFiles, setImageFiles] = useState([])

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleAddressChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value,
            },
        }))
    }

    const handleImageChange = (e) => {
        setImageFiles(Array.from(e.target.files || []))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")
        setMessageType("")

        // This form currently sends JSON, not uploaded image files.
        // Image upload needs a backend endpoint or a supported image URL.
        if (imageFiles.length > 0) {
            setMessage(
                "Image files are selected, but file upload is not configured yet. Please clear the file selection and submit the property details."
            )
            setMessageType("error")
            return
        }

        const propertyData = {
            ...formData,
            listedBy: listedByid,
            price: Number(formData.price),
            bedrooms: Number(formData.bedrooms || 0),
            bathrooms: Number(formData.bathrooms || 0),
            area: Number(formData.area),
            address: {
                ...formData.address,
                pincode: Number(formData.address.pincode),
            },
            images: [],
            amenities: formData.amenities
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
        }

        try {
            const result = await createProperty(propertyData).unwrap()
            setMessage("Property created successfully!")
            setMessageType("success")
            console.log("Created property:", result)

            setFormData({ ...initialFormData, address: { ...initialFormData.address } })
            setImageFiles([])

            const fileInput = document.getElementById("property-images")
            if (fileInput) fileInput.value = ""
        } catch (error) {
            console.error("Property creation failed:", error)

            setMessage(
                error?.data?.message ||
                error?.data?.msg ||
                "Failed to create property. Please check your details and try again."
            )
            setMessageType("error")
        }
    }

    return (
        <div className="add-property-page">
            <div className="add-property-heading">
                <div>
                    <span className="add-property-eyebrow">PROPSPHERE SELLER TOOLS</span>
                    <h2>List Your Property</h2>
                    <p>Share your property with people looking for their next home.</p>
                </div>
                <div className="add-property-badge">＋ New Listing</div>
            </div>

            <form className="property-form" onSubmit={handleSubmit}>
                <section className="property-form-section">
                    <div className="property-section-heading">
                        <span className="property-section-number">01</span>
                        <div>
                            <h3>Basic Information</h3>
                            <p>Tell us about your property.</p>
                        </div>
                    </div>

                    <div className="property-form-grid">
                        <div className="property-field property-field-full">
                            <label htmlFor="property-title">Property Title *</label>
                            <input
                                id="property-title"
                                name="title"
                                type="text"
                                placeholder="e.g. Spacious 3 BHK Apartment"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="property-field property-field-full">
                            <label htmlFor="property-description">Description *</label>
                            <textarea
                                id="property-description"
                                name="description"
                                placeholder="Describe the property, its highlights, and nearby facilities..."
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                required
                            />
                        </div>

                        <div className="property-field">
                            <label htmlFor="property-type">Property Type *</label>
                            <select
                                id="property-type"
                                name="propertyType"
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

                        <div className="property-field">
                            <label htmlFor="listing-type">Listing Type *</label>
                            <select
                                id="listing-type"
                                name="listingType"
                                value={formData.listingType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select listing type</option>
                                <option value="Sale">For Sale</option>
                                <option value="Rent">For Rent</option>
                            </select>
                        </div>

                        <div className="property-field property-field-full">
                            <label htmlFor="property-price">Price (₹) *</label>
                            <input
                                id="property-price"
                                name="price"
                                type="number"
                                placeholder="Enter price in rupees"
                                min="1"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </section>

                <section className="property-form-section">
                    <div className="property-section-heading">
                        <span className="property-section-number">02</span>
                        <div>
                            <h3>Property Address</h3>
                            <p>Where is your property located?</p>
                        </div>
                    </div>

                    <div className="property-form-grid">
                        <div className="property-field property-field-full">
                            <label htmlFor="property-street">Street Address *</label>
                            <input
                                id="property-street"
                                name="street"
                                type="text"
                                placeholder="House number, street name"
                                value={formData.address.street}
                                onChange={handleAddressChange}
                                required
                            />
                        </div>

                        <div className="property-field">
                            <label htmlFor="property-locality">Locality *</label>
                            <input
                                id="property-locality"
                                name="locality"
                                type="text"
                                placeholder="Area or neighbourhood"
                                value={formData.address.locality}
                                onChange={handleAddressChange}
                                required
                            />
                        </div>

                        <div className="property-field">
                            <label htmlFor="property-city">City *</label>
                            <input
                                id="property-city"
                                name="city"
                                type="text"
                                placeholder="Enter city"
                                value={formData.address.city}
                                onChange={handleAddressChange}
                                required
                            />
                        </div>

                        <div className="property-field">
                            <label htmlFor="property-state">State *</label>
                            <input
                                id="property-state"
                                name="state"
                                type="text"
                                placeholder="Enter state"
                                value={formData.address.state}
                                onChange={handleAddressChange}
                                required
                            />
                        </div>

                        <div className="property-field">
                            <label htmlFor="property-pincode">PIN Code *</label>
                            <input
                                id="property-pincode"
                                name="pincode"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]{6}"
                                maxLength={6}
                                placeholder="6-digit PIN code"
                                value={formData.address.pincode}
                                onChange={handleAddressChange}
                                required
                            />
                        </div>
                    </div>
                </section>

                <section className="property-form-section">
                    <div className="property-section-heading">
                        <span className="property-section-number">03</span>
                        <div>
                            <h3>Property Details</h3>
                            <p>Add the specifications buyers and tenants need.</p>
                        </div>
                    </div>

                    <div className="property-form-grid">
                        <div className="property-field">
                            <label htmlFor="property-bedrooms">Bedrooms</label>
                            <input
                                id="property-bedrooms"
                                name="bedrooms"
                                type="number"
                                min="0"
                                placeholder="e.g. 3"
                                value={formData.bedrooms}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="property-field">
                            <label htmlFor="property-bathrooms">Bathrooms</label>
                            <input
                                id="property-bathrooms"
                                name="bathrooms"
                                type="number"
                                min="0"
                                placeholder="e.g. 2"
                                value={formData.bathrooms}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="property-field">
                            <label htmlFor="property-area">Built-up / Plot Area *</label>
                            <input
                                id="property-area"
                                name="area"
                                type="number"
                                min="0.01"
                                step="any"
                                placeholder="Enter area"
                                value={formData.area}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="property-field">
                            <label htmlFor="property-area-unit">Area Unit *</label>
                            <select
                                id="property-area-unit"
                                name="areaUnit"
                                value={formData.areaUnit}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select unit</option>
                                <option value="sqft">Square Feet (sqft)</option>
                                <option value="sqyd">Square Yards (sqyd)</option>
                                <option value="sqm">Square Metres (sqm)</option>
                            </select>
                        </div>

                        <div className="property-field property-field-full">
                            <label htmlFor="property-furnishing">Furnishing</label>
                            <select
                                id="property-furnishing"
                                name="furnishing"
                                value={formData.furnishing}
                                onChange={handleChange}
                            >
                                <option value="">Select furnishing</option>
                                <option value="Unfurnished">Unfurnished</option>
                                <option value="Semi-Furnished">Semi-Furnished</option>
                                <option value="Fully-Furnished">Fully-Furnished</option>
                            </select>
                        </div>

                        <div className="property-field property-field-full">
                            <label htmlFor="property-amenities">Amenities</label>
                            <input
                                id="property-amenities"
                                name="amenities"
                                type="text"
                                placeholder="Parking, Lift, Gym, Swimming Pool"
                                value={formData.amenities}
                                onChange={handleChange}
                            />
                            <small>Separate each amenity with a comma.</small>
                        </div>
                    </div>
                </section>

                <section className="property-form-section">
                    <div className="property-section-heading">
                        <span className="property-section-number">04</span>
                        <div>
                            <h3>Property Images</h3>
                            <p>Choose photos to showcase your property.</p>
                        </div>
                    </div>

                    <div className="property-field property-field-full">
                        <label htmlFor="property-images">Upload Images</label>
                        <input
                            id="property-images"
                            className="property-file-input"
                            type="file"
                            name="images"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                        />
                        <small>
                            {imageFiles.length > 0
                                ? `${imageFiles.length} file(s) selected. File upload is not connected yet.`
                                : "You can select multiple images. Upload functionality needs backend integration."}
                        </small>
                    </div>
                </section>

                {message && (
                    <div
                        className={`property-form-message ${messageType}`}
                        role="status"
                    >
                        {message}
                    </div>
                )}

                <div className="property-form-actions">
                    <p>* Required fields</p>
                    <button
                        type="submit"
                        className="property-submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? "Submitting Property..." : "Submit Property"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddProperty
