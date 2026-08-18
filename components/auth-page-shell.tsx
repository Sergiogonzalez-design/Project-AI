type Props = {
  children: React.ReactNode;
};

/** Full-screen auth/onboarding page shell. */
export function AuthPageShell({ children }: Props) {
  return <div className="relative min-h-screen">{children}</div>;
}
