"use client";

const Button54 = ({ children, onClick }) => {
  return (
    <button
      className="font-sans text-sm tracking-widest uppercase text-black bg-white cursor-pointer border-4 border-black py-2 px-4 relative user-select-none transition-all active:shadow-none active:translate-x-[5px] active:translate-y-[5px] shadow-[1px_1px_0_0_black,2px_2px_0_0_black,3px_3px_0_0_black,4px_4px_0_0_black,5px_5px_0_0_black] hover:bg-black hover:text-white hover:border-white"
      onClick={onClick}
      role="button"
    >
      {children}
    </button>
  );
};

export default Button54;