import dayjs from "dayjs";
import html2canvas from "html2canvas";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
    addPendingBill,
    removePendingBill,
    updatePendingBill,
} from "../../../redux/slice/pendingBillsSlice";
import ItemsTable from "./ItemsTable";
import ActionButtons from "./ActionButtons";
import { ArrowLeft, Download, Share2, DollarSign, IndianRupee, X, Trash2 } from "lucide-react";

export default function ReceiptPreviewPage() {
    const receiptRef = useRef(null);
    const [showAmountInput, setShowAmountInput] = useState(false);
    const [receivedAmount, setReceivedAmount] = useState(0);
    const [tempAmount, setTempAmount] = useState(0);
    const [error, setError] = useState(null);
    const [showItems, setShowItems] = useState(true);
    const pendingBills = useSelector((state) => state.pending.list);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Get data from navigation state
    const {
        date,
        issuedTo,
        billID,
        billItems,
        grandTotal,
        partialReceived = 0,
        pendingItem,
    } = location.state || {};

    const items = pendingItem ? [...(billItems || []), pendingItem] : [...(billItems || [])];
    const computedGrandTotal = items.reduce(
        (sum, item) => sum + item.qty * (item.discountedPrice ? item.discountedPrice : item.price),
        0
    );
    const displayGrandTotal = pendingItem ? computedGrandTotal : grandTotal ?? computedGrandTotal;
    const existingBill = pendingBills.find((i) => i.id === billID);

    // Initialize tempAmount when modal opens
    useEffect(() => {
        if (showAmountInput) {
            setTempAmount(receivedAmount);
        }
    }, [showAmountInput, receivedAmount]);

    // Auto-add payment when receivedAmount is set for existing bills
    useEffect(() => {
        if (receivedAmount > 0 && existingBill) {
            const newTransaction = {
                amount: Number(receivedAmount),
                date: dayjs().format("DD-MM-YYYY hh:mm A"),
            };
            let updatedBill = {
                ...existingBill,
                transactions: [...(existingBill.transactions || []), newTransaction],
            };
            console.log(updatedBill, 'updatedBill after adding transaction')
            const totalReceived = updatedBill.transactions.reduce(
                (s, t) => s + t.amount,
                0
            );
            if (totalReceived >= existingBill.total) {
                dispatch(removePendingBill(existingBill.id));
            } else {
                dispatch(updatePendingBill(updatedBill));
            }
            // Reset receivedAmount after adding
            setReceivedAmount(0);
        }
    }, [receivedAmount, existingBill, dispatch]);

    // Remove a transaction from the bill
    const removeTransaction = (index) => {
        if (!existingBill) return;
        const updatedTransactions = transactions.filter((_, i) => i !== index);
        const totalReceived = updatedTransactions.reduce((s, t) => s + t.amount, 0);
        
        // Always update the bill, even if all transactions are removed
        const updatedBill = {
            ...existingBill,
            transactions: updatedTransactions,
        };
        dispatch(updatePendingBill(updatedBill));
    };

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
                total: displayGrandTotal,
                transactions: [newTransaction],
            };
            dispatch(addPendingBill(newBill));
        }

        shareReceipt();
    };

    const checkWhetherUnpaid = () => {
        try {
            setShowAmountInput(false)
            const existingBill = pendingBills.find((i) => i.id === billID);

            if (receivedAmount > 0 && receivedAmount >= displayGrandTotal && !existingBill) {
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
                const canvas = await html2canvas(receiptRef.current, {
                    scale: 2,
                    useCORS: true,
                    onclone: (clonedDoc) => {
                        const scrollableBody = clonedDoc.querySelector('tbody');
                        const checkBox = clonedDoc.querySelector('#checkbox-container');
                        const hideColumn = clonedDoc.querySelector('.hide-column');
                        const hideButtons = clonedDoc.querySelectorAll('.hide-btn');
                        if (checkBox) checkBox.style.display = 'none';
                        if(hideColumn) hideColumn.style.display = 'none';
                        hideButtons.forEach(btn => btn.style.display = 'none');
                        if (scrollableBody) {
                            scrollableBody.style.height = 'auto';
                            scrollableBody.style.maxHeight = 'none';
                            scrollableBody.style.overflow = 'visible';
                            scrollableBody.style.display = 'table-row-group';
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

                setReceivedAmount(0);
                setShowAmountInput(false);
                navigate(-1);
            } else {
                generateImage();
                console.log("Web Share API not supported, downloaded receipt as image instead.");
            }
        } catch (error) {
            console.log(error, 'error in sharing receipt')
            setError(error?.message ? error.message : error);
        }
    };

    const transactions = existingBill?.transactions || [];
    const totalReceived = transactions.reduce((sum, t) => sum + t.amount, 0);
    const balance = displayGrandTotal - totalReceived;

    return (
        <div className="min-h-screen pb-20 bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="font-medium">Back</span>
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowAmountInput(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                                <IndianRupee className="h-4 w-4" />
                                Recieve
                            </button>
                            <button
                                onClick={checkWhetherUnpaid}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Share2 className="h-4 w-4" />
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full mx-auto  py-2">
                <div
                    ref={receiptRef}
                    className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
                >
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{error}</span>
                                <button
                                    onClick={() => setError(null)}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Company Header */}
                    <div className="relative z-10 text-left mb-8">
                        <h1 className="text-2xl font-bold">POLAR</h1>
                        <h1 className="text-2xl font-bold uppercase">Agencies</h1>

                        <div className="flex justify-between mt-2 text-[8px]">
                            <span className="capitalize">Issued to: {issuedTo}</span>
                            <span>Date: {dayjs(date).format("DD-MM-YYYY")}</span>
                        </div>
                    </div>


                    {/* Items Table */}
                    <div className="space-y-4">
                        <ItemsTable
                            showItems={showItems}
                            transactions={transactions}
                            items={items}
                            grandTotal={displayGrandTotal}
                        />

                        {/* Grand Total */}
                        {transactions.length == 0 && (
                            <div className="flex justify-end items-center gap-4 pt-4 border-t border-slate-200">
                                <span className="text-lg font-semibold text-slate-700">GRAND TOTAL:</span>
                                <span className="text-2xl font-bold text-slate-900">₹{displayGrandTotal}</span>
                            </div>
                        )}
                    </div>

                    {/* Payment History */}
                    {transactions.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900">Payment History</h3>
                            <table className="w-full text-sm relative z-10 border-t border-b border-gray-300 table-fixed">
                                <thead className="bg-slate-50">
                                    <tr className="flex border-b w-full">
                                        <th className="flex-1 text-left py-3 px-2"> </th>
                                        <th className="w-16 py-3 px-2 hide-column">Action</th>
                                        <th className="flex-1 text-right py-3 px-2 text-center">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((t, idx) => (
                                        <tr key={idx} className="flex border-b w-full hover:bg-slate-50">
                                            <td className="flex-1 py-3 px-2">Received</td>
                                            <td className="flex-1 w-16  py-3 px-2 text-center">
                                                <button
                                                    onClick={() => removeTransaction(idx)}
                                                    className="text-red-500 hide-btn hover:text-red-700 p-1"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                            <td className="flex-1 text-right py-3 px-2 font-semibold text-green-600">₹{t.amount}</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Financial Summary */}
                    {(totalReceived > 0 || receivedAmount > 0) && (
                        <div className="bg-slate-50 rounded-xl p-4">
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-slate-200">
                                     <tr className="py-2">
                                        <td className="py-3 font-medium text-slate-700">Total Bill</td>
                                        <td className="text-right font-semibold  py-3">₹{Number(grandTotal)}</td>
                                    </tr>
                                    <tr className="py-2">
                                        <td className="py-3 font-medium text-slate-700">Total Received</td>
                                        <td className="text-right font-semibold  py-3">₹{Number(totalReceived)}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 font-bold text-slate-900">Balance Due</td>
                                        <td className="text-right font-bold text-red-600 py-3">
                                            ₹{Math.max(balance, 0)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Show Items Toggle */}
                    <div id="checkbox-container" className="flex items-center justify-center pt-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                id="toggleItems"
                                className="hidden"
                                onChange={() => setShowItems(!showItems)}
                                checked={showItems}
                            />
                            <span className="text-sm text-slate-600">Show item details</span>
                            <div className={`w-5 h-5 border-2 rounded transition-colors ${showItems ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'
                                }`}></div>
                        </label>
                    </div>
                </div>

                {/* Action Buttons */}
                {/* <div className="mt-8">
                    <ActionButtons
                        onClose={() => navigate(-1)}
                        checkWhetherUnpaid={checkWhetherUnpaid}
                        setShowAmountInput={setShowAmountInput}
                        existingBill={existingBill}
                    />
                </div> */}

                {/* Add Payment Input Modal */}
                {showAmountInput && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-slate-600" />
                                    <h3 className="text-lg font-semibold text-slate-900">Add Payment</h3>
                                </div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={tempAmount}
                                        onChange={(e) => setTempAmount(e.target.value)}
                                        placeholder="Enter amount received"
                                        className="w-full border border-slate-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowAmountInput(false)}
                                        className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            setReceivedAmount(Number(tempAmount));
                                            setShowAmountInput(false);
                                        }}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}