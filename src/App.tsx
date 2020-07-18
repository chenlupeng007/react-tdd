import React from 'react';
import {AppointmentsDayView} from './appointments/AppointmentsDayView'
import {sampleAppointments} from './appointments/sampleData'

function App() {
  return (
    <AppointmentsDayView appointments={sampleAppointments}/>
  );
}

export default App;