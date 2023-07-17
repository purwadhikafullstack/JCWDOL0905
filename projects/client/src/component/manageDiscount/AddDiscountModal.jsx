import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useEffect } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import DiscountForm from "./DiscountForm";
import FormModal from "../FormModal";

export default function AddDiscountModal({
  open,
  setOpen,
  onClose,
  fetchDiscounts,
  branchId,
}) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [selectedDiscountType, setSelectedDiscountType] =
    useState("percentage");
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [inventories, setInventories] = useState([]);
  const [discountValue, setDiscountValue] = useState("");
  const [errorValue, setErrorValue] = useState();
  const [modalOpen, setModalOpen] = useState(open);
  const token = localStorage.getItem("token_admin");
  const cancelButtonRef = useRef(null);

  let validateValue = (value) => {
    if (value === "" && selectedDiscountType === "amount") {
      setErrorValue("Please input discount value");
    } else if (value === "" && selectedDiscountType === "percentage") {
      setErrorValue("Please input discount value");
    } else if (!Number.isInteger(Number(value))) {
      setErrorValue("Discount value must be an integer");
    } else if (value < 1) {
      setErrorValue("Discount value must be at least 1");
    } else if (selectedDiscountType === "percentage" && value > 100) {
      setErrorValue(`Value can't be more than 100`);
    } else if (
      selectedDiscountType === "amount" &&
      value >= selectedProduct.price
    ) {
      setErrorValue(`Value should be lower than product's price`);
    } else {
      setErrorValue("");
    }
    setDiscountValue(value);
  };

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
        const inventoriesData = await api.get(
          `/inventory/?category=${selectedCategory}&branchId=${branchId}`
        );
        setInventories(inventoriesData.data.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchInventories();
    setModalOpen(open);
  }, [open, selectedCategory, selectedDiscountType]);

  const handleClose = () => {
    setModalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const createDiscount = async () => {
    try {
      const data = {
        id_inventory: selectedProduct.value,
        discount_type: selectedDiscountType,
        discount_value:
          selectedDiscountType === "buy one get one" ? null : discountValue,
        start_date: document.getElementById("start_date").value,
        end_date: document.getElementById("end_date").value,
      };
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.post("/discount/", data, config);
      toast.success(response.data.message);
      fetchDiscounts();
      handleClose();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const selectDiscountType = (type) => {
    if (type === "buy one get one") {
      setSelectedDiscountType(type);
      setDiscountValue("");
      setErrorValue("");
    }
    setSelectedDiscountType(type);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const selectStartDate = (date) => {
    setSelectedStartDate(date);
  };
  const selectEndDate = (date) => {
    setSelectedEndDate(date);
  };

  const selectCategory = (e) => {
    setSelectedCategory(e);
  };
  return (
    <FormModal
      pen={open}
      setOpen={setOpen}
      modalOpen={modalOpen}
      onClose={onClose}
      cancelButtonRef={cancelButtonRef}
      onClick={createDiscount}
      disabled={
        !selectedProduct || !selectedStartDate || !selectedEndDate || errorValue
      }
      handleClose={handleClose}
      modalTitle={"Create Discount"}
      children={
        <DiscountForm
          categories={categories}
          inventories={inventories}
          selectedCategory={selectedCategory}
          handleProductSelect={handleProductSelect}
          selectedProduct={selectedProduct}
          selectedDiscountType={selectedDiscountType}
          discountValue={discountValue}
          errorValue={errorValue}
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
          validateValue={validateValue}
          selectDiscountType={selectDiscountType}
          selectStartDate={selectStartDate}
          selectEndDate={selectEndDate}
          selectCategory={selectCategory}
        />
      }
    />
  );
}
