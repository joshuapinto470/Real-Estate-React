import { useState } from 'react'

const TableListing = ({ listings }) => (
  <>
    {
      listings.map(l => (
        <div key={l.id} className='bg-blue-500 text-white p-2 m-2 rounded-md max-w-fit flex flex-wrap'>
          <p className='p-2 m-2'>Name : {l.name}</p>
          <p className='bg-red-600 p-2 rounded m-1'>Description : {l.description}</p>
          <p className='bg-red-600 p-2 rounded m-1'>Type : {l.type}</p>
          <p className='bg-red-600 p-2 rounded m-1'>Address : {l.address}</p>
          <p className='bg-red-600 p-2 rounded m-1'>Regular Price : {l.regularPrice}</p>
          <p className='bg-red-600 p-2 rounded m-1'>Discounted Price : {l.discountPrice}</p>
          <p className='bg-red-600 p-2 rounded m-1'>Furnished : {l.furnished ? "True" : "False"}</p>
          <p className='bg-red-600 p-2 rounded m-1'>Bedrooms : {l.bedrooms}</p>
          <p className='bg-red-600 p-2 rounded m-1'>Bathrooms : {l.bathrooms}</p>
          <p className={`${l.offer ? 'bg-green-600' : 'bg-red-600'} p-2 rounded m-1`}>Offer: {l.offer ? "True" : "False"}</p>
        </div>
      ))
    }
  </>
);

const DisplayListing = () => {
  const [listing, setListing] = useState([]);

  const buttonHandler = async () => {
    const options = {
      method: 'GET',
    };

    const res = await fetch('/api/listing/fetch-listing', options);
    const data = await res.json();
    console.log(data.data)
    setListing(data.data);
  }

  return (
    <div className='p-3 max-w-5xl mx-auto'>
      <div className='text-center text-3xl'>Display Listing</div>
      <button onClick={buttonHandler} className='p-2 bg-slate-700 text-white rounded-lg
                                    uppercase hover:opacity-95 disabled:opacity-80 mx-auto'>Load Listing</button>

      <div>
        <p>Listings</p>
        <TableListing listings={listing} />
      </div>
    </div>
  )
}

export default DisplayListing