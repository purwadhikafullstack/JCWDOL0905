import { useRef, useState } from "react";
import { useEffect } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import FormModal from "../FormModal";
import VoucherForm from "./VoucherForm";

export default function CreateVoucherModal({ open, setOpen, onClose, fetchVouchers}) {
  const [categories, setCategories] = useState([]);
  const [storeBranches, setStoreBranches] = useState([]);
  const [selectedType, setSelectedType] = useState("total purchase");
  const [selectedKind, setSelectedKind] = useState("percentage")
  const [selectedBranch, setSelectedBranch] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState({})
  const [selectedStartDate, setSelectedStartDate] = useState(null); 
  const [selectedEndDate, setSelectedEndDate] = useState(null); 
  const [voucherValue, setVoucherValue] = useState("")
  const [minPurchaseValue, setMinPurchaseValue] = useState("")
  const [errorValue, setErrorValue] = useState()
  const [errorMaxDiscount, setErrorMaxDiscount] = useState()
  const [errorMinPurchase, setErrorMinPurchase] = useState()
  const [maxDiscount, setMaxDiscount] = useState("")
  const [inventories, setInventories] = useState([]);
  const [modalOpen, setModalOpen] = useState(open);
  const token = localStorage.getItem("token_admin");
  const cancelButtonRef = useRef(null);

  const { role, id_branch } = useSelector((state) => state.adminSlice);
  const branchId = role === "BRANCH_ADMIN" ? id_branch : selectedBranch;

  let validateValue = (value) => {
    if (value === "" && selectedKind === "amount") {
      setErrorValue("Please input voucher value");
    } else if (value === "" && selectedKind === "percentage") {
      setErrorValue("Please input voucher value");
    }  else if (!Number.isInteger(Number(value))) {
      setErrorValue("Voucher value must be an integer");
    } else if (value < 1) {
      setErrorValue("Voucher value must be at least 1");
    } else if (selectedKind === "percentage" && value > 100 ){
      setErrorValue(`Value can't be more than 100`);
    } else if (selectedKind === "amount" && selectedType === "product" && value >= selectedProduct.price ){
      setErrorValue(`Value should be lower than product's price`);
    } else {
      setErrorValue("")
    }
    setVoucherValue(value)
  };

  const validateMaxDiscount = (value) => {
    if (value < 1) {
      setErrorMaxDiscount("Maximum Discount can't be 0 or below")
    } else if (!Number.isInteger(Number(value))) {
      setErrorMaxDiscount("Max discount must be an integer");
    } else {
      setErrorMaxDiscount("")
    }
    setMaxDiscount(value)
  }

  const validateMinPurchase = (value) => {
    if (value < 1) {
      setErrorMinPurchase("Minimum purchase can't be 0 or below")
    } else if (!Number.isInteger(Number(value))) {
      setErrorMinPurchase("Minimum purchase must be an integer");
    } else {
      setErrorMinPurchase("")
    }
    setMinPurchaseValue(value)
  }

  useEffect(() => {
    if (selectedType === "product") {
      async function getStoreBranches() {
        try {
          const storeData = await api.get("/branch/");
          setStoreBranches(storeData.data.data);
        } catch (error) {
          console.log(error);
        }
      }
      getStoreBranches();

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
    }
    setModalOpen(open);
  }, [open, selectedType, selectedCategory, selectedBranch]);

  const handleClose = () => {
    setModalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleVoucherType = (type) => {
    setSelectedType(type);
    if (type === "product" || type === "shipping" || type === "referral code") {
      setMinPurchaseValue("")
    }
  }

  const handleVoucherKind = (kind) => {
    setSelectedKind(kind)
    setVoucherValue("")
    setErrorValue("")
    setMaxDiscount("")
    setErrorMaxDiscount("")
  }

  const handleSelectBranch= (e) => {
    setSelectedBranch(e)
  }
  const handleSelectCategory= (e) => {
    setSelectedCategory(e)
  }
  const handleSelectStartDate= (e) => {
    setSelectedStartDate(e)
  }
  const handleSelectEndDate= (e) => {
    setSelectedEndDate(e)
  }

  const createVoucher = async () => {
    try {
      const data = {
        voucher_type: selectedType,
        id_inventory: selectedType === "shipping" || selectedType === "referral code" || selectedType === "total purchase" ? null : selectedProduct.value,
        voucher_kind: document.getElementById("voucher_kind").value,
        voucher_value: voucherValue,
        max_discount: maxDiscount ? maxDiscount : null,
        min_purchase_amount: minPurchaseValue ? parseInt(minPurchaseValue) : null,
        start_date: document.getElementById("start_date").value,
        end_date: document.getElementById("end_date").value,
      };
      const config = {headers: { Authorization: `Bearer ${token}` }};
      const response = await api.post("/voucher/", data, config);
      toast.success(response.data.message);
      fetchVouchers();
      handleClose();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <FormModal
      open={open}
      setOpen={setOpen}
      modalOpen={modalOpen}
      onClose={onClose}
      cancelButtonRef={cancelButtonRef}
      disabled={
        errorValue ||
        errorMaxDiscount ||
        errorMinPurchase ||
        !voucherValue ||
        !selectedStartDate ||
        !selectedEndDate ||
        (selectedType === "total purchase" && !minPurchaseValue) ||
        (selectedType === "product" && !selectedProduct)
      }
      onClick={createVoucher}
      handleClose={handleClose}
      children={<VoucherForm handleVoucherType={handleVoucherType} selectedType={selectedType} role={role} storeBranches={storeBranches} categories={categories} inventories={inventories} selectedCategory={selectedCategory} handleProductSelect={handleProductSelect} selectedProduct={selectedProduct} handleVoucherKind={handleVoucherKind} selectedKind={selectedKind} errorValue={errorValue} validateValue={validateValue} voucherValue={voucherValue} validateMaxDiscount={validateMaxDiscount} maxDiscount={maxDiscount} errorMaxDiscount={errorMaxDiscount} validateMinPurchase={validateMinPurchase} minPurchaseValue={minPurchaseValue} errorMinPurchase={errorMinPurchase} selectedStartDate={selectedStartDate} selectedEndDate={selectedEndDate} handleSelectBranch={handleSelectBranch} handleSelectCategory={handleSelectCategory} handleSelectStartDate={handleSelectStartDate} handleSelectEndDate={handleSelectEndDate} />}
      modalTitle="Create Voucher"
    />
  );
}