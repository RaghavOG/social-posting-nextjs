"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { ImageIcon, Loader2Icon, SendIcon, Smile } from 'lucide-react';
import { Button } from "./ui/button";
import { createPost } from "@/actions/post.action";
import toast from "react-hot-toast";
import EmojiPickerComponent from "./EmojiPickerComponent";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import ImageUpload from "./ImageUpload";

function CreatePost() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleEmojiSelect = (emojiData: { unified: string; names: string[] }) => {
    const emoji = String.fromCodePoint(...emojiData.unified.split('-').map(u => parseInt(u, 16)));
    setContent(prev => prev + emoji);
  }

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!content.trim() && !imageFile) {
      toast.error("Please add some content or an image to post");
      return;
    }

    try {
      setIsPosting(true);
      console.log("Starting post submission...");
      
      let imageBase64: string | undefined;
      if (imageFile) {
        imageBase64 = await convertFileToBase64(imageFile);
      }

      const postData = {
        content,
        image: imageBase64
      };

      const result = await createPost(postData);
      console.log("Post submission result:", result);

      if (result?.success) {
        toast.success("Post created successfully!");
        setContent("");
        handleImageRemove();
        setShowImageUpload(false);
      } else {
        throw new Error(result?.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Post submission error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.imageUrl || "/avatar.png"} alt="User avatar" />
            </Avatar>
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
            />
          </div>

          {showImageUpload && (
            <ImageUpload
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              imagePreviewUrl={imagePreviewUrl}
            />
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0 bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 border-none bg-gray-800">
                  <EmojiPickerComponent onEmojiClick={handleEmojiSelect} />
                </PopoverContent>
              </Popover>
              <Button
                className="flex items-center"
                onClick={handleSubmit}
                disabled={(!content.trim() && !imageFile) || isPosting}
              >
                {isPosting ? (
                  <>
                    <Loader2Icon className="size-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <SendIcon className="size-4 mr-2" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CreatePost;