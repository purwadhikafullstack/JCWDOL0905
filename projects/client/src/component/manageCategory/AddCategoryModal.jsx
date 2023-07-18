import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useEffect } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { Formik } from "formik";
import CategoryForm from "./CategoryForm";

export default function AddCategoryModal({ open, setOpen, onClose, fetchCategories}) {
  const [modalOpen, setModalOpen] = useState(open);
  const token = localStorage.getItem("token_admin");
  const cancelButtonRef = useRef(null);

  const addCategorySchema = Yup.object().shape({
    category_name: Yup.string()
      .min(4, "Category name must be 4 characters at minimum")
      .max(20, "Category name must be 20 characters at maximum")
      .required("Product name is required"),
    image: Yup.mixed()
      .required("Image is required"),
  })

  useEffect(() => {
    setModalOpen(open);
  }, [open]);

  const handleClose = () => {
    setModalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const createCategory = async (values) => {
    try {
      const fileInput = document.getElementById("image");
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append("image", file);
      formData.append( "category_name", values.category_name);
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await api.post("/category/", formData, config);
      toast.success(response.data.message);
      fetchCategories()
      handleClose();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Formik
      initialValues={{ category_name: "", image: "", }}
      validationSchema={addCategorySchema}
      onSubmit={(values) => createCategory(values)}
    >
      {(props) => {
        // console.log(props);
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
                <CategoryForm title="Add New Category" createCategory={createCategory} handleClose={handleClose} cancelButtonRef={cancelButtonRef}/>
                
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
    );
  }}
</Formik>
  );
}
