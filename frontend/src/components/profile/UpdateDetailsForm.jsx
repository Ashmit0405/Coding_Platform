import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useUpdateDetails from "@/hooks/useUpdateDetails.js";

export default function UpdateDetailsForm({ user, token, onClose }) {
  const [detailsForm, setDetailsForm] = useState({
    username: user.username,
    fullname: user.fullname,
    email: user.email,
  });

  const { updateDetails, msg, loading } = useUpdateDetails(token, user);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateDetails(detailsForm, () => {
      if (onClose) onClose();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={detailsForm.username}
          onChange={(e) => setDetailsForm({ ...detailsForm, username: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="fullname">Full Name</Label>
        <Input
          id="fullname"
          type="text"
          value={detailsForm.fullname}
          onChange={(e) => setDetailsForm({ ...detailsForm, fullname: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={detailsForm.email}
          onChange={(e) => setDetailsForm({ ...detailsForm, email: e.target.value })}
          className="mt-1"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Save"}
      </Button>

      {msg && <p className="mt-2 text-sm text-gray-700">{msg}</p>}
    </form>
  );
}
