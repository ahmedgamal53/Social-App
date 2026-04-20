import React, { useRef, useState } from "react";
import { TbMessageDots } from "react-icons/tb";
import { IoMdSend } from "react-icons/io";
import { FaImages } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { IoPersonCircle } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import Upload from "../components/Upload";
import { BeatLoader } from "react-spinners";
import { useAuth } from "../context/AuthProvider";
import { usePosts } from "../api/posts/Posts";
import UserPosts from "../components/UserPosts";
const Home = () => {
  const { data: allPosts } = usePosts();
  console.log("allPosts", allPosts);

  const { loading } = useAuth();
  const [menue, setmenue] = useState(false);
  const [preview, setpreview] = useState([]);
  const [inputvalue, setinputvalue] = useState("");
  const [upload, setupload] = useState([]);
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

  const handelupload = async () => {
    if (!inputvalue.trim() && preview.length === 0) return;

    setupload((prev) => [
      ...prev,
      {
        id: Date.now(),
        username: null,
        text: inputvalue,
        images: [...preview],
        liked: false,
        comment: false,
        likes: [],
        rightcomment: [],
      },
    ]);
    setinputvalue("");
    setpreview([]);
    setmenue(false);
  };

  return (
    <div>
      {!loading ? (
        <div className="m-5 ml-15   flex justify-center items-center flex-col ">
          <div>
            <div className="bg-white shadow-2xl rounded-md w-xl   ">
              <h3 className="border-b-2 mb-3 py-3 px-4 border-gray-300 font-semibold text-xl ">
                Create Post
              </h3>

              <div className="flex items-center justify-between relative">
                <TbMessageDots className="absolute left-4 text-xl text-gray-500 " />
                <input
                  onClick={() => setmenue(true)}
                  type="text"
                  placeholder="What's on your mind?"
                  className="bg-gray-100 cursor-pointer border-2 w-full m-3 px-7 py-1  outline-none border-gray-300 rounded-md"
                />
                <IoMdSend className="absolute right-4 text-xl text-gray-500 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* show menue */}
          <div>
            {menue && (
              <div
                onClick={() => setmenue(false)}
                className="fixed z-50 bg-[#282830e8] inset-0 backdrop-blur-sm "
              >
                <div className="flex justify-center items-center h-screen ">
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-black/40 border-2  border-gray-600  w-[450px] rounded-md relative"
                  >
                    <FaXmark
                      onClick={() => setmenue(false)}
                      className="text-3xl text-gray-600 bg-gray-400 rounded-full  absolute top-6 left-3 cursor-pointer"
                    />
                    <h3 className="text-center text-xl border-b-2 border-gray-400 py-3 mt-3 text-white font-semibold">
                      Create a post
                    </h3>
                    <div className="mt-5 px-3 py-3 text-white flex items-center gap-3">
                      <div>
                        <IoPersonCircle className="text-3xl" />
                      </div>
                      username
                    </div>
                    <div className="flex flex-col min-h-[200px]">
                      <input
                        type="text"
                        value={inputvalue}
                        onChange={(e) => setinputvalue(e.target.value)}
                        placeholder="What are you thinking?"
                        className="px-4 py-5 text-gray-200 outline-none"
                      />
                      <div className="mb-5   ">
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
                                  className="absolute z-50 top-1 left-1 text-2xl bg-black/70 text-white rounded-full p-1 cursor-pointer"
                                />
                                {item.file.type.startsWith("image/") && (
                                  <img
                                    src={item.url}
                                    className="rounded-md w-full object-cover border border-gray-500"
                                  />
                                )}
                                {item.file.type.startsWith("video/") && (
                                  <div>
                                    <video
                                      className="rounded-md "
                                      src={item.url}
                                      controls
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="mt-auto mb-5 mx-3 px-6 py-5 flex justify-between border-2 border-gray-500 rounded-2xl  ">
                        <p className="text-white text-xl"> Add to your post</p>
                        <input
                          type="file"
                          multiple
                          ref={fileinputref}
                          className="hidden"
                          accept="image/*,video/*"
                          onChange={handelchange}
                        />
                        <div onClick={handelclick}>
                          <FaImages className="text-green-400 text-3xl cursor-pointer" />
                        </div>
                      </div>
                      {/* upload */}
                      <button
                        onClick={handelupload}
                        disabled={!inputvalue.trim() && preview.length === 0}
                        className={`text-white hover:bg-blue-400 cursor-pointer  bg-blue-500 mx-5 rounded-md my-5 py-2  disabled:cursor-no-drop disabled:bg-[#3b3d3e]    disabled:opacity-80`}
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* <Upload posts={posts} setupload={setupload} /> */}
          <UserPosts posts={allPosts} />
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
