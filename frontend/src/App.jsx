import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import ProblemPage from "./pages/Problem.jsx";
import SubmitProblem from "./pages/Submit_Problem.jsx";
import ReviewProblems from "./pages/Review_Problem.jsx";
import ManageUsers from "./pages/Users.jsx"
import UserProfile from "./pages/Other.jsx";
import SubmissionDetails from "./pages/Submission.jsx";

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  console.log(user)
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/problem/:id"
          element={
            <ProtectedRoute>
              <ProblemPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit-problem"
          element={
            <ProtectedRoute>
              <SubmitProblem/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/review-problem"
          element={
            <ProtectedRoute>
              <ReviewProblems/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-users"
          element={
            <ProtectedRoute>
              <ManageUsers/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:id"
          element={
            <ProtectedRoute>
              <UserProfile/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/submission/:id"
          element={
            <ProtectedRoute>
              <SubmissionDetails/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
