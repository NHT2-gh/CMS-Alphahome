"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import DatePicker from "@/components/form/DatePicker";
import { User } from "@/types/user";
import { SaveIcon, XIcon } from "lucide-react";
import { updateUserSchema } from "@/lib/validations/user";
import { z } from "zod";

interface EditUserFormProps {
  user: User;
  onSubmit: (userData: Partial<User>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EditUserForm({
  user,
  onSubmit,
  onCancel,
  isLoading = false,
}: EditUserFormProps) {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    status: user.status,
    role: user.role,
    avatar: user.avatar,
    cover: user.cover,
    profile: {
      bio: user.profile.bio,
      dob: user.profile.dob,
      postCount: user.profile.postCount,
      likedCount: user.profile.likedCount,
      savedCount: user.profile.savedCount,
      xUrl: user.profile.xUrl,
      fbUrl: user.profile.fbUrl,
      tiktokUrl: user.profile.tiktokUrl,
      homeUrl: user.profile.homeUrl,
      githubUrl: user.profile.githubUrl,
      youtubeUrl: user.profile.youtubeUrl,
      linkedInUrl: user.profile.linkedInUrl,
      createdAt: user.profile.createdAt,
      updatedAt: new Date(),
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "active", label: "Active" },
    { value: "banned", label: "Banned" },
    { value: "suspended", label: "Suspended" },
  ];

  const roleOptions = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
    { value: "moderator", label: "Moderator" },
  ];

  const validateForm = () => {
    try {
      updateUserSchema.parse(formData);
      setErrors({});
      setFieldErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        const newFieldErrors: Record<string, string[]> = {};

        error.issues.forEach((err: z.ZodIssue) => {
          const path = err.path.join(".");
          if (!newErrors[path]) {
            newErrors[path] = err.message;
          }
          if (!newFieldErrors[path]) {
            newFieldErrors[path] = [];
          }
          newFieldErrors[path].push(err.message);
        });

        setErrors(newErrors);
        setFieldErrors(newFieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newFieldErrors = { ...prev };
        delete newFieldErrors[field];
        return newFieldErrors;
      });
    }
  };

  const handleProfileChange = (field: string, value: string) => {
    const profileField = `profile.${field}`;
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
        updatedAt: new Date(),
      },
    }));

    // Clear errors when user starts typing
    if (errors[profileField]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[profileField];
        return newErrors;
      });
    }
    if (fieldErrors[profileField]) {
      setFieldErrors((prev) => {
        const newFieldErrors = { ...prev };
        delete newFieldErrors[profileField];
        return newFieldErrors;
      });
    }
  };

  return (
    <ComponentCard title="Edit User" desc="Update user information">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              type="text"
              id="firstName"
              defaultValue={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Enter first name"
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              type="text"
              id="lastName"
              defaultValue={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Enter last name"
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            type="email"
            id="email"
            defaultValue={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter email address"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Status</Label>
            <Select
              options={statusOptions}
              defaultValue={formData.status}
              onChange={(value) => handleInputChange("status", value)}
              placeholder="Select status"
              className="dark:bg-dark-900"
            />
          </div>

          <div>
            <Label>Role</Label>
            <Select
              options={roleOptions}
              defaultValue={formData.role}
              onChange={(value) => handleInputChange("role", value)}
              placeholder="Select role"
              className="dark:bg-dark-900"
            />
          </div>
        </div>

        {/* Profile Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Profile Information</h3>

          <div className="space-y-6">
            <div>
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                defaultValue={formData.profile.bio}
                onChange={(e) => handleProfileChange("bio", e.target.value)}
                placeholder="Enter user bio"
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div>
              <DatePicker
                id="dob"
                label="Date of Birth"
                placeholder="Select date of birth"
                onChange={(dates) => {
                  setFormData((prev) => ({
                    ...prev,
                    profile: {
                      ...prev.profile,
                      dob: dates ? dates[0] : null,
                      updatedAt: new Date(),
                    },
                  }));
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  type="url"
                  id="avatar"
                  defaultValue={formData.avatar}
                  onChange={(e) => handleInputChange("avatar", e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div>
                <Label htmlFor="cover">Cover URL</Label>
                <Input
                  type="url"
                  id="cover"
                  defaultValue={formData.cover}
                  onChange={(e) => handleInputChange("cover", e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-md font-medium mb-3">Social Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="githubUrl">GitHub</Label>
                  <Input
                    type="url"
                    id="githubUrl"
                    defaultValue={formData.profile.githubUrl}
                    onChange={(e) =>
                      handleProfileChange("githubUrl", e.target.value)
                    }
                    placeholder="https://github.com/username"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedInUrl">LinkedIn</Label>
                  <Input
                    type="url"
                    id="linkedInUrl"
                    defaultValue={formData.profile.linkedInUrl}
                    onChange={(e) =>
                      handleProfileChange("linkedInUrl", e.target.value)
                    }
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <Label htmlFor="xUrl">X (Twitter)</Label>
                  <Input
                    type="url"
                    id="xUrl"
                    defaultValue={formData.profile.xUrl}
                    onChange={(e) =>
                      handleProfileChange("xUrl", e.target.value)
                    }
                    placeholder="https://x.com/username"
                  />
                </div>

                <div>
                  <Label htmlFor="homeUrl">Website</Label>
                  <Input
                    type="url"
                    id="homeUrl"
                    defaultValue={formData.profile.homeUrl}
                    onChange={(e) =>
                      handleProfileChange("homeUrl", e.target.value)
                    }
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            {/* Statistics (Read-only) */}
            <div>
              <h4 className="text-md font-medium mb-3">Statistics</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Posts</Label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                    {formData.profile.postCount}
                  </div>
                </div>
                <div>
                  <Label>Likes</Label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                    {formData.profile.likedCount}
                  </div>
                </div>
                <div>
                  <Label>Saved</Label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                    {formData.profile.savedCount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            startIcon={<XIcon className="size-4" />}
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            startIcon={<SaveIcon className="size-4" />}
          >
            {isLoading ? "Updating..." : "Update User"}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
