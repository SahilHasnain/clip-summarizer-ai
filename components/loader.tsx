"use client";

export function Loader() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200"></div>
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  );
}
