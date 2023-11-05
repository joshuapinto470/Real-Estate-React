import { useState } from 'react'
import { useSelector } from 'react-redux'

const CreateListing = () => {
    const { currentUser } = useSelector(state => state.user);
    const user = currentUser.user;

    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 5000,
        discountPrice: 4999,
        offer: false,
        parking: false,
        furnished: false,
        userRef: 'user',
    });

    // const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id,
            });
            return;
        }

        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
            return;
        }

        if (
            e.target.type === 'number' ||
            e.target.type === 'text' ||
            e.target.type === 'textarea'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }

    }

    const handleSubmit = async e => {
        if (loading) return;
        e.preventDefault();
        try {
            if (files.length < 1)
                return setError('You must upload atleast 1 image!');
            if (formData.regularPrice < formData.discountPrice)
                return setError('Discounted price cannot be higher than regular price!');
            setError(null)
            setLoading(true);
            const multipartData = new FormData();
            multipartData.append('name', formData.name);
            multipartData.append('description', formData.description);
            multipartData.append('address', formData.address);
            multipartData.append('type', formData.type);
            multipartData.append('bedrooms', formData.bedrooms);
            multipartData.append('bathrooms', formData.bathrooms);
            multipartData.append('furnished', formData.furnished);
            multipartData.append('parking', formData.parking);
            multipartData.append('regularPrice', formData.regularPrice);
            multipartData.append('discountPrice', formData.discountPrice);
            multipartData.append('offer', formData.offer);
            multipartData.append('userRef', formData.userRef);

            for( const file of files){
                multipartData.append('gallery', file);
            }

            const options = {
                method: 'POST',
                body: multipartData
            };

            const res = await fetch('/api/listing/create', options);
            const data = await res.json();
            if (data.success === false) {
                setError(data);
                setLoading(false);
                return;
            }
            setLoading(false);
        } catch (error) {
            console.log(error)
            setError(error);
            setLoading(false);
        }
    }

    return (
        <main className='p-3 max-w-5xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a listing</h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input
                        type="text"
                        placeholder='Property Name'
                        className='border p-3 rounded-lg'
                        id='name' 
                        maxLength='62'
                        minLength={10}
                        required
                        onChange={handleChange}
                        value={formData.name}
                    />

                    <input
                        type="text"
                        placeholder='Description'
                        className='border p-3 rounded-lg'
                        id='description'
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />

                    <input
                        type="text"
                        placeholder='Address'
                        className='border p-3 rounded-lg'
                        id='address'
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />

                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2 flex-wrap'>
                            <input
                                type='checkbox'
                                className='w-4'
                                id='sale'
                                onChange={handleChange}
                                checked={formData.type === 'sale'}
                            />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                className='w-4'
                                id='rent'
                                onChange={handleChange}
                                checked={formData.type === 'rent'}
                            />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                className='w-4'
                                id='parking'
                                onChange={handleChange}
                                checked={formData.parking}
                            />
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                className='w-4'
                                id='furnished'
                                onChange={handleChange}
                            />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                className='w-4'
                                id='offer'
                                onChange={handleChange}
                                checked={formData.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input 
                            type='number' 
                            className='p-3 border border-gray-300 rounded-lg' 
                            id='bedrooms' 
                            value={formData.bedrooms} 
                            min={0}
                            max={55} 
                            required
                            onChange={handleChange}
                            />
                            <span>Bed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                            type='number' 
                            className='p-3 border border-gray-300 rounded-lg' 
                            id='bathrooms' 
                            value={formData.bathrooms} 
                            min={0} 
                            max={50} 
                            required 
                            onChange={handleChange}
                            />
                            <span>Bath</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                            type='number' 
                            className='p-3 border border-gray-300 rounded-lg' 
                            id='regularPrice' 
                            value={formData.regularPrice} 
                            min={1000}
                            required 
                            onChange={handleChange}
                            />
                            <div className="flex flex-col items-center">
                                <p>Regular Price</p>
                                <span className='text-xs'>(₹ / month)</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                            type='number' 
                            className='p-3 border border-gray-300 rounded-lg' 
                            id='discountPrice' 
                            value={formData.discountPrice} 
                            min={0}
                            max={formData.regularPrice - 1}
                            required 
                            onChange={handleChange} 
                            />
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
                        <input
                            onChange={e => setFiles(e.target.files)}
                            className='block p-3 text-gray-900 border 
                        border-gray-300 rounded-lg 
                        cursor-pointer bg-gray-50 file:mr-2 file:rounded-md
                         file:bg-gray-800 file:text-white file:p-2 
                         file:border-none'
                            type='file' id='images' accept='images/*' multiple />
                    </div>
                    <button
                        disabled={loading || uploading}
                        className='p-3 bg-slate-700 text-white rounded-lg
                                    uppercase hover:opacity-95 disabled:opacity-80'>
                        Create Listing
                    </button>
                    {/* {error && <p className='text-white p-2 rounded-md text-sm text-center bg-red-600 max-w-fit mx-auto'>⚠️ {error}</p>} */}
                </div>
            </form>
        </main>
    )
}

export default CreateListing