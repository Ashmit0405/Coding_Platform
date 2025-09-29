import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfileInfo({
  user,
  showDetailsForm,
  setShowDetailsForm,
  showProfileForm,
  setShowProfileForm,
  showChangeForm,
  setShowChangeForm,
  childrenForms,
}) {
  return (
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
          <Button variant="default" onClick={() => setShowDetailsForm((prev) => !prev)}>
            {showDetailsForm ? "Cancel" : "Update Details"}
          </Button>
          <Button variant="default" onClick={() => setShowProfileForm((prev) => !prev)}>
            {showProfileForm ? "Cancel" : "Change Profile Photo"}
          </Button>
          <Button variant="default" onClick={() => setShowChangeForm((prev) => !prev)}>
            {showChangeForm ? "Cancel" : "Change Password"}
          </Button>
        </div>

        {childrenForms}
      </CardContent>
    </Card>
  );
}
