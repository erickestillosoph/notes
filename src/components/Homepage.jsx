import { Button } from "./ui/button";
import { SignInButton } from "@clerk/clerk-react";

export default function Homepage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center bg-gray-100">
      <div className="max-w-7xl px-4 py-20 grid gap-8">
        <article>
          <Button variant="default" className="bg-teal-500 hover:bg-teal-600">
            <SignInButton mode="modal">Get started for free</SignInButton>
          </Button>
        </article>
      </div>
    </div>
  );
}
