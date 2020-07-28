import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import { createContainer } from "./domManipulators";
import { CustomerForm, Customer, CustomerProps } from "../CustomerForm";

describe("CustomerForm", () => {
    let render: (component: React.ReactElement) => void;
    let container: HTMLElement;

    const MockCustomer: CustomerProps = {
        firstName: "Ashley",
        lastName: "Green",
        phoneNumber: '1234567',
        onSubmit: () => {}
    };

    beforeEach(() => {
        ({ render, container } = createContainer());
    });

    const form = (id: string) =>
        container.querySelector(`form[id="${id}"]`) as HTMLFormElement;
    const field = (name: string) =>
        form("customer").elements.namedItem(name) as HTMLInputElement;
    const labelFor = (formElement: string) =>
        container.querySelector(
            `label[for="${formElement}"]`
        ) as HTMLLabelElement;
    const expectToBeInputFieldOfTypeText = (formElement: HTMLInputElement) => {
        expect(formElement).not.toBeNull();
        expect(formElement.tagName).toEqual("INPUT");
        expect(formElement.type).toEqual("text");
    };

    it("renders a form", () => {
        render(<CustomerForm {...MockCustomer} />);
        expect(form("customer")).not.toBeNull();
    });

    it("has a submit button", () => {
        render(<CustomerForm {...MockCustomer} />);
        const submitButton = container.querySelector('input[type="submit"]');
        expect(submitButton).not.toBeNull();
    });

    const itRendersAsATextBox = (fieldName: string) =>
        it("renders as a text box", () => {
            render(<CustomerForm {...MockCustomer} />);
            expectToBeInputFieldOfTypeText(field(fieldName));
        });

    const itAssignsAnIdThatMatchesTheLabelId = (fieldName: keyof Customer) =>
        it("assigns an id that matches the label id", () => {
            render(<CustomerForm {...MockCustomer} />);
            expect(field(fieldName).id).toEqual(fieldName);
        });

    const itIncludesTheExistingValue = (
        fieldName: keyof Customer,
        value: string
    ) =>
        it("includes the existing value", () => {
            render(
                <CustomerForm {...MockCustomer} {...{ [fieldName]: value }} />
            );
            expect(field(fieldName).value).toEqual(value);
        });

    const itRendersALabel = (fieldName: keyof Customer, text: string) =>
        it("renders a label", () => {
            render(
                <CustomerForm
                    {...MockCustomer}
                    {...{ [fieldName]: "Ashley" }}
                />
            );
            expect(labelFor(fieldName)).not.toBeNull();
            expect(labelFor(fieldName).textContent).toEqual(text);
        });

    const itSubmitsExistingValue = (fieldName: keyof Customer) =>
        it("saves existing first name when submitted", () => {
            expect.hasAssertions();
            render(
                <CustomerForm
                    {...MockCustomer}
                    {...{ [fieldName]: "value" }}
                    onSubmit={props =>
                        expect(props[fieldName]).toEqual("value")
                    }
                />
            );
            ReactTestUtils.Simulate.submit(form("customer"));
        });

    const itSubmitsNewValue = (fieldName: keyof Customer, value: string) =>
        it("saves new value when submitted", () => {
            expect.hasAssertions();
            render(
                <CustomerForm
                    {...MockCustomer}
                    onSubmit={props => {
                        expect(props[fieldName]).toEqual(value);
                    }}
                />
            );
            ReactTestUtils.Simulate.change(field(fieldName), {
                target: { value, name: fieldName }
            } as any);
            ReactTestUtils.Simulate.submit(form("customer"));
        });

    describe("first name field", () => {
        itRendersAsATextBox("firstName");
        itIncludesTheExistingValue("firstName", "Ashley");
        itRendersALabel("firstName", "First name");
        itAssignsAnIdThatMatchesTheLabelId("firstName");
        itSubmitsExistingValue("firstName");
        itSubmitsNewValue("firstName", "Jamie");
    });

    describe("last name field", () => {
        itRendersAsATextBox("lastName");
        itIncludesTheExistingValue("lastName", "Green");
        itRendersALabel("lastName", "Last name");
        itAssignsAnIdThatMatchesTheLabelId("lastName");
        itSubmitsExistingValue("lastName");
        itSubmitsNewValue("lastName", "Curry");
    });

    describe("phone number field", () => {
        itRendersAsATextBox("phoneNumber");
        itIncludesTheExistingValue("phoneNumber", "1234567");
        itRendersALabel("phoneNumber", "Phone number");
        itAssignsAnIdThatMatchesTheLabelId("phoneNumber");
        itSubmitsExistingValue("phoneNumber");
        itSubmitsNewValue("phoneNumber", "67890");
    });
});
