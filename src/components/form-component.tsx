interface Props {
    label: string;
    name: string;
    value?: string
}

export default function FormComponent({ label, name, value }: Props) {
    return (
        <>
            <div>
                <label className="block text-white mb-1" htmlFor={name}>{label}</label>
                <input className="p-1 pl-3 w-[50vw] focus:outline-1 focus:outline-white bg-white placeholder:text-black/30 placeholder:lowercase placeholder:text-sm" type="text" name={name} id={name} placeholder={`Enter ${label}`} defaultValue={value} />
            </div>
        </>
    )
}