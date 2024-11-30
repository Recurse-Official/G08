"use client";

const Button54 = ({ children, onClick }) => {
  return (
    <button
      className="font-sans text-sm tracking-widest uppercase text-white bg-black cursor-pointer border-4 border-white py-2 px-4 relative user-select-none transition-all active:shadow-none active:translate-x-[5px] active:translate-y-[5px] shadow-[1px_1px_0_0_white,2px_2px_0_0_white,3px_3px_0_0_white,4px_4px_0_0_white,5px_5px_0_0_white] hover:bg-white hover:text-black hover:border-black"
      onClick={onClick}
      role="button"
    >
      {children}
    </button>
  );
};

export default Button54;