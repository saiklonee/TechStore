import { useAppContext } from "../context/AppContext"
import ProductCard from "./ProductCard";

const NewArrivals = () => {
    const { products } = useAppContext();
    const newArrivals = products.filter((product) => product.inStock).slice(0, 2);

    return (
        <section className="mt-24 px-4 md:px-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    New Arrivals
                </h2>
                {/* Optional View All link */}
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="hidden md:block text-sm md:text-md lg:text-lg font-medium text-primary hover:underline cursor-pointer"
                >
                    View All
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
                {newArrivals.length > 0 ? (
                    newArrivals.map((product, index) => (
                        <div
                            key={index}
                            className="transition-opacity duration-500 animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <ProductCard isNewArrival product={product} />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full text-center">
                        No best sellers available at the moment.
                    </p>
                )}
            </div>
        </section>
    )
}

export default NewArrivals