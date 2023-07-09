import { useState, useEffect } from "react";
import { api } from "../../api/api";
import Layout from "../../component/Layout";
import { Toaster } from "react-hot-toast";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useSelector } from "react-redux";
import { Pagination } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "semantic-ui-css/semantic.min.css";

const ManageStock = () => {
  const [activePage, setActivePage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [searchedProduct, setSearchedProduct] = useState("");
  const [sort, setSort] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState(1);
  const [storeBranches, setStoreBranches] = useState([]);
  const role = useSelector((state) => state.adminSlice.role);
  const id_branch = useSelector((state) => state.adminSlice.id_branch);

  const branchId = role === "BRANCH_ADMIN" ? id_branch : selectedBranchId;
  console.log("branchId", branchId);

  useEffect(() => {
    async function getStoreBranches() {
        try {
          const storeData = await api.get('/branch/')
          setStoreBranches(storeData.data.data)
          console.log("Branches", storeData.data.data)
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
        let url;
        switch (parseInt(sort)) {
          // sort by name A-Z
          case 1:
            url = `/inventory/?order=product_name&sort=ASC&name=${searchedProduct}&category=${selectedCategory}&page=${activePage}&adm=1`;
            break;
          // sort by name Z-A
          case 2:
            url = `/inventory/?order=product_name&sort=DESC&name=${searchedProduct}&category=${selectedCategory}&page=${activePage}&adm=1`;
            break;
          // sort by price L-H
          case 3:
            url = `/inventory/?order=product_price&sort=ASC&name=${searchedProduct}&category=${selectedCategory}&page=${activePage}&adm=1`;
            break;
          // sort by price H-L
          case 4:
            url = `/inventory/?order=product_price&sort=DESC&name=${searchedProduct}&category=${selectedCategory}&page=${activePage}&adm=1`;
            break;
          default:
            url = `/inventory/?order=updatedAt&sort=DESC&name=${searchedProduct}&category=${selectedCategory}&page=${activePage}&adm=1`;
        }

        const productData = await api.get(url, {
          params: {
            branchId,
          },
        });

        setInventories(productData.data.data);
        setTotalPage(Math.ceil(productData.data.count / 12));
      } catch (error) {
        console.log(error);
      }
    }
    fetchInventories();
  }, [sort, activePage, selectedBranchId, selectedCategory]);

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setActivePage(1);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
    setActivePage(1);
    setSort(1)
      async function fetchInventories() {
        try {
          const productData = await api.get(`/inventory/?order=product_name&sort=ASC&name=${searchedProduct}&category=${selectedCategory}&page=${activePage}&adm=1`, {
            params: {
              branchId,
            },
          });
  
          setInventories(productData.data.data);
          setTotalPage(Math.ceil(productData.data.count / 12));
       } catch (err) {
        console.log(err)
       }
    }
    fetchInventories()
  }};

  function formatIDR(price) {
    let idr = Math.floor(price).toLocaleString("id-ID");
    return `Rp ${idr}`;
  }
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
                    id="filter"
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
                  onChange={e => setSearchedProduct(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-md border-0 pl-10 pr-40 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-md sm:leading-6"
                />
                <select className="absolute right-0 bg-gray-100 right-0 rounded-r-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500" onChange={(e) => setSelectedCategory(e.target.value)}>
                <option key="" value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category_name}
                    </option>
                  ))}
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
                  <option value="1">Product Name A-Z</option>
                  <option value="2">Product Name Z-A</option>
                  <option value="3">Price Lowest-Highest</option>
                  <option value="4">Price Highest-Lowest</option>
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
                          >Category
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                          >
                            Product
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                          >
                            Discount
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                          >
                            Stock
                          </th>
                          <th
                            scope="col"
                            className="flex px-3 py-3 sm:pr-3 text-sm text-center items-center justify-center font-semibold text-gray-900"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-left divide-gray-200 bg-white">
                        {inventories.map((inventory) => (
                          <tr key={inventory.id}>
                            <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {inventory.id}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                              {inventory.Product?.Category?.category_name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                              {inventory.Product.product_name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                              {inventory.Discounts?.[0]?.discount_type ===
                              "buy one get one"
                                ? inventory.Discounts?.[0]?.discount_type
                                : inventory.Discounts?.[0]?.discount_type ===
                                  "percentage"
                                ? `${inventory.Discounts?.[0]?.discount_value}%`
                                : inventory.Discounts?.[0]?.discount_type ===
                                  "amount"
                                ? `${formatIDR(
                                    inventory.Discounts?.[0]?.discount_value
                                  )} off`
                                : null}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                              {formatIDR(inventory.discounted_price)}
                              {inventory.Discounts?.[0]?.discount_type ===
                                "amount" ||
                              inventory.Discounts?.[0]?.discount_type ===
                                "percentage" ? (
                                    <span className="ml-2 text-sm text-gray-400 line-through">
                                    {formatIDR(inventory.Product.product_price)}
                                  </span>
                              ) : (
                                <></>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                              {inventory.stock}
                            </td>
                            <td className="flex whitespace-nowrap px-3 py-3 text-center text-sm font-medium sm:pr-3 justify-center">
                              <div className="flex row">
                                <PencilSquareIcon
                                  className="fill-green-600 block h-6 w-6"
                                  aria-hidden="true"
                                />
                              </div>
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
      </div>
    </Layout>
  );
};

export default ManageStock;