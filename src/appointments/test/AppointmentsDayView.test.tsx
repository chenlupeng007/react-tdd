import React from "react";
import ReactDom from "react-dom";
import ReactTestUtils from "react-dom/test-utils";
import { Appointment, AppointmentsDayView, AppointmentProps } from "../AppointmentsDayView";
const today = new Date();
const at = (hours: number) => today.setHours(hours, 0);
export const appointments: Array<AppointmentProps> = [
    { startsAt: at(12), customer: { firstName: "Ashley", lastName: 'Jones',phoneNumber: '123456789' }, stylist: 'Sam', service: 'Cut', notes: 'abc' },
    { startsAt: at(13), customer: { firstName: "Jordan", lastName: 'Smith', phoneNumber: '234567890'}, stylist: 'Jo', service: 'Blow-dry', notes: 'def' },
];
describe("Appointment", () => {
    let component: React.ReactElement;
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement("div");
    });

    const render = (component: React.ReactElement) =>
        ReactDom.render(component, container);
    const appointmentTable = () =>
        container.querySelector("#appointmentView > table") as Element;

    it("renders a table", () => {
        component = <Appointment {...appointments[0]} />;

        render(component);
        expect(appointmentTable()).not.toBeNull();
    });

    it("renders the customer first name", () => {
        component = <Appointment {...appointments[0]} />;

        render(component);
        expect(appointmentTable().textContent).toMatch("Ashley");
    });

    it("renders another customer first name", () => {
        component = <Appointment {...appointments[1]} />;

        render(component);
        expect(appointmentTable().textContent).toMatch("Jordan");
    });

    it("renders the customer last name", () => {
        component = <Appointment {...appointments[0]} />;

        render(component);
        expect(appointmentTable().textContent).toMatch("Jones");
    });

    it("renders another customer last name", () => {
        component = <Appointment {...appointments[1]} />;

        render(component);
        expect(appointmentTable().textContent).toMatch("Smith");
    });

    it("renders the customer phone number", () => {
        component = <Appointment {...appointments[0]} />;

        render(component);
        expect(appointmentTable().textContent).toMatch("123456789");
    });

    it("renders another customer phone number", () => {
        component = <Appointment {...appointments[1]} />;

        render(component);
        expect(appointmentTable().textContent).toMatch("234567890");
    });

    it("renders the stylist name", () => {
        component = <Appointment {...appointments[0]} />;

        render(component);
        expect(appointmentTable().textContent).toMatch("Sam");
    });

    it("renders another stylist name", () => {
        component = <Appointment {...appointments[1]} />;

        render(component);
        expect(appointmentTable().textContent).toMatch("Jo");
    });

    it("renders the salon service", () => {
        component = <Appointment {...appointments[0]} />;

        render(component);
        expect(appointmentTable().textContent).toMatch("Cut");
    });

    it("renders another salon service", () => {
        component = <Appointment {...appointments[1]} />;

        render(component);
        expect(appointmentTable().textContent).toMatch("Blow-dry");
    });

    it("renders the appointments notes", () => {
        component = <Appointment {...appointments[0]} />;

        render(component);
        expect(appointmentTable().textContent).toMatch("abc");
    });

    it("renders other appointment notes", () => {
        component = <Appointment {...appointments[1]} />;

        render(component);
        expect(appointmentTable().textContent).toMatch("def");
    });

    it("renders a heading with the time", () => {
        component = <Appointment {...appointments[0]} />;

        render(component);
        expect(container.querySelector("h3")).not.toBeNull();
        expect(container.querySelector("h3")!.textContent).toEqual(
            "Today’s appointment at 12:00"
        );
    });
});

describe("AppointmentsDayView", () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement("div");
    });

    const render = (component: React.ReactElement) =>
        ReactDom.render(component, container);

    it("renders a div with the right id", () => {
        render(<AppointmentsDayView appointments={[]} />);
        expect(
            container.querySelector("div#appointmentsDayView")
        ).not.toBeNull();
    });

    it("renders multiple appointments in an ol elements", () => {
        render(<AppointmentsDayView appointments={appointments} />);
        expect(container.querySelector("ol")).not.toBeNull();
        expect(container.querySelector("ol")!.children).toHaveLength(2);
    });

    it("renders each appointment in an li", () => {
        render(<AppointmentsDayView appointments={appointments} />);
        expect(container.querySelectorAll("li")).toHaveLength(2);
        expect(container.querySelectorAll("li")[0].textContent).toEqual(
            "12:00"
        );
        expect(container.querySelectorAll("li")[1].textContent).toEqual(
            "13:00"
        );
    });

    it("initially shows a message saying there are no appointmentstoday", () => {
        render(<AppointmentsDayView appointments={[]} />);
        expect(container.textContent).toMatch(
            "There are no appointments scheduled for today."
        );
    });

    it(" selects the first appointment by default", () => {
        render(<AppointmentsDayView appointments={appointments} />);
        expect(container.textContent).toMatch("Ashley");
    });

    it("has a button element in each li", () => {
        render(<AppointmentsDayView appointments={appointments} />);
        expect(container.querySelectorAll("li > button")).toHaveLength(2);
        expect(
            (container.querySelectorAll("li > button")[0] as HTMLButtonElement)
                .type
        ).toEqual("button");
    });

    it("renders another appointment when selected", () => {
        render(<AppointmentsDayView appointments={appointments} />);
        const button = container.querySelectorAll("button")[1];
        ReactTestUtils.Simulate.click(button);
        expect(container.textContent).toMatch("Jordan");
    });
});
