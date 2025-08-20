import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PendingBillCard from './PendingBillCard';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../common/confirmmodal/ConfirmModal';
import { removePendingBill } from '../../redux/slice/pendingBillsSlice';

const Pending = () => {
    const bills = useSelector((state) => state.pending.list);
    const [selected, setSelected] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onAddAnotherBill = (billItem) => {
        navigate('/receipt', { state: billItem })

    }

    const onRemove = (item) => {
        setSelected(item)
    }

    console.log(bills, 'bills')


    return (
        <div>
            {bills?.map(i => <PendingBillCard key={i.id} bill={i} onPay={() => onAddAnotherBill(i)} onRemove={() => onRemove(i)} />)}
            <ConfirmModal
                isOpen={!!selected}
                message="Do you really want to delete this pending bill?"
                onConfirm={() => {
                    dispatch(removePendingBill(selected?.id))
                    setSelected(null)
                }}
                onCancel={() =>  setSelected(null)}
            />
        </div>
    )
}

export default Pending