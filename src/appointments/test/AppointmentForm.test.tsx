import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import { createContainer } from "./domManipulators";
import { AppointmentForm } from "../AppointmentForm";

describe("AppointmentForm", () => {
    let render: (component: React.ReactElement) => void;
    let container: HTMLElement;
    const selectableServices = ["Cut", "Blow-dry"];
    const today = new Date(2018, 11, 1);
    const availableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) }
    ];
    const mockProps = {
        selectableServices,
        service: "Blow-dry",
        onSubmit: () => {},
        salonOpensAt: 9,
        salonClosesAt: 11,
        today,
        availableTimeSlots,
        startsAt: availableTimeSlots[0].startsAt
    };

    beforeEach(() => {
        ({ render, container } = createContainer());
    });
    const form = (id: string) =>
        container.querySelector(`form[id="${id}"]`) as HTMLFormElement;
    const field = (name: string) =>
        form("appointment").elements.namedItem(name) as HTMLSelectElement;
    const findOption = (
        dropDownNode: HTMLSelectElement,
        textContent: string
    ) => {
        const options = Array.from(
            dropDownNode.childNodes as NodeListOf<HTMLOptionElement>
        );
        return options.find(
            options => options.textContent === textContent
        ) as HTMLOptionElement;
    };
    const labelFor = (formElement: string) =>
        container.querySelector(
            `label[for="${formElement}"]`
        ) as HTMLLabelElement;
    const timeSlotTable = () =>
        container.querySelector("table#time-slots") as HTMLTableElement;

    const startsAtField = (index: number) => {
        const a = container.querySelectorAll<HTMLInputElement>(
            `input[name="startsAt"]`
        );
        return a[index];
    };
    it("renders a form", () => {
        render(<AppointmentForm {...mockProps} />);

        expect(form("appointment")).not.toBeNull();
    });

    describe("service field", () => {
        it("renders as a select box", () => {
            render(<AppointmentForm {...mockProps} />);

            const serviceElement = field("service");
            expect(serviceElement).not.toBeNull();
            expect(serviceElement.tagName).toEqual("SELECT");
        });

        it("lists all salon services", () => {
            render(
                <AppointmentForm
                    selectableServices={selectableServices}
                    {...mockProps}
                />
            );
            const optionNodes = Array.from(
                field("service").childNodes as NodeListOf<HTMLOptionElement>
            );
            const renderedServices = optionNodes.map(node => node.textContent);
            expect(renderedServices).toEqual(
                expect.arrayContaining(selectableServices)
            );
        });

        it("pre-selects the existing value", () => {
            render(<AppointmentForm {...mockProps} />);
            const option = findOption(field("service"), "Blow-dry");
            expect(option.selected).toBeTruthy();
        });

        it("renders a label", () => {
            render(<AppointmentForm {...mockProps} />);
            expect(labelFor("service")).not.toBeNull();
            expect(labelFor("service").textContent).toEqual("Salon service");
        });

        it("assigns an id that matches the label id", () => {
            render(<AppointmentForm {...mockProps} />);
            expect(field("service").id).toEqual("service");
        });

        it("saves existing value when submitted", () => {
            expect.hasAssertions();
            render(
                <AppointmentForm
                    {...mockProps}
                    onSubmit={({ service }) =>
                        expect(service).toEqual("Blow-dry")
                    }
                />
            );
            ReactTestUtils.Simulate.submit(form("appointment"));
        });

        it("saves new value when submitted", () => {
            expect.hasAssertions();
            render(
                <AppointmentForm
                    {...mockProps}
                    onSubmit={({ service }) => expect(service).toEqual("Cut")}
                />
            );
            ReactTestUtils.Simulate.change(field("service"), {
                target: { value: "Cut", name: "service" }
            } as any);
            ReactTestUtils.Simulate.submit(form("appointment"));
        });
    });

    describe("time slot table", () => {
        it("renders a table for time slots", () => {
            render(<AppointmentForm {...mockProps} />);
            expect(timeSlotTable()).not.toBeNull();
        });
        it("renders a time slot for every half an hour between open and closetimes", () => {
            render(<AppointmentForm {...mockProps} />);
            const timesOfDay = timeSlotTable().querySelectorAll(
                "tbody >* th"
            ) as NodeListOf<HTMLTableHeaderCellElement>;
            expect(timesOfDay).toHaveLength(4);
            expect(timesOfDay[0].textContent).toEqual("09:00");
            expect(timesOfDay[1].textContent).toEqual("09:30");
            expect(timesOfDay[3].textContent).toEqual("10:30");
        });
        it("renders an empty cell at the start of the header row", () => {
            render(<AppointmentForm {...mockProps} />);
            const headerRow = timeSlotTable().querySelector(
                "thead > tr"
            ) as HTMLTableRowElement;
            expect((headerRow.firstChild as ChildNode).textContent).toEqual("");
        });
        it("renders a week of available dates", () => {
            render(<AppointmentForm {...mockProps} />);
            const dates = timeSlotTable().querySelectorAll(
                "thead >* th:not(:first-child)"
            );
            expect(dates).toHaveLength(7);
            expect(dates[0].textContent).toEqual("Sat 01");
            expect(dates[1].textContent).toEqual("Sun 02");
            expect(dates[6].textContent).toEqual("Fri 07");
        });
        it("renders a radio button for each time slot", () => {
            render(<AppointmentForm {...mockProps} />);
            const cells = timeSlotTable().querySelectorAll("td");
            expect(
                cells[0].querySelector('input[type="radio"]')
            ).not.toBeNull();
            expect(
                cells[7].querySelector('input[type="radio"]')
            ).not.toBeNull();
        });
        it("does not render radio buttons for unavailable time slots", () => {
            render(<AppointmentForm {...mockProps} availableTimeSlots={[]} />);
            const timesOfDay = timeSlotTable().querySelectorAll("input");
            expect(timesOfDay).toHaveLength(0);
        });
        it("sets radio button values to the index of the corresponding appointment", () => {
            render(<AppointmentForm {...mockProps}/>);
            expect(startsAtField(0).value).toEqual(
                availableTimeSlots[0].startsAt.toString()
            );
            expect(startsAtField(1).value).toEqual(
                availableTimeSlots[1].startsAt.toString()
            );
        });

        it("pre-selects the existing value", () => {
            render(<AppointmentForm {...mockProps} />);
            expect(startsAtField(0).checked).toEqual(true);
        });

        it("saves existing value when submitted", () => {
            expect.hasAssertions();
            render(
                <AppointmentForm
                    {...mockProps}
                    onSubmit={({ startsAt }) =>
                        {
                            expect(startsAt).toEqual(availableTimeSlots[0].startsAt);
                        }
                    }
                />
            );
            ReactTestUtils.Simulate.submit(form("appointment"));
        });

        it('saves new value when submitted', () => {
            expect.hasAssertions();
            render(
                <AppointmentForm
                    {...mockProps}
                    onSubmit={({ startsAt }) =>
                        {
                            expect(startsAt).toEqual(availableTimeSlots[1].startsAt);
                        }
                    }
                />
            );
            ReactTestUtils.Simulate.change(startsAtField(1), {
              target: {
                value: availableTimeSlots[1].startsAt.toString(),
                name: 'startsAt'
              }
            } as any);
            ReactTestUtils.Simulate.submit(form('appointment'));
          });
    });
});
