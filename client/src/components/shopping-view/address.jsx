import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "../ui/use-toast";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  // Handle add or edit address
  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "You can add max 3 addresses",
        variant: "destructive",
      });
      return;
    }

    const addressAction = currentEditedId !== null ? editaAddress : addNewAddress;
    const addressData = currentEditedId !== null ? { addressId: currentEditedId, formData } : formData;

    dispatch(addressAction({ userId: user?.id, ...addressData }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses(user?.id));
          setCurrentEditedId(null);
          setFormData(initialAddressFormData);
          toast({
            title: currentEditedId !== null ? "Address updated successfully" : "Address added successfully",
          });
        }
      });
  }

  // Delete an address
  function handleDeleteAddress(addressId) {
    dispatch(deleteAddress({ userId: user?.id, addressId }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses(user?.id));
          toast({
            title: "Address deleted successfully",
          });
        }
      });
  }

  // Set address data for editing
  function handleEditAddress(address) {
    setCurrentEditedId(address?._id);
    setFormData({
      address: address?.address,
      city: address?.city,
      phone: address?.phone,
      pincode: address?.pincode,
      notes: address?.notes,
    });
  }

  // Check if form is valid
  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  // Fetch all addresses on initial load
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddresses(user?.id));
    }
  }, [dispatch, user?.id]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                key={singleAddressItem._id}
                selectedId={selectedId}
                handleDeleteAddress={() => handleDeleteAddress(singleAddressItem._id)}
                addressInfo={singleAddressItem}
                handleEditAddress={() => handleEditAddress(singleAddressItem)}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
