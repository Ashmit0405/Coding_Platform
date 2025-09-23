import { useState } from "react";
import useChangePassword from "@/hooks/useChangePassword.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChangePasswordForm({ token, onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { changePassword, msg, loading } = useChangePassword(token);

  const handleSubmit = (e) => {
    e.preventDefault();
    changePassword(oldPassword, newPassword, () => {
      setOldPassword("");
      setNewPassword("");
      if (onClose) onClose();
    });
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="old-password">Old Password</Label>
            <Input
              id="old-password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
              required
            />
          </div>

          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Changing..." : "Save"}
          </Button>
        </form>

        {msg && <p className="mt-2 text-sm text-gray-700">{msg}</p>}
      </CardContent>
    </Card>
  );
}
