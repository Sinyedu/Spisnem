// Placeholder social sign-in — not wired up (part of the UI-only auth flow).
export default function SocialButtons() {
  return (
    <>
      <div className="auth__divider">or continue with</div>
      <div className="auth__social">
        <button type="button" className="auth__social-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="#4285F4"
              d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7C21.8 19 23 15.9 23 12.3z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.8H1.8v3C3.7 21.4 7.5 24 12 24z"
            />
            <path fill="#FBBC05" d="M5.6 14.6a7.2 7.2 0 0 1 0-4.6v-3H1.8a12 12 0 0 0 0 10.6l3.8-3z" />
            <path
              fill="#EA4335"
              d="M12 4.8c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.2 15.1 0 12 0 7.5 0 3.7 2.6 1.8 6.4l3.8 3C6.5 6.8 9 4.8 12 4.8z"
            />
          </svg>
          Google
        </button>
        <button type="button" className="auth__social-btn">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.9-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.8-.4 6.9 1.1 9.1.8 1.1 1.6 2.3 2.8 2.3 1.1 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.7-2.1c.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.6-3.7zM14.3 5.3c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.7-.9 2.7 1 .1 2-.5 2.6-1.2z" />
          </svg>
          Apple
        </button>
      </div>
    </>
  );
}
