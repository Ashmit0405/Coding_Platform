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
                        <NavigationMenuLink asChild className="text-gray-700 hover:text-blue-600 hover:cursor-pointer transition-colors font-medium">
                            <Link to="/profile">
                                Profile
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    {(user?.role === "setter" || user?.role === "admin") && (
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className="text-gray-700 hover:text-blue-600 hover:cursor-pointer transition-colors font-medium">
                                <Link to="/submit-problem">
                                    Submit Problem
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    )}
                    {(user?.role === "admin") && (
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className="text-gray-700 hover:text-blue-600 hover:cursor-pointer transition-colors font-medium">
                                <Link to="/review-problem">
                                    Review Problem
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    )}
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className="text-gray-700 hover:text-blue-600 hover:cursor-pointer transition-colors font-medium">
                            <Link to="/all-users">
                                Users List
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
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