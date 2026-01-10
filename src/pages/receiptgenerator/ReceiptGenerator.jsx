import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ReceiptModal from "./previewModal/PreviewModal";
import dayjs from "dayjs";
import DiscountInputModal from "./discounInputModal/DiscountInputModal";
import PriceField from "./priceField/PriceField";
import ConfirmModal from "../../common/confirmmodal/ConfirmModal";
import { useLocation } from "react-router-dom";
import Select from "react-select";

export default function ReceiptGenerator() {
  const [date, setDate] = useState();
  const [issuedTo, setIssuedTo] = useState("");
  const [items, setItems] = useState([]);
  const [showDiscountInput, setShowDiscountInput] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [open, setOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState(null)

  const recipients = useSelector((state) => state.recipients.list);
  const products = useSelector((state) => state.items.list);

  const location = useLocation()
  const pendingBillItem = location.state

  //if coming from pending add default item 'old balance' '


  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === "qty" || field === "price" ? Number(value) : value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { description: "", qty: 1, price: 0 }]);
  };

  const resetForm = () => {
    setDate("");
    setIssuedTo("");
    setItems([{ description: "", qty: 1, price: 0 }]);
  };

  const onDiscountApply = (item, dprice) => {
    const updated = [...items];
    const index = updated.findIndex(i => i.id === item.id)
    updated[index].discountedPrice = dprice
    console.log(updated, 'updated')
    setItems(updated);
    setSelectedItem(null)
    setShowDiscountInput(false)
  }



  //set initial data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const initalProduct = products.length > 0 ? products[0] : ''
    const initalReceivee = recipients.length > 0 ? recipients[0] : ''
    console.log(initalProduct, 'initalProduct')
    setDate(dayjs().format("YYYY-MM-DD"))
    setItems([{ description: initalProduct?.name, qty: 1, price: initalProduct?.price }])
    setIssuedTo(initalReceivee)
  }, [])

  useEffect(() => {
    if (pendingBillItem?.id) {
      console.log(pendingBillItem,'pendingBillItem')
      const oldBalance = {
        description: 'Old balance',
        price: pendingBillItem?.balance,
        qty: 1,
        isPending: true,
        date: pendingBillItem?.date,

      }
      // setItems(prev => [...prev, oldBalance])
      setIssuedTo(pendingBillItem?.customer)
      setPendingItem(oldBalance)
    }
  }, [pendingBillItem])

  console.log(items, 'itemsitems')

  let grandTotal = items.reduce((sum, item) => sum + item.qty * (item?.discountedPrice ? item?.discountedPrice : item.price), 0);
  if (pendingItem) grandTotal += pendingItem?.price

  return (
    <div className="p-2 max-w-md mx-auto space-y-6">
      {/* Form */}
      <div className="space-y-3 py-6 bg-white p-4 rounded-xl shadow pb-24">
        <input
          type="date"
          value={date}
          onChange={(e) => {
            console.log(e.target.value, 'date')
            setDate(e.target.value)
          }}
          className="w-full border p-2 rounded"
        />
        <select className="capitalize border rounded p-2" name="name" value={issuedTo} onChange={(e) => setIssuedTo(e.target.value)} id="">
          {recipients.map((r, idx) => (
            <option key={idx} className="p-2 border capitalize rounded flex justify-between">
              {r}
            </option>
          ))}
        </select>
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`${item?.isPending ? 'bg-gray-100' : 'bg-white'}  shadow rounded-xl p-4  mb-4 flex flex-col gap-2 relative`}
          >
            {/* Select Product */}
            {item?.isPending ? <div className="flex gap-2 items-center">
              <p className="">{item.description}</p>
              <p className="bg-gray-200 rounded text-[10px] p-1 font-bold">{item.date}</p>
            </div> : <Select
              className="capitalize w-full text-sm"
              value={
                item.description
                  ? { label: item.description, value: item.id }
                  : null
              }
              onChange={(selected) => {
                if (!selected) return;
                handleItemChange(idx, "id", selected.id);
                handleItemChange(idx, "description", selected.name);
                handleItemChange(idx, "price", selected.price);
              }}
              options={products.map((p) => ({
                value: p.id,
                label: p.name,
                ...p
              }))}
              placeholder="Select Item"
              isClearable
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#d1d5db",
                  borderRadius: "0.375rem",
                  padding: "2px 4px",
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
              }}
            />}

            {/* Quantity + Price Row */}
            {item?.isPending ?
              <div className="flex">
                <p className="text-lg font-semibold text-[tomato]">₹{item?.price}</p>
              </div>
              :
              <div className="flex items-center justify-between gap-2">
                {/* Qty with increment/decrement */}
                <div className="flex items-center border rounded-lg w-[60%]">
                  <button
                    type="button"
                    onClick={() =>
                      handleItemChange(idx, "qty", Math.max(1, item.qty - 1))
                    }
                    className="px-3 py-1 text-lg text-gray-600 hover:text-black"
                  >
                    –
                  </button>

                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => handleItemChange(idx, "qty", e.target.value)}
                    className="w-full text-center p-2 focus:outline-none"
                    step={1}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleItemChange(idx, "qty", Number(item.qty) + 1)
                    }
                    className="px-3 py-1 text-lg text-gray-600 hover:text-black"
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <div className="flex-1 text-right">
                  {/* <p className="text-sm text-gray-500">Price</p> */}
                  <PriceField item={item} />
                  {/* Discount Trigger */}
                  {item?.discountedPrice > 0 ? null : <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowDiscountInput(true);
                    }}
                    className="self-end text-[8px] bg-gradient-to-r from-teal-500 to-green-500 text-white px-3 py-1 rounded-lg shadow hover:opacity-90"
                  >
                    + Discount
                  </button>}
                </div>
              </div>}


          </div>
        ))}
        {pendingItem ? <div

          className={`bg-gray-100  shadow rounded-xl p-4  mb-4 flex flex-col gap-2 relative`}
        >
          <div className="flex gap-2 items-center">
            <p className="">{pendingItem.description}</p>
            <p className="bg-gray-200 rounded text-[10px] p-1 font-bold">{pendingItem.date}</p>
          </div>

          <div className="flex">
            <p className="text-lg font-semibold text-[tomato]">₹{pendingItem?.price}</p>
          </div>


        </div> : null}

        <button onClick={addItem} className="bg-blue-500 text-white px-4 py-2 rounded">
          + Add Item
        </button>
        <div className="flex gap-2">
          <button onClick={() => setOpen(true)} className="bg-gray-500 text-white px-4 py-2 rounded flex-1">
            Reset
          </button>
          <button onClick={() => setShowPreview(true)} className="bg-green-500 text-white px-4 py-2 rounded flex-1">
            Preview
          </button>
        </div>
      </div>

      {showDiscountInput ? <DiscountInputModal selectedItem={selectedItem} onClose={() => {
        setSelectedItem(null)
        setShowDiscountInput(false)
      }}
        applyDiscount={onDiscountApply}
      /> : null}

      {/* Receipt Preview */}
      {items?.length > 0 ? <ReceiptModal
        isOpen={showPreview} onClose={() => setShowPreview(false)} date={date} issuedTo={issuedTo} pendingItem={pendingItem} billID={null} billItems={items} grandTotal={grandTotal}
      /> : null}
      <ConfirmModal
        isOpen={open}
        message="Do you really want to reset everything?"
        onConfirm={() => {
          setOpen(false)
          resetForm()
          setPendingItem(null)
        }}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}
