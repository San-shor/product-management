import React from 'react';

const page = async () => {
  const products = await fetch('https://api.bitechx.com/products');
  console.log(products);
  return (
    <div className='min-h-screen bg-[#EFF1F3] px-6 py-10'>
      <div className='max-w-5xl mx-auto bg-white rounded-xl p-6 shadow'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-semibold text-[#0D1821]'>Products</h1>

          <input
            type='text'
            placeholder='Search products...'
            className='px-4 py-2 rounded-md border border-gray-300 focus:outline-none w-60'
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
    </div>
  );
};

export default page;
