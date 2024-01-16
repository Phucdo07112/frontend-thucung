import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import jwt_decode from "jwt-decode";
import { updateUser } from "../../redux/slides/userSlice";
import InputForm from "../../components/InputForm/InputForm";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";

const Login = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const { data, isLoading } = mutation;
  console.log('data',data);
  useEffect(() => {
    if (data?.status === "OK") {
      if (location?.state) {
        navigate(location?.state);
      } else {
        navigate("/");
      }
      localStorage.setItem("accessToken-dog", JSON.stringify(data?.access_Token));
      localStorage.setItem('refreshToken-dog', JSON.stringify(data?.refresh_token))
      if (data?.access_Token) {
        const decoded = jwt_decode(data?.access_Token);
        console.log("decoded", decoded);

        if (decoded?.id) {
          handleGetDetailUser(decoded?.id, data?.access_Token);
        }
      }
    }
  }, [data, navigate]);

  const handleGetDetailUser = async (id, access_Token) => {
    const storage = localStorage.getItem('refreshToken-dog')
    const refreshToken = JSON.parse(storage)
    const res = await UserService.getDetailUser(id, access_Token);
    dispatch(updateUser({ ...res?.data, access_Token: access_Token, refreshToken }));
  };

  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleOnchangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    mutation.mutate({
      email,
      password,
    });
    console.log("sign-up", email, password);
  };
  return (
    <div className="login-bg flex items-center justify-center w-full h-screen relative">
      <div className="flex rounded-2xl p-6 ">
        <div className="flex m-auto gap-4 blur-css z-10 rounded-2xl ">
          <div className="flex-1">
            <img
              className="w-[550px] rounded-2xl"
              src="./images/dogvang.jpg"
              alt=""
            />
          </div>
          <form onSubmit={(e) => handleSignIn(e)} className="flex-1">
            <p className="text-end mb-5 p-4">
              Not a member?{" "}
              <a className="text-[#3888F2]" href="/register">
                Register now
              </a>
            </p>
            <div className="flex m-auto flex-col w-[400px]">
              <h3 className="text-2xl font-semibold mb-1">Hello Again!</h3>
              <p className="mb-5">Wellcome back you've been missed!</p>
              <div className="mb-5 flex flex-col gap-3 w-full">
                <InputForm
                  placeholder="Enter Email"
                  value={email}
                  type="email"
                  onChange={(e) => handleOnchangeEmail(e)}
                />
                <div style={{ position: "relative" }}>
                  <span
                    onClick={() => setIsShowPassword(!isShowPassword)}
                    style={{
                      zIndex: 10,
                      position: "absolute",
                      top: "13px",
                      right: "13px",
                      cursor: "pointer"
                    }}
                  >
                    {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                  </span>

                  <InputForm
                    placeholder="Enter Password"
                    value={password}
                    type={isShowPassword ? 'text':'password'}
                    onChange={(e) => handleOnchangePassword(e)}
                  />
                </div>
                {data?.status === "ERR" && (
                  <span style={{ color: "red" }}>{data?.message}</span>
                )}
              </div>
              <p className="text-end text-gray-600">Recovery Password</p>
              <button
                type="submit"
                className="bg-[#FF642F] text-white py-2 text-xl rounded-lg w-full mt-4 font-semibold"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
