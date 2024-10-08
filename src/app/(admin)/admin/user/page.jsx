"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import {
  LockIcon,
  Mail,
  Pen,
  Plus,
  Settings,
  UserCircle2,
  UserSquare2Icon,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { USER_MESSAGE } from "@/constants/message";

const User = () => {
  const [limit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingState, setLoadingState] = useState("loading");
  const [idUser, setIdUser] = useState();
  const [users, setUsers] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const modelDel = useDisclosure();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      name: "",
    },
  });

  const password = watch("password");

  const fetchUsers = async () => {
    setLoadingState("loading");
    try {
      const res = await fetch(`/api/users?page=${page}&limit=${limit}`, {
        method: "GET",
      });

      const result = await res.json();

      setTotalPages(result.totalPages);
      setUsers(result.data);
      result.currentPage !== page && setPage(result.currentPage);

      setLoadingState("idle");
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data) => {
    toast.info(USER_MESSAGE.USER_CREATE_IN_PROGRESS);
    const { confirmPassword, ...dataSubmit } = data;

    try {
      const res = await fetch(`/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataSubmit),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(result.message || USER_MESSAGE.CREATE_SUCCESS);
        fetchUsers();
        reset();
        onOpenChange(false);
      } else {
        toast.error(result.message || USER_MESSAGE.CREATE_FAILED);
      }
    } catch (error) {
      toast.error(USER_MESSAGE.CREATE_FAILED);
      console.error(error);
    }
  };

  const handleDelete = async () => {
    toast.info(USER_MESSAGE.USER_DELETE_IN_PROGRESS);
    try {
      modelDel.onOpenChange(false);
      const res = await fetch(`/api/users/${idUser}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || USER_MESSAGE.DELETE_SUCCESS);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== idUser));
      } else {
        toast.error(result.message || USER_MESSAGE.DELETE_FAILED);
      }
    } catch (error) {
      toast.error(USER_MESSAGE.DELETE_FAILED);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();

    return () => {};
  }, [page]);

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col gap-2 border-r min-h-full p-2 pt-40">
        <h1 className="uppercase mb-4 text-[20px] font-bold">user list</h1>
        <Button
          color="success"
          onPress={onOpen}
          className="w-max p-0 aspect-square min-w-10"
        >
          <Plus fill="#FFFFFF" strokeWidth={6} className="text-white w-3 h-3" />
        </Button>
        <Table
          aria-label="Danh sách người dùng"
          loadingState={loadingState}
          bottomContent={
            loadingState === "loading" ? null : (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  page={page}
                  total={totalPages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            )
          }
        >
          <TableHeader>
            {[
              { key: "username", title: "Username" },
              { key: "email", title: "Email" },
              { key: "name", title: "Name" },
              { key: "active", title: "Active" },
              {
                key: "edit",
                title: <Settings />,
              },
            ].map((el) => (
              <TableColumn
                key={el.key}
                textValue={el.title}
                aria-label={el.title}
                className="text-center first:text-start last:justify-end last:flex last:items-center"
              >
                {el.title}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody
            items={users}
            emptyContent={"No users"}
            isLoading={loadingState === "loading"}
            loadingContent={<Spinner label="Loading..." />}
          >
            {(item) => (
              <TableRow key={item.id}>
                <TableCell className="text-center first:text-start last:text-end">
                  {item.username}
                </TableCell>
                <TableCell className="text-center first:text-start last:text-end">
                  {item.email}
                </TableCell>
                <TableCell className="text-center first:text-start last:text-end">
                  {item.name}
                </TableCell>
                <TableCell className="text-center first:text-start last:text-end">
                  {item.active ? (
                    <span className="text-green-500">ACTIVE</span>
                  ) : (
                    <span className="text-red-500">INACTIVE</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Button
                      color="primary"
                      className="p-0 aspect-square min-w-10"
                      onClick={() => router.push(`/admin/user/${item.id}`)}
                    >
                      <Pen fill="#FFFFFF" className="text-white w-3 h-3" />
                    </Button>
                    <Button
                      color="danger"
                      className=" p-0 aspect-square min-w-10"
                      onPress={() => {
                        setIdUser(item.id);
                        modelDel.onOpen();
                      }}
                    >
                      <X
                        fill="#FFFFFF"
                        strokeWidth={6}
                        className="text-white w-3 h-3"
                      />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                Create user
              </ModalHeader>
              <ModalBody>
                <Input
                  endContent={
                    <UserCircle2 className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Username"
                  placeholder="Enter your username"
                  variant="bordered"
                  {...register("username", {
                    required: "Username is required",
                    pattern: {
                      value: /^[a-zA-Z0-9]{4,12}$/,
                      message:
                        "Username must be 4-12 characters long, alphanumeric only",
                    },
                  })}
                  status={errors.username ? "error" : "default"}
                />
                {errors.username && (
                  <p className="text-red-500">{errors.username.message}</p>
                )}

                <Input
                  endContent={
                    <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
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

                <Input
                  endContent={
                    <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  type="password"
                  variant="bordered"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  status={errors.confirmPassword ? "error" : "default"}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}

                <Input
                  endContent={
                    <Mail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
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
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}

                <Input
                  endContent={
                    <UserSquare2Icon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Name"
                  placeholder="Enter your name"
                  variant="bordered"
                  {...register("name", { required: "Name is required" })}
                  status={errors.name ? "error" : "default"}
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="success" type="submit">
                  Create
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={modelDel.isOpen} onOpenChange={modelDel.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you absolutely sure?
              </ModalHeader>
              <ModalBody>
                <p>
                  This action cannot be undone. This will permanently delete
                  user and delete your data from our servers.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={modelDel.onClose}
                >
                  Close
                </Button>
                <Button color="primary" onPress={handleDelete}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default User;
