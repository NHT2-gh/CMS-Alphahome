"use client";
import Button from "@/components/ui/button/Button";
import CustomLink from "@/components/ui/links/Link";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface BreadcrumbProps {
  pageTitle: string;
  links?: { href?: string; label: string }[];
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, links }) => {
  const route = useRouter();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <h2
        className="text-xl font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
      >
        {pageTitle}
      </h2>
      {links ? (
        <nav>
          <ol className="flex items-center gap-1.5">
            <li className="inline-flex items-center gap-1.5 text-sm">
              <CustomLink className="" href="/" variant="colored" color="info">
                Home
              </CustomLink>
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </li>

            {links?.map((link) => (
              <li key={link.label} className="group flex items-center gap-1.5">
                {link.href ? (
                  <CustomLink
                    className=""
                    href={link.href}
                    variant="colored"
                    color="info"
                  >
                    {link.label}
                  </CustomLink>
                ) : (
                  <span className="text-sm text-gray-800 dark:text-white/90">
                    {link.label}
                  </span>
                )}

                <svg
                  className="stroke-current group-last:hidden"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    stroke=""
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </li>
            ))}
          </ol>
        </nav>
      ) : (
        <Button onClick={() => route.back()}>Quay lại trang trước</Button>
      )}
    </div>
  );
};

export default PageBreadcrumb;
