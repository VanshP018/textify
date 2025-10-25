const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-base-200 p-12 text-center">
      <img
        src="./public/image.png"
        alt="Auth Visual"
        className="w-2/3 max-w-lg mb-8 rounded-2xl shadow-lg object-cover"
      />
      <h2 className="text-5xl font-extrabold mb-3">{title}</h2>
      <p className="text-xl text-base-content/70 max-w-xl">{subtitle}</p>
    </div>
  );
};




export default AuthImagePattern;
