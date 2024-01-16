import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getItem } from "../../utils/jsonString";
import {
  UserOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import * as UserService from "../../services/UserService";
import { useQueries } from "@tanstack/react-query";
import AdminUser from "../../components/AdminUser/AdminUser";
import { Menu } from "antd";
import Header from "../../components/Layout/Header";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import AdminCategory from "../../components/AdminCategory/AdminCategory";
import { MdOutlineCategory } from "react-icons/md";
import AdminPet from "../../components/AdminPet/AdminPet";
import {MdPets} from "react-icons/md"
import AdminOrder from "../../components/AdminOrder/AdminOrder";
import AdminDashboards from "../../components/AdminDashboard/AdminDashboard";
import {RiDashboard3Line} from "react-icons/ri"
import Layout from "../../components/Layout/Layout";
const AdminDashboard = () => {
  const user = useSelector((state) => state?.user);

  const items = [
    getItem("Thống kê", "dashboard", <RiDashboard3Line />),
    getItem("Người dùng", "users", <UserOutlined />),
    getItem("Danh mục", "categories", <MdOutlineCategory />),
    getItem("Sản phẩm", "products", <AppstoreOutlined />),
    getItem("Thú Cưng", "pets", <MdPets />),
    getItem("Đơn hàng", "orders", <ShoppingCartOutlined />),
  ];

  const [keySelected, setKeySelected] = useState("dashboard");
  // const getAllOrder = async () => {
  //   const res = await OrderService.getAllOrder(user?.access_token)
  //   return {data: res?.data, key: 'orders'}
  // }

  // const getAllProducts = async () => {
  //   const res = await ProductService.getAllProduct()
  //   console.log('res1', res)
  //   return {data: res?.data, key: 'products'}
  // }

  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token);
    console.log("res", res);
    return { data: res?.data, key: "users" };
  };

  const queries = useQueries({
    queries: [
      // {queryKey: ['products'], queryFn: getAllProducts, staleTime: 1000 * 60},
      { queryKey: ["users"], queryFn: getAllUsers, staleTime: 1000 * 60 },
      // {queryKey: ['orders'], queryFn: getAllOrder, staleTime: 1000 * 60},
    ],
  });
  const memoCount = useMemo(() => {
    const result = {};
    try {
      if (queries) {
        queries.forEach((query) => {
          result[query?.data?.key] = query?.data?.data?.length;
        });
      }
      return result;
    } catch (error) {
      return result;
    }
  }, [queries]);
  const COLORS = {
    users: ["#e66465", "#9198e5"],
    products: ["#a8c0ff", "#3f2b96"],
    orders: ["#11998e", "#38ef7d"],
  };

  const renderPage = (key) => {
    switch (key) {
      case "dashboard":
        return <AdminDashboards />;
      case "users":
        return <AdminUser />;
      case "products":
        return <AdminProduct />;
      case "pets":
        return <AdminPet />;
      case "categories":
        return <AdminCategory />;
      case 'orders':
        return (
          <AdminOrder />
        )
      default:
        return <></>;
    }
  };

  const handleOnClick = ({ key }) => {
    setKeySelected(key);
  };

  return (
    <>
      {user?.isAdmin ? (
        <div className="mt-24">
          <Header isHiddenSearch isHiddenCart isHiddenNav />
          <div className="mt-[100px]" style={{ display: "flex" }}>
            <Menu
              mode="inline"
              // openKeys={openKeys}
              // onOpenChange={onOpenChange}
              style={{
                width: 256,
                boxShadow: "1px 1px 2px #ccc",
                height: "100vh",
              }}
              className="fixed top-[95px] bottom-0"
              items={items}
              onClick={handleOnClick}
            />
            <div className="container" style={{ flex: "1", marginLeft:"270px" }}>
              {renderPage(keySelected)}
            </div>
          </div>
        </div>
      ) : (
        <Layout>
          <NotFoundPage />
        </Layout>
      )}
    </>
  );
};

export default AdminDashboard;
