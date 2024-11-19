import {useState} from 'react'
import {Button} from "@/components/ui/button.tsx";
import {supabase} from "@/lib/supabase/supabase.ts";

const SignOutButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const handleSignOut = async () => {
        try {
            setIsLoading(true)
            const {error} = await supabase.auth.signOut();
            if (error) {
                throw error;
            }
        } catch (e) {
            console.error('Error signing out: ', e)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Button onClick={handleSignOut}>
            {
                isLoading ? 'Signing out...' : 'Sign Out'
            }
        </Button>
    );
};

export default SignOutButton;