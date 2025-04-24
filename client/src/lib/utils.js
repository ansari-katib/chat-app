import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import animationData from "@/assets/react-lottie";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}



export const colors = [
  "bg-[#ff000080] text-white border-[1px] border-[#ff000080]",  // Red with 50% transparency
  "bg-[#ffff0080] text-black border-[1px] border-[#ffff0080]",  // Yellow with 50% transparency
  "bg-[#33333380] text-white border-[1px] border-[#33333380]",  // Dark gray with 50% transparency
  "bg-[#00808080] text-white border-[1px] border-[#00808080]",  // Teal with 50% transparency
  "bg-[#00000060] text-white border-[1px] border-[#00000060]"   // Black with 60% transparency
];


export const getColor = (colorIndex) => {
  if (colorIndex >= 0 && colorIndex < colors.length) {
    return colors[colorIndex];
  }
  return colors[0]; 
}


export const animationDefaultOptions = {
  loop:true,
  autoplay:true,
  animationData,
}