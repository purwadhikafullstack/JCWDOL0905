import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { Toaster } from "react-hot-toast";
import AddDiscountModal from "../../component/AddDiscountModal";
import Layout from "../../component/Layout";
import { useSelector } from "react-redux";
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const ManageDiscount = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePage, setActivePage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(searchParams.get("sort") || "ASC");
  const [discountType, setDiscountType] = useState(searchParams.get("type") ||"")
  const [searchProduct, setSearchProduct] = useState(searchParams.get("name") || "");
  const [discounts, setDiscounts] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(searchParams.get("branchId") || 1);
  const [storeBranches, setStoreBranches] = useState([]);
  const token = localStorage.getItem("token_admin");
  const role = useSelector((state) => state.adminSlice.role);
  const id_branch = useSelector((state) => state.adminSlice.id_branch);
  const branchId = role === "BRANCH_ADMIN" ? id_branch : selectedBranchId;

  useEffect(() => {
    setSearchParams({ 
      branchId,
      page: activePage,
      sort: sort,
      type: discountType,
      name: searchProduct
    });
  }, [activePage, sort, discountType, searchProduct, selectedBranchId]);

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    async function fetchDiscounts() {
      try {
        const discountData = await api.get(`/discount`, {
          params: {
            page: activePage,
            sort: sort,
            type: discountType,
            name: searchProduct,
            branchId,
            }, ...config });
        setDiscounts(discountData.data.data);
        setTotalPage(Math.ceil(discountData.data.count / 12));
      } catch (err) {
        console.log(err);
      }
    }
    fetchDiscounts();
    async function getStoreBranches() {
      try {
        const storeData = await api.get('/branch')
        setStoreBranches(storeData.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    getStoreBranches()
  }, [selectedBranchId, activePage, sort, discountType, searchProduct]);

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setActivePage(1);
  };

  const handleFilterDiscountType = (e) => {
    setDiscountType(e.target.value)
    setActivePage(1);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
    setActivePage(1);
    setSort("ASC")
    setSearchProduct(search)
  }};

  function formatIDR(price) {
    let idr = Math.ceil(price).toLocaleString("id-ID");
    return `Rp ${idr}`;
  }

  function formattedDate(date) {
    return moment(date).format("DD/MM/YYYY");
  }


  return (
    <Layout>
    <div className="flex min-w-screen min-h-screen">
      <Toaster />
      <div className="flex mx-auto rounded-md w-full max-w-xl max-h-5xl px-2 bg-white md:w-full md:max-w-4xl md:px-6 lg:w-full lg:max-w-7xl lg:h-7xl lg:px-4">
        <div className="w-full lg:w-full p-4 lg:p-8 justify-start ">
          <div className="flex justify-between items-center my-3 mb-8">
            <div>
            <h2>Manage Discount</h2>
            </div>
            <button
              className="bg-green-500 h-10 px-4 md:px-8 lg:px-8 text-white font-semibold rounded-md"
                onClick={openAddModal}
            >
              Create Discount
            </button>
          </div>

          { role === "SUPER_ADMIN" ?
            <div className="flex mb-6">
              <div className="flex items-center">
                <label className="block text-md font-medium leading-6 text-gray-900 mr-4"> Select Branch:</label>
                <select className="rounded-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500" id="filter" 
                onChange={(e) => setSelectedBranchId(e.target.value)} value={selectedBranchId}
                 >
                  {storeBranches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.branch_name}
                    </option>
                  ))}
                </select>
              </div>
            </div> : <></>} 

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
                  placeholder="Search product"
                  defaultValue={searchProduct}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-md border-0 pl-10 pr-40 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-md sm:leading-6"
                />
                <select className="absolute right-0 bg-gray-100 right-0 rounded-r-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500" onChange={handleFilterDiscountType} value={discountType}>
                <option key="all" value="">All Discount Type</option>
                <option key="percentage" value="percentage">Percentage</option>
                <option key="amount" value="amount">Amount</option>
                <option key="buy one get one" value="buy one get one">Buy 1 Get 1</option>
                </select>
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
                  <option value="ASC">Product Name A-Z</option>
                  <option value="DESC">Product Name Z-A</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-3 py-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            ID
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                          >Product
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                          >
                            Discount Type
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                          >
                            Discount Value
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                          >
                            Period
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-left divide-gray-200 bg-white">
                        {discounts.map((discount) => (
                          <tr key={discount.id}>
                            <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {discount.id}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                              {discount.Inventory?.Product?.product_name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                              {discount.discount_type}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                              {discount.discount_type === "percentage" ?`${discount.discount_value}%` : discount.discount_type === "amount" ? formatIDR(discount.discount_value) : "-"}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                              {formattedDate(discount.start_date)} - {formattedDate(discount.end_date)}
                            </td>
                            
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-12 flex justify-center">
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
        <AddDiscountModal
          selectedBranchId={selectedBranchId}
          open={addModalOpen}
          setOpen={setAddModalOpen}
          cancelButtonRef={null}
          onClose={closeAddModal}
        />
      )}
    </div>
    </Layout>
  );
};

export default ManageDiscount;