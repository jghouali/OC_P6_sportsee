import styles from './Logo.module.scss'

function Logo({ withCompanyName = false }) {
    return (
        <div className='flex flex-row relative z-0 gap-1.25 items-baseline' >
            <div className='flex flex-row gap-px'>
                <div className='relative w-0.75'>
                    <div className={`${styles.logo__divOrange} ${styles['logo__divOrange--1']}`}></div >
                    <div className={`${styles.logo__divPink} ${styles['logo__divPink--1']}`}></div>
                </div>
                <div className='relative w-0.75'>
                    <div className={`${styles.logo__divOrange} ${styles['logo__divOrange--2']}`}></div >
                    <div className={`${styles.logo__divPink} ${styles['logo__divPink--2']}`}></div >
                </div>
                <div className='relative w-0.75'>
                    <div className={`${styles.logo__divOrange} ${styles['logo__divOrange--3']}`}></div >
                    <div className={`${styles.logo__divPink} ${styles['logo__divPink--3']}`}></div >
                </div>
                <div className='relative w-0.75'>
                    <div className={`${styles.logo__divOrange} ${styles['logo__divOrange--4']}`}></div >
                    <div className={`${styles.logo__divPink} ${styles['logo__divPink--4']}`}></div >
                </div >
                <div className='relative w-0.75'>
                    <div className={`${styles.logo__divOrange} ${styles['logo__divOrange--5']}`}></div >
                    <div className={`${styles.logo__divPink} ${styles['logo__divPink--5']}`}></div >
                </div >
            </div>
            {(withCompanyName) && <div className='text-[30px] text-bluePrimary tracking-normal font-bold'>SPORTSEE</div>}
        </div >
    )
}

export default Logo