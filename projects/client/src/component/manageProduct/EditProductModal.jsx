import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useEffect } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import ProductForm from "./ProductForm";

export default function EditProductModal({ open, setOpen, onClose, product, categories, fetchProducts}) {
  const [modalOpen, setModalOpen] = useState(open);
  const token = localStorage.getItem("token_admin");
  const cancelButtonRef = useRef(null);

  const editProductSchema = Yup.object().shape({
    product_name: Yup.string()
      .min(4, "Product name must be 4 characters at minimum"),
    product_price: Yup.number("Price must be a number")
      .positive("Price must be a positive number")
      .integer("Price must be an integer"),
    weight: Yup.number("Weight must be a number")
      .positive("Weight must be a positive number")
      .integer("Weight must be an integer"),
    product_description: Yup.string()
      .min(4, "Product description must be 4 characters at minimum")
      .max(255, "Product description must be 255 characters at max")
      .required("Product description is required"),
    image: Yup.mixed(),
    id_category: Yup.number().required("Please choose category")
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
      const fileInput = document.getElementById("image");
      const file = fileInput.files[0];

      const formData = new FormData();
      formData.append("product_name",values.product_name);
      formData.append("id_category",values.id_category);
      formData.append("product_description",values.product_description);
      formData.append("product_price",values.product_price);
      formData.append("weight",values.weight);
      formData.append("image", file);

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await api.patch(`/product/${product.id}`, formData, config);
      toast.success(response.data.message);
      fetchProducts()
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <Formik
      initialValues={{ product_name: product.product_name || "", product_price: product.product_price || "", weight: product.weight || "", product_description: product.product_description || "", image: "", id_category: product.id_category || "",}}
      validationSchema={editProductSchema}
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
                          <ProductForm  title={"Edit Product"} categories={categories} handleClose={handleClose} cancelButtonRef={cancelButtonRef}/>
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