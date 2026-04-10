import dayjs from "dayjs";
import html2canvas from "html2canvas";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addPendingBill,
    removePendingBill,
    updatePendingBill,
} from "../../../redux/slice/pendingBillsSlice";
import ItemsTable from "./ItemsTable";
import ActionButtons from "./ActionButtons";

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
    const [error, setError] = useState(null);
    const [showItems, setShowItems] = useState(true);
    const pendingBills = useSelector((state) => state.pending.list);
    const dispatch = useDispatch();

    console.log(pendingItem, 'pendingItem')
    console.log(billItems, 'billItems')

    const items = pendingItem ? [...billItems, pendingItem] : [...billItems];

    console.log(items, 'items items')

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
            if (!receivedAmount || Number(receivedAmount) < 1) {
                shareReceipt();
                return
            }
            let updatedBill = {
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
                id: dayjs().format("DD-MM-YYYY hh:mm a"),
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
        try {
            setReceivedAmount(0);
            setShowAmountInput(false)
            console.log(pendingBills, 'pendingBills')
            const existingBill = pendingBills.find((i) => i.id === billID);
            console.log(existingBill, 'existing bill')
            if (receivedAmount > 0 && receivedAmount >= grandTotal && !existingBill) {
                shareReceipt();
            } else {
                handlePendingBill(existingBill);
            }
        } catch (error) {
            setError(error?.message ? error.message : error);

        }

    };

    const shareReceipt = async () => {
        try {
            if (navigator.share) {
                // Options to handle the scrollable body
                const canvas = await html2canvas(receiptRef.current, {
                    scale: 2,
                    useCORS: true,
                    // 'onclone' is the magic part
                    onclone: (clonedDoc) => {
                        // Find the tbody inside the cloned document
                        const scrollableBody = clonedDoc.querySelector('tbody');
                        const checkBox = clonedDoc.querySelector('#checkbox-container');
                        console.log(checkBox, 'checkBox doc')
                        if(checkBox) checkBox.style.display = 'none'; // Hide the checkbox in the cloned version
                        if (scrollableBody) {
                            // Force the cloned tbody to show all content
                            scrollableBody.style.height = 'auto';
                            scrollableBody.style.maxHeight = 'none';
                            scrollableBody.style.overflow = 'visible';
                            scrollableBody.style.display = 'table-row-group'; // Reset to standard table behavior
                        }
                    }
                });

                canvas.toBlob(async (blob) => {
                    const file = new File([blob], "receipt.png", { type: "image/png" });

                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        try {
                            await navigator.share({
                                files: [file],
                                title: "Receipt",
                                text: "",
                            });
                        } catch (err) {
                            console.error("Error sharing:", err);
                        }
                    } else {
                        generateImage();
                    }
                });

                // State resets
                setReceivedAmount(0);
                setShowAmountInput(false);
                onClose();
            } else {
                generateImage();
                console.log("Web Share API not supported, downloaded receipt as image instead.");
            }
        } catch (error) {
            console.log(error, 'error in sharing receipt')
            setError(error?.message ? error.message : error);
        }
    };

    if (!isOpen) return null;

    const existingBill = pendingBills.find((i) => i.id === billID);
    const transactions = existingBill?.transactions || [];

    const totalReceived = transactions.reduce((sum, t) => sum + t.amount, 0);
    const balance = grandTotal - totalReceived;



    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex  justify-center z-50 p-2 h-[100vh]  overflow-auto">
            <div className="rounded-xl pt-10 shadow-lg max-w-sm w-full relative overflow-hidden">
                <div
                    ref={receiptRef}
                    className="h-[65vh] relative bg-white  p-6 rounded-xl shadow-lg overflow-hidden"
                >
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500 rotate-45 translate-x-12 -translate-y-12"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-300 rotate-45 -translate-x-12 translate-y-12"></div>

                    {/* Header */}
                    {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">{error}
                        <button onClick={() => setError(null)} className="text-sm text-red-500 underline"> {' '}Dismiss</button>
                    </div>}
                    <div className="relative z-10 text-left mb-8">
                        <h1 className="text-2xl font-bold">POLAR</h1>
                        <h1 className="text-2xl font-bold uppercase">Agencies</h1>

                        <div className="flex justify-between mt-2 text-[8px]">
                            <span className="capitalize">Issued to: {issuedTo}</span>
                            <span>Date: {dayjs(date).format("DD-MM-YYYY")}</span>
                        </div>
                    </div>

                    {/* Items Table */}
                    <ItemsTable showItems={showItems} transactions={transactions} items={items} grandTotal={grandTotal} />
                    {transactions.length > 1 ? null : <div className="flex justify-end gap-4 mt-4 text-[12px] font-bold">
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
                                        <span>Received </span>
                                        <span>₹{t.amount}</span>
                                    </li>
                                ))}

                            </ul>
                        </div>
                    )}

                    {/* Totals */}
                    <div className="mb-2">


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
                    <div className="flex ml-4" id="checkbox-container" data-html2canvas-ignore>
                        <input type="checkbox" id="toggleItems" className="hidden" onChange={() => setShowItems(!showItems)} checked={showItems} />
                        <label htmlFor="toggleItems" className="text-[10px] cursor-pointer flex items-center gap-1">
                            <span>Show Items</span>
                            <div className={`w-4 h-4 border rounded ${showItems ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </label>
                    </div>
                </div>

                {/* Footer Buttons */}
                <ActionButtons onClose={onClose} checkWhetherUnpaid={checkWhetherUnpaid} setShowAmountInput={setShowAmountInput} existingBill={existingBill} />

                {/* Add Payment */}
                {existingBill ? <div className="w-full">
                    {showAmountInput && (
                        <div className="relative w-full">
                            <input
                                type="number"
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
