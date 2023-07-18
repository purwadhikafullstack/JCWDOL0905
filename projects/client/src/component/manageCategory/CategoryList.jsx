import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function CategoryList({categories, openDeleteModal, openEditModal}) {
    return(
        <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-4 md:gap-y-4 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-4">
            {categories.map((category) => (
              <div
                className="flex rounded-lg border border-gray-200 sm:w-96 md:max-w-full lg:max-w-full"
                key={category.id}
              >
                <div className="flex w-full px-4 py-3 items-center">
                  <div className="mr-4 w-20 shrink-0">
                    <img
                      src={category.category_image}
                      alt={category.category_name}
                      className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                    />
                  </div>
                  <div className="flex w-full">
                    <h4 className="text-md font-semibold text-gray-900 my-1">
                      {category.category_name}
                    </h4>
                  </div>

                  <div className="justify-end">
                    <div className="flex justify-between">
                      <button
                        className="m-1 p-2 border border-green-600 hover:border-green-800 text-lg font-bold text-green-600 hover:text-green-800 rounded-full"
                        onClick={() => openEditModal(category)}
                      >
                        <PencilSquareIcon
                          className="block h-5 w-5"
                          aria-hidden="true"
                        />
                      </button>
                      <button
                        className="m-1 p-2 border border-red-600 text-lg font-bold text-red-600 hover:border-red-800 hover:text-red-800 rounded-full"
                        onClick={() => openDeleteModal(category.id)}
                      >
                        <TrashIcon
                          className="block h-5 w-5"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
    )
}