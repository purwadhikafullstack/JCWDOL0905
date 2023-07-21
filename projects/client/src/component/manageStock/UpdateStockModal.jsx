import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useEffect } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";

export default function UpdateStockModal({ open, setOpen, onClose, inventory, fetchInventories}) {
  const [modalOpen, setModalOpen] = useState(open);
  const token = localStorage.getItem("token_admin");
  const cancelButtonRef = useRef(null);

  const editStockSchema = Yup.object().shape({
    addition: Yup.number("Addition quantity must be a number")
      .min(0, "Addition must be at least 0")
      .integer("Addition quantity must be an integer"),
    substraction: Yup.number("Substraction quantity must be a number")
      .min(0, "Substraction must be at least 0")
      .max(inventory.stock, "Can't reduce more than product's stock")
      .integer("Substraction quantity must be an integer"),
  });

  useEffect(() => {
    setModalOpen(open);
  }, [open]);

  const handleClose = () => {
    setModalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const editProduct = async (values) => {
    try {
      const status = values.addition ? 'in' : 'out';
      const qty = status === 'in' ? values.addition : values.substraction;
      const stock = status === 'in' ? inventory.stock + qty : inventory.stock - qty;
      const data = {
        stock : stock,
        status: status,
        quantity: qty
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await api.patch(`/inventory/${inventory.id}`, data, config);
      toast.success(response.data.message);
      fetchInventories()
      handleClose();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Formik
      initialValues={{ stock: inventory?.stock, addition: 0, substraction: 0 }}
      validationSchema={editStockSchema}
      onSubmit={(values) => editProduct(values)}
    >
      {(props) => {
        return (
          <>
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
                        <Form>
                          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <Dialog.Title
                                  as="h3"
                                  className="text-xl font-semibold leading-6 text-gray-900"
                                >
                                  Update Stock
                                </Dialog.Title>
                                <div className="mt-8 mb-4 w-96">
                                  {/* <Form> */}
                                  <div className="flex mb-4">
                                    <div className="flex w-20 h-20 bg-neutral-300 shrink-0 mr-3">
                                      <div className="square-image-container rounded-md">
                                        <img
                                          src={inventory?.Product?.product_image}
                                          alt={inventory?.Product?.product_name}
                                          className="w-full h-full object-cover object-center sm:h-full sm:w-full rounded-md"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex-row h-full ">
                                      <div className="text-left mt-1">
                                        <h4 className="text-left font-bold text-gray-700 mb-1">
                                          {inventory?.Product?.product_name}
                                        </h4>
                                        <p className="m-0 p-0 text-md text-gray-500 text-left">In stock : <span className="text-green-500 font-bold">{inventory?.stock}</span></p>
                                      </div>
                                    </div>
                                  </div>
                                 

                                  <div className="flex">
                                    <Field name="addition">
                                      {({ field, form }) => (
                                        <div className="">
                                          <label
                                            htmlFor="addition"
                                            className="block text-md font-medium leading-6 text-gray-900"
                                          >
                                            Add
                                          </label>
                                          <div className="my-2">
                                            <div className="relative">
                                              <input
                                                {...field}
                                                id="addition"
                                                type="number"
                                                className={`block w-full rounded-md border-0 px-2 pt-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 disabled:bg-gray-100 disabled:opacity-50 ${
                                                  form.errors.addition &&
                                                  form.touched.addition
                                                    ? "ring-2 ring-red-600"
                                                    : ""
                                                }`}
                                                disabled={
                                                  form.values.substraction != 0
                                                }
                                              />
                                            </div>
                                            <ErrorMessage
                                              name="addition"
                                              component="div"
                                              className="text-red-500 text-sm mt-1"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </Field>

                                    <Field name="substraction">
                                      {({ field, form }) => (
                                        <div className="ml-4">
                                          <label
                                            htmlFor="substraction"
                                            className="block text-md font-medium leading-6 text-gray-900"
                                          >
                                            Reduce
                                          </label>
                                          <div className="my-2">
                                            <div className="relative">
                                              <input
                                                {...field}
                                                id="substraction"
                                                type="number"
                                                className={`block w-full rounded-md border-0 px-2 py-1.5 pt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 disabled:bg-gray-100 disabled:opacity-50 ${
                                                  form.errors.substraction &&
                                                  form.touched.substraction
                                                    ? "ring-2 ring-red-600"
                                                    : ""
                                                }`}
                                                disabled={
                                                  form.values.addition != 0
                                                }
                                              />
                                            </div>
                                            <ErrorMessage
                                              name="substraction"
                                              component="div"
                                              className="text-red-500 text-sm mt-1"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </Field>
                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                              type="submit"
                              className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 active:bg-green-700 sm:ml-3 sm:w-auto"
                            >
                              Update
                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              onClick={handleClose}
                              ref={cancelButtonRef}
                            >
                              Cancel
                            </button>
                          </div>
                        </Form>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>
          </>
        );
      }}
    </Formik>
  );
}