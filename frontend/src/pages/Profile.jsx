import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import Navbar from "@/components/navbar.jsx";
import ProfileInfo from "@/components/profile/ProfileInfo.jsx";
import ProfileForms from "@/components/profile/ProfileForms.jsx";
import SolvedHistory from "@/components/profile/SolvedHistory.jsx";

export default function Profile() {
  const { user, token } = useContext(AuthContext);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(true);

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/get-coding-profile", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        const data = await res.json();
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

      <ProfileInfo
        user={user}
        showDetailsForm={showDetailsForm}
        setShowDetailsForm={setShowDetailsForm}
        showProfileForm={showProfileForm}
        setShowProfileForm={setShowProfileForm}
        showChangeForm={showChangeForm}
        setShowChangeForm={setShowChangeForm}
        childrenForms={
          <ProfileForms
            user={user}
            token={token}
            showDetailsForm={showDetailsForm}
            showProfileForm={showProfileForm}
            showChangeForm={showChangeForm}
            setShowDetailsForm={setShowDetailsForm}
            setShowProfileForm={setShowProfileForm}
            setShowChangeForm={setShowChangeForm}
          />
        }
      />

      <SolvedHistory problems={problems} loading={loading} visible={historyVisible} setVisible={setHistoryVisible} />
    </div>
  );
}
