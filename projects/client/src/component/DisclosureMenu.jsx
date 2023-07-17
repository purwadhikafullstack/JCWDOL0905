import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import logo from "../assets/images/logo-brand-groceria.png";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import default_picture from "../assets/images/default.jpg";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DisclosureMenu(props) {
  const user = props.data;
  const isLogin = props.isLogin;
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  function signOut() {
    localStorage.clear();
    dispatch(logout());
    setTimeout(() => {
      Navigate("/login");
    }, 1500);
  }

  if (isLogin) {
    return (
      <div className="border-t border-gray-700 pt-4 pb-3">
        <div className="flex items-center px-4">
          <div className="ml-3">
            <div className="text-sm font-medium text-black-400">
              {user.name}
            </div>
          </div>
          <button
            type="button"
            className="ml-auto flex-shrink-0 rounded-full bg-green-700 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-800"
          >
            <img
              className="h-10 w-10 rounded-full"
              src={
                user.profile_picture ? user.profile_picture : default_picture
              }
              alt=""
            />
          </button>
        </div>
        <div className="mt-3 space-y-1 px-2">
          <Disclosure.Button
            key={"Cart"}
            as="a"
            href={"/cart"}
            className="block rounded-md py-2 px-4 text-base font-medium text-gray-400 hover:bg-gray-300 hover:text-black"
          >
            Cart
          </Disclosure.Button>
          <Disclosure.Button
            key={"Profile"}
            as="a"
            href={"/profile"}
            className="block rounded-md py-2 px-4 text-base font-medium text-gray-400 hover:bg-gray-300 hover:text-black"
          >
            Profile
          </Disclosure.Button>
          <Disclosure.Button
            key={"Order"}
            as="a"
            href={"/order-history"}
            className="block rounded-md py-2 px-4 text-base font-medium text-gray-400 hover:bg-gray-300 hover:text-black"
          >
            My Order
          </Disclosure.Button>
          <Disclosure.Button
            key={"SignOut"}
            as="a"
            onClick={signOut}
            className="block rounded-md py-2 px-4 text-base font-medium text-gray-400 hover:bg-gray-300 hover:text-black"
          >
            Sign Out
          </Disclosure.Button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-1 px-2 pt-2 pb-3">
      <Disclosure.Button
        key={"Login"}
        as="a"
        href={"/login"}
        className={classNames(
          "text-green-700 hover:bg-green-500 hover:text-white",
          "block rounded-md py-2 px-3 text-base font-medium"
        )}
      >
        Login
      </Disclosure.Button>
      <Disclosure.Button
        key={"Login"}
        as="a"
        href={"/register"}
        className={classNames(
          "text-green-700 hover:bg-green-500 hover:text-white",
          "block rounded-md py-2 px-3 text-base font-medium"
        )}
      >
        Register
      </Disclosure.Button>
    </div>
  );
}
