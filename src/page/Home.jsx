import React, { useRef, useState } from "react";
import { TbMessageDots } from "react-icons/tb";
import { IoMdSend } from "react-icons/io";
import { FaImages } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { IoPersonCircle } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { BeatLoader } from "react-spinners";
import { useAuth } from "../context/AuthProvider";
import { useInsertPost, usePosts } from "../api/posts/Posts";
import UserPosts from "../components/UserPosts";
import { supabase } from "../supabaseClient.js";
import { FaSearch } from "react-icons/fa";
import imageCompression from "browser-image-compression";
const Home = () => {
  const { data: allPosts, isLoading } = usePosts();
  const { mutate: insertPost } = useInsertPost();

  const { loading, profile, setloading } = useAuth();
  const [menue, setmenue] = useState(false);
  const [preview, setpreview] = useState([]);
  const [inputvalue, setinputvalue] = useState("");
  const [search, setSearch] = useState("");
  const fileinputref = useRef();

  const handelclick = () => {
    fileinputref.current.click();
  };
  const handelchange = (e) => {
    const files = Array.from(e.target.files);
    const images = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setpreview((prev) => [...prev, ...images]);

    e.target.value = "";
  };

  const uploadImages = async (files) => {
    const uploadPromises = files.map(async (file) => {
      let finalFile = file;
      let ext = file.type.split("/")[1] || "mp4";
      let contentType = file.type;

      if (file.type.startsWith("image/")) {
        const options = {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
          fileType: "image/webp",
        };

        const compressed = await imageCompression(file, options);
        finalFile = compressed;
        ext = "webp";
        contentType = "image/webp";
      }

      const fileName = `posts/${Date.now()}-${crypto.randomUUID()}.${ext}`;

      await supabase.storage.from("posts").upload(fileName, finalFile, {
        contentType: contentType,
      });

      const { data } = supabase.storage.from("posts").getPublicUrl(fileName);

      return data.publicUrl;
    });

    const results = await Promise.all(uploadPromises);
    return results.filter(Boolean);
  };
  if (isLoading) {
    return (
      <div className="fixed flex justify-center items-center h-screen inset-0 bg-black/10">
        <div className="">
          <BeatLoader color="#3498db" size={15} />
        </div>
      </div>
    );
  }

  const filteredPosts = allPosts?.filter(
    (post) =>
      post.caption?.toLowerCase().includes(search.toLowerCase()) ||
      post.profiles?.username?.toLowerCase().includes(search.toLowerCase()),
  );

  const handelupload = async () => {
    if (!inputvalue.trim() && preview.length === 0) return;
    try {
      setloading(true);
      const files = preview.map((p) => p.file);
      const imageUrls = await uploadImages(files);

      insertPost({ caption: inputvalue, images: imageUrls });
    } catch (error) {
      console.log(error);
      setloading(false);
    } finally {
      setloading(false);
      setinputvalue("");
      setpreview([]);
      setmenue(false);
    }
  };

  return (
    <div>
      {!loading ? (
        <div>
          <div className="top-0 sticky z-40 bg-white/60 backdrop-blur-2xl shadow-md border border-white/40  ">
            <div className="p-3 flex justify-center items-center">
              <div className="flex items-center relative w-[450px]">
                <FaSearch className="text-gray-400 absolute left-3 text-sm" />
                <input
                  type="search"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/40 border border-transparent pl-9 pr-3 py-2 outline-none rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:bg-white/70 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
              </div>
            </div>
          </div>
          <div className="m-5 ml-15   flex justify-center items-center flex-col ">
            <div>
              <div className="bg-white/80 backdrop-blur-xl shadow-md border border-gray-200 rounded-2xl w-xl">
                <h3 className="border-b border-gray-200 py-3 px-4 font-semibold text-[18px] text-gray-800">
                  Create Post
                </h3>

                <div className="flex items-center relative px-3 py-3">
                  <TbMessageDots className="absolute left-5 text-lg text-gray-600" />
                  <input
                    onClick={() => setmenue(true)}
                    type="text"
                    placeholder="What's on your mind?"
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-10 py-2 outline-none rounded-xl text-sm text-gray-700 placeholder-gray-400 cursor-pointer "
                  />
                  <IoMdSend className="absolute right-5 text-3xl cursor-pointer text-blue-500 bg-white/90  backdrop-blur-md p-1 rounded-full shadow-md hover:scale-105 transition-all duration-200" />{" "}
                </div>
              </div>
            </div>

            {/* show menue */}
            <div>
              {menue && (
                <div
                  onClick={() => setmenue(false)}
                  className="fixed z-50 inset-0 bg-white/30 backdrop-blur-sm"
                >
                  <div className="flex justify-center items-center h-screen ">
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white/80 backdrop-blur-xl border border-gray-200 w-[450px] rounded-2xl relative shadow-xl"
                    >
                      <FaXmark
                        onClick={() => setmenue(false)}
                        className="text-2xl text-gray-500 bg-white rounded-full absolute top-4 left-4 cursor-pointer p-1 shadow-md"
                      />

                      <h3 className="text-center text-[18px] border-b border-gray-200 py-3 mt-2 text-gray-800 font-semibold">
                        Create a post
                      </h3>

                      <div className="mt-4 px-4 py-3 text-gray-800 flex items-center gap-3">
                        <div>
                          {profile?.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              className="object-cover rounded-full w-[60px] h-[60px]"
                            />
                          ) : (
                            <IoPersonCircle className="text-4xl w-[60px] h-[60px] text-gray-400" />
                          )}
                        </div>

                        <div className="text-[15px] font-medium">
                          {profile?.username}
                        </div>
                      </div>

                      <div className="flex flex-col min-h-[200px]">
                        <input
                          type="text"
                          value={inputvalue}
                          onChange={(e) => setinputvalue(e.target.value)}
                          placeholder="What are you thinking?"
                          className="px-4 py-4 text-gray-700 outline-none placeholder-gray-400"
                        />

                        <div className="mb-5">
                          {preview.length > 0 && (
                            <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-60 px-5 mt-3">
                              {preview.map((item, index) => (
                                <div key={index} className="relative">
                                  <IoCloseSharp
                                    onClick={() =>
                                      setpreview((prev) =>
                                        prev.filter((_, i) => i !== index),
                                      )
                                    }
                                    className="absolute z-50 top-1 left-1 text-xl bg-black/70 text-white rounded-full p-1 cursor-pointer"
                                  />

                                  {item.file.type.startsWith("image/") && (
                                    <img
                                      src={item.url}
                                      className="rounded-xl w-full object-cover border border-gray-200"
                                    />
                                  )}

                                  {item.file.type.startsWith("video/") && (
                                    <video
                                      className="rounded-xl"
                                      src={item.url}
                                      controls
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-auto mb-5 mx-3 px-5 py-4 flex justify-between border border-gray-200 rounded-xl bg-gray-50">
                          <p className="text-gray-700 text-[15px]">
                            Add to your post
                          </p>

                          <input
                            type="file"
                            multiple
                            ref={fileinputref}
                            className="hidden"
                            accept="image/*,video/*"
                            onChange={handelchange}
                          />

                          <div onClick={handelclick}>
                            <FaImages className="text-green-500 text-2xl cursor-pointer" />
                          </div>
                        </div>

                        <button
                          onClick={handelupload}
                          disabled={!inputvalue.trim() && preview.length === 0}
                          className="text-white bg-blue-500 hover:bg-blue-600 cursor-pointer mx-5 rounded-xl my-5 py-2 text-sm transition-all duration-200 disabled:cursor-no-drop disabled:bg-gray-300 disabled:text-gray-500"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <UserPosts posts={filteredPosts} />
          </div>
        </div>
      ) : (
        <div className="fixed flex justify-center items-center h-screen inset-0 bg-black/10">
          <div className="">
            <BeatLoader color="#3498db" size={15} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
