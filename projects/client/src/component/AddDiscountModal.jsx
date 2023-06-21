import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useEffect } from "react";
import { api } from "../api/api";
import toast from "react-hot-toast";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";

export default function AddDiscountModal({ open, setOpen, onClose}) {
  const [categories, setCategories] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [selectedDiscountType, setSelectedDiscountType] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null); 
  const [selectedEndDate, setSelectedEndDate] = useState(null); 
  const [inventories, setInventories] = useState([]);
  const [modalOpen, setModalOpen] = useState(open);
  const token = localStorage.getItem("token_admin");
  const cancelButtonRef = useRef(null);

  const { role, id_branch } = useSelector((state) => state.adminSlice);
  let branchId = id_branch;

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

    async function fetchInventories() {
      try {
        // console.log("selectedCategory",selectedCategory);
        if (role === 'SUPER_ADMIN') {
          branchId = selectedBranch;
        } 
        const inventoriesData = await api.get(`/inventory/?category=${selectedCategory}&branchId=${branchId}`);
        // console.log(inventoriesData)
        setInventories(inventoriesData.data.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchInventories();

    setModalOpen(open);
  }, [open, selectedBranch, selectedCategory, selectedDiscountType]);

  const handleClose = () => {
    setModalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const createDiscount = async () => {
    try {
      const discountType = document.getElementById("discount_type").value;
      let discountValue;
      if (discountType === "buy one get one") {
        discountValue = null;
      } else {
        discountValue = document.getElementById("discount_value").value;
      }
      const data = {
        id_inventory: document.getElementById("inventory").value,
        discount_type: discountType,
        discount_value: discountValue,
        min_purchase_qty: document.getElementById("min_purchase_qty").value,
        start_date: document.getElementById("start_date").value,
        end_date: document.getElementById("end_date").value,
      };
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.post("/discount/", data, config);
      toast.success(response.data.message);
      window.location.reload();
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <Transition.Root show={modalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              show={open}
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900"
                      >
                        Create Discount
                      </Dialog.Title>
                      <div className="mt-8 mb-4 w-96">
                        <form className="" action="#" method="POST">
                        {role === "SUPER_ADMIN" ? 
                        <div>
                        <label className="block text-md font-medium leading-6 text-gray-900">
                          Select Store Branch
                        </label>
                        <div className="my-2">
                          <select
                            className="w-full rounded-md border border-gray-200 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500"
                            id="category" required
                            onChange={(e) =>
                              setSelectedBranch(e.target.value)
                            }
                          >
                            <option key="1" value="1">
                                Store 1
                              </option>
                              <option key="1" value="1">
                                Store 1
                              </option>
                            {/* {categories.map((category) => ( 
                              <option key={category.id} value={category.id}>
                                St
                              </option>
                            ))} */}
                          </select>
                        </div>
                      </div> : <></>}

                          <div>
                            <label className="block text-md font-medium leading-6 text-gray-900">
                              Product Category
                            </label>
                            <div className="my-2">
                              <select
                                className="w-full rounded-md border border-gray-200 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500"
                                id="category" required
                                onChange={(e) =>
                                  setSelectedCategory(e.target.value)
                                }
                              >
                                {categories.map((category) => (
                                  <option key={category.id} value={category.id}>
                                    {category.category_name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-md font-medium leading-6 text-gray-900">
                              Select Product
                            </label>
                            <div className="my-2">
                              <select
                                className="w-full rounded-md border border-gray-200 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500"
                                id="inventory" required
                              >
                                {inventories.map((inventory) => (
                                  <option key={inventory.id} value={inventory.id}>
                                    {inventory.Product.product_name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="flex">
                          <div className="mr-2">
                            <label className="block text-md font-medium leading-6 text-gray-900">
                              Discount Type
                            </label>
                            <div className="my-2">
                              <select
                                className="w-full rounded-md border border-gray-200 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500"
                                id="discount_type" required
                                
                                onChange={(e) =>
                                  setSelectedDiscountType(e.target.value)
                                }
                              >
                                <option value="percentage">Percentage</option>
                                <option value="amount">Amount</option>
                                <option value="buy one get one">Buy One Get One</option>
                              </select>
                            </div>
                          </div>

                          <div className="ml-2">
                            <label className="block text-md font-medium leading-6 text-gray-900">
                              Discount Value
                            </label>
                            <div className="my-2">
                              {selectedDiscountType === "buy one get one" ? <input type="number" id="discount_value" className="block w-full disabled:opacity-50 rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6" disabled defaultValue={0}/> : <input type="number" id="discount_value" className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6" required/>}
                            </div>
                          </div>
                          </div>

                          <div>
                            <label className="block text-md font-medium leading-6 text-gray-900">
                              Minimum Purchase
                            </label>
                            <div className="my-2">
                              <input type="number" id="min_purchase_qty" className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6" defaultValue={1}/>
                            </div>
                          </div>

                          <div className="flex">
                            <div className="mr-2">
                              <div className="flex items-center justify-between">
                                <label className="block text-md font-medium leading-6 text-gray-900">
                                  Start Date
                                </label>
                              </div>
                              <div className="mt-2">
                                <Datepicker
                                  selected={selectedStartDate}
                                  className="block w-full mr-2 rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-md sm:leading-6"
                                  id="start_date"
                                  minDate={new Date()}
                                  onChange={(date) =>
                                    setSelectedStartDate(date)
                                  }
                                />
                              </div>
                            </div>
                            <div className="ml-2">
                              <div className="flex items-center justify-between">
                                <label className="block text-md font-medium leading-6 text-gray-900">
                                  End Date
                                </label>
                              </div>
                              <div className="mt-2">
                                <Datepicker
                                  selected={selectedEndDate}
                                  className="block w-full mr-2 rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 placeholder:text-gray-400 focus:ring-inset focus:ring-green-600 sm:text-md sm:leading-6"
                                  id="end_date"
                                  minDate={selectedStartDate ? new Date(selectedStartDate.getTime() + (24 * 60 * 60 * 1000)) : undefined}
                                  onChange={(date) => setSelectedEndDate(date)}
                                />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button type="submit" onClick={createDiscount}
                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 sm:ml-3 sm:w-auto">
                    Submit
                  </button>
                  <button type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={handleClose}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
