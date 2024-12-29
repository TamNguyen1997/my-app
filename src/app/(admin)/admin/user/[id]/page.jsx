"use client";

import { USER_MESSAGE } from "@/constants/message";
import { Button, Input, Switch } from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

const UserDetail = () => {
  const params = useParams();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      newPassword: "",
      confirmNewPassword: "",
      email: "",
      name: "",
      active: false,
    },
  });

  const fetchUserData = async () => {
    if (params.id) {
      try {
        const res = await fetch(params.id && `/api/users/${params.id}`);
        console.log(res);
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const result = await res.json();
        console.log(result);
        const { username, email, name, active } = result;
        reset({
          username,
          email,
          name,
          active: active === true,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [params.id, reset]);

  const onSubmit = async (data) => {
    toast.info(USER_MESSAGE.USER_UPDATE_IN_PROGRESS);

    const {
      username,
      email,
      name,
      active,
      password,
      newPassword,
      confirmNewPassword,
    } = data;

    if (isChangingPassword) {
      if (newPassword !== confirmNewPassword) {
        toast.error(USER_MESSAGE.PASSWORD_MISMATCH);
        return;
      }
    }

    const payload = {
      username,
      email,
      name,
      active,
      ...(isChangingPassword && { password, newPassword }),
    };

    try {
      const res = await fetch(`/api/users/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (res.ok) {
        if (isChangingPassword) {
          toast.success(result.message || USER_MESSAGE.PASSWORD_CHANGE_SUCCESS);
        } else {
          toast.success(result.message || USER_MESSAGE.UPDATE_SUCCESS);
        }
        setTimeout(() => router.back(), 3000);
      } else {
        toast.error(result.message || USER_MESSAGE.UPDATE_FAILED);
      }

      reset();
    } catch (error) {
      toast.error(USER_MESSAGE.UPDATE_FAILED);
      console.error(USER_MESSAGE.UPDATE_FAILED, error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex justify-center items-center flex-col mt-20">
        <h1 className="uppercase mb-4 text-[20px] font-bold">user profile</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[500px]"
        >
          <div>
            <div className="mt-2">
              <Input
                label="Username"
                placeholder="Enter your username"
                variant="bordered"
                disabled
                value={watch("username")}
                className="opacity-50"
              />
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
            </div>
            <div className="mt-2">
              <Input
                label="Email"
                placeholder="Enter your email"
                type="email"
                variant="bordered"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                    message: "Invalid email address",
                  },
                })}
                status={errors.email ? "error" : "default"}
                value={watch("email")}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="mt-2">
              <Input
                label="Name"
                placeholder="Enter your name"
                variant="bordered"
                {...register("name", { required: "Name is required" })}
                status={errors.name ? "error" : "default"}
                value={watch("name")}
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 mt-2">
              <label className="ml-2">Active</label>
              <Switch
                isSelected={watch("active")}
                onValueChange={(isChecked) => {
                  setValue("active", isChecked);
                }}
                color="success"
              />
            </div>
          </div>

          <div>
            <Button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="mt-4"
              color="warning"
            >
              {isChangingPassword
                ? "Cancel Change Password"
                : "Change Password"}
            </Button>
            {isChangingPassword && (
              <div>
                <div className="mt-2">
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    variant="bordered"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    status={errors.password ? "error" : "default"}
                  />
                  {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="mt-2">
                  <Input
                    label="New Password"
                    placeholder="Enter your new password"
                    type="password"
                    variant="bordered"
                    {...register("newPassword", {
                      required: "Please enter your new password",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    status={errors.newPassword ? "error" : "default"}
                  />
                  {errors.newPassword && (
                    <p className="text-red-500">{errors.newPassword.message}</p>
                  )}
                </div>

                <div className="mt-2">
                  <Input
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    type="password"
                    variant="bordered"
                    {...register("confirmNewPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watch("newPassword") ||
                        "Passwords do not match",
                    })}
                    status={errors.confirmNewPassword ? "error" : "default"}
                  />
                  {errors.confirmNewPassword && (
                    <p className="text-red-500">
                      {errors.confirmNewPassword.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <Button color="success" type="submit" className="mt-4">
            Update User
          </Button>
        </form>
      </div>
    </>
  );
};

export default UserDetail;
