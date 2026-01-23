import React from "react";
import { motion } from "motion/react";
import { ShoppingCart } from "lucide-react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

export default function MainBanner() {
  const { navigate } = useAppContext();
  return (
    <section className="relative w-full h-[85vh] overflow-hidden flex items-center justify-center p-6">
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <img
          src={assets.home_banner_two}
          alt="Tech store background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute left-10 bottom-15">
        <div className="relative z-10 max-w-4xl space-y-6">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Discover the Future of Tech
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Explore the latest gadgets, gear, and electronics at unbeatable
            prices.
          </motion.p>

          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <button
              onClick={() => navigate("/products")}
              className="text-lg px-6 py-3 rounded-md shadow-lg cursor-pointer bg-primary  text-white flex items-center hover:bg-primary-dull transition"
            >
              Shop Now
              <ShoppingCart className="ml-2" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
