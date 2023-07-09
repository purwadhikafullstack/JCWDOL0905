import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import logo from "../assets/images/logo-brand-groceria.png"
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import default_picture from "../assets/images/default.jpg"

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function DisclosureMenu(props){
    const user = props.data
    const isLogin = props.isLogin
    const dispatch = useDispatch()
    const Navigate = useNavigate()

    function signOut(){
        localStorage.clear();
        dispatch(logout());
        setTimeout(() => {Navigate('/login')}, 1500);
    }

    if(isLogin){
        return(
            <div className="border-t border-gray-700 pt-4 pb-3">
                <div className="flex items-center px-4">
                    <div className="ml-3">
                        <div className="text-sm font-medium text-black-400">{user.name}</div>
                    </div>
                    <button type="button" className="ml-auto flex-shrink-0 rounded-full bg-green-700 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-800">
                        <img className="h-10 w-10 rounded-full" src={user.profile_picture ? user.profile_picture : default_picture} alt="" />
                    </button>
                </div>
                <div className="mt-3 space-y-1 px-2">
                    <Disclosure.Button key={'Cart'} as="a" href={'/cart'} className="block rounded-md py-2 px-4 text-base font-medium text-gray-400 hover:bg-gray-300 hover:text-black">
                        Cart
                    </Disclosure.Button>
                    <Disclosure.Button key={'Profile'} as="a" href={'/profile'} className="block rounded-md py-2 px-4 text-base font-medium text-gray-400 hover:bg-gray-300 hover:text-black">
                        Profile
                    </Disclosure.Button>
                    <Disclosure.Button key={'Order'} as="a" href={'/order-history'} className="block rounded-md py-2 px-4 text-base font-medium text-gray-400 hover:bg-gray-300 hover:text-black">
                        My Order
                    </Disclosure.Button>
                    <Disclosure.Button key={'SignOut'} as="a" onClick={signOut} className="block rounded-md py-2 px-4 text-base font-medium text-gray-400 hover:bg-gray-300 hover:text-black">
                        Sign Out
                    </Disclosure.Button>
                </div>
            </div>
        )
    }
    return (
        <div className="space-y-1 px-2 pt-2 pb-3">
            <Disclosure.Button key={"Login"} as="a" href={'/login'} className={classNames('text-green-700 hover:bg-green-500 hover:text-white', 'block rounded-md py-2 px-3 text-base font-medium')}>
                Login
            </Disclosure.Button>
            <Disclosure.Button key={"Login"} as="a" href={'/register'} className={classNames('text-green-700 hover:bg-green-500 hover:text-white', 'block rounded-md py-2 px-3 text-base font-medium')}>
                Register
            </Disclosure.Button>
        </div>
    )
}

function DesktopMenu(props){
    const user = props.data
    const isLogin = props.isLogin
    const count = props.count
    const dispatch = useDispatch()
    const Navigate = useNavigate()

    function signOut(){
        localStorage.clear();
        dispatch(logout());
        setTimeout(() => {Navigate('/login')}, 1500);
    }

    if(isLogin){
        return (
            <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
                <div class="h-screen flex justify-center items-center mt-2">
                    <div class="relative py-2">
                        <div class="t-0 absolute left-6">
                            <p class="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white">{count}</p>
                        </div>
                        <button type="button" className="flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-green focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-green-800">
                            <a href='/cart'><ShoppingCartIcon color='green' className="h-8 w-8" aria-hidden="true" /></a>
                        </button>
                    </div>
                </div>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-8 flex-shrink-0">
                <div>
                    <Menu.Button className="ml-auto flex rounded-full bg-green-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-800">
                        <img className="h-8 w-8 rounded-full" src={user.profile_picture ? user.profile_picture : default_picture} alt="profile user" />
                    </Menu.Button>
                </div>
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-300 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item key={"Profile"}>
                            {({ active }) => (
                                <a href={'/profile'} className={classNames(active ? 'bg-gray-100' : '', 'block py-2 px-4 text-sm text-gray-700')}>
                                    Profile
                                </a>
                            )}
                        </Menu.Item>
                        <Menu.Item key={"Profile"}>
                            {({ active }) => (
                                <a href={'/order-history'} className={classNames(active ? 'bg-gray-100' : '', 'block py-2 px-4 text-sm text-gray-700')}>
                                    My Order
                                </a>
                            )}
                        </Menu.Item>
                        <Menu.Item key={"SignOut"}>
                            {({ active }) => (
                                <a href={'#'} onClick={signOut} className={classNames(active ? 'bg-gray-100' : '', 'block py-2 px-4 text-sm text-gray-700')}>
                                    Sign Out
                                </a>
                            )}
                        </Menu.Item>
                    </Menu.Items>
                </Transition>
                </Menu>
            </div>
        )
    }
    return (
        <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
            <nav className="hidden lg:flex lg:space-x-8 lg:py-2" aria-label="Global">
                <a key={'Login'} href={'/login'} className={classNames('text-green-700 hover:bg-green-500 hover:text-white', 'rounded-md py-2 px-3 inline-flex items-center text-sm font-medium')}>
                    Login
                </a>
                <a key={'Register'} href={'/register'} className={classNames('text-green-700 hover:bg-green-500 hover:text-white', 'rounded-md py-2 px-3 inline-flex items-center text-sm font-medium')}>
                    Register
                </a>
            </nav>
        </div>
    )
}

export default function NavBar() {
    const [search, setSearch] = useState([]);
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