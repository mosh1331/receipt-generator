import React from 'react'
import { Share, SidebarCloseIcon, DollarSign } from "lucide-react";

const ActionButtons = ({ onClose, checkWhetherUnpaid, setShowAmountInput, existingBill }) => {
    return (
        <div className="flex w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm divide-x divide-slate-200">
            <button
                onClick={onClose}
                className="flex-1 min-w-0 inline-flex h-12 items-center justify-center bg-white text-slate-700 transition hover:bg-slate-100 focus:outline-none"
            >
                <SidebarCloseIcon className="h-5 w-5" />
            </button>
            <button
                onClick={checkWhetherUnpaid}
                className="flex-1 min-w-0 inline-flex h-12 items-center justify-center bg-white text-slate-700 transition hover:bg-slate-100 focus:outline-none"
            >
                <Share className="h-5 w-5" />
            </button>
            {existingBill ? (
                <button
                    onClick={() => setShowAmountInput(true)}
                    className="flex-1 min-w-0 inline-flex h-12 items-center justify-center bg-white text-slate-700 transition hover:bg-slate-100 focus:outline-none"
                >
                    <DollarSign className="h-5 w-5" />
                </button>
            ) : null}
        </div>
    )
}

export default ActionButtons