import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { FaImages } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { FaCamera } from "react-icons/fa";
import { BsPersonBadge } from "react-icons/bs";
import { HiMiniPhoto } from "react-icons/hi2";
import { supabase } from "../supabaseClient.js";
import { BeatLoader } from "react-spinners";
import { IoClose } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import Home from "./Home.jsx";
import CreatPostUser from "../components/CreatPostsUser.jsx";
import { useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
const Profile = () => {
  const { id } = useParams();

  const fileinputref = useRef();
  const { session, setprofile, profile: currentUser } = useAuth();
  const [menu, setmenu] = useState(false);

  const [profileData, setProfileData] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [viewPecture, setviewPecture] = useState(false);
  const [editeUserName, setediteUserName] = useState(false);
  const [inputusername, setinputusername] = useState();

  const isOwner = currentUser?.id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) {
        setProfileData(data);
        setinputusername(data?.username);
      }
    };
    if (id) fetchProfile();
  }, [id]);

  const handelchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: "image/webp",
      };

      const compressedFile = await imageCompression(file, options);

      const filename = `${session.user.id}-${Date.now()}.webp`;

      await supabase.storage.from("avatars").upload(filename, compressedFile, {
        contentType: "image/webp",
      });

      const { data } = supabase.storage.from("avatars").getPublicUrl(filename);

      const imageUrl = `${data.publicUrl}?t=${Date.now()}`;

      await supabase
        .from("profiles")
        .update({ avatar_url: imageUrl })
        .eq("id", session.user.id);

      setprofile((prev) => ({
        ...prev,
        avatar_url: imageUrl,
      }));
      setProfileData((prev) => ({ ...prev, avatar_url: imageUrl }));
    } catch (error) {
      console.log(error);
      setUploading(false);
    } finally {
      setUploading(false);
      setmenu(false);
    }
  };

  const handelmenue = (e) => {
    e.stopPropagation();
    setmenu(!menu);
  };

  const handelPecture = () => {
    if (profileData?.avatar_url) {
      setviewPecture(true);
    }

    setmenu(false);
  };

  const handelEdite = () => {
    setediteUserName(true);
  };

  const canseledite = () => {
    setediteUserName(false);
    setinputusername(profileData?.username);
  };

  const handelSaveUsername = async () => {
    if (!inputusername.trim()) {
      setediteUserName(false);
      setinputusername(profileData?.username);
      return;
    }
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username: inputusername })
        .eq("id", session.user.id);

      if (error) {
        alert(error.message);
        return;
      }

      setprofile((prev) => ({ ...prev, username: inputusername }));
      setProfileData((prev) => ({ ...prev, username: inputusername }));
    } catch (error) {
      console.log(error);
      setediteUserName(false);
    } finally {
      setediteUserName(false);
    }
  };

  return (
    <div onClick={() => setmenu(false)} className=" h-screen">
      <div className="bg-[#2a2a2a] border-b border-gray-700 px-6 py-6 flex items-center justify-between">
        {/* left */}
        <div className="flex items-center gap-5">
          {/* avatar */}
          <div className="relative">
            <div
              onClick={handelmenue}
              className={isOwner ? "cursor-pointer" : ""}
            >
              {profileData?.avatar_url ? (
                <img
                  src={profileData.avatar_url}
                  className="w-[90px] h-[90px] rounded-full object-cover border-2 border-gray-600"
                />
              ) : (
                <IoPersonCircle className="w-[90px] h-[90px] text-gray-400" />
              )}

              {/* camera icon */}
              {isOwner && (
                <div className="absolute bottom-0 right-0 bg-gray-800 border border-gray-600 w-[32px] h-[32px] flex items-center justify-center rounded-full">
                  <FaCamera className="text-white text-sm" />
                </div>
              )}
            </div>

            {isOwner && menu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-[100%] mt-2 left-0 bg-[#2a2a2a] border border-gray-700 rounded-xl w-[220px] shadow-xl p-2 z-50"
              >
                <div
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 rounded-lg cursor-pointer"
                  onClick={handelPecture}
                >
                  <BsPersonBadge className="text-lg" />
                  <span className="text-white text-sm">
                    View profile picture
                  </span>
                </div>

                <input
                  type="file"
                  className="hidden"
                  ref={fileinputref}
                  accept="image/*"
                  onChange={handelchange}
                />

                <div
                  onClick={() => fileinputref.current.click()}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 rounded-lg cursor-pointer"
                >
                  <HiMiniPhoto className="text-lg" />
                  <span className="text-white text-sm">
                    Choose profile picture
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            {isOwner && editeUserName ? (
              <div className="flex flex-col gap-3">
                <input
                  value={inputusername}
                  onChange={(e) => setinputusername(e.target.value)}
                  className="bg-gray-800 px-4 py-2 rounded-lg outline-none text-white border border-gray-600"
                  type="text"
                />

                <div className="flex gap-3">
                  <button
                    onClick={canseledite}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handelSaveUsername}
                    disabled={!inputusername.trim()}
                    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white text-sm disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <h2 className="text-white text-2xl font-semibold">
                {profileData?.username}
              </h2>
            )}
          </div>
        </div>

        {isOwner && (
          <button
            onClick={handelEdite}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white text-sm transition"
          >
            Edit profile
            <MdEdit />
          </button>
        )}
      </div>

      {uploading ? (
        <div className="fixed flex justify-center items-center h-screen inset-0 bg-black/10">
          <div className="">
            <BeatLoader color="#3498db" size={15} />
          </div>
        </div>
      ) : null}
      {profileData?.avatar_url && viewPecture && (
        <div
          onClick={() => setviewPecture(false)}
          className="fixed flex justify-center items-center h-screen inset-0 z-50 bg-black/50 drop-shadow-2xl"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-3xl flex gap-5 relative "
          >
            <img className="rounded-md" src={profileData?.avatar_url} alt="" />
            <div
              onClick={() => setviewPecture(false)}
              className=" z-10 absolute right-0 text-4xl cursor-pointer text-gray-400"
            >
              <IoClose />
            </div>
          </div>
        </div>
      )}

      {/* posts */}
      <CreatPostUser id={id} />
    </div>
  );
};

export default Profile;
