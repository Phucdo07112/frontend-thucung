import React from "react";
import { AiOutlineDownload } from "react-icons/ai";
const TopAdmin = ({
  iconTitle,
  title,
  iconAdd,
  AddTitle,
  onClickEx,
  IsShowModal = null,
  isDownLoad= true
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-5">
        {iconTitle}
        <p className="text-lg font-medium">{title}</p>
      </div>
      <div className="flex items-center gap-4 ">
        {isDownLoad && (
          <div
            onClick={onClickEx}
            className="flex items-center gap-2 border-2 px-5 py-3 border-gray-600 rounded-lg cursor-pointer hover:bg-gray-500 hover:text-white"
          >
            <p>Download</p>
            <AiOutlineDownload size={18} />
          </div>
        )}
        {iconAdd && (
          <div
            className="flex items-center gap-2 text-sky-600 border-2  px-5 py-3 border-sky-600 rounded-lg cursor-pointer hover:bg-sky-500 hover:text-white"
            onClick={() => IsShowModal(true)}
          >
            <p>{AddTitle}</p>
            {iconAdd}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopAdmin;
