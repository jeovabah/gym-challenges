export const getAvatarUrl = (name: string, avatarUrl: string | null) => {
  if (avatarUrl) return avatarUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
}; 