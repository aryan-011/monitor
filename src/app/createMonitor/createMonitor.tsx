"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Snackbar, useSnackbar } from "../monitors/Snackbar";
import { useDispatch } from 'react-redux';
import { addMonitor } from '../../store/monitorSlice';

const TrackingForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    curl: "",
    fields: "",
  });
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/createMonitor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.log(responseData)
        showSnackbar({
          message:responseData.message,
          usecase:"error"
        })
        setLoading(false)
        return
      }

      showSnackbar({
        message: responseData.message,
        useCase: "success",
      });

      dispatch(addMonitor(responseData.monitor));
      setLoading(false);
      router.push("/");
    } catch (error:any) {
      console.error("Error submitting form data:", error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-1 font-medium">
          Name:
        </label>
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
        <label htmlFor="curl" className="block mb-1 font-medium">
          cURL:
        </label>
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
        <label htmlFor="fields" className="block mb-1 font-medium">
          Fields (to track):
        </label>
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
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default TrackingForm;
