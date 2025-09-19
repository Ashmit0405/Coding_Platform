import React, { useState } from "react";
import axios from "axios";

const Register = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        fullname: "",
        profilePhoto: "",
        password: "",
        role: "user"
    });
    const [msg, setMsg] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8000/api/register", form);
            setMsg(res.data.message || "User registered successfully!");
        } catch (err) {
            setMsg(err.response?.data?.message || "Error registering user");
        }
    };

    return (
        <div className="bg-red-300">
            <form
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold text-center">Register</h2>

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-2 border p-2 rounded"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />

                <input
                    type="text"
                    name="fullname"
                    placeholder="Full Name (optional)"
                    value={form.fullname}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                
                <input
                    type="file"
                    name="profilePhoto"
                    accept="image/*"
                    onChange={(e) => setForm({ ...form, profilePhoto: e.target.files[0] })}
                    className="w-full border p-2 rounded"
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded hover:bg-black"
                >
                    Register
                </button>

                {msg && <p className="text-sm text-center text-gray-600">{msg}</p>}
            </form>
        </div>
    );
};

export default Register;
