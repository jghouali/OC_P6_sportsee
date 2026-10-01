function Error() {
  return (
    <div className='flex flex-col w-full h-screen justify-center items-center gap-6 text-center py-16 px-8 max-w-150 m-auto '>
      <h3 className='text-9xl m-0 text-bluePrimary font-black'>404</h3>
      <h4>Oups 🙈 Cette page n'existe pas</h4>
      <p className="bodyDefault text-darkPrimary">La page que vous cherchez semble introuvable.</p>
      <a href="/" className='inline-block py-3 px-12 bg-bluePrimary text-white rounded-lg font-extrabold transition-all duration-200 ease-in w-60'>
        Retour à l'accueil
      </a>
    </div>
  )
}

export default Error
