import React from "react";
import "../../footer.css";
import { BiLogoFacebookCircle } from "react-icons/bi";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { BiLogoTwitter } from "react-icons/bi";
import { BiLogoPinterest } from "react-icons/bi";
import { MdLocationPin } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import { BsFillClockFill } from "react-icons/bs";
import { FiMail } from "react-icons/fi";
import {SlEnvolopeLetter} from "react-icons/sl"
import {HiPaperAirplane} from "react-icons/hi"

const Footer = () => {
  return (
    <footer className="footer-bg w-full h-[550px] text-white bg-white">
      <div className="h-full relative">
        <div className="flex items-center w-[700px] bg-[#ffbc3e] m-auto rounded-lg p-4">
          <div className="flex flex-1 items-center gap-3">
            <SlEnvolopeLetter className="text-[50px]" />
            <h5 className="w-[200px] font-medium">Subscribe now to get latest update</h5>
          </div>
          <div className="flex-1 flex items-center border-b ">
            <input className="placeholder:text-white w-full " placeholder="Email address" />
            <HiPaperAirplane className="text-[30px]"/>
          </div>
        </div>
        <div className="flex justify-between container py-8 pt-[120px]">
          <div className="footer-list w-36">
            <img src="/images/Logo2.png" alt="" />
            <p className="leading-6">
              Cửa hàng thú cưng hân hạnh được phục vụ bạn
            </p>
            <a
              target="_blank"
              href="https://www.facebook.com/profile.php?id=100028583903010"
            >
              {" "}
              <BiLogoFacebookCircle />{" "}
            </a>
            <a
              target="_blank"
              href="https://www.facebook.com/profile.php?id=100028583903010"
            >
              {" "}
              <BiLogoInstagramAlt />{" "}
            </a>
            <a
              target="_blank"
              href="https://www.facebook.com/profile.php?id=100028583903010"
            >
              {" "}
              <BiLogoTwitter />{" "}
            </a>
            <a
              target="_blank"
              href="https://www.pinterest.com/search/pins/?q=th%C3%BA%20c%C6%B0ng&rs=typed"
            >
              {" "}
              <BiLogoPinterest />{" "}
            </a>
          </div>

          <div className="flex flex-col items-start gap-2">
            <h1 className="font-bold text-2xl text-orange">Links</h1>
            <a target="_blank" href="">
              Pet Services
            </a>
            <a target="_blank" href="">
              About Us
            </a>
            <a target="_blank" href="">
              Pet Boarding
            </a>
            <a target="_blank" href="">
              Latest News
            </a>
            <a target="_blank" href="">
              Contact
            </a>
          </div>

          <div className="">
            <h1 className="font-bold text-2xl text-orange">Gallery</h1>
            <div className="flex w-36 flex-wrap gap-2">
              <img
                src="/images/01.png"
                alt=""
                className="pet-img w-16 h-16"
              ></img>
              <img
                src="/images/02.png"
                alt=""
                className="pet-img w-16 h-16"
              ></img>
              <img
                src="/images/03.png"
                alt=""
                className="pet-img w-16 h-16"
              ></img>
              <img
                src="/images/04.png"
                alt=""
                className="pet-img w-16 h-16"
              ></img>
              <img
                src="/images/05.png"
                alt=""
                className="pet-img w-16 h-16"
              ></img>
              <img
                src="/images/06.png"
                alt=""
                className="pet-img w-16 h-16"
              ></img>
            </div>
          </div>

          <div className="contact-content ">
            <h1 className="font-bold text-2xl text-orange">Contact</h1>
            <div className="contact-info ">
              <p className="flex items-center gap-2 mb-2">
                <a>
                  <MdLocationPin />
                </a>
                79 Nguyễn văn Huyên street,Tuy Hoà city,Phú Yên
              </p>
              <p className="flex items-center gap-2 mb-2">
                <a>
                  <BsFillTelephoneFill />
                </a>
                0123456789
              </p>
              <p className="flex items-center gap-2 mb-2">
                <a>
                  <BsFillClockFill />
                </a>
                Mon - Sun:7AM-7PM
              </p>
              <p className="flex items-center gap-2 mb-2">
                <a>
                  <FiMail />
                </a>
                needhlp@company.com
              </p>
            </div>
          </div>
        </div>
        <p className="copyright text-lg text-center font-bold text-orange">
          {" "}
          @Cửa Hàng Thú Cưng
        </p>
      </div>
    </footer>
  );
};

export default Footer;
