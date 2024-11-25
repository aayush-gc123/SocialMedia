import { Dialog, DialogContent } from '@radix-ui/react-dialog';
import React, { useState } from 'react';
import { DialogHeader } from './dialog';
import { readFileAsDataURI } from '@/lib/utils';

// Form submission handler
const CreatePost = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [file, setFile] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const fileChangeHandler = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const dataUri = await readFileAsDataURI(selectedFile);
      setImagePreview(dataUri);
    }
  };

  const createPostHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Form submitted");
      setTimeout(() => {
        setLoading(false);
        console.log("Post submitted successfully");
      }, 2000); // Simulate a 2-second delay for form submission
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-2xl w-[90%] sm:w-[500px] max-h-[80vh] overflow-auto transition-all duration-300 ease-in-out"
      >
        <DialogHeader className="text-center font-semibold text-2xl text-gray-800 mb-4">
          Create a New Post
        </DialogHeader>

        {/* Post form */}
        <form onSubmit={createPostHandler} className="space-y-6">
          {/* Text area for post content */}
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out text-gray-700"
            rows="6"
          />

          {/* Image Preview */}
          {imagePreview && (
            <div>
              <img src={imagePreview} alt="Image Preview" className="w-full h-auto mt-2 rounded-md" />
            </div>
          )}

          {/* File upload */}
          <div className="flex flex-col">
            <label htmlFor="file-upload" className="text-sm text-gray-700">
              Upload an Image (optional)
            </label>
            <input
              type="file"
              id="file-upload"
              onChange={fileChangeHandler}
              className="mt-2 border border-gray-300 rounded-md p-2 text-gray-700 hover:border-blue-500 transition duration-200"
            />
          </div>

          {/* Loading State */}
          {loading ? (
            <button
              type="button"
              className="w-full bg-blue-500 text-white py-3 rounded-md cursor-not-allowed"
              disabled
            >
              Submitting...
            </button>
          ) : (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Submit Post
            </button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
