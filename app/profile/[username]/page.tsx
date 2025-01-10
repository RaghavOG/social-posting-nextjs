
import {
  getProfileByUsername,
  getUserLikedPosts,
  getUserPosts,
  isFollowing,
} from "@/actions/profile.action";
import { notFound } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";

type ProfileParams = {
  params: {
    username: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

// Metadata generation function
export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const user = await getProfileByUsername(params.username);
  if (!user) {
    return {
      title: "User Not Found",
      description: "The requested profile could not be found.",
    };
  };

  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Check out ${user.username}'s profile.`,
  };
}

// ProfilePageServer function
async function ProfilePageServer({ params }: ProfileParams) {
  const user = await getProfileByUsername(params.username);

  // Handle case when user is not found
  if (!user) notFound();

  // Fetch related data concurrently
  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
    />
  );
}

export default ProfilePageServer;
