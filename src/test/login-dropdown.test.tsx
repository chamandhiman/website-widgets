import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginDropdown, GoogleSignInCard } from "@/components/LoginDropdown";

const mockSignInWithGoogle = vi.fn();

vi.mock("@/lib/auth", () => ({
  useAuth: () => ({
    signInWithGoogle: mockSignInWithGoogle,
    isFirebaseConfigured: true,
    user: null,
    loading: false,
  }),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("LoginDropdown & GoogleSignInCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders trigger button and toggles dropdown on click", () => {
    render(<LoginDropdown buttonText="Log in" />);

    const trigger = screen.getByRole("button", { name: "Log in" });
    expect(trigger).toBeInTheDocument();
    expect(screen.queryByText("Sign in to your account")).not.toBeInTheDocument();

    // Open dropdown
    fireEvent.click(trigger);
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    expect(screen.getByText("WEBTOOLOCEAN")).toBeInTheDocument();
    expect(screen.getByText("Verified")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continue with Google/i })).toBeInTheDocument();
    expect(screen.getByText("OAuth 2.0 Account Chooser")).toBeInTheDocument();
    expect(screen.getByText("Fast access")).toBeInTheDocument();

    // Click trigger again to close
    fireEvent.click(trigger);
    expect(screen.queryByText("Sign in to your account")).not.toBeInTheDocument();
  });

  it("closes dropdown on Escape key", () => {
    render(<LoginDropdown buttonText="Log in" />);

    const trigger = screen.getByRole("button", { name: "Log in" });
    fireEvent.click(trigger);
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("Sign in to your account")).not.toBeInTheDocument();
  });

  it("does not render obsolete email or password input fields", () => {
    render(<GoogleSignInCard />);

    expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/forgot password/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/create an account/i)).not.toBeInTheDocument();
  });

  it("calls signInWithGoogle when Continue with Google button is clicked", async () => {
    mockSignInWithGoogle.mockResolvedValueOnce(undefined);
    const onSuccess = vi.fn();
    render(<GoogleSignInCard onSuccess={onSuccess} />);

    const googleBtn = screen.getByRole("button", { name: /Continue with Google/i });
    fireEvent.click(googleBtn);

    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });
});
