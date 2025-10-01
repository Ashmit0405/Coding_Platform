import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import Navbar from "@/components/navbar.jsx";
import ProfileInfo from "@/components/profile/ProfileInfo.jsx";
import ProfileForms from "@/components/profile/ProfileForms.jsx";
import SolvedHistory from "@/components/profile/SolvedHistory.jsx";

export default function Profile() {
  const { user: loggedInUser, token } = useContext(AuthContext);
  const { id: userId } = useParams();

  const [profileUser, setProfileUser] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(true);

  const isOwnProfile = !userId || (loggedInUser && userId === loggedInUser._id);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        if (isOwnProfile) {
          setProfileUser(loggedInUser);
          const res = await fetch("http://localhost:5000/api/get-coding-profile", {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          });
          const data = await res.json();
          setProblems(data.data || []);
        } else {
          const res = await fetch(`http://localhost:5000/api/get-user/${userId}`, {
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok && data?.data?.user) {
            setProfileUser(data.data.user);
            setProblems(data.data.history || []);
          } else {
            setProfileUser(null);
            setProblems([]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (loggedInUser) fetchProfile();
  }, [userId, loggedInUser, token, isOwnProfile]);

  if (!loggedInUser) return <p className="text-center text-gray-600">Please log in first.</p>;
  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!profileUser) return <p className="text-center mt-6 text-gray-600">User not found</p>;

  return (
    <div className="p-6 w-full mx-auto space-y-6">
      <Navbar />

      <ProfileInfo
        user={profileUser}
        setShowDetailsForm={setShowDetailsForm}
        setShowProfileForm={setShowProfileForm}
        setShowChangeForm={setShowChangeForm}
        isSelf={isOwnProfile}
        childrenForms={
          <ProfileForms
            user={profileUser}
            token={token}
            showDetailsForm={showDetailsForm}
            showProfileForm={showProfileForm}
            showChangeForm={showChangeForm}
            setShowDetailsForm={setShowDetailsForm}
            setShowProfileForm={setShowProfileForm}
            setShowChangeForm={setShowChangeForm}
            isSelf={isOwnProfile}
          />
        }
      />

      <SolvedHistory
        problems={problems}
        loading={loading}
        visible={historyVisible}
        setVisible={setHistoryVisible}
      />
    </div>
  );
}
