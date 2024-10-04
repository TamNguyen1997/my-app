"use client";

import { Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { LOGIN_MESSAGE } from "@/constants/message";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    toast.info(LOGIN_MESSAGE.LOGIN_IN_PROGRESS);

    try {
      const res = await fetch(`/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || LOGIN_MESSAGE.LOGIN_SUCCESS);
        setTimeout(() => router.push("/admin"));
      } else {
        toast.error(result.message || LOGIN_MESSAGE.LOGIN_FAILED);
      }
    } catch (error) {
      toast.error(LOGIN_MESSAGE.LOGIN_FAILED);
      console.error(error);
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Đăng nhập
              </h1>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 md:space-y-6"
                action="#"
              >
                <div>
                  <Input
                    label="Username"
                    aria-label="Username"
                    placeholder=" "
                    {...register("username", {
                      required: "Username is required",
                    })}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    label="Mật khẩu"
                    aria-label="Mật khẩu"
                    placeholder="••••••••"
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <a
                    href="#"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Đăng nhập
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
