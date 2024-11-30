"use client";

const Button54Red = ({ children, onClick }) => {
  return (
    <button
      className="font-sans text-sm tracking-widest uppercase text-white bg-red-500 cursor-pointer border-4 border-red-200 py-2 px-4 relative user-select-none transition-all active:shadow-none active:translate-x-[5px] active:translate-y-[5px] shadow-[1px_1px_0_0_red,2px_2px_0_0_red,3px_3px_0_0_red,4px_4px_0_0_red,5px_5px_0_0_red] hover:bg-white hover:text-red-500 hover:border-red-500"
      onClick={onClick}
      role="button"
    >
      {children}
    </button>
  );
};

export default Button54Red;