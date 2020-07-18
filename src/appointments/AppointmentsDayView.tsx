import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
export interface Customer {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface AppointmentProps {
    startsAt: number;
    customer: Customer;
    stylist: string;
    service: string;
    notes: string;
}

export interface AppointmentsDayViewProps {
    appointments: Array<AppointmentProps>;
}

const appointmentTimeOfDay = (startAt: number) => {
    const [h, m] = new Date(startAt).toTimeString().split(":");
    return `${h}:${m}`;
};

const useStyles = makeStyles({
    appointmentsDayView: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center"
    },
    ol: {
        width: "99px",
        listStyleType: "none",
        padding: "0",
        borderRight: "1px solid black"
    },
    button: {
        background: "#579",
        textDecoration: "none",
        fontWeight: "bold",
        color: "white",
        boxShadow: "none",
        border: "0",
        outline: "none",
        padding: "5px 15px",
        margin: "5px 5px 5px 0px",
        WebkitAppearance: "none",
        borderRadius: "2px",
        cursor: "pointer"
    },
    toggledButton: {
        background: "#79a"
    },
    appointmentView: {
        width: "700px"
    },
    table: {
        width: "100%",
        marginTop: "10px",
        padding: "0",
        borderSpacing: "0",
        borderCollapse: "collapse"
    },
    td: {
        padding: '5px',
        textAlign: 'center',
        height: '30px',
        verticalAlign: 'top'
    },
    h3: {
        marginLeft: '10px',
    }
});

export const Appointment: React.FC<AppointmentProps> = ({
    customer,
    stylist,
    service,
    notes,
    startsAt
}) => {
    const classes = useStyles();
    return (
        <div id="appointmentView" className={classes.appointmentView}>
            <h3 className={classes.h3}>
                Today&rsquo;s appointment at {appointmentTimeOfDay(startsAt)}
            </h3>
            <table className={classes.table}>
                <tbody>
                    <tr>
                        <td className={classes.td}>Customer</td>
                        <td className={classes.td}>
                            {customer.firstName} {customer.lastName}
                        </td>
                    </tr>
                    <tr>
                        <td className={classes.td}>Phone number</td>
                        <td className={classes.td}>{customer.phoneNumber}</td>
                    </tr>
                    <tr>
                        <td className={classes.td}>Stylist</td>
                        <td className={classes.td}>{stylist}</td>
                    </tr>
                    <tr>
                        <td className={classes.td}>Service</td>
                        <td className={classes.td}>{service}</td>
                    </tr>
                    <tr>
                        <td className={classes.td}>Notes</td>
                        <td className={classes.td}>{notes}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export const AppointmentsDayView: React.FC<AppointmentsDayViewProps> = ({
    appointments
}) => {
    const [selectedAppointment, setSelectedAppointment] = useState(0);
    const classes = useStyles();
    return (
        <div id="appointmentsDayView" className={classes.appointmentsDayView}>
            <ol className={classes.ol}>
                {appointments.map((appointment, index) => (
                    <li key={appointment.startsAt}>
                        <button
                            type="button"
                            onClick={() => setSelectedAppointment(index)}
                            className={
                                index === selectedAppointment
                                    ? `${classes.button} ${classes.toggledButton}`
                                    : classes.button
                            }
                        >
                            {appointmentTimeOfDay(appointment.startsAt)}
                        </button>
                    </li>
                ))}
            </ol>
            {appointments.length === 0 ? (
                <p>There are no appointments scheduled for today.</p>
            ) : (
                <Appointment {...appointments[selectedAppointment]} />
            )}
        </div>
    );
};
