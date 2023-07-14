import React, { useEffect } from "react";
import Layout from "../../component/Layout";
import { useState } from "react";
import { api } from "../../api/api";
import { Toaster } from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import ModalCreateBranchStore from "../../component/branchManagement/ModalCreateBranchStore";
import ModalEditBranchStore from "../../component/branchManagement/ModalEditBranchStore";
import ModalDeleteBranchStore from "../../component/branchManagement/ModalDeleteBranchStore";
import PopoverFilter from "../../component/PopoverFilter";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../component/PaginationRowPerPage";

function Table({
  tableData,
  setEditData,
  setOpenEditModal,
  setOpenDeleteModal,
}) {
  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6 md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    {" "}
                    ID Store{" "}
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {" "}
                    Branch Name{" "}
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {" "}
                    Province{" "}
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {" "}
                    City{" "}
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {" "}
                    Address{" "}
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {" "}
                    Longitude{" "}
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {" "}
                    Latitude{" "}
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {" "}
                    Actions{" "}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y text-left divide-gray-200 bg-white">
                {tableData.map((stores) => (
                  <tr key={stores.email}>
                    <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {" "}
                      {stores.id || ""}{" "}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      {" "}
                      {stores.branch_name || ""}{" "}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      {" "}
                      {stores.province || ""}{" "}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      {" "}
                      {stores.city || ""}{" "}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      {" "}
                      {stores.address || ""}{" "}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      {" "}
                      {stores.longitude || ""}{" "}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      {" "}
                      {stores.latitude || ""}{" "}
                    </td>
                    <td className="flex whitespace-nowrap px-3 py-3 text-center text-sm font-medium sm:pr-3 justify-center">
                      <div className="flex row">
                        <PencilIcon
                          className="h-5 w-5 fill-yellow-600 cursor-pointer mr-10"
                          onClick={() => {
                            console.log("edit");
                            setEditData({
                              id: stores.id,
                              branchName: stores.branch_name,
                              provinceName: `${stores.province_id}-${stores.province}`,
                              cityName: `${stores.city_id}-${stores.city}`,
                              storeAddress: stores.address,
                            });
                            setOpenEditModal(true);
                          }}
                        />
                        <TrashIcon
                          className="h-5 w-5 fill-red-600 cursor-pointer"
                          onClick={() => {
                            console.log("delete");
                            setEditData({
                              id: stores.id,
                              branchName: stores.branch_name,
                              provinceName: `${stores.province_id}-${stores.province}`,
                              cityName: `${stores.city_id}-${stores.city}`,
                              storeAddress: stores.address,
                            });
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

function BranchStoreManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const [storeData, setStoreData] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [branchName, setBranchName] = useState(searchParams.get("branchName")||"");
  const [provinceName, setProvinceName] = useState(searchParams.get("provinceName")||"");
  const [cityName, setCityName] = useState(searchParams.get("cityName")||"");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 5);
  const [totalPages, setTotalPages] = useState(0)

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowPerPage = (newLimit) => {
    setLimit(newLimit);
  };


  useEffect(() => {
    setSearchParams({ 
      page: page.toString(),
      limit: limit.toString(),
      branchName: branchName,
      provinceName: provinceName,
      cityName: cityName
    });
  }, [page, limit, setSearchParams, branchName, cityName, provinceName]);

  const getListOfStoreData = async () => {
    try {
      const response = await api.get(`branch/filter`, {
        params: {
          page: page,
          limit: limit,
          branchName: branchName === "" ? null : branchName,
          provinceName: provinceName === "" ? null : provinceName,
          cityName: cityName === "" ? null : cityName
        }
      });
      setStoreData(response.data.data.items);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getListOfStoreData();
  }, [page, limit]);

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold text-gray-900 text-center justify-center">
          Branch Store Management
        </h1>
        <div className="flex justify-end">
          <button
            className="items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            onClick={() => setOpenModal(true)}
          >
            Add New Store
          </button>
        </div>
        <div className="flex justify-start">
          <PopoverFilter positionClass="">
            <div className="flex flex-wrap space-y-2">
              <div className="flex items-center space-x-4">
                <p className="w-24 text-right">Branch Store Name:</p>
                <input
                  type="text"
                  name="branchName"
                  className="w-52 rounded-md text-sm px-4 py-2 focus:outline-none focus:border-green-400 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset"
                  placeholder="Search by branch name"
                  required
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-4">
                <p className="w-24 text-right">Province:</p>
                <input
                  type="text"
                  name="provinceName"
                  className="w-52 rounded-md text-sm px-4 py-2 focus:outline-none focus:border-green-400 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset"
                  placeholder="Search by province name"
                  required
                  value={provinceName}
                  onChange={(e) => setProvinceName(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-4">
                <p className="w-24 text-right">City:</p>
                <input
                  type="text"
                  name="cityName"
                  className="w-52 rounded-md text-sm px-4 py-2 focus:outline-none focus:border-green-400 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset"
                  placeholder="Search by city name"
                  required
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-4 w-full">
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => getListOfStoreData()}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </PopoverFilter>
        </div>
        <Table
          tableData={storeData}
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
        <ModalCreateBranchStore
          open={openModal}
          setOpen={setOpenModal}
          getListOfStoreData={getListOfStoreData}
        />
        <ModalEditBranchStore
          open={openEditModal}
          setOpen={setOpenEditModal}
          editData={editData}
          setEditData={setEditData}
          getListOfStoreData={getListOfStoreData}
        />
        <ModalDeleteBranchStore
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          deleteData={editData}
          getListOfStoreData={getListOfStoreData}
        />
      </div>
      <Toaster />
    </Layout>
  );
}

export default BranchStoreManagement;
