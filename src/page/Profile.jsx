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
      const filename = `${session.user.id}-${Date.now()}`;

      await supabase.storage.from("avatars").upload(filename, file);

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
      <div className="bg-[#252728] flex justify-around items-center  p-10">
        <div className="flex items-center gap-3 justify-center ">
          <div className="text-white relative ">
            <div
              onClick={handelmenue}
              disabled={uploading}
              className={isOwner ? "cursor-pointer" : ""}
            >
              {profileData?.avatar_url ? (
                <img
                  src={profileData.avatar_url}
                  className="size-15 object-cover mb-3 rounded-full w-[100px] h-[100px]   "
                />
              ) : (
                <IoPersonCircle className="text-3xl w-[100px] h-[100px]" />
              )}
              {isOwner && (
                <div className="rounded-2xl absolute bottom-1 left-0 bg-[#2f2d2d] w-[30px] h-[30px] flex justify-center items-center p-2">
                  <FaCamera />
                </div>
              )}
            </div>
            <div className="">
              {isOwner && menu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute flex flex-col gap-2 bg-[#252728] p-2 rounded-md w-[250px]"
                >
                  <div
                    className="flex items-center gap-2 cursor-pointer font-bold"
                    onClick={handelPecture}
                  >
                    <BsPersonBadge className="text-xl" />
                    <span>View profile picture</span>
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
                    className="flex cursor-pointer items-center gap-2 font-bold"
                  >
                    <HiMiniPhoto className="text-xl" />
                    <span>Choosing a profile picture</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            {isOwner && editeUserName ? (
              <div className="flex  flex-col gap-2 items-center">
                <input
                  value={inputusername}
                  onChange={(e) => setinputusername(e.target.value)}
                  className="bg-[#3B3D3E] px-3 py-2 rounded-2xl outline-none text-white"
                  type="text"
                />
                <div className="flex  gap-5">
                  <button
                    onClick={canseledite}
                    className="bg-[#3B3D3E] px-3 py-2 rounded-md text-white cursor-pointer"
                  >
                    cancel
                  </button>
                  <button
                    onClick={handelSaveUsername}
                    disabled={!inputusername.trim()}
                    className="bg-[#3B3D3E] px-3 py-2 rounded-md disabled:cursor-no-drop disabled:opacity-50 text-white cursor-pointer"
                  >
                    save
                  </button>
                </div>
              </div>
            ) : (
              <h2 className="text-white absolute">{profileData?.username}</h2>
            )}
          </div>
        </div>
        {isOwner && (
          <div
            onClick={handelEdite}
            className="text-white flex justify-center items-center gap-2 bg-[#3B3D3E] px-3 py-2 rounded-md cursor-pointer"
          >
            Edite profile
            <span>
              <MdEdit />
            </span>
          </div>
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
            className="w-5xl flex gap-5 relative"
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
