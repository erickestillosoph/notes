import { Button } from "./ui/button";
import { SignInButton } from "@clerk/clerk-react";

export default function Homepage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center bg-gray-100">
      <div className="max-w-7xl px-4 py-20 grid gap-8">
        <article>
          <div className="flex items-center justify-center mt-6">
            <Button variant="default" className="bg-teal-500 hover:bg-teal-600">
              <SignInButton mode="modal">Get started for free</SignInButton>
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
}
