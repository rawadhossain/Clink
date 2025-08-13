"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { signIn, getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, ArrowLeft, SproutIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export default function SignIn() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { data: session, status } = useSession();

	// ✅ Redirect if already authenticated
	useEffect(() => {
		if (status === "authenticated" && session?.user) {
			router.push("/notes");
		}
	}, [status, session, router]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const result = await signIn("credentials", {
				email: formData.email,
				password: formData.password,
				redirect: false,
			});

			if (result?.ok) {
				const session = await getSession();
				toast.success("Signed in successfully!", {
					description: `Welcome back${
						session?.user?.name ? `, ${session.user.name}` : ""
					}!`,
				});
				router.push("/notes");
				router.refresh();
			} else {
				toast.error("Sign in failed", {
					description: "Invalid email or password. Please try again.",
				});
			}
		} catch (error) {
			console.error("Sign in error:", error);
			toast.error("An unexpected error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setIsLoading(true);
		try {
			await signIn("google", {
				callbackUrl: "/notes", // Let NextAuth handle redirect
			});
		} catch (error) {
			console.error("Google sign in error:", error);
			toast.error("Google sign in failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const isFormValid = formData.email && formData.password;

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-950 dark:to-black">
			{/* Header */}
			<div className="flex items-center justify-between p-4 sm:p-6">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => router.push("/")}
					className="touch-target"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<div className="w-10" />
			</div>

			{/* Main */}
			<div className="flex-1 flex items-center justify-center p-4">
				<Card
					className="w-full max-w-md mx-auto 
					dark:bg-gray-800 dark:border-gray-700 
					dark:shadow-xl dark:shadow-green-500/20 
					dark:ring-1 dark:ring-green-600/50 
					transition-all duration-300 ease-in-out
					hover:dark:shadow-green-500/40 hover:dark:ring-green-500"
				>
					<CardHeader className="space-y-1 text-center pb-4">
						<div className="flex items-center justify-center mb-4">
							<div className="flex items-center gap-2">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg text-green-600">
									<SproutIcon className="h-12 w-12" />
								</div>
								<span className="text-lg font-semibold dark:text-gray-50">
									Giki Zero
								</span>
							</div>
						</div>
						<CardTitle className="text-2xl dark:text-gray-50">Welcome Back</CardTitle>
						<CardDescription className="dark:text-gray-300">
							Sign in to continue tracking your carbon footprint
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Button
							variant="outline"
							className="w-full bg-transparent touch-target
								dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600
								dark:hover:bg-gray-600 dark:hover:border-green-500"
							onClick={handleGoogleSignIn}
							disabled={isLoading}
						>
							<FcGoogle className="mr-2 h-4 w-4" />
							Continue with Google
						</Button>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<Separator className="w-full dark:bg-gray-600" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground dark:bg-gray-800 dark:text-gray-400">
									Or continue with email
								</span>
							</div>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email" className="dark:text-gray-300">
									Email
								</Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="Enter your email"
									value={formData.email}
									onChange={handleChange}
									required
									className="touch-target dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-green-500"
									autoComplete="email"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="password" className="dark:text-gray-300">
									Password
								</Label>
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="Enter your password"
									value={formData.password}
									onChange={handleChange}
									required
									className="touch-target dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-green-500"
									autoComplete="current-password"
								/>
							</div>
							<Button
								type="submit"
								className="w-full touch-target dark:bg-green-700 dark:text-white dark:hover:bg-green-600 dark:focus:ring-green-500"
								disabled={isLoading || !isFormValid}
							>
								<Mail className="mr-2 h-4 w-4" />
								{isLoading ? "Signing in..." : "Sign in"}
							</Button>
						</form>
					</CardContent>
					<CardFooter>
						<p className="text-center text-sm text-muted-foreground w-full dark:text-gray-400">
							Don't have an account?{" "}
							<Link
								href="/auth/signup"
								className="text-green-600 hover:underline font-medium dark:text-green-400"
							>
								Sign up
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
