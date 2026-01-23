import { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Contact = () => {
    const { axios } = useAppContext();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (loading) return;

        try {
            setLoading(true);

            const { data } = await axios.post("/api/contact/send", {
                name,
                email,
                message,
            });

            if (data.success) {
                toast.success(data.message || "Message sent successfully");
                setName("");
                setEmail("");
                setMessage("");
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch (error) {
            toast.error(error.message || "Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 min-h-[90vh] flex items-center justify-center px-4">
            <div className="w-full max-w-xl bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 md:p-10 shadow-xl">
                <h1 className="text-2xl md:text-3xl font-semibold text-white">
                    Get in Touch
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    Have a question, feedback, or collaboration idea?
                    We’d love to hear from you.
                </p>

                <form
                    onSubmit={onSubmitHandler}
                    className="mt-6 space-y-4"
                >
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300">
                            Your Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                            placeholder="Enter your name"
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
                            required
                            disabled={loading}
                            placeholder="you@example.com"
                            className="bg-transparent border border-gray-500/30 rounded px-3 py-2 outline-none focus:border-primary text-white"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300">
                            Message
                        </label>
                        <textarea
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            disabled={loading}
                            placeholder="Type your message here..."
                            className="bg-transparent border border-gray-500/30 rounded px-3 py-2 outline-none resize-none focus:border-primary text-white"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className={`w-full py-2.5 rounded font-medium transition ${loading
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-primary hover:bg-primary-dull"
                            } text-white`}
                    >
                        {loading ? "Sending..." : "Send Message"}
                    </button>
                </form>

                <div className="mt-6 text-xs text-gray-500 text-center">
                    We usually reply within 24 hours.
                </div>
            </div>
        </div>
    );
};

export default Contact;
