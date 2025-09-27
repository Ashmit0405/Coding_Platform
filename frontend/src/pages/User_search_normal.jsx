import { useState } from "react";
import { Link } from "react-router-dom";
import useFetchUsers from "@/hooks/useFetchUsers";
import useSearchUsers from "@/hooks/useSearchUsers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/navbar";

export default function Users({ accessToken }) {
  const { users, setUsers, loading } = useFetchUsers();
  const { searchUsers, searching } = useSearchUsers(setUsers, accessToken);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6 space-y-6">
      <Navbar />
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">All Users</h1>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <Input
          placeholder="Search by username, fullname or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={() => searchUsers(searchQuery)}
          variant="default"
          className="w-full md:w-auto"
        >
          Search
        </Button>
      </div>

      {/* Users Cards */}
      {loading ? (
        <p className="p-6 text-gray-500">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="p-6 text-gray-500">
          {searching ? "No matching users found." : "No users available."}
        </p>
      ) : (
        <div className="flex flex-col sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((u) => (
            <Card key={u._id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4 flex flex-col gap-2">
                <Link
                  to={`/user/${u._id}`}
                  className="text-blue-600 hover:underline text-lg font-semibold"
                >
                  {u.username}
                </Link>
                <p className="text-gray-700 font-medium">{u.fullname}</p>
                <p className="text-gray-500">{u.email}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
