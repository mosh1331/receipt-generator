import React, { useEffect, useState } from 'react'

const DiscountInputModal = ({ onClose, selectedItem,applyDiscount }) => {
    const [discount, setDiscount] = useState(0)
    const [isPercent, setIsPercent] = useState(false)
    const [price, setPrice] = useState(0)

    const basePrice = selectedItem?.price || 0;

    const getDiscountedPrice = (price, discount) => {
      if (!price) return 0;
      if (!discount) return price;
      return price - (price * discount) / 100;
    };
    
    useEffect(() => {
      if (discount === 0) {
        setPrice(basePrice);
      } else if (isPercent) {
        setPrice(getDiscountedPrice(basePrice, discount));
      } else {
        setPrice(basePrice - discount);
      }
    }, [discount, isPercent, basePrice]);

    useEffect(() => {
        if (selectedItem) {
            setPrice(basePrice)
        }
    }, [selectedItem])

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
            <div className="bg-white text-center rounded-xl shadow-lg max-w-sm w-full relative overflow-hidden p-2">
                <h2 className='font-bold text-xl mb-2'>Add Discount</h2>
                <div className='text-left my-2'>
                    <p className="font-bold">Base price : {basePrice}</p>
                    <p className="font-bold">Discounted price : {price}</p>
                </div>
                <div className='flex w-full border rounded-rt '>
                    <div className={`w-1/2 p-1 ${isPercent ? 'bg-gradient-to-r from-teal-500 to-green-500 text-white' : 'bg-white'}`} onClick={() => setIsPercent(true)} >
                        % Percent
                    </div>
                    <div className={`w-1/2 p-1 ${isPercent ? 'bg-white' : 'bg-gradient-to-r from-teal-500 to-green-500 text-white'}`} onClick={() => setIsPercent(false)}>
                        123 Number
                    </div>
                </div>

                <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="border p-2 rounded flex-1 w-full mb-2"
                />
                <div className="flex">
                    <button onClick={onClose} className="bg-[tomato] text-white px-4 py-2  flex-1 w-1/2">
                        Cancel
                    </button>
                    <button onClick={() => applyDiscount(selectedItem,price)} className="bg-green-500 text-white px-4 py-2  flex-1 w-1/2">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DiscountInputModal