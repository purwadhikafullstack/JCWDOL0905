import {
    Bars3Icon,
    EnvelopeIcon,
    PhoneIcon,
    DocumentDuplicateIcon,
    XMarkIcon,
    PencilSquareIcon,
    PencilIcon
} from "@heroicons/react/24/outline";
import default_picture from "../assets/images/default.jpg"

export default function ProfileInformation(props) {
    let profiles = props.profiles
    return (
        <>
            <div className="py-10 px-6 sm:px-10 lg:col-span-1 xl:p-12">
                <div class="flex items-center">
                    <div class="items-center text-lg font-medium text-warm-gray-900">
                        Profile
                    </div>
                    <a href="/edit-profile">
                        <div class="ml-3 items-center">
                        <PencilSquareIcon className="h-5 w-5 fill-white" aria-hidden="true"/>
                        </div>
                    </a>
                </div>
                <form
                action="#"
                method="POST"
                className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
                >
                <div className="sm:col-span-2">
                    <label
                    htmlFor="profile-picture"
                    className="block text-sm font-medium text-warm-gray-900"
                    >
                    Profile Picture
                    </label>
                    <div className="mt-1">
                        <img src={profiles.profile_picture ? profiles.profile_picture : default_picture} className="rounded-full h-20 w-20"></img>
                    </div>
                </div>
                <div className="sm:col-span-2">
                    <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-warm-gray-900"
                    >
                    Name
                    </label>
                    <div className="mt-1">
                    <input
                        type="text"
                        name="name"
                        id="name"
                        defaultValue={profiles.name}
                        className="block w-full rounded-md border-warm-gray-300 py-3 px-4 text-warm-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                        readOnly
                    />
                    </div>
                </div>
                <div className="sm:col-span-2">
                    <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-warm-gray-900"
                    >
                    Email
                    </label>
                    <div className="mt-1">
                    <input
                        type="text"
                        name="email"
                        id="email"
                        defaultValue={profiles.email}
                        className="block w-full rounded-md border-warm-gray-300 py-3 px-4 text-warm-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                        readOnly
                    />
                    </div>
                </div>
                <div>
                    <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-warm-gray-900"
                    >
                    Gender
                    </label>
                    <div className="mt-1">
                    <input
                        type="text"
                        name="gender"
                        id="first-namegender"
                        defaultValue={profiles.gender}
                        autoComplete="given-name"
                        className="block w-full rounded-md border-warm-gray-300 py-3 px-4 text-warm-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                        readOnly
                    />
                    </div>
                </div>
                <div>
                    <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-warm-gray-900"
                    >
                    Birthdate
                    </label>
                    <div className="mt-1">
                    <input
                        type="date"
                        name="birthdate"
                        id="birthdate"
                        defaultValue={profiles.birthdate}
                        autoComplete="family-name"
                        className="block w-full rounded-md border-warm-gray-300 py-3 px-4 text-warm-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                        readOnly
                    />
                    </div>
                </div>
                </form>
            </div>
        </>
    )
}