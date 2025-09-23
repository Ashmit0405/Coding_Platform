import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/navbar.jsx";
import { AuthContext } from "@/context/AuthContext.jsx";

export default function UserProfile() {
    const { id: userId } = useParams();
    const { user: loggedInUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!userId) return;
        if (loggedInUser && userId === loggedInUser._id) {
            navigate("/profile");
            return;
        }

        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:5000/api/get/${userId}`, {
                    credentials: "include",
                });
                const data = await res.json();
                if (res.ok && data?.data?.user) {
                    setUser(data.data.user);
                    setHistory(data.data.history || []);
                    setError("");
                } else {
                    setError(data?.message || "Error fetching user profile");
                    setUser(null);
                    setHistory([]);
                }
            } catch (err) {
                console.error(err);
                setError("Server error, please try again.");
                setUser(null);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId, loggedInUser, navigate]);

    if (loading) { return <p className="text-center mt-6">Loading...</p>; }
    if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;
    if (!user) return <p className="text-center mt-6 text-gray-600">User not found</p>;

    return (
        <div className="p-6 w-full mx-auto space-y-6">
            <Navbar />
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">👤 {user.username}'s Profile</h2>
                <p><span className="font-medium">Full Name:</span> {user.fullname}</p>
                {user.email && <p><span className="font-medium">Email:</span> {user.email}</p>}
                {user.profilePhoto && (
                    <div className="mt-4">
                        <img src={user.profilePhoto} alt="Profile" className="w-24 h-24 rounded-full border" />
                    </div>
                )}
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Coding History</h2>
                {history.length > 0 ? (
                    <ul className="space-y-2">
                        {history.map((item, idx) => (
                            <li key={idx} className="p-3 border rounded-md hover:bg-gray-50 transition">
                                <p className="font-medium text-blue-600">Problem ID: {item.problem_id}</p>
                                <p className="text-sm text-gray-500">State: {item.state}</p>
                                <p className="text-sm text-gray-500">
                                    Submitted At: {new Date(item.createdAt).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No coding history found.</p>
                )}
            </div>
        </div>
    );
}
