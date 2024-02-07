import React, { useEffect, useState } from "react";
import { BuilderComponent, Builder, builder } from "@builder.io/react";

builder.init("8f912ba45f0940a6b238646a2ec68cbb");

export const MyComponent = () => {
    const [builderContentJson, setBuilderContentJson] = useState(null);

    useEffect(() => {
        builder
            .get("page", { url: location.pathname })
            .promise()
            .then(setBuilderContentJson);
    }, []);

    return <BuilderComponent model="page" content={builderContentJson} />;
};

// Register your components for use in the visual editor!
// https://www.builder.io/blog/drag-drop-react
const Heading = props => <h1 className="my-heading">{props.title}</h1>;

Builder.registerComponent(Heading, {
    name: "Heading",
    inputs: [{ name: "title", type: "text" }]
});
