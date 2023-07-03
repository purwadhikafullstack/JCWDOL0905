import { Bars3CenterLeftIcon, } from "@heroicons/react/24/solid";

export default function TopBar({ showNav, setShowNav }) {
  return (
    <div
      className={`fixed w-full h-16 flex justify-between items-center transition-all duration-[400ms] ${
        showNav ? "pl-56" : ""
      }`}
    >
      <div className="pl-0">
        <Bars3CenterLeftIcon
          className="h-8 w-8 text-white bg-gray-800 cursor-pointer rounded-sm"
          onClick={() => setShowNav(!showNav)}
        />
      </div>
    </div>
  );
}
