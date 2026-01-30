import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { assets, categories } from "../../assets/assets";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const MAX_IMAGES = 4;

const AddProduct = () => {
    // Keep fixed length array for predictable UI (4 slots)
    const [files, setFiles] = useState(() => Array(MAX_IMAGES).fill(null));
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [offerPrice, setOfferPrice] = useState("");
    const [loading, setLoading] = useState(false);

    const { axios } = useAppContext();

    // file input refs so we can clear the input value when removing
    const inputRefs = useRef([]);

    // Create preview URLs only when files change (optimized)
    const previews = useMemo(() => {
        return files.map((file) => (file ? URL.createObjectURL(file) : null));
    }, [files]);

    // Cleanup preview URLs (important to prevent memory leaks)
    useEffect(() => {
        return () => {
            previews.forEach((url) => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, [previews]);

    const setFileAtIndex = useCallback((index, file) => {
        setFiles((prev) => {
            const next = [...prev];
            next[index] = file ?? null;
            return next;
        });
    }, []);

    const handleFileChange = useCallback(
        (index, e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Basic guard: accept images only (extra safety)
            if (!file.type?.startsWith("image/")) {
                toast.error("Please select an image file");
                e.target.value = "";
                return;
            }

            setFileAtIndex(index, file);
            // allow selecting the same file again later
            e.target.value = "";
        },
        [setFileAtIndex]
    );

    const removeImage = useCallback(
        (index) => {
            if (loading) return;

            setFileAtIndex(index, null);

            // also clear input element (if any)
            const input = inputRefs.current[index];
            if (input) input.value = "";
        },
        [loading, setFileAtIndex]
    );

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (loading) return;

        const numericPrice = Number(price);
        const numericOfferPrice = Number(offerPrice);

        // validations
        const selectedFiles = files.filter(Boolean);
        if (selectedFiles.length === 0) {
            toast.error("Please add at least one product image");
            return;
        }

        if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
            toast.error("Please enter a valid price");
            return;
        }

        if (!Number.isFinite(numericOfferPrice) || numericOfferPrice <= 0) {
            toast.error("Please enter a valid offer price");
            return;
        }

        if (numericOfferPrice > numericPrice) {
            toast.error("Offer price cannot be greater than product price");
            return;
        }

        try {
            setLoading(true);

            const productData = {
                name: name.trim(),
                description: description
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean),
                category,
                price: numericPrice,
                offerPrice: numericOfferPrice,
            };

            const formData = new FormData();
            formData.append("productData", JSON.stringify(productData));

            selectedFiles.forEach((file) => {
                formData.append("images", file);
            });

            const { data } = await axios.post("/api/product/add", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (data?.success) {
                toast.success(data.message || "Product added");

                // reset form
                setName("");
                setDescription("");
                setCategory("");
                setPrice("");
                setOfferPrice("");
                setFiles(Array(MAX_IMAGES).fill(null));

                // clear file inputs
                inputRefs.current.forEach((input) => {
                    if (input) input.value = "";
                });
            } else {
                toast.error(data?.message || "Something went wrong");
            }
        } catch (error) {
            toast.error(error?.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <form
                onSubmit={onSubmitHandler}
                className="md:p-10 p-4 space-y-5 max-w-lg"
            >
                {/* Images */}
                <div>
                    <p className="text-base font-medium">Product Images</p>

                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array.from({ length: MAX_IMAGES }).map((_, index) => {
                            const hasImage = Boolean(files[index]);
                            const previewUrl = previews[index];

                            return (
                                <div key={index} className="relative">
                                    <label
                                        htmlFor={`image${index}`}
                                        className={`block ${loading ? "pointer-events-none" : ""}`}
                                        title={hasImage ? "Change image" : "Add image"}
                                    >
                                        <input
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            id={`image${index}`}
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            disabled={loading}
                                            onChange={(e) => handleFileChange(index, e)}
                                        />

                                        <img
                                            className={`max-w-24 cursor-pointer rounded border border-gray-500/20 ${loading ? "opacity-50" : ""
                                                }`}
                                            src={hasImage ? previewUrl : assets.upload_area}
                                            alt={hasImage ? `product-${index}` : "upload"}
                                            width={100}
                                            height={100}
                                        />
                                    </label>

                                    {/* Remove button */}
                                    {hasImage && (
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            disabled={loading}
                                            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition"
                                            aria-label={`Remove image ${index + 1}`}
                                            title="Remove"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                        You can upload up to {MAX_IMAGES} images. Click × to remove.
                    </p>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1">
                    <label className="text-base font-medium">Product Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Type here"
                        required
                        disabled={loading}
                        className="outline-none py-2 px-3 rounded border border-gray-500/40"
                    />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                    <label className="text-base font-medium">Product Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        disabled={loading}
                        placeholder="Each line becomes a bullet point"
                        className="outline-none py-2 px-3 rounded border border-gray-500/40 resize-none"
                    />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1">
                    <label className="text-base font-medium">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        disabled={loading}
                        className="outline-none py-2 px-3 rounded border border-gray-500/40"
                    >
                        <option value="">Select Category</option>
                        {categories.map((item, index) => (
                            <option key={index} value={item.path}>
                                {item.path}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Prices */}
                <div className="flex gap-5">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-base font-medium">Product Price</label>
                        <input
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            type="number"
                            required
                            disabled={loading}
                            className="outline-none py-2 px-3 rounded border border-gray-500/40"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-base font-medium">Offer Price</label>
                        <input
                            value={offerPrice}
                            onChange={(e) => setOfferPrice(e.target.value)}
                            type="number"
                            required
                            disabled={loading}
                            className="outline-none py-2 px-3 rounded border border-gray-500/40"
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>

                {/* Button */}
                <button
                    disabled={loading}
                    className={`px-8 py-2.5 rounded text-white font-medium transition ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-primary hover:bg-primary-dull"
                        }`}
                >
                    {loading ? "Uploading..." : "ADD PRODUCT"}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
