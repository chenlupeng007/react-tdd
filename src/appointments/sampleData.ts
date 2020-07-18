import { name, phone, lorem } from 'faker';

const pickRandom = function<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
};

const today = new Date();
const at = (hours: number) => today.setHours(hours, 0);

const stylists = [...new Set( [0, 1, 2, 3, 4, 5, 6]
  .map(() => name.firstName()))]

const services = [
  'Cut',
  'Blow-dry',
  'Cut & color',
  'Beard trim',
  'Cut & beard trim',
  'Extensions'
];

const generateFakeCustomer = () => ({
  firstName: name.firstName(),
  lastName: name.lastName(),
  phoneNumber: phone.phoneNumberFormat(1)
});

const generateFakeAppointment = () => ({
  customer: generateFakeCustomer(),
  stylist: pickRandom(stylists),
  service: pickRandom(services),
  notes: lorem.paragraph()
});

export const sampleAppointments = [
  { startsAt: at(9), ...generateFakeAppointment() },
  { startsAt: at(10), ...generateFakeAppointment() },
  { startsAt: at(11), ...generateFakeAppointment() },
  { startsAt: at(12), ...generateFakeAppointment() },
  { startsAt: at(13), ...generateFakeAppointment() },
  { startsAt: at(14), ...generateFakeAppointment() },
  { startsAt: at(15), ...generateFakeAppointment() },
  { startsAt: at(16), ...generateFakeAppointment() },
  { startsAt: at(17), ...generateFakeAppointment() }
];
