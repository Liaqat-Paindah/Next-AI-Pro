"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, Phone } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { z } from "zod";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

// Define schema directly in the component
const UserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

const RegisterFormSchema = UserSchema.pick({
  email: true,
  password: true,
  first_name: true,
  last_name: true,
  phone: true,
})
  .extend({
    confirmPassword: z.string().min(1, "Confirm password is required"),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof RegisterFormSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  const toggleConfirmVisibility = () =>
    setIsConfirmVisible((prevState) => !prevState);

  const formik = useFormik<RegisterFormData>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
      phone: "",
      terms: false,
    },
    validate: (values) => {
      const result = RegisterFormSchema.safeParse(values);
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const path = issue.path[0];
          if (path && typeof path === "string") {
            errors[path] = issue.message;
          }
        });
        return errors;
      }
      return {};
    },
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      setGeneralError(null);
      setIsPending(true);
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
            first_name: values.first_name,
            last_name: values.last_name,
            phone: values.phone,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Attempt to auto-login
          const signInResult = await signIn("credentials", {
            redirect: false, // handle redirect manually
            email: values.email,
            password: values.password,
          });

          if (signInResult?.ok) {
            toast.success("Account created successfully!");
            router.push("/dashboard");
          }
        } else {
          toast.error(data.message || "Registration failed");
          setIsPending(false);
          setSubmitting(false);
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error(error);
        setIsPending(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center p-4 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-4 rounded-lg border dark:border-gray-600 p-8 shadow-sm">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create an account
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sign up to get started with your account.
          </p>
        </div>

        {/* General Error Message */}
        {generalError && (
          <div
            className="rounded-md bg-destructive/15 p-3 text-sm text-destructive"
            role="alert"
          >
            {generalError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-5">
            {/* First Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="first_name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                First Name
              </Label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="John"
                  className={`h-10 w-full pl-10 pr-3 ${
                    formik.touched.first_name && formik.errors.first_name
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  required
                  disabled={isPending}
                  aria-required="true"
                  aria-invalid={
                    formik.touched.first_name && !!formik.errors.first_name
                  }
                  aria-describedby={
                    formik.touched.first_name && formik.errors.first_name
                      ? "first_name-error"
                      : undefined
                  }
                  autoComplete="given-name"
                />
              </div>
              {formik.touched.first_name && formik.errors.first_name && (
                <p
                  id="first_name-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {formik.errors.first_name}
                </p>
              )}
            </div>

            {/* Last Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="last_name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Last Name
              </Label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Doe"
                  className={`h-10 w-full pl-10 pr-3 ${
                    formik.touched.last_name && formik.errors.last_name
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  required
                  disabled={isPending}
                  aria-required="true"
                  aria-invalid={
                    formik.touched.last_name && !!formik.errors.last_name
                  }
                  aria-describedby={
                    formik.touched.last_name && formik.errors.last_name
                      ? "last_name-error"
                      : undefined
                  }
                  autoComplete="family-name"
                />
              </div>
              {formik.touched.last_name && formik.errors.last_name && (
                <p
                  id="last_name-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {formik.errors.last_name}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone Number
              </Label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="+1 (555) 000-0000"
                  className={`h-10 w-full pl-10 pr-3 ${
                    formik.touched.phone && formik.errors.phone
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  required
                  disabled={isPending}
                  aria-required="true"
                  aria-invalid={formik.touched.phone && !!formik.errors.phone}
                  aria-describedby={
                    formik.touched.phone && formik.errors.phone
                      ? "phone-error"
                      : undefined
                  }
                  autoComplete="tel"
                />
              </div>
              {formik.touched.phone && formik.errors.phone && (
                <p
                  id="phone-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {formik.errors.phone}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="name@example.com"
                  className={`h-10 w-full pl-10 pr-3 ${
                    formik.touched.email && formik.errors.email
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  required
                  disabled={isPending}
                  aria-required="true"
                  aria-invalid={formik.touched.email && !!formik.errors.email}
                  aria-describedby={
                    formik.touched.email && formik.errors.email
                      ? "email-error"
                      : undefined
                  }
                  autoComplete="email"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p
                  id="email-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  name="password"
                  type={isVisible ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="••••••••"
                  className={`h-10 w-full pl-10 pr-10 ${
                    formik.touched.password && formik.errors.password
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  required
                  disabled={isPending}
                  aria-required="true"
                  aria-invalid={
                    formik.touched.password && !!formik.errors.password
                  }
                  aria-describedby={
                    formik.touched.password && formik.errors.password
                      ? "password-error"
                      : undefined
                  }
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={isVisible ? "Hide password" : "Show password"}
                  disabled={isPending}
                  tabIndex={isPending ? -1 : 0}
                >
                  {isVisible ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p
                  id="password-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={isConfirmVisible ? "text" : "password"}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="••••••••"
                  className={`h-10 w-full pl-10 pr-10 ${
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  required
                  disabled={isPending}
                  aria-required="true"
                  aria-invalid={
                    formik.touched.confirmPassword &&
                    !!formik.errors.confirmPassword
                  }
                  aria-describedby={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? "confirmPassword-error"
                      : undefined
                  }
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={
                    isConfirmVisible ? "Hide password" : "Show password"
                  }
                  disabled={isPending}
                  tabIndex={isPending ? -1 : 0}
                >
                  {isConfirmVisible ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p
                    id="confirmPassword-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={formik.values.terms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800"
                    disabled={isPending}
                    aria-invalid={formik.touched.terms && !!formik.errors.terms}
                    aria-describedby={
                      formik.touched.terms && formik.errors.terms
                        ? "terms-error"
                        : undefined
                    }
                  />
                </div>
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      href="/terms"
                      className="text-primary hover:text-primary/80 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      tabIndex={isPending ? -1 : 0}
                    >
                      Terms and Conditions
                    </a>
                  </Label>
                  {formik.touched.terms && formik.errors.terms && (
                    <p
                      id="terms-error"
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {formik.errors.terms}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending || formik.isSubmitting}
            className="group relative h-11 w-full overflow-hidden text-base font-semibold text-white transition-all border dark:border-gray-600 dark:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="flex items-center justify-center gap-2">
              {isPending ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Sign up</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </span>
          </Button>

          {/* Sign In Link */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="font-semibold text-primary hover:text-primary/80 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              tabIndex={isPending ? -1 : 0}
            >
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
