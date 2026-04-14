import React from "react";

export default function TableNotFound({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <p className="mt-2 text-gray-600 dark:text-gray-400 italic">
          {message}
        </p>
      </div>
    </div>
  );
}
