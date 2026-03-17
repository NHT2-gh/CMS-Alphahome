import React from "react";
import { PageBreadcrumb } from ".";

interface MainContainerProps {
  title: string;
  children: React.ReactNode;
  links?: { href?: string; label: string }[];
}

export default function MainContainer({
  title,
  children,
  links,
}: MainContainerProps) {
  return (
    <section className="rounded-lg bg-white p-6 shadow-theme-sm dark:bg-gray-800 space-y-10">
      <PageBreadcrumb pageTitle={title} links={links} />
      <section className="mt-2 text-gray-600 dark:text-gray-400">
        {children}
      </section>
    </section>
  );
}
