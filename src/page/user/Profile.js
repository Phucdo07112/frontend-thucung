import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/userSlice";
import { getBase64 } from "../../utils/jsonString";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import Loading from "../../components/LoadingComponent/Loading";
import InputForm from "../../components/InputForm/InputForm";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Image, Upload } from "antd";
const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const mutation = useMutationHooks((data) => {
    const { id, access_Token, ...rests } = data;
    return UserService.updateUser(id, access_Token, rests);
  });
  const { data, isLoading, isSuccess, isError } = mutation;
  console.log("mutation", mutation);
  useEffect(() => {
    setName(user?.name);
    setEmail(user?.email);
    setPhone(user?.phone);
    setAddress(user?.address);
    setAvatar(user?.avatar);
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      message.success("ok");
      handleGetDetailUser(user?.id, user?.access_token);
    } else if (isError) {
      message.error("cc");
    }
  }, [isSuccess, isError]);

  const handleGetDetailUser = async (id, access_Token) => {
    const res = await UserService.getDetailUser(id, access_Token);
    dispatch(updateUser({ ...res?.data, access_Token: access_Token }));
  };

  const handleOnchangeName = (e) => {
    setName(e.target.value);
  };
  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleOnchangePhone = (e) => {
    setPhone(e.target.value);
  };
  const handleOnchangeAddress = (e) => {
    setAddress(e.target.value);
  };
  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file?.preview);
    console.log(file);
  };

  const handleUpdate = () => {
    mutation.mutate({
      id: user.id,
      email,
      name,
      phone,
      address,
      avatar,
      access_Token: user.access_token,
    });
  };
  return (
    <div className="container pt-2">
      <div className="bg-white p-6 my-4 rounded-2xl max-w-[700px] mx-auto border-2">
        <div className="bg-[#FF642F] w-[280px] flex items-center justify-center p-2 rounded-lg mb-4">
          <p className="text-lg font-bold ">Thông tin người dùng</p>
        </div>
        <Loading isLoading={isLoading}>
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col gap-2">
              <label className="font-semibold " htmlFor="Avatar">
                Avatar
              </label>
              {avatar && (
                <Image
                  src={avatar}
                  className="mx-auto"
                  style={{
                    height: "100px",
                    width: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  alt="avatar"
                />
              )}
              <div className="flex items-center justify-between w-[400px]">
                <Upload onChange={handleOnchangeAvatar} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </div>
              {/* <InputForm
                      style={{ width: '300px',marginBottom: "10px" }}
                      id='Avatar'
                      value={avatar}
                      onChange={(e) => handleOnchangeAvatar(e)}
                  /> */}
              {/* <ButtonComponent
                onClick={handleUpdate}
                size={40}
                className="bg-yellow-300 text-white font-semibold"
                textButton={"Cập nhật"}
                classNameText=""
              ></ButtonComponent> */}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold " htmlFor="name">
                Name
              </label>
              <div className="flex items-center gap-2">
                <InputForm
                  style={{ width: "400px" }}
                  id="name"
                  value={name}
                  onChange={(e) => handleOnchangeName(e)}
                />
                {/* <ButtonComponent
                  onClick={handleUpdate}
                  size={40}
                  className="bg-yellow-300 h-10 text-white font-semibold"
                  textButton={"Cập nhật"}
                  classNameText=""
                ></ButtonComponent> */}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold " htmlFor="email">
                Email
              </label>
              <div className="flex items-center gap-2">
                <InputForm
                  style={{ width: "400px" }}
                  id="email"
                  placeholder="abc@gmail.com"
                  type="email"
                  value={email}
                  onChange={(e) => handleOnchangeEmail(e)}
                />
                {/* <ButtonComponent
                  onClick={handleUpdate}
                  size={40}
                  className="bg-yellow-300 h-10 text-white font-semibold"
                  textButton={"Cập nhật"}
                  classNameText=""
                ></ButtonComponent> */}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold " htmlFor="Phone">
                Phone
              </label>
              <div className="flex items-center gap-2">
                <InputForm
                  style={{ width: "400px" }}
                  id="Phone"
                  value={phone}
                  onChange={(e) => handleOnchangePhone(e)}
                />
                {/* <ButtonComponent
                  onClick={handleUpdate}
                  size={40}
                  className="bg-yellow-300 h-10 text-white font-semibold"
                  textButton={"Cập nhật"}
                  classNameText=""
                ></ButtonComponent> */}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold " htmlFor="Address">
                Address
              </label>
              <div className="flex flex-col items-center gap-2">
                <InputForm
                  style={{ width: "400px" }}
                  id="Address"
                  value={address}
                  onChange={(e) => handleOnchangeAddress(e)}
                />
                <ButtonComponent
                  onClick={handleUpdate}
                  size={40}
                  className="bg-yellow-300 h-10 text-white font-semibold w-full mt-5"
                  textButton={"Cập nhật"}
                  classNameText=""
                ></ButtonComponent>
              </div>
            </div>
          </div>
        </Loading>
      </div>
    </div>
  );
};

export default Profile;
