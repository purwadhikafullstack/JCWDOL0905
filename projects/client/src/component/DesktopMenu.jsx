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

export default function DesktopMenu(props) {
  const user = props.data;
  const isLogin = props.isLogin;
  const count = props.count;
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
      <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
        <div class="h-screen flex justify-center items-center mt-2">
          <div class="relative py-2">
            <div class="t-0 absolute left-6">
              <p class="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white">
                {count}
              </p>
            </div>
            <button
              type="button"
              className="flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-green focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-green-800"
            >
              <a href="/cart">
                <ShoppingCartIcon
                  color="green"
                  className="h-8 w-8"
                  aria-hidden="true"
                />
              </a>
            </button>
          </div>
        </div>

        <Menu as="div" className="relative ml-8 flex-shrink-0">
          <div>
            <Menu.Button className="ml-auto flex rounded-full bg-green-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-800">
              <img
                className="h-8 w-8 rounded-full"
                src={
                  user.profile_picture ? user.profile_picture : default_picture
                }
                alt="profile user"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-300 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item key={"Profile"}>
                {({ active }) => (
                  <a
                    href={"/profile"}
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block py-2 px-4 text-sm text-gray-700"
                    )}
                  >
                    Profile
                  </a>
                )}
              </Menu.Item>
              <Menu.Item key={"Profile"}>
                {({ active }) => (
                  <a
                    href={"/order-history"}
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block py-2 px-4 text-sm text-gray-700"
                    )}
                  >
                    My Order
                  </a>
                )}
              </Menu.Item>
              <Menu.Item key={"SignOut"}>
                {({ active }) => (
                  <a
                    href={"#"}
                    onClick={signOut}
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block py-2 px-4 text-sm text-gray-700"
                    )}
                  >
                    Sign Out
                  </a>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    );
  }
  return (
    <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
      <nav className="hidden lg:flex lg:space-x-8 lg:py-2" aria-label="Global">
        <a
          key={"Login"}
          href={"/login"}
          className={classNames(
            "text-green-700 hover:bg-green-500 hover:text-white",
            "rounded-md py-2 px-3 inline-flex items-center text-sm font-medium"
          )}
        >
          Login
        </a>
        <a
          key={"Register"}
          href={"/register"}
          className={classNames(
            "text-green-700 hover:bg-green-500 hover:text-white",
            "rounded-md py-2 px-3 inline-flex items-center text-sm font-medium"
          )}
        >
          Register
        </a>
      </nav>
    </div>
  );
}
