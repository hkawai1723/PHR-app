"use client";

import React from "react";
import Link from "next/link";

const DashboardPage = () => {
  return (
    <div className="w-full h-full flex justify-center ">
      <div className="flex flex-col items-center bg-white pt-12 lg:w-[800px]">
        <h1 className="text-4xl text-center">Welcome!</h1>
        <div className="w-3xl mt-12 text-2xl space-y-8 max-w-screen px-10">
          <p>
            With this PHR app, you can record your past medical history, family
            history.
          </p>
          <p>
            I made this app for my job hunting by the way. There was a PHR app
            project that I was originally a part of, but it was cancelled. I had
            implemented the functionality for medical history and family
            history, and I thought it would be a waste to have the code thrown
            away, so I rebuilt it for my job hunting. Please visit my github
            repository to check the code.{" "}
            <Link
              href="https://github.com/hkawai1723/PHR-app"
              className="text-blue-500 hover:underline"
            >
              Github code
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
