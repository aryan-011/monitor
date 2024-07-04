"use client"

import React, { useEffect, useState } from 'react';

interface FormData {
  name: string;
  curl: string;
  fields: string;
  result: string
}

const TrackingTable = () => {
  const [formSubmissions, setFormSubmissions] = useState<any>([]);

  useEffect(() => {
    const fetchFormSubmissions = async () => {
      try {
        const response = await fetch('/api/getMonitors');
        const data = await response.json();
        console.log(data)
        setFormSubmissions(data);
      } catch (error) {
        console.error('Error fetching form submissions:', error);
      }
    };

    fetchFormSubmissions();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b dark:border-gray-700">Name</th>
            {/* <th className="py-2 px-4 border-b dark:border-gray-700">cURL</th> */}
            <th className="py-2 px-4 border-b dark:border-gray-700">Fields</th>
            <th className="py-2 px-4 border-b dark:border-gray-700">Results</th>
          </tr>
        </thead>
        <tbody>
          {formSubmissions?.map((form:any, index:number) => (
            <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <td className="py-2 px-4 border-b dark:border-gray-700">{form.name}</td>
              {/* <td className="py-2 px-4 border-b dark:border-gray-700">{form.curl}</td> */}
              <td className="py-2 px-4 border-b dark:border-gray-700">{form.fieldsToTrack}</td>
              <td className="py-2 px-4 border-b dark:border-gray-700">{form.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackingTable;
