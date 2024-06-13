import { Meta } from "@storybook/react";
import { fn } from "@storybook/test";
import { ChangeEvent, useState } from "react";

const meta = {
    title: "BasicReact",
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    args: { onClick: fn() },
} satisfies Meta;

export default meta;

export const BasicReact = () => {
    // Declare state variables to display on UI
    const [name, setname] = useState('')

    // Logic
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setname(e.target.value)
    }

    const onClick = () => {
        alert(name)
    }

    // UI
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: 500, background: 'black', padding: 24 }}>
            <input placeholder="name" onChange={onChange} style={{marginBottom: 8}}/>
            <button style={{ background: 'green', color: 'white' }} onClick={onClick}>Submit</button>
        </div>
    )
}
