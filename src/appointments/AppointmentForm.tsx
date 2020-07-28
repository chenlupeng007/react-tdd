import React, { useState, useCallback } from "react";
import { AppointmentProps } from "./AppointmentsDayView";
type Appointment = Pick<AppointmentProps, "service" | "startsAt">;

interface RadioButtonProps {
    availableTimeSlots: any[];
    date: number;
    timeSlot: number;
    checkedTimeSlot: number;
    handleChange: (args: any) => void;
}

interface TimeSlotTableProps extends Omit<RadioButtonProps, "date" | "timeSlot"> {
    salonOpensAt: number;
    salonClosesAt: number;
    today: Date;
    // availableTimeSlots: any[];
    // checkedTimeSlot: number;
    // handleChange: (args: any) => void;
}
export interface Props extends Omit<TimeSlotTableProps, "checkedTimeSlot" | "handleChange"> {
    selectableServices: string[];
    service: string;
    startsAt: number;
    onSubmit: (appointment: Appointment) => void;
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

const RadioButtonIfAvailable = ({
    availableTimeSlots,
    date,
    timeSlot,
    checkedTimeSlot,
    handleChange
}: RadioButtonProps) => {
    const startsAt = mergeDateAndTime(date, timeSlot);
    if (
        availableTimeSlots.some(
            availableTimeSlot => availableTimeSlot.startsAt === startsAt
        )
    ) {
        const isChecked = startsAt === checkedTimeSlot;
        return (
            <input
                name="startsAt"
                type="radio"
                value={startsAt}
                checked={isChecked}
                onChange={handleChange}
            />
        );
    }
    return null;
};

const TimeSlotTable: React.FC<TimeSlotTableProps> = ({
    salonClosesAt,
    salonOpensAt,
    today,
    availableTimeSlots,
    checkedTimeSlot,
    handleChange,
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
                                <RadioButtonIfAvailable
                                    availableTimeSlots={availableTimeSlots}
                                    date={date}
                                    timeSlot={timeSlot}
                                    checkedTimeSlot={checkedTimeSlot}
                                    handleChange={handleChange}
                                />
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
    availableTimeSlots,
    startsAt
}: Props) => {
    const [appointment, setAppointment] = useState<Appointment>({
        service,
        startsAt
    });
    const handleServiceChange = ({ target: { value } }: any) =>
        setAppointment(appointment => ({
            ...appointment,
            service: value
        }));
    const handleStartsAtChange = useCallback(
        ({ target: { value } }) =>
            setAppointment(appointment => ({
                ...appointment,
                startsAt: parseInt(value)
            })),
        []
    );
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
                checkedTimeSlot={appointment.startsAt}
                handleChange={handleStartsAtChange}
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
    availableTimeSlots: []
};
