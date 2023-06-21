import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Toaster } from "react-hot-toast";
import AddCategoryModal from "../../component/manageCategory/AddCategoryModal";
import DeleteCategoryModal from "../../component/manageCategory/DeleteModal";
import EditCategoryModal from "../../component/manageCategory/EditCategoryModal";

export const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({});

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await api.get("/category");
        setCategories(categoriesData.data.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const openDeleteModal = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedCategoryId(null);
    setDeleteModalOpen(false);
  };

  const openEditModal = (categoryData) => {
    setSelectedCategory(categoryData);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedCategory({});
    setEditModalOpen(false);
  };

  return (
    <div className="flex bg-neutral-100 min-w-screen min-h-screen">
      <Toaster />
      <div className="flex mx-auto rounded-md max-w-xl max-h-5xl px-2 py-2 bg-white md:max-w-4xl md:my-8 md:px-6 md:py-6 lg:max-w-7xl lg:h-7xl lg:px-4 lg:py-4 lg:my-8 drop-shadow-md">
        <div className="p-4 lg:p-8 justify-start ">
          <div className="flex justify-between items-center my-3 mb-8">
            <h2>Manage Category</h2>
            <button
              className="bg-green-600 h-10 px-4 md:px-8 lg:px-8 text-white font-semibold rounded-md"
              onClick={openAddModal}
            >
              Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-4 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-4">
            {categories.map((category) => (
              <div
                className="flex rounded-lg border border-gray-200 lg:w-96"
                key={category.id}
              >
                <div className="flex w-full px-4 py-3 items-center">
                  <div className="mr-4 w-44">
                    <img
                      src={category.category_image}
                      alt={category.category_name}
                      className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                    />
                  </div>
                  <div className="flex w-full">
                    <h3 className="text-md font-semibold text-gray-900 my-1">
                      {category.category_name}
                    </h3>
                  </div>

                  <div className="justify-end">
                    <div className="flex justify-between">
                      <button
                        className="m-2 p-2 border border-green-600 hover:border-green-800 text-lg font-bold text-green-600 hover:text-green-800 rounded-full"
                        onClick={() => openEditModal(category)}
                      >
                        <PencilSquareIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      </button>
                      <button
                        className="m-2 p-2 border border-red-600 text-lg font-bold text-red-600 hover:border-red-800 hover:text-red-800 rounded-full"
                        onClick={() => openDeleteModal(category.id)}
                      >
                        <TrashIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div></div>
      </div>
      {addModalOpen && (
        <AddCategoryModal
          open={addModalOpen}
          setOpen={setAddModalOpen}
          cancelButtonRef={null}
          onClose={closeAddModal}
        />
      )}
      {deleteModalOpen && (
        <DeleteCategoryModal
          open={deleteModalOpen}
          setOpen={setDeleteModalOpen}
          categoryId={selectedCategoryId}
          cancelButtonRef={null}
          onClose={closeDeleteModal}
        />
      )}
      {editModalOpen && (
        <EditCategoryModal
          open={editModalOpen}
          setOpen={setEditModalOpen}
          category={selectedCategory}
          cancelButtonRef={null}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
};
