import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PendingBillCard from './PendingBillCard';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../common/confirmmodal/ConfirmModal';
import { removePendingBill } from '../../redux/slice/pendingBillsSlice';
import SearchBar from '../../common/search/SearchBar';

const Pending = () => {
    const bills = useSelector((state) => state.pending.list);
    const [selected, setSelected] = useState(null)
    const [query, setQuery] = useState("");

    const filteredItems = useMemo(() => {
        if (!query.trim()) return bills;
        return bills.filter((i) =>
            i.customer.toLowerCase().includes(query.toLowerCase())
        );
    }, [bills, query]);


    const navigate = useNavigate()  
    const dispatch = useDispatch()

    const onAddAnotherBill = (billItem) => {
        navigate('/receipt', {
            state: {
                date: billItem.date,
                issuedTo: billItem.customer,
                billID: billItem.id,
                billItems: billItem.items,
                grandTotal: billItem.total,
                partialReceived: billItem.receivedAmount || 0,
                pendingItem: null,
            },
        })
    }

    const onMarkAsReceived = (billItem) => {
        navigate('/receipt-preview', {
            state: {
                date: billItem.date,
                issuedTo: billItem.customer,
                billID: billItem.id,
                billItems: billItem.items,
                grandTotal: billItem.total,
                partialReceived: billItem.receivedAmount || 0,
                pendingItem: null,
            },
        })
    }

    const onRemove = (item) => {
        setSelected(item)
    }
    console.log(bills, 'bills')

    return (
        <div className='pb-40'>
            <SearchBar value={query} onChange={setQuery} placeholder="Search items..." />

            {filteredItems?.map(i => <PendingBillCard key={i.id} bill={i} onAddAnotherBill={() => onAddAnotherBill(i)} onPay={() => onMarkAsReceived(i)} onRemove={() => onRemove(i)} />)}
            <ConfirmModal
                isOpen={!!selected}
                message="Do you really want to delete this pending bill?"
                onConfirm={() => {
                    dispatch(removePendingBill(selected?.id))
                    setSelected(null)
                }}
                onCancel={() => setSelected(null)}
            />
        </div>
    )
}

export default Pending