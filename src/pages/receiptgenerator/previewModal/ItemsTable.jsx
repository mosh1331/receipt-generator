import React from 'react'

const ItemsTable = ({ showItems, transactions, items, grandTotal }) => {
    if(!showItems) return null;
    return (
        <table className="w-full mt-6 text-[10px] relative z-10 border-t border-b border-gray-300 table-fixed">
            <thead className={' '} style={{ display: 'block', width: '100%' }}>
                <tr className="flex border-b  w-full">
                    <th className="flex-1 text-left py-2">Description</th>
                    <th className="flex-1 ">Qty</th>
                    <th className="flex-1 ">Price</th>
                    <th className="flex-1 ">Subtotal</th>
                </tr>
            </thead>
            <tbody style={{ display: 'block', maxHeight: '18vh', overflow: 'auto' }}>
                {transactions.length > 1 ?
                    <tr className="border-b flex" >
                        <td className="py-2 flex-1 capitalize">Bill Amount</td>
                        <td className="text-center flex-1"></td>
                        <td className="text-center flex-1">

                        </td>
                        <td className="text-center font-bold">
                            ₹{grandTotal}
                        </td>
                    </tr>
                    : items.map((item, idx) => (
                        <tr key={idx} className="border-b flex">
                            <td className="py-2 capitalize flex-1">{item.description}</td>
                            <td className="text-center flex-1">{item.qty}</td>
                            <td className="text-center flex-1">
                                ₹{item.discountedPrice || item.price}
                            </td>
                            <td className="text-center flex-1">
                                ₹
                                {item.qty *
                                    (item.discountedPrice ? item.discountedPrice : item.price)}
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>

    )
}

export default ItemsTable