import { blog_data } from "@/assets/assets";
import React, { useEffect, useState } from "react";
import BlogItem from "./BlogItem";
import axios from "axios";

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    const response = await axios.get("/api/blog");
    setBlogs(response.data.blogs);
    console.log(response.data.blogs);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <div className="flex justify-center gap-6 my-10">
        <button
          onClick={() => setMenu("All")}
          className={
            menu === "All" ? "bg-black text-white py-1 px-4 rounded-sm" : ""
          }
        >
          All
        </button>
        <button
          onClick={() => setMenu("Front-End")}
          className={
            menu === "Front-End"
              ? "bg-black text-white py-1 px-4 rounded-sm"
              : ""
          }
        >
          Front-End
        </button>
        <button
          onClick={() => setMenu("FullStack")}
          className={
            menu === "FullStack"
              ? "bg-black text-white py-1 px-4 rounded-sm"
              : ""
          }
        >
          FullStack
        </button>
        <button
          onClick={() => setMenu("Python")}
          className={
            menu === "Python" ? "bg-black text-white py-1 px-4 rounded-sm" : ""
          }
        >
          Python
        </button>
      </div>
      <div className="flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24">
        {blogs
          .filter((item) => {
            if (menu === "All") {
              return item;
            } else {
              return item.category === menu;
            }
          })
          .map((item, index) => {
            return (
              <BlogItem
                key={index}
                title={item.title}
                description={item.description}
                category={item.category}
                image={item.image}
                author={item.author}
                author_img={item.author_img}
                date={item.date}
                id={item._id}
              />
            );
          })}
      </div>
    </div>
  );
};

export default BlogList;
