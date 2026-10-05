import ProfileNav from "./ProfileNav";

export default function ProfileLayout({ children }) {
  return (
    <main>
      <h1 className="sr-only">Account Settings</h1>
      <ProfileNav />
      {children}
    </main>
  );
}