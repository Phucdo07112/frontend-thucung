import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import HomePage from "./page/HomePage";
import Cart from "./page/cart";
import Login from "./page/auth/Login";
import { routes } from "./routes";
import DefaultComponent from "./components/Layout/Default";
import Layout from "./components/Layout/Layout";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { isJsonString } from "./utils/jsonString";
import { resetUser, updateUser } from "./redux/slides/userSlice";
import * as UserService from "./services/UserService";
import jwt_decode from "jwt-decode";
import Loading from "./components/LoadingComponent/Loading";
function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const fetchApi = async () => {
  //   const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL_BACKEND}/product/get-all`)
  //   return res.data
  // }
  // const query = useQuery({ queryKey: ['todos'], queryFn: fetchApi })
  // console.log(query);

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailUser(decoded?.id, storageData);
    }
    setLoading(false);
  }, []);

  const handleDecoded = () => {
    let storageData = localStorage.getItem("accessToken-dog");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwt_decode(storageData);
    }
    return { storageData, decoded };
  };

  // Add a request interceptor
  // Dùng để kiểm tra access_Token hết hạn để trả về access_Token mới
  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      // trước khi call chạy cái này
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      let storageRefreshToken = localStorage.getItem('refreshToken-dog')
      const refreshToken = JSON.parse(storageRefreshToken)
      const decodedRefreshToken =  jwt_decode(refreshToken)
      if (decoded?.exp < currentTime.getTime() / 1000) {
        if(decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
          const data = await UserService.refreshToken(refreshToken)
          // localStorage.setItem("accessToken-dog", JSON.stringify(data?.access_token));
          console.log('data?.access_token',data?.access_token);
          config.headers['token'] = `Bearer ${data?.access_token}`
        }else {
          dispatch(resetUser())
        }
      }
      // Do something before request is sent
      console.log("config", config);
      return config;
    },
    (error) => {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  const handleGetDetailUser = async (id, access_Token) => {
    let storageRefreshToken = localStorage.getItem('refreshToken-dog')
    const refreshToken = JSON.parse(storageRefreshToken)
    const res = await UserService.getDetailUser(id, access_Token);
    console.log('res',res);
    dispatch(updateUser({ ...res?.data, access_Token: access_Token,refreshToken: refreshToken }));
  };
  return (
    // <h1>cc</h1>

    <Routes>
      {routes.map((route) => {
        const Page = route.page;
        const Layouts = route.isShowHeader ? Layout : DefaultComponent;
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Layouts>
                <Loading isLoading={loading}>
                  <Page />
                </Loading>
              </Layouts>
            }
          />
        );
      })}
      {/* <Route path="/" element={<HomePage />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} /> */}
      {/* //     <Route path="/" element={<HomePage />} />
    //     <Route path="/product/:slug" element={<ProductDetails />} />
    //     <Route path="/categories" element={<Categories />} />
    //     <Route path="/cart" element={<CartPage />} />
    //     <Route path="/category/:slug" element={<CategoryProduct />} />
    //     <Route path="/search" element={<Search />} />
    //     <Route path="/dashboard" element={<PrivateRoute />}>
    //       <Route path="user" element={<Dashboard />} />
    //       <Route path="user/orders" element={<Orders />} />
    //       <Route path="user/profile" element={<Profile />} />
    //     </Route>
    //     <Route path="/dashboard" element={<AdminRoute />}>
    //       <Route path="admin" element={<AdminDashboard />} />
    //       <Route path="admin/create-category" element={<CreateCategory />} />
    //       <Route path="admin/create-product" element={<CreateProduct />} />
    //       <Route path="admin/product/:slug" element={<UpdateProduct />} />
    //       <Route path="admin/products" element={<Products />} />
    //       <Route path="admin/users" element={<Users />} />
    //       <Route path="admin/orders" element={<AdminOrders />} />
    //     </Route>
    //     <Route path="/register" element={<Register />} />
    //     <Route path="/forgot-password" element={<ForgotPasssword />} />
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/about" element={<About />} />
    //     <Route path="/contact" element={<Contact />} />
    //     <Route path="/policy" element={<Policy />} />
    //     <Route path="*" element={<Pagenotfound />} /> */}
    </Routes>
  );
}

export default App;
