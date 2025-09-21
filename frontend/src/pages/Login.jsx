import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);

  if (user) {
    console.log(user);
    
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    console.log(success)
    if (success) {
      navigate("/");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
          required
        />

        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
          required
        />

        <Button type="submit" className="w-full">Log-In</Button>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <p className="text-sm text-center text-gray-600 mt-6">
          No Account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
