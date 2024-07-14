import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
  <UserProfile path="/dashboard/settings/user-profile" />
);

export default UserProfilePage;