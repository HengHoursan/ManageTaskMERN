import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {toast} from 'sonner'
import Loader from "./Loader"
import {useState} from "react";

const NavBar = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    // const [user, setUser] = useState(null);
    //
    // const fetchData = async () => {
    //     try {
    //         const token = localStorage.getItem("token");
    //         const allUsers = await getAllUsers({
    //             headers: {authorization: "Bearer"+token},
    //         });
    //         const userData = localStorage.getItem("userData");
    //         console.log(allUsers);
    //
    //         const currentUser = allUsers.find(u => u.id=== userData?.id);
    //
    //         if (currentUser) {
    //             console.log("This is current user:", currentUser.username);
    //             setUser(currentUser.username);
    //         } else {
    //             console.warn("User not found");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching users:", error);
    //     }
    // };
    //
    // useEffect(() => {
    //     fetchData();
    // }, []);

    const handleLogout = async () => {
        try{
            setIsLoading(true);
            localStorage.removeItem("userData");
            localStorage.removeItem("token");
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success("Log out successful!", {
                description: "You have been successfully logged out.",
                duration: 4000,
            });
            navigate("/");
        }catch(error){
            console.log('Error logging out', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex justify-between items-center p-4 border-b">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            onClick={() => navigate("/home")}
                            className="font-bold text-lg cursor-pointer"
                        >
                            Manager Tasks
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
                <NavigationMenuList className="flex justify-between gap-2.5">
                    <NavigationMenuItem>
                        <Button onClick={handleLogout} className='cursor-pointer'>Log out</Button>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            {isLoading && (
                <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default NavBar;
