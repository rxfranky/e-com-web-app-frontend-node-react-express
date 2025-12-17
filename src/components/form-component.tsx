import { number } from "motion/react";

interface Props {
    label: string;
    name: string;
    value?:string
}

export default function FormComponent({ label, name, value }: Props) {
    return (
        <>
            <div>
                <label className="block font-semibold" htmlFor={name}>{label}</label>
                <input className="p-1 pl-3 w-[50vw] focus:outline-2 focus:outline-amber-400 border border-amber-400 rounded-md" type="text" name={name} id={name} placeholder={`Enter ${label.toLowerCase()}`} defaultValue={value}/>
            </div>
        </>
    )
}