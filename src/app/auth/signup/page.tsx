"use client";

import type React from "react";
import { useState } from "react";
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
import { Leaf, UserPlus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function SignUp() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

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
			const response = await fetch("/api/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success("Account created successfully!", {
					description: "You can now sign in with your new credentials.",
				});
				router.push("/auth/signin");
			} else {
				toast.error("Signup failed", {
					description: data.error || "Please check your input and try again.",
				});
			}
		} catch (error) {
			console.error("Signup error:", error);
			toast.error("An unexpected error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const isFormValid = formData.email && formData.password.length >= 8;

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
			{/* Mobile-friendly header */}
			<div className="flex items-center justify-between p-4 sm:p-6">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => router.back()}
					className="touch-target"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<div className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
						<Leaf className="h-4 w-4" />
					</div>
					<span className="text-lg font-semibold">Giki Zero</span>
				</div>
				<div className="w-10" />
			</div>

			{/* Main content */}
			<div className="flex-1 flex items-center justify-center p-4">
				<Card className="w-full max-w-md mx-auto">
					<CardHeader className="space-y-1 text-center pb-4">
						<div className="flex items-center justify-center mb-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white">
								<UserPlus className="h-6 w-6" />
							</div>
						</div>
						<CardTitle className="text-2xl">Create Your Account</CardTitle>
						<CardDescription>
							Join Giki Zero and start tracking your carbon footprint
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Full Name (Optional)</Label>
								<Input
									id="name"
									name="name"
									type="text"
									placeholder="Enter your full name"
									value={formData.name}
									onChange={handleChange}
									className="touch-target"
									autoComplete="name"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="Enter your email"
									value={formData.email}
									onChange={handleChange}
									required
									className="touch-target"
									autoComplete="email"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="Create a password (min 8 characters)"
									value={formData.password}
									onChange={handleChange}
									required
									minLength={8}
									className="touch-target"
									autoComplete="new-password"
								/>
							</div>
							<Button
								type="submit"
								className="w-full touch-target"
								disabled={isLoading || !isFormValid}
							>
								{isLoading ? "Creating account..." : "Sign Up"}
							</Button>
						</form>
					</CardContent>
					<CardFooter>
						<p className="text-center text-sm text-muted-foreground w-full">
							Already have an account?{" "}
							<Link
								href="/auth/signin"
								className="text-green-600 hover:underline font-medium"
							>
								Sign in
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
