'use client';

import React, { useState, useEffect } from 'react';

const CreateLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    meeting_days: [],
    start_time: '',
    end_time: '',
    max_slots: '',
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await fetch('/api/auth/admin/create');
      if (response.ok) {
        const data = await response.json();
        setLessons(data);
      } else {
        console.error('Failed to fetch lessons');
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prevState => ({
      ...prevState,
      meeting_days: prevState.meeting_days.includes(day)
        ? prevState.meeting_days.filter(d => d !== day)
        : [...prevState.meeting_days, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newLesson = {
      ...formData,
      meeting_days: formData.meeting_days.join(','),
      max_slots: parseInt(formData.max_slots, 10)
    };

    try {
      const response = await fetch('/api/auth/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLesson),
      });

      if (response.ok) {
        const createdLesson = await response.json();
        setLessons([...lessons, createdLesson]);
        setFormData({
          start_date: '',
          end_date: '',
          meeting_days: [],
          start_time: '',
          end_time: '',
          max_slots: '',
        });
      } else {
        console.error('Failed to create lesson');
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-8">Create Swim Lessons</h1>

      {/* Form for creating new lessons */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4 flex space-x-4">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start_date">
              Start Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="start_date"
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end_date">
              End Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="end_date"
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Meeting Days
          </label>
          <div className="flex flex-wrap -mx-2">
            {daysOfWeek.map(day => (
              <div key={day} className="px-2 mb-2">
                <button
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-3 py-1 rounded ${
                    formData.meeting_days.includes(day)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {day}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4 flex space-x-4">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start_time">
              Start Time
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="start_time"
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end_time">
              End Time
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="end_time"
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="max_slots">
            Max Slots
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="max_slots"
            type="number"
            placeholder="Maximum number of participants"
            name="max_slots"
            value={formData.max_slots}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create Lesson
          </button>
        </div>
      </form>

      {/* Table of existing lessons */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Existing Lessons</h2>
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date Range
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Meeting Days
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Time
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Max Slots
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => (
              <tr key={lesson.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {new Date(lesson.start_date).toLocaleDateString()} to {new Date(lesson.end_date).toLocaleDateString()}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {lesson.meeting_days}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {new Date(lesson.start_time).toLocaleTimeString()} - {new Date(lesson.end_time).toLocaleTimeString()}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {lesson.max_slots}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button className="text-blue-600 hover:text-blue-900">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateLessons;