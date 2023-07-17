import { useState, useEffect } from "react";
import { api } from "../../api/api";
import Layout from "../../component/Layout";
import { Toaster } from "react-hot-toast";
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useSelector } from "react-redux";
import { Pagination } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import UpdateStockModal from "../../component/manageStock/UpdateStockModal";
import { useSearchParams} from "react-router-dom";
import Table from "../../component/Table";
import StockTableBody from "../../component/manageStock/StockTableBody";

const ManageStock = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePage, setActivePage] = useState(searchParams.get("page") || 1);
  const [totalPage, setTotalPage] = useState(1);
  const [order, setOrder] = useState(searchParams.get("order") || "")
  const [sort, setSort] = useState(searchParams.get("sort") || 'ASC');
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [searchedProduct, setSearchedProduct] = useState(searchParams.get("name") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedBranchId, setSelectedBranchId] = useState(searchParams.get("branchId") || 1);
  const [storeBranches, setStoreBranches] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({})
  const role = useSelector((state) => state.adminSlice.role);
  const id_branch = useSelector((state) => state.adminSlice.id_branch);
  const branchId = role === "BRANCH_ADMIN" ? id_branch : selectedBranchId;

  useEffect(() => {
    setSearchParams({ 
      page: activePage,
      sort: sort,
      order: order,
      category: selectedCategory,
      name: searchedProduct,
      branchId
    });
  }, [activePage, sort, order, selectedCategory, searchedProduct, selectedBranchId]);

  useEffect(() => {
    async function getStoreBranches() {
        try {
          const storeData = await api.get('/branch/')
          setStoreBranches(storeData.data.data)
        } catch (error) {
          console.log(error)
        }
      }
      getStoreBranches()

    async function fetchCategories() {
        try {
          const categoriesData = await api.get("/category");
          setCategories(categoriesData.data.data);
        } catch (err) {
          console.log(err);
        }
      }
    fetchCategories();

    async function fetchInventories() {
      try {
        const productData = await api.get('/inventory', {
          params: {
            branchId,
            order: order,
            sort: sort,
            name: searchedProduct,
            category: selectedCategory,
            page: activePage,
            adm: 1
          },
        });
        setInventories(productData.data.data);
        setTotalPage(Math.ceil(productData.data.count / 12));
      } catch (error) {
        console.log(error);
      }
    }
    fetchInventories();
  }, [order, sort, activePage, selectedBranchId, selectedCategory, searchedProduct]);

  const handleSortChange = (e) => {
    const values = JSON.parse(e.target.value);
    setSort(values.sort);
    setOrder(values.order);
    setActivePage(1);
  };
  const handleFilterCategory = (e) => {
    setSelectedCategory(e.target.value)
    setActivePage(1);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setActivePage(1);
      setSearchedProduct(search)
  }};
  const openEditModal = (inventoryData) => {
    setSelectedProduct(inventoryData);
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedProduct({});
    setEditModalOpen(false);
  };
  return (
    <Layout>
      <div className="flex min-w-screen min-h-screen">
        <Toaster />
        <div className="flex mx-auto rounded-md w-full max-w-xl max-h-5xl px-2 bg-white md:max-w-4xl md:w-full md:px-6 lg:w-full lg:max-w-7xl lg:h-7xl lg:px-4">
          <div className="w-full lg:w-full p-4 lg:p-8 justify-start ">
            <div className="flex justify-between items-center my-3 mb-8">
              <h2>Manage Stock</h2>
            </div>

            {role === "SUPER_ADMIN" ? (
              <div className="flex mb-6">
                <div className="flex items-center">
                  <label className="block text-md font-medium leading-6 text-gray-900 mr-4">
                    Select Branch:
                  </label>
                  <select
                    className="rounded-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500"
                    id="filter" value={selectedBranchId}
                    onChange={(e) => setSelectedBranchId(e.target.value)}
                  >
                    {storeBranches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.branch_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <></>
            )}

            <div className="flex flex-col md:flex-row lg:flex-row mb-6">
              <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="search" type="search"
                  placeholder="Search product name"
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown} defaultValue={searchedProduct}
                  className="w-full rounded-md border-0 pl-10 pr-40 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-md sm:leading-6"
                />
                <select className="absolute right-0 bg-gray-100 right-0 rounded-r-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500" onChange={handleFilterCategory} value={selectedCategory}>
                <option key="" value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex mt-4 md:ml-8 md:mt-0 items-center">
                <label className="block w-16 text-md font-medium leading-6 text-gray-900 mr-2 ">Sort by:</label>
                <select
                  className="w-56 lg:w-60 rounded-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500" id="filter" value={JSON.stringify({ order, sort })} onChange={handleSortChange}
                >
                  <option value='{"order":"product_name","sort":"ASC"}'>Product Name A-Z</option>
                  <option value='{"order":"product_name","sort":"DESC"}'>Product Name Z-A</option>
                  <option value='{"order":"product_price","sort":"ASC"}'>Price Lowest-Highest</option>
                  <option value='{"order":"product_price","sort":"DESC"}'>Price Highest-Lowest</option>
                </select>
              </div>
            </div>

            <Table
              headCols={["ID", "Category", "Product", "Discount", "Price", "Stock", "Actions" ]} tableBody={<StockTableBody inventories={inventories} openEditModal={openEditModal}/>}
            />
            <div className="my-12 flex justify-center">
              <Pagination activePage={activePage}
                totalPages={totalPage}
                onPageChange={(e, pageInfo) => {
                  setActivePage(pageInfo.activePage);
                }}
              />
            </div>
          </div>
          <div></div>
        </div>
        {editModalOpen && (<UpdateStockModal open={editModalOpen} setOpen={setEditModalOpen} inventory={selectedProduct} cancelButtonRef={null} onClose={closeEditModal} />)}
      </div>
    </Layout>
  );
};
export default ManageStock;