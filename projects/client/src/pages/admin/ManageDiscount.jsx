import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { Toaster } from "react-hot-toast";
import AddDiscountModal from "../../component/AddDiscountModal";
import Layout from "../../component/Layout";
import { useSelector } from "react-redux";
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

export const ManageDiscount = () => {
  const [discounts, setDiscounts] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(1);
  const [storeBranches, setStoreBranches] = useState([]);
  const token = localStorage.getItem("token_admin");
  const role = useSelector((state) => state.adminSlice.role);
  const id_branch = useSelector((state) => state.adminSlice.id_branch);

  const branchId = role === "BRANCH_ADMIN" ? id_branch : "";
  console.log("branchId", branchId)
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    async function fetchDiscounts() {
      try {
        const discountData = await api.get(`/discount/?branchId=${branchId}`, config);
        setDiscounts(discountData.data.data);
        console.log(discountData.data.data)
      } catch (err) {
        console.log(err);
      }
    }
    fetchDiscounts();
    async function getStoreBranches() {
      try {
        const storeData = await api.get('/branch')
        setStoreBranches(storeData.data.data)
        console.log(storeData.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    getStoreBranches()
  }, [selectedBranchId]);

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  function formatDate(date) {
    let objectDate = new Date(date);
    let day = objectDate.getDate();
    let month = objectDate.getMonth();
    let year = objectDate.getFullYear();

    return `${day}/${month + 1}/${year}`
  }

  return (
    <Layout>
    <div className="flex min-w-screen min-h-screen">
      <Toaster />
      <div className="flex mx-auto rounded-md w-full max-w-xl max-h-5xl px-2 bg-white md:w-full md:px-6 lg:w-full lg:max-w-7xl lg:h-7xl lg:px-4">
        <div className="w-full lg:w-full p-4 lg:p-8 justify-start ">
          <div className="flex justify-between items-center my-3 mb-8">
            <h2>Manage Discount</h2>
            <button
              className="bg-green-600 h-10 px-4 md:px-8 lg:px-8 text-white font-semibold rounded-md"
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
                onChange={(e) => setSelectedBranchId(e.target.value)}
                 >
                  {storeBranches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.branch_name}
                    </option>
                  ))}
                </select>
              </div>
            </div> : <></>} 

          <div>
            <div className="flex flex-col">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <table className="min-w-full text-left text-md font-light">
                      <thead className="border-b font-medium dark:border-neutral-500">
                        <tr>
                          <th scope="col" className="px-6 py-4">
                            Id
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Product
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Discount Type
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Discount Value
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Period
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {discounts.map((discount) => (
                          <tr className="border-b dark:border-neutral-500">
                            <td className="whitespace-nowrap px-6 py-4 font-medium">
                              {discount.id}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4"> {discount.Inventory?.Product?.product_name}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">{discount.discount_type}</td>
                            <td className="whitespace-nowrap px-6 py-4">{discount.discount_value}</td>
                            <td className="whitespace-nowrap px-6 py-4">{formatDate(discount.start_date)} - {formatDate(discount.end_date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      {addModalOpen && (
        <AddDiscountModal
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
