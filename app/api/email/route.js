import connectDB from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";
import { NextResponse } from "next/server";

// Add New Email
export async function POST(request) {
  let imagePath = "";
  try {
    const formData = await request.formData();

    // Extract form data
    const email = formData.get("email");

    // Validate required fields
    if (!email) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check for duplicate email
    const existingEmail = await EmailModel.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({
        success: false,
        message: "Email already exists",
      });
    }

    // Creating email data object
    const emailData = {
      email,
      date: new Date(),
    };

    // Save email to database
    await EmailModel.create(emailData);

    return NextResponse.json({
      success: true,
      message: "Email added successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Get All Emails
export async function GET(request) {
  try {
    const emails = await EmailModel.find({}).sort({ date: -1 }).lean();
    return NextResponse.json({
      success: true,
      emails,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Delete Email
export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const email = await EmailModel({ _id: id });
    if (!email) {
      return NextResponse.json({
        success: false,
        message: "Email not found",
      });
    }
    await EmailModel.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      message: "Email deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
