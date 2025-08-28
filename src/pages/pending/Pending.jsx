import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PendingBillCard from './PendingBillCard';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../common/confirmmodal/ConfirmModal';
import { removePendingBill } from '../../redux/slice/pendingBillsSlice';
import ReceiptModal from '../receiptgenerator/previewModal/PreviewModal';

const Pending = () => {
    const bills = useSelector((state) => state.pending.list);
    const [selected, setSelected] = useState(null)
    const [selectedBill, setSelectedBill] = useState(null)
    const [showPreview, setShowPreview] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onAddAnotherBill = (billItem) => {
        navigate('/receipt', { state: billItem })

    }

    const onMarkAsReceived = (billItem) => {
        setSelectedBill(billItem)
        setShowPreview(true)
    }

    const onRemove = (item) => {
        setSelected(item)
    }
    console.log(selectedBill,'selectedBill')

    return (
        <div className='pb-40'>
            {bills?.map(i => <PendingBillCard key={i.id} bill={i} onAddAnotherBill={() => onAddAnotherBill(i)} onPay={() => onMarkAsReceived(i)} onRemove={() => onRemove(i)} />)}
            <ConfirmModal
                isOpen={!!selected}
                message="Do you really want to delete this pending bill?"
                onConfirm={() => {
                    dispatch(removePendingBill(selected?.id))
                    setSelected(null)
                }}
                onCancel={() => setSelected(null)}
            />
            <ReceiptModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                date={selectedBill?.date}
                issuedTo={selectedBill?.customer}
                items={selectedBill?.items}
                grandTotal={selectedBill?.total}
                partialReceived={selectedBill?.receivedAmount}
            />
        </div>
    )
}

export default Pending