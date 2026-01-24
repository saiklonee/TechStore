import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Profile = () => {
    const { axios, user } = useAppContext();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
        }
    }, [user]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (loading) return;

        try {
            setLoading(true);

            const { data } = await axios.put("/api/user/update-profile", {
                name,
                email,
            });

            if (data.success) {
                toast.success("Profile updated successfully");
            } else {
                toast.error(data.message || "Update failed");
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 min-h-[90vh] flex items-center justify-center px-4">
            <div className="w-full max-w-xl bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 md:p-10 shadow-xl">
                <h1 className="text-2xl md:text-3xl font-semibold text-white">
                    Profile
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    Manage your personal information and account details
                </p>

                <form onSubmit={onSubmitHandler} className="mt-6 space-y-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                            required
                            className="bg-transparent border border-gray-500/30 rounded px-3 py-2 outline-none focus:border-primary text-white"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                            className="bg-transparent border border-gray-500/30 rounded px-3 py-2 outline-none focus:border-primary text-white"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className={`w-full py-2.5 rounded font-medium transition ${loading
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-primary hover:bg-primary-dull"
                            } text-white`}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-8 h-px bg-white/10" />

                {/* Account Meta */}
                <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex justify-between">
                        <span>Account Type</span>
                        <span className="text-white">
                            {user?.role || "User"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Member Since</span>
                        <span className="text-white">
                            {user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString()
                                : "—"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
