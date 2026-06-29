const PetCategoryCard = ({
  title,
  image,
  backgroundColor,
  onClick,
  active = false,
  imageAlt,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${backgroundColor} rounded-[26px] p-4 sm:p-6 flex flex-col items-center justify-center text-center hover:scale-105 duration-300 cursor-pointer shadow-sm hover:shadow-xl snap-center shrink-0 w-[140px] sm:w-[180px] md:w-[240px] transition-all ${
        active
          ? "ring-4 ring-orange-300 border-2 border-orange-400 shadow-lg scale-[1.02]"
          : "border border-transparent"
      }`}
    >
      <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center">
        <img
          src={image}
          alt={imageAlt || title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      <h3 className="mt-3 sm:mt-4 font-bold text-lg sm:text-xl md:text-2xl text-gray-900">
        {title}
      </h3>
    </button>
  );
};

export default PetCategoryCard;
