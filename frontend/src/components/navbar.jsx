import { AuthContext } from "@/context/AuthContext.jsx";
import { useContext } from "react";
import { Link } from "react-router-dom";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    return (
        <header className="flex items-center justify-between bg-white shadow-md px-6 py-4 rounded-lg mb-10">
            <Link to="/">
                <h1 className="text-xl font-bold text-blue-600">MyApp</h1>
            </Link>

            <NavigationMenu>
                <NavigationMenuList className="flex space-x-6">
                    <NavigationMenuItem>
                        <NavigationMenuLink className="text-gray-700 hover:text-blue-600 hover:cursor-pointer transition-colors font-medium">
                            Dashboard
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link to="/profile">
                            <NavigationMenuLink className="text-gray-700 hover:text-blue-600 hover:cursor-pointer transition-colors font-medium">
                                Profile
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink className="text-gray-700 hover:text-blue-600 hover:cursor-pointer transition-colors font-medium">
                            Settings
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    {(user?.role === "setter"||user?.role==="admin") && (
                        <NavigationMenuItem>
                            <Link to="/submit-problem">
                                <NavigationMenuLink className="text-gray-700 hover:text-blue-600 hover:cursor-pointer transition-colors font-medium">
                                    Submit Problem
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    )}
                    {(user?.role==="admin") && (
                        <NavigationMenuItem>
                            <Link to="/review-problem">
                                <NavigationMenuLink className="text-gray-700 hover:text-blue-600 hover:cursor-pointer transition-colors font-medium">
                                    Review Problem
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    )}
                    {(user?.role==="admin") && (
                        <NavigationMenuItem>
                            <Link to="/all-users">
                                <NavigationMenuLink className="text-gray-700 hover:text-blue-600 hover:cursor-pointer transition-colors font-medium">
                                    Users List
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    )}
                </NavigationMenuList>
            </NavigationMenu>
            <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white px-4 py-2 rounded-md transition-colors"
            >
                Logout
            </button>
        </header>
    );
}