import connectDB from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import { writeFile, unlink } from "fs/promises";

const fs = require("fs");

const { NextResponse } = require("next/server");

const LoadDB = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

LoadDB();

// GET method to fetch all blogs
// API endpoint: /api/blog
export async function GET(request) {
  const blogId = request.nextUrl.searchParams.get("id");
  if (blogId) {
    const blog = await BlogModel.findById(blogId);
    if (blog) {
      blog.authorImg = `/public/${blog.authorImg}`; // Adjust path if necessary
    }
    return NextResponse.json(blog);
  } else {
    const blogs = await BlogModel.find({}).sort({ date: -1 });
    return NextResponse.json({ blogs });
  }
}

// POST method to create a new blog
// This method will be called when the form is submitted
// API endpoint: /api/blog
export async function POST(request) {
  let imagePath = "";
  try {
    const formData = await request.formData();

    // Extract form data
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const author = formData.get("author");
    const authorImg = formData.get("authorImg");

    // Validate required fields
    if (!title || !description || !category || !author || !authorImg) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const timestamp = Date.now();

    // Handling image upload
    const image = formData.get("image");
    if (!image) {
      return NextResponse.json({
        success: false,
        message: "No image uploaded",
      });
    }

    const imageByData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByData);
    imagePath = `./public/${timestamp}_${image.name}`;
    await writeFile(imagePath, buffer);
    const imgUrl = `/${timestamp}_${image.name}`;
    console.log(`Image uploaded: ${imgUrl}`);

    // Check for duplicate blog
    const existingBlog = await BlogModel.findOne({ title });
    if (existingBlog) {
      // Delete the uploaded image if the blog is a duplicate
      await unlink(imagePath);
      console.log(`Image deleted due to duplicate blog title: ${imagePath}`);
      return NextResponse.json({
        success: false,
        message: "A blog with this title already exists",
      });
    }

    // Creating blog data object
    const blogData = {
      title,
      description,
      category,
      author,
      authorImg,
      image: imgUrl,
      date: new Date(),
    };

    // Save to database
    await BlogModel.create(blogData);

    console.log("Blog created:", blogData);

    return NextResponse.json({
      success: true,
      message: "Blog created",
      data: blogData,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);

    // If image was uploaded but blog creation failed, delete the uploaded image
    if (imagePath) {
      try {
        await unlink(imagePath);
        console.log(`Image deleted due to blog creation failure: ${imagePath}`);
      } catch (unlinkError) {
        console.error(`Error deleting image: ${unlinkError.message}`);
      }
    }

    return NextResponse.json({ success: false, message: error.message });
  }
}

// PUT method to update a blog
// API endpoint: /api/blog/:id
export async function PUT(request) {
  const { id } = request.params;
  const formData = await request.formData();
  const blogData = {
    title: `${formData.get("title")}`,
    description: `${formData.get("description")}`,
    category: `${formData.get("category")}`,
    author: `${formData.get("author")}`,
    authorImg: `${formData.get("authorImg")}`,
    date: new Date(),
  };

  // Update the blog in the database
  await BlogModel.findByIdAndUpdate(id, blogData);

  return NextResponse.json({ success: true, message: "Blog updated" });
}

// DELETE method to delete a blog
// API endpoint: /api/blog/:id
export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");

  // Delete the blog from the database
  const blog = await BlogModel.findById(id);
  fs.unlink(`./public/${blog.image}`, () => {});

  await BlogModel.findByIdAndDelete(id);

  return NextResponse.json({ success: true, message: "Blog deleted" });
}
