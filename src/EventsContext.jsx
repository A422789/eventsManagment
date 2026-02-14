import React, { createContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc 
} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC93VGVS2a5XERGR3CvWTvFUzmH2cnKJJM",
  authDomain: "eventmanagment-fdba1.firebaseapp.com",
  projectId: "eventmanagment-fdba1",
  storageBucket: "eventmanagment-fdba1.firebasestorage.app",
  messagingSenderId: "218695199702",
  appId: "1:218695199702:web:c71d9d4617c96d9c21d277",
  measurementId: "G-NHNYBF29K2"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const EventsContext = createContext(null);

export const EventsContextProvider = ({ children }) => {
  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const eventsCollectionRef = collection(db, "events");
    
  
    const unsubscribe = onSnapshot(eventsCollectionRef, (snapshot) => {
      const fetchedEvents = snapshot.docs.map((doc) => ({
        id: doc.id,       
        ...doc.data(),    
      }));
      setEvents(fetchedEvents);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const addEvent = async (eventObject) => {
    try {
      const eventsCollectionRef = collection(db, "events");
     
      await addDoc(eventsCollectionRef, eventObject);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };


  const deleteEvent = async (eventId) => {
    try {
      const eventDocRef = doc(db, "events", eventId);
      await deleteDoc(eventDocRef);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };


  const updateEvent = async (eventId, updatedData) => {
    try {
      const eventDocRef = doc(db, "events", eventId);
      await updateDoc(eventDocRef, updatedData);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const contextValue = {
    events,      
    addEvent,     
    updateEvent,
    deleteEvent,  
    loading      
  };

  return (
    <EventsContext.Provider value={contextValue}>
      {children}
    </EventsContext.Provider>
  );
};
