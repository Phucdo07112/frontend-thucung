import React, { useEffect, useState } from "react";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as useService from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import * as message from "../../components/Message/Message";
import InputForm from "../../components/InputForm/InputForm";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
const Register = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowComfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const mutation = useMutationHooks((data) => useService.signUpUser(data));

  const { data, isLoading, isSuccess, isError } = mutation;

  useEffect(() => {
    if (data?.status === "OK") {
      message.success();
      navigate("/login");
    } else if (data?.status === "ERR") {
      message.error();
    }
  }, [data, navigate]);

  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleOnchangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleOnchangeconfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    mutation.mutate({
      email,
      password,
      confirmPassword,
    });
    console.log("sign-up", email, password, confirmPassword);
  };
  return (
    <div className="login-bg flex items-center justify-center w-full h-screen relative">
      <div className="flex rounded-2xl p-6 ">
        <div className="flex m-auto gap-4 blur-css z-10 rounded-2xl ">
          <div className="flex-1">
            <img
              className="w-[550px] rounded-2xl"
              src="./images/dogden.jpg"
              alt=""
            />
          </div>
          <form onSubmit={(e) => handleSignUp(e)} className="flex-1">
            <p className="text-end mb-5 p-4">
              Are you member?{" "}
              <a className="text-[#3888F2]" href="/login">
                Login Now
              </a>
            </p>
            <div className="flex m-auto flex-col w-[400px]">
              <h3 className="text-2xl font-semibold mb-1">Create Account!</h3>
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
                      cursor: "pointer",
                    }}
                  >
                    {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                  </span>

                  <InputForm
                    placeholder="Password"
                    type={isShowPassword ? "text" : "password"}
                    value={password}
                    onChange={handleOnchangePassword}
                  />
                </div>

                <div style={{ position: "relative" }}>
                  <span
                    onClick={() => setIsShowComfirmPassword(!isShowConfirmPassword)}
                    style={{
                      zIndex: 10,
                      position: "absolute",
                      top: "13px",
                      right: "13px",
                      cursor: "pointer",
                    }}
                  >
                    {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                  </span>

                  <InputForm
                    placeholder="Comfirm Password"
                    type={isShowConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleOnchangeconfirmPassword}
                  />
                </div>
              </div>
              <p className="text-end text-gray-600">Recovery Password</p>
              <button
                type="submit"
                className="bg-[#FF642F] text-white py-2 text-xl rounded-lg w-full mt-4 font-semibold"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
