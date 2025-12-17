import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
    profilePhoto: "",
    role: "user"
  });
  const [msg, setMsg] = useState("");
  const navigate=useNavigate();
  const API = import.meta.env.VITE_BACKEND_URL;  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    try {
      const res = await fetch(`${API}/api/register`, {
        method: "POST",
        body: formData,
      });

      const resp = await res.json();
      // console.log(resp)
      if(resp.statusCode==200){
        setMsg(resp.message || "Registered successfully!");
        navigate("/login");
      }
    } catch (err) {
      setMsg("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="mb-4"
          required
        />

        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="mb-4"
          required
        />

        <Input
          type="text"
          name="fullname"
          placeholder="FullName"
          value={form.fullname}
          onChange={handleChange}
          className="mb-4"
          required
        />

        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="mb-4"
          required
        />
        <Input
          type="file"
          name="profilePhoto"
          accept="image/*"
          onChange={(e) =>
            setForm({ ...form, profilePhoto: e.target.files[0] })
          }
          className="mb-4 py-2"
        />
        

        <Button type="submit" className="w-full">Register</Button>

        {msg && (
          <p className="text-sm text-center text-gray-600 mt-4">{msg}</p>
        )}
        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
