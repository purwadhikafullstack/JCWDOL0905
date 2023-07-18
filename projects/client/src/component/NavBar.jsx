import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import logo from "../assets/images/logo-brand-groceria.png"
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import default_picture from "../assets/images/default.jpg"
import DesktopMenu from './DesktopMenu'
import DisclosureMenu from './DisclosureMenu'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function NavBar() {
    const [search, setSearch] = useState("");
    const user = useSelector((state) => state.userSlice);
    const isLogin = localStorage.getItem("token");
    const countItem = useSelector((state) => state.cartSlice.count);

    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        const searchParams = new URLSearchParams({ product_name: search });
        window.location.href = `/product?${searchParams}`;
      }
    };

    return (
        <Disclosure as="header" className="bg-white">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-700 lg:px-8">
                        <div className="relative flex h-16 justify-between">
                            <div className="relative z-10 flex px-2 lg:px-0">
                                <div className="flex flex-shrink-0 items-center">
                                    <a href='/'>
                                        <img
                                            className="block h-8 w-auto"
                                            src={logo}
                                            alt="Groceria"
                                        />
                                    </a>
                                </div>
                            </div>
                            <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
                                <div className="w-full sm:max-w-xs">
                                    <label htmlFor="search" className="sr-only">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <input
                                        id="search"
                                        name="search"
                                        className="block w-full rounded-md border border-transparent bg-white-700 py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-white focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 focus:outline-none focus:ring-white sm:text-sm"
                                        placeholder="Search on Groceria"
                                        type="search"
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        />
                                        
                                    </div>
                                </div>
                            </div>
                            <div className="relative z-10 flex items-center lg:hidden">
                                {/* Mobile menu button */}
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-green-700 hover:bg-green-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <DesktopMenu data={user} isLogin={isLogin} count={countItem}/>
                        </div>
                    </div>

                    <Disclosure.Panel as="nav" className="lg:hidden" aria-label="Global">
                        <DisclosureMenu data={user} isLogin={isLogin}/>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}