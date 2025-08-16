import React from 'react'

const PriceField = ({item}) => {
  return (
    <div className="flex flex-col items-end">
    {item.discountedPrice && item.discountedPrice < item.price ? (
      <>
        <p className="text-[8px] text-gray-400 line-through">
          ₹{item.price}
        </p>
        <p className="text-lg font-semibold text-green-600">
          ₹{item.discountedPrice}
        </p>
      </>
    ) : (
      <p className="text-lg font-semibold">₹{item.price}</p>
    )}
  </div>
  )
}

export default PriceField