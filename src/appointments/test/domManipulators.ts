import ReactDOM from "react-dom";
import React from 'react'
export const createContainer = () => {
    const container = document.createElement("div");
    return {
        render: (component: React.ReactElement) => ReactDOM.render(component, container),
        container
    };
};
