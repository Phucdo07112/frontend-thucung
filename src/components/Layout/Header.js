import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./headercss/header.css";
import { AiOutlineSearch } from "react-icons/ai";
import { AiOutlineShoppingCart,AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { Badge, Image, Popover } from "antd";
import { resetUser } from "../../redux/slides/userSlice";
import { searchProduct } from '../../redux/slides/productSlice';
const Header = ({ isHiddenSearch, isHiddenCart, isHiddenNav }) => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    setLoading(true);
    await UserService.logoutUser();
    dispatch(resetUser());
    localStorage.removeItem("accessToken-dog");
    setLoading(false);
  };

  const content = (
    <div className="w-[200px] flex flex-col gap-2">
      
      <p
        className="bg-gray-800 p-2 rounded-lg cursor-pointer font-semibold text-white"
        onClick={() => handleClickNavigate('profile')}
      >
        Thông tin người dùng
      </p>
      <p
        className="bg-gray-800 p-2 rounded-lg cursor-pointer font-semibold text-white"
        onClick={() => handleClickNavigate(`my-order`)}
      >
        Đơn hàng của tôi
      </p>
      {user?.isAdmin && (
        <p
          className="bg-gray-800 p-2 rounded-lg cursor-pointer font-semibold text-white"
          onClick={() => handleClickNavigate('admin')}
        >
          Quản lí hệ thống
        </p>
      )}
      <p
        className="bg-gray-800 p-2 rounded-lg cursor-pointer font-semibold text-white"
        onClick={() => handleClickNavigate()}
      >
        LogOut
      </p>
    </div>
  );

  const handleClickNavigate = (type) => {
    if(type === 'profile') {
      navigate('/profile')
    }else if(type === 'admin') {
      navigate('/admin/AdminDashboard')
    }else if(type === 'my-order') {
      navigate('/myorder',{ state : {
          id: user?.id,
          token : user?.access_token
        }
      })
    }else {
      handleLogOut()
    }
    setIsOpenPopup(false)
  }
  useEffect(() => {
    setLoading(true);
    setAvatar(user?.avatar);
    setLoading(false);
  }, [user?.avatar]);

  
  const onSearch = (e) => {
    e.preventDefault()
    setSearch(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(searchProduct(search))
    navigate(`/search`)
  }
  return (
    <header>
      <div className="container flex items-center justify-between">
        <Link className="mr-[10px]" to="/">
          <img src="/images/Logo.png" alt="Logo" />
        </Link>

        {!isHiddenNav && (
          <form onSubmit={onSubmit}>
            <div className="flex items-center">
              <input className="w-[400px] h-[46px] text-gray-600 rounded-l-lg bg-[#faf6f1] px-4" placeholder="Tìm kiếm thú cưng" onChange={onSearch}/>
              <button type="submit" className="btn-search-bf cursor-pointer  px-3 py-2 bg-[#ffbc3e] rounded-r-lg relative">
                <AiOutlineSearch style={{ fontSize: "30px" }} />
              </button>
            </div>
          </form>
        )}

        <div className="flex items-center gap-4 border-l-2 pl-7">
          {!isHiddenSearch && (
            <Link to="/heart" className="cursor-pointer">
              <Badge count={user?.heartPet?.length + user?.heartProduct?.length} color="#ffbc3e">
                <AiOutlineHeart style={{ fontSize: "30px" }} />
              </Badge>
            </Link>
          )}
          {!isHiddenCart && (
            <Link to="/order" className="cursor-pointer">
              <Badge count={order?.orderItems?.length + order?.orderPetItems?.length}>
                <AiOutlineShoppingCart
                  style={{
                    fontSize: "30px",
                    marginRight: "8px",
                    marginLeft: "10px",
                  }}
                />
              </Badge>
            </Link>
          )}
          <div className=" flex items-center gap-2">
            {user?.access_token ? (
              <>
                <Popover content={content} trigger="click">
                  <div className="bg-[#FF642F] flex text-white items-center gap-2 rounded-xl p-2 cursor-pointer font-semibold text-sm">
                    <Image
                      src={avatar}
                      style={{
                        height: "40px",
                        width: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      alt="avatar"
                    />
                    {user.name || user.email}
                  </div>
                </Popover>
              </>
            ) : (
              <div id="login">
                <a href="/login">Login</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
