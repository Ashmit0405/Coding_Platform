import UpdateDetailsForm from "@/components/profile/UpdateDetailsForm.jsx";
import UpdateProfilePhoto from "@/components/profile/UpdateProfilePhoto.jsx";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm.jsx";

export default function ProfileForms({ user, token, showDetailsForm, showProfileForm, showChangeForm, setShowDetailsForm, setShowProfileForm, setShowChangeForm }) {
  return (
    <>
      {showDetailsForm && (
        <UpdateDetailsForm user={user} token={token} onClose={() => setShowDetailsForm(false)} />
      )}
      {showProfileForm && (
        <UpdateProfilePhoto token={token} onClose={() => setShowProfileForm(false)} />
      )}
      {showChangeForm && (
        <ChangePasswordForm token={token} onClose={() => setShowChangeForm(false)} />
      )}
    </>
  );
}
