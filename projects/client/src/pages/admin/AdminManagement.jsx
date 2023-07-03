import React, { useEffect } from "react";
import Layout from "../../component/Layout";
import Pagination from "../../component/PaginationRowPerPage";
import { useState } from "react";
import { api } from "../../api/api";
import ModalAdminBranch from "../../component/ModalAdminBranch";
import { Toaster } from "react-hot-toast";
import ModalEditAdminBranch from "../../component/ModalEditAdminBranch";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import ModalDeleteAdminBranch from "../../component/ModalDeleteAdminBranch";

function Table({ tableData, setEditData, setOpenEditModal, setOpenDeleteModal }) {
  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900 sm:pl-6" > ID </th> <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900 sm:pl-3" > Admin Name </th>
                  <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900" > Email </th>
                  <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900" > Role </th>
                  <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900" > Branch Store Name </th>
                  <th scope="col" className="flex px-3 py-3 sm:pr-3 text-sm text-center items-center justify-center font-semibold text-gray-900" > {" "} Actions{" "} </th>
                </tr>
              </thead>
              <tbody className="divide-y text-left divide-gray-200 bg-white">
                {tableData.map((person) => (
                  <tr key={person.email}>
                    <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {person.id || ""}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      {person.admin_name || ""}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      {person.email || ""}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      {person.role === "BRANCH_ADMIN" ? "BRANCH ADMIN" : person.role || ""}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      {person.Store_Branch.branch_name || ""}
                    </td>
                    <td className="flex whitespace-nowrap px-3 py-3 text-center text-sm font-medium sm:pr-3 justify-center">
                      <div className="flex row">
                        <PencilIcon
                          className="h-5 w-5 fill-yellow-600 cursor-pointer mr-10"
                          onClick={() => {
                            setEditData(person);
                            setOpenEditModal(true);
                          }}
                        />
                        <TrashIcon
                          className="h-5 w-5 fill-red-600 cursor-pointer"
                          onClick={() => {
                            setEditData(person);
                            setOpenDeleteModal(true);
                          }}
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
  );
}

function AdminManagement() {
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [filterState, setFilterState] = useState("");
  const [filterType, setFilterType] = useState("");
  const [tableData, setTableData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editData, setEditData] = useState({});

  const onInputChange = (value) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
      setFilterType("email");
    } else {
      setFilterType("name");
    }
    setFilterState(value);
  };

  const resetFilter = () => {
    setFilterType("");
    setFilterState("");
  };

  const handleChangePage = (newPage) => {
    resetFilter();
    setPage(newPage);
  };

  const handleChangeRowPerPage = (newLimit) => {
    resetFilter();
    setLimit(newLimit);
  };

  const getListOfAdmin = async () => {
    try {
      const response = await api.get(`admins/branch-admin-list`, { params: { page: page, limit: limit, filterState: filterState, filterType: filterType, }, });
      setTableData(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListOfAdmin();
  }, [page, limit]);

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 text-center justify-center"> Branch Admin Management </h1>
        </div>
        <div className="mt-10 sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <div>
              <input
                type="yex"
                name="name"
                className="text-sm placeholder-gray-500 pl-5 pr-4 rounded-2xl border border-gray-400 w-300 py-2 focus:outline-none focus:border-green-400"
                placeholder="Search by name or email"
                required
                value={filterState}
                onChange={(e) => onInputChange(e.target.value)}
              />
              <button
                onClick={() => getListOfAdmin()}
                type="button"
                className="ml-5 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Search branch admin
              </button>
            </div>
          </div>
          <div className="mt-3 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add New Branch Admin
            </button>
          </div>
        </div>
        <Table
          tableData={tableData}
          setEditData={setEditData}
          setOpenEditModal={setOpenEditModal}
          setOpenDeleteModal={setOpenDeleteModal}
        />
        <Pagination
          rowsOption={[5, 10, 20, 30]}
          handleChangeRow={handleChangeRowPerPage}
          rowPerPage={limit}
          page={page}
          handleChangePage={handleChangePage}
          totalPages={totalPages}
        />
      </div>
      <ModalAdminBranch
        open={open}
        setOpen={setOpen}
        getListOfAdmin={getListOfAdmin}
      />
      <ModalEditAdminBranch
        open={openEditModal}
        setOpen={setOpenEditModal}
        editData={editData}
        setEditData={setEditData}
        getListOfAdmin={getListOfAdmin}
      />
      <ModalDeleteAdminBranch
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        deleteData={editData}
        getListOfAdmin={getListOfAdmin}
      />
      <Toaster />
    </Layout>
  );
}

export default AdminManagement;