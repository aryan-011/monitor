"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react';
const TrackingForm = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    curl: '',
    fields: '',
  });

  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      await fetch('/api/createMonitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }).then(resp=>resp.json()).then(response=>{
        setResponseMessage(response.message);
        router.push("/")
      })
      
      
    } catch (error) {
      console.error('Error submitting form data:', error);
      setResponseMessage('Failed to submit form data');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-1 font-medium">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="curl" className="block mb-1 font-medium">cURL:</label>
        <input
          type="text"
          id="curl"
          name="curl"
          value={formData.curl}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="fields" className="block mb-1 font-medium">Fields (to track):</label>
        <input
          type="text"
          id="fields"
          name="fields"
          value={formData.fields}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit
      </button>
      {responseMessage && <p className="mt-4">{responseMessage}</p>}
    </form>
  );
};

export default TrackingForm;
