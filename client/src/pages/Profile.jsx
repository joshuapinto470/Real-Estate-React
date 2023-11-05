import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  userUpdateStart,
  userUpdateSuccess, userUpdateFailure,
  userDeleteFailure, userDeleteSuccess
} from '../redux/user/userSlice.js';

const Profile = () => {
  const { currentUser } = useSelector(state => state.user);
  const user = currentUser.user;
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector(state => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAvatarUpload = file => {
    setFile(file);
    setFormData({ ...formData, avatar: URL.createObjectURL(file) });
  }

  const handleDeleteUser = async () => {
    if (loading) return;
    try {
      dispatch(userUpdateStart());
      const options = {
        method: 'DELETE',
      }

      const res = await fetch('api/user/deleteUser', options);
      const data = await res.json();
      if (data.success === false) {
        dispatch(userDeleteFailure(data));
        return;
      }
      dispatch(userDeleteSuccess());
      navigate('/');
    } catch (error) {
      dispatch(userDeleteFailure(error));
    }
  }

  const handleSignOut = async () => {
    if (loading) return;
    console.log('loggin out')
    try {
      dispatch(userUpdateStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(userDeleteFailure(data.message));
        return;
      }
      dispatch(userDeleteSuccess());
      navigate('/')
    } catch (error) {
      dispatch(userDeleteFailure(error));
    }
  }

  const handleFormSubmit = async e => {
    if (loading) return;
    e.preventDefault();
    try {
      // Upload form to server.
      dispatch(userUpdateStart());
      const multipartData = new FormData();

      formData.email &&
        multipartData.append('email', formData.email);

      formData.username &&
        multipartData.append('username', formData.username);

      formData.password &&
        multipartData.append('password', formData.password);

      file &&
        multipartData.append('avatar', file);

      const options = {
        method: 'POST',
        credentials: 'include',
        body: multipartData,
      };

      const res = await fetch('/api/user/updateUser', options);
      const data = await res.json();
      if (data.success === false) {
        dispatch(userUpdateFailure(data));
        return;
      }
      dispatch(userUpdateSuccess(data));
    } catch (error) {
      dispatch(userUpdateFailure(error));
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Hello 👋 {user.username}!</h1>
      <form className='flex flex-col gap-4' onSubmit={handleFormSubmit}>
        <input onChange={e => handleAvatarUpload(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*' />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || user.avatar} alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />

        <input type='text' placeholder={user.username} id='username' className='border p-3 rounded-lg mt-2' onChange={handleChange}></input>
        <input type='email' placeholder={user.email} id='email' className='border p-3 rounded-lg mt-2' onChange={handleChange}></input>
        <input type='password' placeholder='Change Password' id='password' className='border p-3 rounded-lg mt-2' onChange={handleChange}></input>
        <button
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          Update
        </button>
        <Link
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
          to='/create-listing'>
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span
          onClick={handleDeleteUser}
          className='text-red-700 cursor-pointer hover:bg-red-700 hover:text-white p-2 rounded-lg'>
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className='text-red-700 cursor-pointer hover:bg-blue-500 hover:text-white p-2 rounded-lg'>
          Sign Out
        </span>
      </div>
    </div>
  )
}

export default Profile