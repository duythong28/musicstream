
import { SignIn } from "@clerk/clerk-react";
import { Music } from "lucide-react";

const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark via-dark-secondary to-dark-tertiary">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Music className="text-primary" size={48} />
          <span className="text-4xl font-bold">MusicStream</span>
        </div>

        {/* Clerk Sign In */}
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-dark-secondary shadow-2xl",
            },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
};

export default SignInPage;