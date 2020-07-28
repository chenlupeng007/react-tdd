import React, { useState } from "react";
export interface Customer {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}
export interface CustomerProps extends Customer {
    onSubmit: (customer: Customer) => void;
}
export const CustomerForm = ({
    firstName,
    lastName,
    phoneNumber,
    onSubmit
}: CustomerProps) => {
    const [customer, setCustomer] = useState<Customer>({ firstName, lastName, phoneNumber });
    const handleChange = ({ target }: any) =>
        setCustomer(customer => ({
            ...customer,
            [target.name]: target.value
        }));
    return (
        <form id="customer" onSubmit={() => onSubmit(customer)}>
            <label htmlFor="firstName">First name</label>
            <input
                type="text"
                name="firstName"
                value={firstName}
                id="firstName"
                onChange={handleChange}
            />

            <label htmlFor="lastName">Last name</label>
            <input
                type="text"
                name="lastName"
                value={lastName}
                id="lastName"
                onChange={handleChange}
            />

            <label htmlFor="phoneNumber">Phone number</label>
            <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                value={phoneNumber}
                onChange={handleChange}
            />

            <input type="submit" value="Add" />
        </form>
    );
};
