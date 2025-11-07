import dayjs from "dayjs";
import html2canvas from "html2canvas";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addPendingBill,
    removePendingBill,
    updatePendingBill,
} from "../../../redux/slice/pendingBillsSlice";

export default function ReceiptModal({
    isOpen,
    onClose,
    date,
    issuedTo,
    billID,
    billItems,
    grandTotal,
    partialReceived = 0,
    pendingItem,
}) {
    const receiptRef = useRef(null);
    const [showAmountInput, setShowAmountInput] = useState(false);
    const [receivedAmount, setReceivedAmount] = useState(0);
    const pendingBills = useSelector((state) => state.pending.list);
    const dispatch = useDispatch();

    const items = pendingItem ? [...billItems, pendingItem] : [...billItems];

    // Generate receipt as image
    const generateImage = () => {
        if (receiptRef.current) {
            html2canvas(receiptRef.current, { scale: 2 }).then((canvas) => {
                const link = document.createElement("a");
                link.download = "receipt.png";
                link.href = canvas.toDataURL("image/png");
                link.click();
            });
        }
    };

    const handlePendingBill = (existingBill) => {
        const newTransaction = {
            amount: Number(receivedAmount),
            date: dayjs().format("DD-MM-YYYY hh:mm A"),
        };
        console.log(existingBill, '==== existing bill')
        console.log(newTransaction, '==== newTransaction')
        if (existingBill) {
            const updatedBill = {
                ...existingBill,
                transactions: [...(existingBill.transactions || []), newTransaction],
            };

            const totalReceived = updatedBill.transactions.reduce(
                (s, t) => s + t.amount,
                0
            );

            if (totalReceived >= existingBill.total) {
                dispatch(removePendingBill(existingBill.id));
            } else {
                dispatch(updatePendingBill(updatedBill));
            }
        } else {
            const newBill = {
                id: dayjs().format("DD-MM-YYYY hh:mm:ss"),
                customer: issuedTo,
                items,
                total: grandTotal,
                transactions: [newTransaction],
            };
            dispatch(addPendingBill(newBill));
        }

        shareReceipt();
    };

    const checkWhetherUnpaid = () => {
        setReceivedAmount(0);
        setShowAmountInput(false)
        const existingBill = pendingBills.find((i) => i.id === billID);
        if (receivedAmount > 0 && receivedAmount >= grandTotal && !existingBill) {
            shareReceipt();
        } else {
            handlePendingBill(existingBill);
        }
    };

    const shareReceipt = async () => {
        if (navigator.share && navigator.canShare) {
            const canvas = await html2canvas(receiptRef.current, { scale: 2 });
            canvas.toBlob(async (blob) => {
                const file = new File([blob], "receipt.png", { type: "image/png" });

                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: "Receipt",
                        text: "Here is your receipt.",
                    });
                } else {
                    generateImage();
                }
            });
            setReceivedAmount(0);
            setShowAmountInput(false);
            onClose();
        } else {
            generateImage();
        }
    };


    if (!isOpen) return null;

    const existingBill = pendingBills.find((i) => i.id === billID);
    const transactions = existingBill?.transactions || [];

    const totalReceived = transactions.reduce((sum, t) => sum + t.amount, 0);
    const balance = grandTotal - totalReceived;
    const previousBalance =grandTotal - totalReceived

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 h-[100vh] overflow-auto">
            <div className="bg-white rounded-xl shadow-lg max-w-sm w-full relative overflow-hidden">
                <div
                    ref={receiptRef}
                    className="relative bg-white p-6 rounded-xl shadow-lg overflow-hidden"
                >
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500 rotate-45 translate-x-12 -translate-y-12"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-300 rotate-45 -translate-x-12 translate-y-12"></div>

                    {/* Header */}
                    <div className="relative z-10 text-left mb-20">
                        <h1 className="text-2xl font-bold">POLAR</h1>
                        <h1 className="text-2xl font-bold uppercase">Agencies</h1>

                        <div className="flex justify-between mt-2 text-[8px]">
                            <span className="capitalize">Issued to: {issuedTo}</span>
                            <span>Date: {dayjs(date).format("DD-MM-YYYY")}</span>
                        </div>
                    </div>

                    {/* Items Table */}
                    <table className="w-full mt-6 text-[10px] relative z-10 border-t border-b border-gray-300">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Description</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 1 ?
                                <tr className="border-b">
                                    <td className="py-2 capitalize">Bill Amount</td>
                                    <td className="text-center"></td>
                                    <td className="text-center">

                                    </td>
                                    <td className="text-center font-bold">
                                        ₹{grandTotal}
                                    </td>
                                </tr>
                                : items.map((item, idx) => (
                                    <tr key={idx} className="border-b">
                                        <td className="py-2 capitalize">{item.description}</td>
                                        <td className="text-center">{item.qty}</td>
                                        <td className="text-center">
                                            ₹{item.discountedPrice || item.price}
                                        </td>
                                        <td className="text-center">
                                            ₹
                                            {item.qty *
                                                (item.discountedPrice ? item.discountedPrice : item.price)}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {transactions.length > 1 ? null:<div className="flex justify-end gap-4 mt-4 text-[12px] font-bold">
                        <span>GRAND TOTAL :</span>
                        <span>₹{grandTotal}</span>
                    </div>}
                    {/* Transactions Section */}
                    {transactions.length > 0 && (
                        <div className="mt-4 relative z-10">
                            <h3 className="text-xs font-bold mb-2 border-b pb-1">
                                Payment History
                            </h3>
                            <ul className="space-y-1">
                                {transactions.map((t, idx) => (
                                    <li
                                        key={idx}
                                        className="flex justify-between text-[10px] text-gray-700"
                                    >
                                        <span>Received at {dayjs(t.date).format("DD MMM, hh:mm A")}</span>
                                        <span>₹{t.amount}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Totals */}
                    <div className="mb-20">


                        {(totalReceived > 0 || receivedAmount > 0) && (
                            <table className="w-full mt-4 text-[10px] border-t border-b border-gray-300">
                                <tbody>
                                    <tr>
                                        <td className="py-1">Total Received</td>
                                        <td className="text-right">₹{Number(totalReceived)}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 font-bold">Balance</td>
                                        <td className="text-right font-bold text-red-600">
                                            ₹{Math.max(balance, 0)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex w-full">
                    <button
                        onClick={onClose}
                        className="bg-[tomato] w-1/2 text-white px-4 py-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={checkWhetherUnpaid}
                        className="bg-green-500 w-1/2 text-white px-4 py-2"
                    >
                        Share
                    </button>
                </div>

                {/* Add Payment */}
                {existingBill ? <div className="w-full">
                    <button
                        onClick={() => setShowAmountInput(true)}
                        className="bg-gray-600 w-full text-white px-4 py-2"
                    >
                        Add Received Amount
                    </button>

                    {showAmountInput && (
                        <div className="relative w-full">
                            <input
                                type="number"
                                min="1"
                                value={receivedAmount}
                                onChange={(e) => setReceivedAmount(e.target.value)}
                                className="w-full border p-2 rounded pr-8"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setReceivedAmount(0);
                                    setShowAmountInput(false);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div> : null}
            </div>
        </div>
    );
}
