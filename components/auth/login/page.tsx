"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { z } from "zod";
import { UserSchema } from "@/schema/auth";
const LoginFormSchema = UserSchema.pick({ email: true, password: true });
type LoginFormData = z.infer<typeof LoginFormSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const formik = useFormik<LoginFormData>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const result = LoginFormSchema.safeParse(values);
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
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
          ...{ callbackUrl: "/dashboard" },
        });

        if (result?.error) {
          if (result.error === "CredentialsSignin") {
            setGeneralError("Invalid email or password. Please try again.");
          } else {
            setGeneralError(
              "An error occurred during sign in. Please try again.",
            );
          }
          setIsPending(false);
          setSubmitting(false);
        } else if (result?.ok) {
          router.push("/dashboard");
          router.refresh();
        }
      } catch (error) {
        console.error("Login error:", error);
        setGeneralError("An unexpected error occurred. Please try again.");
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
            Welcome back
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sign in to access your dashboard and settings.
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
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </Label>
                <a
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-primary hover:text-primary/80 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  tabIndex={isPending ? -1 : 0}
                >
                  Forgot password?
                </a>
              </div>
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
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none "
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
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending || formik.isSubmitting}
            className="group relative h-11 w-full overflow-hidden text-base font-semibold text-white transition-all border dark:border-gray-600 dark:bg-gray-900   disabled:cursor-not-allowed disabled:opacity-50"
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
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </span>
          </Button>

          {/* Sign Up Link */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <a
              href="/auth/register"
              className="font-semibold text-primary hover:text-primary/80 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              tabIndex={isPending ? -1 : 0}
            >
              Create an account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
