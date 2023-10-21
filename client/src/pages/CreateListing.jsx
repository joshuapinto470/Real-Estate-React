import React from 'react'

const CreateListing = () => {
    return (
        <main className='p-3 max-w-5xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a listing</h1>
            <form className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type="text" placeholder='Name'
                        className='border p-3 rounded-lg' id='name' maxLength='62' minLength={10} required />
                    <input type="text"
                        placeholder='Description'
                        className='border p-3 rounded-lg' id='description' required />
                    <input type="text"
                        placeholder='Address'
                        className='border p-3 rounded-lg' id='address' required />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2 flex-wrap'>
                            <input type='checkbox' className='w-4' id='sale' />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' className='w-4' id='rent' />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' className='w-4' id='parking' />
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' className='w-4' id='furnished' />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' className='w-4' id='offer' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input type='number' className='p-3 border border-gray-300 rounded-lg' id='bedroom' min='1' max={10} required />
                            <span>Bed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type='number' className='p-3 border border-gray-300 rounded-lg' id='bath' min='1' max={10} required />
                            <span>Bath</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type='number' className='p-3 border border-gray-300 rounded-lg' id='regular-price' min='1' max={10} required />
                            <div className="flex flex-col items-center">
                                <p>Regular Price</p>
                                <span className='text-xs'>(₹ / month)</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type='number' className='p-3 border border-gray-300 rounded-lg' id='discount-price' min='1' max={10} required />
                            <div className='flex flex-col items-center'>
                                <p>Discounted Price</p>
                                <span className='text-xs'>(₹ / month)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className='font-semibold'>Images:
                        <span className='font-normal text-gray-600 ml-2'>The first image will be the cover</span></p>
                    <div className="flex gap-4 flex-wrap">
                        <input className='block p-3 text-gray-900 border 
                        border-gray-300 rounded-lg 
                        cursor-pointer bg-gray-50 file:mr-2 file:rounded-md file:bg-gray-800 file:text-white file:p-2 file:border-none' type='file' id='images' accept='images/*' multiple />
                        <button className='p-3 text-green-700 border
                         border-green-700 rounded-lg 
                         uppercase hover:shadow-lg disabled:opacity-80'>Upload
                        </button>
                    </div>
                    <button className='p-3 bg-slate-700 text-white rounded-lg
                uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
                </div>
            </form>
        </main>
    )
}

export default CreateListing