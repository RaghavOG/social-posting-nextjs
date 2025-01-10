// app/profile/[username]/page.tsx
import { Metadata } from "next";
import {
  getProfileByUsername,
  getUserLikedPosts,
  getUserPosts,
  isFollowing,
} from "@/actions/profile.action";
import { notFound } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";

// Define the params type for the page
interface PageProps {
  params: { username: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Metadata generation function
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const user = await getProfileByUsername(params.username);
  if (!user) {
    return {
      title: "User Not Found",
      description: "The requested profile could not be found.",
    };
  }

  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Check out ${user.username}'s profile.`,
  };
}

// Page component
export default async function Page({ params }: PageProps) {
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