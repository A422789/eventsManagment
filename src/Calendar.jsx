import React, { useState, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventsContext } from './EventsContext';

const Page1 = () => {
  const { events, addEvent, deleteEvent, updateEvent, loading } = useContext(EventsContext);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);
  

  const [formData, setFormData] = useState({ title: '', description: '', location: '' });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [expandedEventId, setExpandedEventId] = useState(null);


  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedDateInfo(null);
    setIsEditMode(false);
    setFormData({ title: '', description: '', location: '' });
  };

  const handleDateSelect = (selectInfo) => {
    setSelectedDateInfo(selectInfo);
    setFormData({ title: '', description: '', location: '' });
    setIsEditMode(false);
    setDialogOpen(true);
  };

  const handleEditClick = (event) => {
    setEditingEventId(event.id);
    setFormData({ 
        title: event.title, 
        description: event.description || '', 
        location: event.location || '' 
    });
    setIsEditMode(true);
    setDialogOpen(true);
    setOpenMenuId(null);
  };

  const handleSaveEvent = async () => {
    if (formData.title) {
      if (isEditMode) {
        await updateEvent(editingEventId, formData);
      } else if (selectedDateInfo) {
        await addEvent({
          ...formData,
          start: selectedDateInfo.startStr,
          end: selectedDateInfo.endStr,
          allDay: selectedDateInfo.allDay,
        });
      }
      handleDialogClose();
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete '${title}'?`)) {
      await deleteEvent(id);
      setOpenMenuId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#e0e0e0] p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
        
       
        <div className="w-full md:w-1/4 bg-[#1e1e1e] rounded-xl p-6 shadow-2xl border border-[#333] h-fit md:h-[85vh] overflow-y-auto">
          <h2 className="text-[#bb86fc] text-xl font-bold text-center mb-6 border-b border-[#333] pb-4">
            Events List ({events.length})
          </h2>
          <ul className="space-y-3">
            {events.map((event) => (
              <li key={event.id} className="bg-[#2c2c2c] rounded-lg border-l-4 border-[#bb86fc] shadow-md transition-all">
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer" 
                  onClick={() => setExpandedEventId(expandedEventId === event.id ? null : event.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                       <span className={`text-[#bb86fc] text-[10px] transition-transform ${expandedEventId === event.id ? 'rotate-90' : ''}`}>▶</span>
                       <p className="font-semibold text-[#bb86fc] truncate">{event.title}</p>
                    </div>
                    <p className="text-sm text-gray-400 ml-4">
                      {new Date(event.start).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="relative ml-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === event.id ? null : event.id); }} 
                      className="text-gray-400 hover:text-white p-1 font-bold"
                    >⋮</button>
                    {openMenuId === event.id && (
                      <div className="absolute right-0 mt-2 w-28 bg-[#1e1e1e] border border-[#444] rounded-md shadow-xl z-50 overflow-hidden">
                        <button onClick={(e) => { e.stopPropagation(); handleEditClick(event); }} className="w-full text-left px-4 py-2 text-sm hover:bg-[#333]">Edit</button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(event.id, event.title); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#333]">Delete</button>
                      </div>
                    )}
                  </div>
                </div>

              
                {expandedEventId === event.id && (
                  <div className="px-8 pb-4 text-sm space-y-2 border-t border-[#333] pt-3 bg-[#252525]/50 animate-fadeIn">
                    <p><span className="text-gray-500 font-bold">Location:</span> <span className="text-gray-300">{event.location || "Not set"}</span></p>
                    <p><span className="text-gray-500 font-bold">Description:</span> <span className="text-gray-300 block mt-1 italic">{event.description || "No description"}</span></p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

 
        <div className="flex-1 bg-[#1e1e1e] rounded-xl p-4 shadow-2xl border border-[#333] overflow-hidden custom-calendar">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            select={handleDateSelect}
            eventClick={(info) => {
              const eventData = events.find(e => e.id === info.event.id);
              if (eventData) handleEditClick(eventData);
            }}
            eventDrop={async (info) => {
                await updateEvent(info.event.id, {
                  start: info.event.startStr,
                  end: info.event.endStr
                });
            }}
          />
        </div>
      </div>


      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="p-6 space-y-4">
              <h3 className="text-[#bb86fc] text-xl font-bold mb-4">
                {isEditMode ? "Update Event" : "Add New Event"}
              </h3>
              <div className="space-y-4">
                <input
                  autoFocus
                  type="text"
                  placeholder="Event Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-[#2c2c2c] border border-[#444] rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#bb86fc] focus:ring-1 focus:ring-[#bb86fc] transition-all"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-[#2c2c2c] border border-[#444] rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#bb86fc] focus:ring-1 focus:ring-[#bb86fc] transition-all"
                />
                <textarea
                  placeholder="Description"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-[#2c2c2c] border border-[#444] rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#bb86fc] focus:ring-1 focus:ring-[#bb86fc] transition-all resize-none"
                />
              </div>
            </div>
            <div className="bg-[#252525] p-4 flex justify-end gap-3">
              <button 
                onClick={handleDialogClose} 
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEvent}
                className="bg-[#bb86fc] text-[#121212] font-bold px-6 py-2 rounded-lg hover:bg-[#a370e0] transition-colors shadow-lg"
              >
                {isEditMode ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
     <style>{`
        .custom-calendar .fc { --fc-border-color: #333; --fc-daygrid-event-dot-width: 8px; color: #e0e0e0; }
        .custom-calendar .fc-toolbar-title { color: #bb86fc !important; font-weight: bold; }
        .custom-calendar .fc-button-primary { background-color: #3f51b5 !important; border: none !important; text-transform: capitalize; }
        .custom-calendar .fc-button-primary:hover { background-color: #303f9f !important; }
        .custom-calendar .fc-button-active { background-color: #bb86fc !important; color: #121212 !important; }
        .custom-calendar .fc-event { background-color: #bb86fc !important; border: none !important; padding: 2px 4px; cursor: pointer; }
        .custom-calendar .fc-event-title { color: #121212 !important; font-weight: 600; }
        .custom-calendar .fc-day-today { background: rgba(187, 134, 252, 0.1) !important; }
        .custom-calendar .fc-col-header-cell-cushion { color: #bb86fc; padding: 10px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Page1;