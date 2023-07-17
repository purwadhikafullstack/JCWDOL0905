import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { Toaster } from "react-hot-toast";
import CreateVoucherModal from "../../component/manageVoucher/CreateVoucherModal";
import Layout from "../../component/Layout";
import { useSelector } from "react-redux";
import Table from "../../component/Table";
import VoucherTableBody from "../../component/manageVoucher/VoucherTableBody";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const ManageVoucher = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vouchers, setVouchers] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activePage, setActivePage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPage, setTotalPage] = useState(1);
  const [voucherType, setVoucherType] = useState(searchParams.get("type") ||"")
  const [sort, setSort] = useState(searchParams.get("sort") || "DESC");
  const token = localStorage.getItem("token_admin");
  const role = useSelector((state) => state.adminSlice.role);
  const id_branch = useSelector((state) => state.adminSlice.id_branch);

  const branchId = role === "BRANCH_ADMIN" ? id_branch : "";

  useEffect(() => {
    setSearchParams({ 
      page: activePage,
      sort: sort,
      type: voucherType,
    });
  }, [activePage, sort, voucherType]);

  async function fetchVouchers() {
    try {
      const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
      
      const vouchersData = await api.get(`/voucher/`, 
      {
        params: {
        page: activePage,
        sort: sort,
        type: voucherType, 
        },
        ...config
      });
      setVouchers(vouchersData.data.data);
      setTotalPage(Math.ceil(vouchersData.data.count / 12))
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchVouchers();
  }, [activePage, sort, voucherType]);

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

  const handleFilterVoucherType = (e) => {
    setVoucherType(e.target.value)
    setActivePage(1);
  };


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
          
          <div className="flex flex-col md:flex-row lg:flex-row mb-6">
              <div className="flex mt-4 md:mt-0 items-center">
                <label className="block text-md font-medium leading-6 text-gray-900 mr-4 ">
                  Filter:
                </label>
                <select
                  className="w-56 lg:w-60 rounded-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500"
                  id="filter"
                  value={voucherType}
                  onChange={handleFilterVoucherType}
                >
                  <option key="all" value="">All Voucher Type</option>
                  <option key="product" value="product">Product Voucher</option>
                  <option key="shipping" value="shipping">Shipping Voucher</option>
                  <option key="total purchase" value="total purchase">Total Purchase</option>
                  <option key="referral code" value="referral code">Referral Code</option>
                </select>
              </div>

              <div className="flex mt-4 md:ml-8 md:mt-0 items-center">
                <label className="block w-16 text-md font-medium leading-6 text-gray-900 mr-2 ">
                  Sort by:
                </label>
                <select
                  className="w-56 lg:w-60 rounded-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500"
                  id="sort"
                  value={sort}
                  onChange={handleSortChange}
                >
                  <option value="DESC">Created Newer</option>
                  <option value="ASC">Created Older</option>
                </select>
              </div>
            </div>

          <Table headCols={["ID", "Voucher Type", "Product", "Voucher Value", "Max Discount", "Min Purchase Value", "Period", "Status"]} tableBody={<VoucherTableBody vouchers={vouchers} branchId={branchId}/>} />

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
        <CreateVoucherModal
          open={addModalOpen}
          setOpen={setAddModalOpen}
          cancelButtonRef={null}
          onClose={closeAddModal}
          fetchVouchers={fetchVouchers}
        />
      )}
    </div>
    </Layout>
  );
};

export default ManageVoucher;