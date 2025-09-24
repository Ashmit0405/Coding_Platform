import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import Navbar from "@/components/navbar.jsx";
import UpdateDetailsForm from "@/components/profile/UpdateDetailsForm.jsx";
import UpdateProfilePhoto from "@/components/profile/UpdateProfilePhoto.jsx";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm.jsx";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const { user, token } = useContext(AuthContext);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showChangeForm, setShowChangeForm] = useState(false);

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/get-coding-profile", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        const data = await res.json();
        console.log(data)
        setProblems(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchSolvedProblems();
  }, [user, token]);

  if (!user) return <p className="text-center text-gray-600">Please log in first.</p>;

  return (
    <div className="p-6 w-full mx-auto space-y-6">
      <Navbar />

      <Card>
        <CardHeader>
          <CardTitle>👤 Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p><span className="font-medium">Username:</span> {user.username}</p>
          <p><span className="font-medium">Full Name:</span> {user.fullname}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Role:</span> {user.role}</p>

          {user.profilePhoto && (
            <img
              src={user.profilePhoto}
              alt="Profile"
              className="w-24 h-24 rounded-full border mt-2"
            />
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              className={"hover:cursor-pointer"}
              variant="default"
              onClick={() => setShowDetailsForm((prev) => !prev)}
            >
              {showDetailsForm ? "Cancel" : "Update Details"}
            </Button>
            <Button
              className={"hover:cursor-pointer"}
              variant="default"
              onClick={() => setShowProfileForm((prev) => !prev)}
            >
              {showProfileForm ? "Cancel" : "Change Profile Photo"}
            </Button>
            <Button
              className={"hover:cursor-pointer"}
              variant="default"
              onClick={() => setShowChangeForm((prev) => !prev)}
            >
              {showChangeForm ? "Cancel" : "Change Password"}
            </Button>
          </div>

          {showDetailsForm && (
            <div className="mt-4">
              <UpdateDetailsForm user={user} token={token} onClose={() => setShowDetailsForm(false)} />
            </div>
          )}

          {showProfileForm && (
            <div className="mt-4">
              <UpdateProfilePhoto token={token} onClose={() => setShowProfileForm(false)} />
            </div>
          )}

          {showChangeForm && (
            <div className="mt-4">
              <ChangePasswordForm token={token} onClose={() => setShowChangeForm(false)} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <p className="text-gray-600">Loading problems...</p>
          ) : problems.length > 0 ? (
            <ul className="space-y-2">
              {problems.map((problem, idx) => (
                <li
                  key={idx}
                  className="p-3 border rounded-md hover:bg-gray-50 transition"
                >
                  <p className="font-medium text-blue-600">{problem.title}</p>
                  <p className="text-sm text-gray-500">Difficulty: {problem.difficulty}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No problems solved yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
