import { signIn } from "next-auth/react";
import React from "react";

const SigninButton = () => {
    return (
        <button onClick={() => signIn("Credentials", { callbackUrl: "/" })} className="font-semibold hover:underline">
            Sign In
        </button>
    );
};

export default SigninButton;
