"use client"
import React, { useEffect, useState } from 'react';
import { MdRefresh, MdDelete } from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';
import { useSnackbar } from './Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { setMonitors,updateMonitor, deleteMonitor, selectMonitors } from '../../store/monitorSlice';
interface FormData {
  id: string;
  name: string;
  fieldsToTrack: string;
  result: string;
  updatedAt: Date;
}

const TrackingTable = () => {
  const dispatch = useDispatch();
  const monitors = useSelector(selectMonitors);
  //console.log(monitors)
  const [loading, setLoading] = useState(false);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchFormSubmissions = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/getMonitors');
        const data = await response.json();
        dispatch(setMonitors(data))
      } catch (error) {
        console.error('Error fetching form submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormSubmissions();
  }, []);

  async function refreshMonitor(id: string, index: number) {
    setRefreshingId(id);
    try {
      const response = await fetch(`/api/refreshMonitor/${id}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      dispatch(updateMonitor({id,i:index,monitor:data}))
    } catch (error) {
      console.error('Error refreshing monitor:', error);
    } finally {
      setRefreshingId(null);
    }
  }

  async function deleteMonitorfn(id: string) {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/deleteMonitor/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        dispatch(deleteMonitor(id))
        showSnackbar({
          message: 'Monitor deleted successfully!',
          useCase: 'success'
        });
      } else {
        throw new Error('Failed to delete monitor');
      }
    } catch (error) {
      console.error('Error deleting monitor:', error);
      showSnackbar({
        message: 'Failed to delete monitor',
        useCase: 'error'
      });
    } finally {
      setDeletingId(null);
    }
  }


  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin" size={30} />
        </div>
      ) : monitors.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 dark:text-gray-400">No monitors to display.</p>
        </div>
      ) : (
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b dark:border-gray-700">Name</th>
              <th className="py-2 px-4 border-b dark:border-gray-700">Fields</th>
              <th className="py-2 px-4 border-b dark:border-gray-700">Results</th>
              <th className="py-2 px-4 border-b dark:border-gray-700">Last Updated At</th>
              <th className="py-2 px-4 border-b dark:border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {monitors.map((form, index) => (
              <tr key={form.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 align-middle">
                <td className="py-2 px-4 border-b dark:border-gray-700">{form.name}</td>
                <td className="py-2 px-4 border-b dark:border-gray-700">{form.fieldsToTrack}</td>
                <td className="py-2 px-4 border-b dark:border-gray-700">{form.result}</td>
                <td className="py-2 px-4 border-b dark:border-gray-700">{new Date(form.updatedAt).toLocaleString()}</td>
                <td className="py-2 px-4 border-b dark:border-gray-700">
                  <div className="flex items-center justify-center space-x-4">
                    <div onClick={() => refreshMonitor(form.id, index)} className="cursor-pointer">
                      {refreshingId === form.id ? (
                        <FaSpinner className="animate-spin" size={24} />
                      ) : (
                        <MdRefresh size={24} />
                      )}
                    </div>
                    <div onClick={() => deleteMonitorfn(form.id)} className="cursor-pointer">
                      {deletingId === form.id ? (
                        <FaSpinner className="animate-spin" size={24} />
                      ) : (
                        <MdDelete size={24} />
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrackingTable;
