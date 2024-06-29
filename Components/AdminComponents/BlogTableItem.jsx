import { assets } from "@/assets/assets";
import Image from "next/image";
import React from "react";

const BlogTableItem = ({
  authorImg,
  title,
  author,
  date,
  deleteBlog,
  mongoId,
}) => {
  const BlogDate = new Date(date);

  return (
    <tr className="bg-white border-b">
      <td className="hidden sm:table-cell px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <Image
            src={authorImg ? authorImg : assets.profile_icon}
            alt=""
            width={40}
            height={40}
            className="rounded-full"
          />
          <p>{author ? author : "No Author"}</p>
        </div>
      </td>
      <td className="px-6 py-4">{title ? title : "No Title"}</td>
      <td className="px-6 py-4">{BlogDate.toDateString()}</td>
      <td
        onClick={() => deleteBlog(mongoId)}
        className="px-6 py-4 cursor-pointer"
      >
        X
      </td>
    </tr>
  );
};

export default BlogTableItem;
