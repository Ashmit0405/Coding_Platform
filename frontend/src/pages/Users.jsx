import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext.jsx";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetch("http://localhost:5000/api/get-all-users", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setUsers(data.data)
            })
            .catch((err) => console.error(err));
    }, []);

    const handleRemove = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/remove-acc/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                setUsers((prev) => prev.filter((u) => u._id !== id));
            } else {
                console.error("Failed to remove user");
            }
        } catch (error) {
            console.error("Error removing user:", error);
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            const res = await fetch(`http://localhost:5000/api/change-role`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ user_id: id, role: newRole }),
            });

            if (res.ok) {
                setUsers((prev) =>
                    prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
                );
            } else {
                console.error("Failed to change role");
            }
        } catch (error) {
            console.error("Error changing role:", error);
        }
    };


    return (
        <div className="p-6 grid gap-4">
            <Navbar/>
            <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

            {users
                .filter((u) => u._id !== user?._id)
                .map((u) => (
                    <Card key={u._id} className="rounded-2xl shadow-md">
                        <CardContent className="p-4">
                            <h2 className="text-lg font-semibold">
                                {u.username} ({u.email})
                            </h2>
                            <p className="text-gray-600">Current Role: {u.role}</p>

                            <div className="flex gap-3 mt-4">
                                {/* Role change buttons */}
                                <Button
                                    variant="outline"
                                    className={`hover:cursor-pointer ${u.role === "user" && "bg-gray-200"
                                        }`}
                                    onClick={() => handleRoleChange(u._id, "user")}
                                >
                                    User
                                </Button>
                                <Button
                                    variant="outline"
                                    className={`hover:cursor-pointer ${u.role === "setter" && "bg-gray-200"
                                        }`}
                                    onClick={() => handleRoleChange(u._id, "setter")}
                                >
                                    Setter
                                </Button>
                                <Button
                                    variant="outline"
                                    className={`hover:cursor-pointer ${u.role === "admin" && "bg-gray-200"
                                        }`}
                                    onClick={() => handleRoleChange(u._id, "admin")}
                                >
                                    Admin
                                </Button>

                                {/* Remove user */}
                                <Button
                                    variant="destructive"
                                    className="ml-auto hover:cursor-pointer hover:bg-red-700"
                                    onClick={() => handleRemove(u._id)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
        </div>
    );
}
