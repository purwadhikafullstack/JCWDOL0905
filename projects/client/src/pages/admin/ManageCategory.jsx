import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { Toaster } from "react-hot-toast";
import Layout from "../../component/Layout";
import AddCategoryModal from "../../component/manageCategory/AddCategoryModal";
import DeleteCategoryModal from "../../component/manageCategory/DeleteCategoryModal";
import EditCategoryModal from "../../component/manageCategory/EditCategoryModal";
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Pagination } from "semantic-ui-react";
import { useSearchParams } from "react-router-dom";
import CategoryList from "../../component/manageCategory/CategoryList";

export const ManageCategory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePage, setActivePage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPage, setTotalPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [searchCategory, setSearchCategory] = useState(searchParams.get("name") || "")
  const [sort, setSort] = useState(searchParams.get("sort") || "ASC");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({});

  useEffect(() => {
    setSearchParams({ 
      page: activePage,
      sort: sort,
      name: searchCategory,
      adm: 1
    });
  }, [activePage, sort, searchCategory]);

  useEffect(() => {
    setSearchParams({ 
      page: activePage,
      sort: sort,
      name: searchCategory,
      adm: 1
    });
  }, [activePage, sort, searchCategory]);

  async function fetchCategories() {
    try {
      const categoriesData = await api.get('/category', {
        params: {
          adm: 1,
          page: activePage,
          name: searchCategory,
          sort: sort
        }
      });
      setCategories(categoriesData.data.data);
      setTotalPage(Math.ceil(categoriesData.data.count / 12));
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, [sort, activePage, searchCategory]);

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
const handleSortChange = (e) => {
    setSort(e.target.value);
    setActivePage(1);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
    setActivePage(1);
    setSearchCategory(search)
  }};
  return (
    <Layout>
      <div className="flex min-w-screen min-h-screen">
      <Toaster />
      <div className="flex mx-auto w-full rounded-md max-w-xl max-h-5xl px-2 bg-white md:max-w-4xl md:px-6 lg:max-w-7xl lg:h-7xl lg:px-4">
        <div className="w-full lg:w-full p-4 lg:p-8 justify-start ">
          <div className="flex justify-between items-center my-3 mb-8">
            <h2>Manage Category</h2>
            <button
              className="bg-green-500 h-10 px-4 md:px-8 lg:px-8 text-white font-semibold rounded-md"
              onClick={openAddModal}
            >
              Add Category
            </button>
          </div>

          <div className="flex flex-col md:flex-row lg:flex-row mb-6">
              <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="search" type="search" placeholder="Search category name" onChange={e => setSearch(e.target.value)} defaultValue={searchCategory}
                  onKeyDown={handleKeyDown} className="w-full rounded-md border-0 pl-10 pr-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-md sm:leading-6"
                />
              </div>
              <div className="flex mt-4 md:ml-8 md:mt-0 items-center">
                <label className="block w-16 text-md font-medium leading-6 text-gray-900 mr-2 ">
                  Sort by:
                </label>
                <select
                  className="w-56 lg:w-60 rounded-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500"
                  id="filter"
                  value={sort}
                  onChange={handleSortChange}
                >
                  <option value="ASC">Category Name A-Z</option>
                  <option value="DESC">Category Name Z-A</option>
                </select>
              </div>
            </div>

            <CategoryList categories={categories} openEditModal={openEditModal} openDeleteModal={openDeleteModal}/>
          
          <div className="mt-12 flex justify-center items-end">
              <Pagination
                activePage={activePage}
                totalPages={totalPage}
                onPageChange={(e, pageInfo) => {
                  setActivePage(pageInfo.activePage);
                }}
              />
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
          fetchCategories={fetchCategories}
        />
      )}
      {deleteModalOpen && (
        <DeleteCategoryModal
          open={deleteModalOpen}
          setOpen={setDeleteModalOpen}
          categoryId={selectedCategoryId}
          cancelButtonRef={null}
          onClose={closeDeleteModal}
          fetchCategories={fetchCategories}
        />
      )}
      {editModalOpen && (
        <EditCategoryModal
          open={editModalOpen}
          setOpen={setEditModalOpen}
          category={selectedCategory}
          cancelButtonRef={null}
          onClose={closeEditModal}
          fetchCategories={fetchCategories}
        />
      )}
      </div>
    </Layout>
  );
};

export default ManageCategory;