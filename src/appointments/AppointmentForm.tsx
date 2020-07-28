import React, { useState } from "react";
import { AppointmentProps } from "./AppointmentsDayView";

interface TimeSlotTableProps {
    salonOpensAt: number;
    salonClosesAt: number;
    today: Date;
    availableTimeSlots: any[];
}
export interface Props extends TimeSlotTableProps {
    selectableServices: string[];
    service: string;
    onSubmit: (appointment: any) => void;
}

const timeIncrements = (
    numTimes: number,
    startTime: number,
    increment: number
) =>
    Array<number>(numTimes)
        .fill(startTime)
        .reduce<number[]>((acc, _, i) => {
            return acc.concat([startTime + i * increment]);
        }, []);

const dailyTimesSlots = (salonOpensAt: number, salonClosesAt: number) => {
    const totalSlots = (salonClosesAt - salonOpensAt) * 2;
    const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
    const increment = 30 * 60 * 1000;
    return timeIncrements(totalSlots, startTime, increment);
};

const weeklyDateValues = (startDate: Date) => {
    const midnight = new Date(startDate).setHours(0, 0, 0, 0);
    const increment = 24 * 60 * 60 * 1000;
    return timeIncrements(7, midnight, increment);
};

const toShortDate = (timestamp: number) => {
    const [day, , dayOfMonth] = new Date(timestamp).toDateString().split(" ");
    return `${day} ${dayOfMonth}`;
};

const toTimeValue = (timestamp: number) =>
    new Date(timestamp).toTimeString().substring(0, 5);

const mergeDateAndTime = (date: number, timeSlot: number) => {
    const time = new Date(timeSlot);
    return new Date(date).setHours(
        time.getHours(),
        time.getMinutes(),
        time.getSeconds(),
        time.getMilliseconds()
    );
};

const TimeSlotTable: React.FC<TimeSlotTableProps> = ({
    salonClosesAt,
    salonOpensAt,
    today,
    availableTimeSlots
}) => {
    const timeSlots = dailyTimesSlots(salonOpensAt, salonClosesAt);
    const dates = weeklyDateValues(today);
    return (
        <table id="time-slots">
            <thead>
                <tr>
                    <th />
                    {dates.map(d => (
                        <th key={d}>{toShortDate(d)}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {timeSlots.map(timeSlot => (
                    <tr key={timeSlot}>
                        <th>{toTimeValue(timeSlot)}</th>
                        {dates.map(date => (
                            <td key={date}>
                                {availableTimeSlots.some(
                                    availableTimeSlot =>
                                        availableTimeSlot.startAt ===
                                        mergeDateAndTime(date, timeSlot)
                                ) ? (
                                    <input type="radio" />
                                ) : null}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export const AppointmentForm = ({
    selectableServices,
    service,
    onSubmit,
    salonOpensAt,
    salonClosesAt,
    today,
    availableTimeSlots
}: Props) => {
    const [appointment, setAppointment] = useState<
        Pick<AppointmentProps, "service">
    >({ service });
    const handleServiceChange = ({ target: { value } }: any) =>
        setAppointment(appointment => ({
            ...appointment,
            service: value
        }));

    return (
        <form id="appointment" onSubmit={() => onSubmit(appointment)}>
            <label htmlFor="service">Salon service</label>
            <select
                name="service"
                value={service}
                id="service"
                onChange={handleServiceChange}
            >
                {selectableServices.map(s => (
                    <option key={s}>{s}</option>
                ))}
            </select>
            <TimeSlotTable
                salonOpensAt={salonOpensAt}
                salonClosesAt={salonClosesAt}
                today={today}
                availableTimeSlots={availableTimeSlots}
            />
        </form>
    );
};
AppointmentForm.defaultProps = {
    selectableServices: [
        "Cut",
        "Blow-dry",
        "Cut & color",
        "Beard trim",
        "Cut & beard trim",
        "Extensions"
    ],
    salonOpensAt: 9,
    salonClosesAt: 11,
    today: new Date(),
    availableTimeSlots: [],
};
