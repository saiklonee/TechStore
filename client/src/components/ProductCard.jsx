import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({
  product,
  isBestSeller = false,
  isNewArrival = false,
}) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate } =
    useAppContext();

  if (!product) return null;

  const inCart = cartItems[product._id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => {
        navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="group bg-white rounded-lg border border-gray-150 cursor-pointer overflow-hidden hover:border-gray-300 transition-colors duration-200"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {/* BADGES */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
          {isBestSeller && (
            <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
              Best Seller
            </span>
          )}

          {!isBestSeller && isNewArrival && (
            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
              New Arrival
            </span>
          )}
        </div>

        <img
          src={product.image?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 mb-1">
          {product.category}
        </p>

        <h3 className="text-[14px] font-semibold text-gray-900 leading-tight line-clamp-2 mb-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[16px] font-bold text-gray-900">
              {currency} {product.offerPrice}
            </p>

            {product.offerPrice < product.price && (
              <p className="text-[12px] text-gray-400 line-through">
                {currency} {product.price}
              </p>
            )}
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            {!inCart ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => addToCart(product._id)}
                className="px-2.5 py-1.5 bg-primary hover:bg-blue-700 text-white text-[13px] rounded-sm shadow-sm cursor-pointer"
              >
                Add to Cart
              </motion.button>
            ) : (
              <div className="flex items-center gap-2.5 bg-gray-300 px-2.5 py-1 rounded-sm">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="text-gray-600 hover:text-gray-900 text-[15px] w-5 cursor-pointer"
                >
                  -
                </button>
                <span className="text-[13px] font-medium min-w-[20px] text-center">
                  {inCart}
                </span>
                <button
                  onClick={() => addToCart(product._id)}
                  className="text-gray-600 hover:text-gray-900 text-[15px] w-5 cursor-pointer transition-all"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>

        {/* subtle footer text */}
        {(isBestSeller || isNewArrival) && (
          <div className="mt-2 text-[11px] text-gray-500">
            {isBestSeller && "★ Popular choice"}
            {!isBestSeller && isNewArrival && "Newly added"}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
