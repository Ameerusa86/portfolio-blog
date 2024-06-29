"use client";

import { assets } from "@/assets/assets";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "All",
    author: "Ameer Hasan",
    authorImg: "/public/author_img.png",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
    console.log(data);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("author", data.author);
    formData.append("authorImg", data.authorImg);
    formData.append("image", image);
    const response = await axios.post("/api/blog", formData);
    if (response.status === 200) {
      toast.success("Blog Added Successfully");
      setImage(false);
      setData({
        title: "",
        description: "",
        category: "All",
        author: "Ameer Hasan",
        authorImg: "/public/author_img.png",
      });
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <form onSubmit={onSubmitHandler} className="pt-5 px-5 sm:pt-12 sm:pl-16">
        <p className="text-xl">Upload Thumbnail</p>
        <label htmlFor="image">
          <Image
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt=""
            width={140}
            height={70}
            className="mt-4"
          />
        </label>
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          id="image"
          hidden
          required
        />
        <p className="text-xl mt-4">Blog Title</p>
        <input
          type="text"
          className="w-full sm:w-[500px] border border-gray-300 rounded-md mt-4 px-4 py-3"
          required
          placeholder="Enter Blog Title"
          name="title"
          onChange={onChangeHandler}
          value={data.title}
        />
        <p className="text-xl mt-4">Blog Description</p>
        <textarea
          type="text"
          className="w-full sm:w-[500px] border border-gray-300 rounded-md mt-4 px-4 py-3"
          required
          placeholder="Write Blog Description"
          rows={6}
          name="description"
          onChange={onChangeHandler}
          value={data.description}
        />
        <p className="text-xl mt-4">Blog Category</p>
        <select
          name="category"
          className="w-40 mt-4 px-4 py-3 border text-gray-500"
          onChange={onChangeHandler}
          value={data.category}
        >
          <option value="Front-End">Front-End</option>
          <option value="FullStack">FullStack</option>
          <option value="Python">Python</option>
        </select>
        <br />
        <button
          className="mt-8 w-40 h-12 bg-black text-white rounded-sm"
          type="submit"
        >
          ADD
        </button>
      </form>
    </>
  );
};

export default Page;
