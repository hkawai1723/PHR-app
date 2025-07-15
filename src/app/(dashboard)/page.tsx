"use client";

import React from "react";
import Link from "next/link";

const DashboardPage = () => {
  return (
    <div className="w-full h-full flex justify-center ">
      <div className="flex flex-col items-center bg-white min-w-[1200px]  pt-12">
        <h1 className="text-4xl text-center">Welcome!</h1>
        <div className="w-3xl mt-12 text-2xl space-y-8">
          <p>
            With this PHR app, you can record your past medical history, family
            history, medication and more.
          </p>
          <p>
            I made this app for my job hunting by the way. There was a PHR app
            project that I was originally a part of, but it was cancelled. I had
            implemented the functionality for medical history and family
            history, and I thought it would be a waste to have the code thrown
            away, so I rebuilt it for my job hunting. Please visit my github repository to check the code. <Link href="">Github code</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
