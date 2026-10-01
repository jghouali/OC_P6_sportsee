import { Form, Link, useActionData, useNavigation } from 'react-router'

function LoginForm() {
    const actionData = useActionData()
    const navigation = useNavigation()
    const loading = navigation.state === "submitting"

    return (
        <div className='flex flex-col w-99.5 gap-4 color-[#141629] items-baseline bg-white p-10 pb-20 rounded-[20px]'>
            <Form method="post" className='flex flex-col gap-10'>
                <h3 className='text-bluePrimary'>Transformez vos stats en résultats</h3>

                <div className='flex flex-col gap-6'>
                    <h4>Se connecter</h4>
                    {actionData?.error && <p>{actionData.error}</p>}
                    <div className='flex flex-col gap-2'>
                        <label className='bodyDefault text-greyLight' htmlFor="loginUsernameInput">Nom d'utilisateur</label>
                        <input className='border border-[#71717155] focus:border-bluePrimary transition-colors duration-300 ease-in h-14.5 w-79.25 pl-5 rounded-[10px] disabled:bg-greyLight disabled:text-greyLight outline-none' type="text" name="username" id="loginUsernameInput" disabled={loading} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='bodyDefault text-greyLight' htmlFor="loginPasswordInput">Mot de passe</label>
                        <input className='border border-[#71717155] focus:border-bluePrimary transition-colors duration-300 ease-in h-14.5 w-79.25 pl-5 rounded-[10px] disabled:bg-greyLight disabled:text-greyLight outline-none' type="password" name="password" id="loginPasswordInput" disabled={loading} />
                    </div>
                    <button className='h-14.5 w-79.25 bg-bluePrimary hover:bg-blueHover transition-colors duration-300 ease-in rounded-[10px] text-white bodyLarge py-4 px-10 disabled:text-greyLight' disabled={loading} type="submit">
                        {loading ? 'Chargement en cours...' : 'Se connecter'}
                    </button>
                </div>
                <Link className='no-underline bodyDefault text-darkPrimary' to="/recover">Mot de passe oublié ?</Link>
            </Form>
        </div>
    )
}

export default LoginForm