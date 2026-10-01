function BlueBlock({ children, className = '' }) {

    return (
        <div className={`flex flex-row items-center h-25.75 rounded-[10px] bg-bluePrimary py-5 px-7.5 ${className}`} >
            <div className='flex flex-col gap-4.75' >
                {children}
            </div>
        </div>
    )
}

export default BlueBlock