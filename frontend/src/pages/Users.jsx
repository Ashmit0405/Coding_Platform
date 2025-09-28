import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext.jsx";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import Navbar from "@/components/navbar";

import useFetchUsers from "@/hooks/useFetchUsers";
import useRemoveUser from "@/hooks/useRemoveUser";
import useChangeUserRole from "@/hooks/useChangeUserRole";
import useSearchUsers from "@/hooks/useSearchUsers";

export default function ManageUsers({ accessToken }) {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");

  const { users, setUsers, loading } = useFetchUsers();
  const { removeUser } = useRemoveUser(setUsers);
  const { changeUserRole } = useChangeUserRole(setUsers);
  const { searchUsers, searching } = useSearchUsers(setUsers, accessToken);

  return (
    <div className="p-6 grid gap-4">
      <Navbar />
      {user?.role==="admin"?(<h1 className="text-2xl font-bold mb-4">Manage Users</h1>):(<h1 className="text-2xl font-bold mb-4">All Users</h1>)}

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <Input
          type="text"
          placeholder="Search by username, fullname or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <Button
          onClick={() => searchUsers(searchQuery)}
          variant="default"
          className="w-full md:w-auto"
        >
          Search
        </Button>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : users.filter((u) => u._id !== user?._id).length === 0 ? (
        <p className="text-gray-500">
          {searching ? "No matching users found." : "No users available."}
        </p>
      ) : (
        users
          .filter((u) => u._id !== user?._id)
          .map((u) => (
            <Card key={u._id} className="rounded-2xl shadow-md">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold">
                  <Link
                  to={`/user/${u._id}`}
                  className="text-blue-600 hover:underline text-lg font-semibold"
                >
                  {u.username}
                </Link>
                <p className="text-gray-700 font-medium">{u.fullname}</p>
                <p className="text-gray-500">{u.email}</p>
                </h2>

                {user?.role === "admin" && (
                  <>
                    <p className="text-gray-600">Current Role: {u.role}</p>
                    <div className="flex gap-3 mt-4">
                      <Button
                        variant="outline"
                        className={`hover:cursor-pointer ${
                          u.role === "user" ? "bg-gray-200" : ""
                        }`}
                        onClick={() => changeUserRole(u._id, "user")}
                      >
                        User
                      </Button>
                      <Button
                        variant="outline"
                        className={`hover:cursor-pointer ${
                          u.role === "setter" ? "bg-gray-200" : ""
                        }`}
                        onClick={() => changeUserRole(u._id, "setter")}
                      >
                        Setter
                      </Button>
                      <Button
                        variant="outline"
                        className={`hover:cursor-pointer ${
                          u.role === "admin" ? "bg-gray-200" : ""
                        }`}
                        onClick={() => changeUserRole(u._id, "admin")}
                      >
                        Admin
                      </Button>

                      {/* Remove user */}
                      <Button
                        variant="destructive"
                        className="ml-auto hover:cursor-pointer hover:bg-red-700"
                        onClick={() => removeUser(u._id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))
      )}
    </div>
  );
}
