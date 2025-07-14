import React from "react";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
} from "@ui/card";
import { Separator } from "@ui/separator";
import { LoginForm } from "./login-form";

export const LoginScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen ">
      <Card className="w-[600px] p-12">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold ">Welcom!</CardTitle>
          <CardDescription className="text-lg">
            You can login with your google account!
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};
