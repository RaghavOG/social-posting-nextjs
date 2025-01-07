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
import { motion, AnimatePresence } from "framer-motion";

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
      
      let imageBase64: string | undefined;
      if (imageFile) {
        imageBase64 = await convertFileToBase64(imageFile);
      }

      const postData = {
        content,
        image: imageBase64
      };

      const result = await createPost(postData);

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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="pt-6">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex space-x-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Avatar className="w-10 h-10 ring-2 ring-primary/10">
                  <AvatarImage src={user?.imageUrl || "/avatar.png"} alt="User avatar" />
                </Avatar>
              </motion.div>
              <Textarea
                placeholder="What's on your mind?"
                className="min-h-[100px] resize-none border-none focus-visible:ring-1 p-0 text-base transition-all duration-200 ease-in-out hover:bg-accent/5"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isPosting}
              />
            </div>

            <AnimatePresence mode="wait">
              {showImageUpload && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ImageUpload
                    onImageUpload={handleImageUpload}
                    onImageRemove={handleImageRemove}
                    imagePreviewUrl={imagePreviewUrl}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              className="flex items-center justify-between border-t pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div className="flex space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  disabled={isPosting}
                >
                  <ImageIcon className="size-4 mr-2" />
                  Photo
                </Button>
              </motion.div>
              <div className="flex items-center space-x-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0 bg-background hover:bg-accent transition-colors duration-200"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 border-none bg-background shadow-xl">
                    <EmojiPickerComponent onEmojiClick={handleEmojiSelect} />
                  </PopoverContent>
                </Popover>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="flex items-center bg-primary hover:bg-primary/90 transition-all duration-200"
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
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default CreatePost;