import { useEffect, useState } from "react";
import { assets, categories } from "../../assets/assets";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const AddProduct = () => {
    const [files, setFiles] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [offerPrice, setOfferPrice] = useState("");
    const [loading, setLoading] = useState(false);

    const { axios } = useAppContext();

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        // prevent double submit
        if (loading) return;

        try {
            setLoading(true);

            const productData = {
                name,
                description: description.split("\n"),
                category,
                price: Number(price),
                offerPrice: Number(offerPrice),
            };

            const formData = new FormData();
            formData.append("productData", JSON.stringify(productData));

            files.forEach((file) => {
                if (file) {
                    formData.append("images", file);
                }
            });

            const { data } = await axios.post(
                "/api/product/add",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (data.success) {
                toast.success(data.message || "Product added");

                // reset form
                setName("");
                setDescription("");
                setCategory("");
                setPrice("");
                setOfferPrice("");
                setFiles([]);
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch (error) {
            toast.error(error.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    // prevent memory leaks from image previews
    useEffect(() => {
        return () => {
            files.forEach((file) => {
                if (file) URL.revokeObjectURL(file);
            });
        };
    }, [files]);

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
                        {Array(4)
                            .fill("")
                            .map((_, index) => (
                                <label key={index} htmlFor={`image${index}`}>
                                    <input
                                        id={`image${index}`}
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        disabled={loading}
                                        onChange={(e) => {
                                            const updatedFiles = [...files];
                                            updatedFiles[index] = e.target.files[0];
                                            setFiles(updatedFiles);
                                        }}
                                    />
                                    <img
                                        className={`max-w-24 cursor-pointer ${loading ? "opacity-50" : ""
                                            }`}
                                        src={
                                            files[index]
                                                ? URL.createObjectURL(files[index])
                                                : assets.upload_area
                                        }
                                        alt="upload"
                                        width={100}
                                        height={100}
                                    />
                                </label>
                            ))}
                    </div>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1">
                    <label className="text-base font-medium">
                        Product Name
                    </label>
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
                    <label className="text-base font-medium">
                        Product Description
                    </label>
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
                    <label className="text-base font-medium">
                        Category
                    </label>
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
                        <label className="text-base font-medium">
                            Product Price
                        </label>
                        <input
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            type="number"
                            required
                            disabled={loading}
                            className="outline-none py-2 px-3 rounded border border-gray-500/40"
                        />
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-base font-medium">
                            Offer Price
                        </label>
                        <input
                            value={offerPrice}
                            onChange={(e) => setOfferPrice(e.target.value)}
                            type="number"
                            required
                            disabled={loading}
                            className="outline-none py-2 px-3 rounded border border-gray-500/40"
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
