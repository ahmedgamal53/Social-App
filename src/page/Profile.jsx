import { useRef, useState } from "react";
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
import PostsUser from "../components/PostsUser.jsx";
const Profile = () => {
  const fileinputref = useRef();
  const { session, setprofile, profile } = useAuth();
  const [menu, setmenu] = useState(false);
  // const [avatar, setAvatar] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [viewPecture, setviewPecture] = useState(false);
  const [editeUserName, setediteUserName] = useState(false);
  const [inputusername, setinputusername] = useState(profile?.username);
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
    if (profile?.avatar_url) {
      setviewPecture(true);
    }
    setmenu(false);
  };

  const handelEdite = () => {
    setediteUserName(true);
  };

  const canseledite = () => {
    setediteUserName(false);
    setinputusername(profile?.username);
  };

  const handelSaveUsername = async () => {
    if (!inputusername.trim()) {
      setediteUserName(false);
      setinputusername(profile?.username);
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
              className="  cursor-pointer"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  className="size-15 object-cover mb-3 rounded-full w-[100px] h-[100px]   "
                />
              ) : (
                <IoPersonCircle className="text-3xl w-[100px] h-[100px]" />
              )}
              <div className="rounded-2xl absolute  bottom-1 left-0 bg-[#2f2d2d] w-[30px] h-[30px] text-white  flex justify-center items-center p-2 ">
                <FaCamera />
              </div>
            </div>
            <div className="">
              {menu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className=" icon absolute flex flex-col gap-2 bg-[#252728]  justify-center item p-2 rounded-md w-[250px] "
                >
                  <div className="flex  items-center gap-2  cursor-pointer font-bold ">
                    <BsPersonBadge className="text-xl" />
                    <div onClick={handelPecture}>
                      <span>View profile picture</span>
                    </div>
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
                    className="flex cursor-pointer  items-center gap-2 font-bold "
                  >
                    <HiMiniPhoto className="text-xl" />
                    <span>Choosing a profile picture</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            {editeUserName ? (
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
              <h2 className="text-white absolute">{profile?.username}</h2>
            )}
          </div>
        </div>
        <div
          onClick={handelEdite}
          className="text-white flex justify-center items-center gap-2 bg-[#3B3D3E] px-3 py-2 rounded-md cursor-pointer"
        >
          Edite profile
          <span>
            <MdEdit />
          </span>
        </div>
      </div>
      {uploading ? (
        <div className="fixed flex justify-center items-center h-screen inset-0 bg-black/10">
          <div className="">
            <BeatLoader color="#3498db" size={15} />
          </div>
        </div>
      ) : null}
      {profile?.avatar_url && viewPecture && (
        <div
          onClick={() => setviewPecture(false)}
          className="fixed flex justify-center items-center h-screen inset-0 bg-black/50 drop-shadow-2xl"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-5xl flex gap-5 relative"
          >
            <img className="rounded-md" src={profile.avatar_url} alt="" />
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
      <PostsUser />
    </div>
  );
};

export default Profile;
