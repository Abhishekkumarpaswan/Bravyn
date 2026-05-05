import { useEffect, useRef } from "react";

interface GoogleAuthButtonProps {
  text?: "signin_with" | "signup_with" | "continue_with";
  onCredential: (credential: string) => Promise<void> | void;
}

const GoogleAuthButton = ({
  text = "continue_with",
  onCredential,
}: GoogleAuthButtonProps) => {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !buttonRef.current || !window.google?.accounts?.id) return;

    buttonRef.current.innerHTML = "";

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        if (response.credential) {
          await onCredential(response.credential);
        }
      },
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      shape: "pill",
      text,
      width: 320,
    });
  }, [clientId, onCredential, text]);

  if (!clientId) {
    return (
      <button
        type="button"
        disabled
        className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-400"
      >
        Add `VITE_GOOGLE_CLIENT_ID` to enable Google auth
      </button>
    );
  }

  return (
    <div className="flex justify-center">
      <div ref={buttonRef} />
    </div>
  );
};

export default GoogleAuthButton;
