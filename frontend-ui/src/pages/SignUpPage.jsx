
import { SignUp } from "@clerk/clerk-react";
import { Music } from "lucide-react";

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark via-dark-secondary to-dark-tertiary">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Music className="text-primary" size={48} />
          <span className="text-4xl font-bold">MusicStream</span>
        </div>

        {/* Clerk Sign Up */}
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-dark-secondary shadow-2xl",
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
};

export default SignUpPage;