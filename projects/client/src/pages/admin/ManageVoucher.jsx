import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { Toaster } from "react-hot-toast";
import CreateVoucherModal from "../../component/CreateVoucherModal";
import Layout from "../../component/Layout";
import { useSelector } from "react-redux";

const ManageVoucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const token = localStorage.getItem("token_admin");
  const role = useSelector((state) => state.adminSlice.role);
  const id_branch = useSelector((state) => state.adminSlice.id_branch);

  const branchId = role === "BRANCH_ADMIN" ? id_branch : "";
  console.log("branchId", branchId)

  useEffect(() => {
    async function fetchVouchers() {
      try {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
          };
        
        const vouchersData = await api.get(`/voucher/?branchId=${branchId}`, config);
        setVouchers(vouchersData.data.data.rows);
        console.log(vouchersData.data.data.rows)
      } catch (err) {
        console.log(err);
      }
    }
    fetchVouchers();
  
  }, []);

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
      <div className="flex mx-auto rounded-md w-full max-w-xl max-h-5xl px-2 bg-white md:w-full md:max-w-4xl md:px-6 lg:w-full lg:max-w-7xl lg:h-7xl lg:px-4">
        <div className="w-full lg:w-full p-4 lg:p-8 justify-start ">
          <div className="flex justify-between items-center my-3 mb-8">
            <h2>Manage Voucher</h2>
            <button
              className="bg-green-600 h-10 px-4 md:px-8 lg:px-8 text-white font-semibold rounded-md"
                onClick={openAddModal}
            >
              Create Voucher
            </button>
          </div>


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
                            Voucher Type
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Product
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Voucher Code
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Voucher Kind
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Voucher Value
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Maximum Discount
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Minimum Purchase Value
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Period
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {vouchers?.map((voucher) => (
                          voucher.voucher_type === "product" && voucher.Inventory?.id_branch !== branchId && branchId !== "" ? <></> : 
                          <tr className="border-b dark:border-neutral-500">
                            <td className="whitespace-nowrap px-6 py-4 font-medium">
                              {voucher.id}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                            {voucher.voucher_type}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                {voucher?.Inventory?.Product.product_name} 
                                {voucher.Inventory ? <span> ({voucher.Inventory?.Store_Branch?.branch_name})</span> : <></> }</td>
                            <td className="whitespace-nowrap px-6 py-4">
                                {voucher.voucher_code}</td>
                            <td className="whitespace-nowrap px-6 py-4">
                                {voucher.voucher_kind}</td>
                            <td className="whitespace-nowrap px-6 py-4">
                                {voucher.voucher_value}</td>
                            <td className="whitespace-nowrap px-6 py-4">
                                {voucher.max_discount}</td>
                            <td className="whitespace-nowrap px-6 py-4">
                                {voucher.min_purchase_amount}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                {formatDate(voucher.start_date)} - {formatDate(voucher.end_date)}</td>
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
        <CreateVoucherModal
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

export default ManageVoucher;