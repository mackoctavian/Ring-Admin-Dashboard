import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
  <UserProfile path="/settings/user-profile" />
);

export default UserProfilePage;