export const metadata = {
  title: 'Mon profil - CineApp',
  description: 'Gérez votre profil utilisateur',
};

import PrivateRoute from '@/components/auth/PrivateRoute';
import ProfileContent from '@/components/profile/ProfileContent';

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <ProfileContent />
    </PrivateRoute>
  );
}