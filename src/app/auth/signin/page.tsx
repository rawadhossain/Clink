"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, ArrowLeft, SproutIcon, UserPlus } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

type AuthTab = "signin" | "signup";

const INITIAL_SIGNIN = { email: "", password: "" };
const INITIAL_SIGNUP = { name: "", email: "", password: "" };

export default function SignInPage() {
	const [activeTab, setActiveTab] = useState<AuthTab>("signin");
	const [signInData, setSignInData] = useState(INITIAL_SIGNIN);
	const [signUpData, setSignUpData] = useState(INITIAL_SIGNUP);
	const [loadingAction, setLoadingAction] = useState<"signin" | "signup" | "google" | null>(null);

	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = useMemo(
		() => searchParams.get("callbackUrl") ?? "/notes",
		[searchParams]
	);

	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "authenticated" && session?.user) {
			router.replace(callbackUrl);
		}
	}, [status, session, router, callbackUrl]);

	const isLoading = loadingAction !== null;

	const handleGoogleSignIn = async () => {
		setLoadingAction("google");
		try {
			await signIn("google", {
				callbackUrl,
			});
		} catch (error) {
			console.error("Google sign-in error:", error);
			toast.error("Google sign-in failed. Please try again.");
		} finally {
			setLoadingAction(null);
		}
	};

	const handleSignInSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoadingAction("signin");

		try {
			const result = await signIn("credentials", {
				email: signInData.email,
				password: signInData.password,
				redirect: false,
			});

			if (result?.error) {
				toast.error("Sign-in failed", {
					description: "Invalid email or password. Please try again.",
				});
				return;
			}

			toast.success("Signed in successfully!");
			setSignInData(INITIAL_SIGNIN);
			router.push(callbackUrl);
			router.refresh();
		} catch (error) {
			console.error("Sign-in error:", error);
			toast.error("An unexpected error occurred. Please try again.");
		} finally {
			setLoadingAction(null);
		}
	};

	const handleSignUpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoadingAction("signup");

		try {
			const response = await fetch("/api/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(signUpData),
			});

			const data = await response.json();

			if (!response.ok) {
				toast.error("Signup failed", {
					description: data?.error ?? "Please verify your details and try again.",
				});
				return;
			}

			toast.success("Account created! Signing you in…");

			const loginResult = await signIn("credentials", {
				email: signUpData.email,
				password: signUpData.password,
				redirect: false,
			});

			if (loginResult?.error) {
				setActiveTab("signin");
				toast.success("Account created successfully! Please sign in.");
				return;
			}

			setSignUpData(INITIAL_SIGNUP);
			router.push(callbackUrl);
			router.refresh();
		} catch (error) {
			console.error("Signup error:", error);
			toast.error("Unable to create account. Please try again.");
		} finally {
			setLoadingAction(null);
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-950 dark:to-black">
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

			<div className="flex-1 flex items-center justify-center p-4">
				<Card className="w-full max-w-md mx-auto dark:bg-gray-800 dark:border-gray-700 dark:shadow-xl dark:shadow-green-500/20 dark:ring-1 dark:ring-green-600/50 transition-all duration-300 ease-in-out hover:dark:shadow-green-500/40 hover:dark:ring-green-500">
					<CardHeader className="space-y-1 text-center pb-4">
						<div className="flex items-center justify-center mb-4">
							<div className="flex items-center gap-2">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg text-green-600">
									<SproutIcon className="h-12 w-12" />
								</div>
								<span className="text-lg font-semibold dark:text-gray-50">Clink</span>
							</div>
						</div>
						<CardTitle className="text-2xl dark:text-gray-50">
							{activeTab === "signin" ? "Welcome Back" : "Create your account"}
						</CardTitle>
						<CardDescription className="dark:text-gray-300">
							{activeTab === "signin"
								? "Sign in to continue creating and sharing notes."
								: "Join Clink to collaborate effortlessly on your notes."}
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6">
						<Tabs
							value={activeTab}
							onValueChange={(value) => setActiveTab(value as AuthTab)}
							className="w-full space-y-6"
						>
							<TabsList className="grid grid-cols-2 gap-2 rounded-lg bg-muted/60 p-1 dark:bg-gray-700/60">
								<TabsTrigger
									value="signin"
									className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
								>
									Sign in
								</TabsTrigger>
								<TabsTrigger
									value="signup"
									className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
								>
									Create account
								</TabsTrigger>
							</TabsList>

							<TabsContent value="signin" className="space-y-5">
								<Button
									variant="outline"
									className="w-full bg-transparent touch-target dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-green-500"
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

								<form onSubmit={handleSignInSubmit} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="signin-email" className="dark:text-gray-300">
											Email
										</Label>
										<Input
											id="signin-email"
											name="email"
											type="email"
											placeholder="Enter your email"
											value={signInData.email}
											onChange={(event) =>
												setSignInData((prev) => ({
													...prev,
													email: event.target.value,
												}))
											}
											required
											className="touch-target dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-green-500"
											autoComplete="email"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="signin-password" className="dark:text-gray-300">
											Password
										</Label>
										<Input
											id="signin-password"
											name="password"
											type="password"
											placeholder="Enter your password"
											value={signInData.password}
											onChange={(event) =>
												setSignInData((prev) => ({
													...prev,
													password: event.target.value,
												}))
											}
											required
											className="touch-target dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-green-500"
											autoComplete="current-password"
										/>
									</div>
									<Button
										type="submit"
										className="w-full touch-target dark:bg-green-700 dark:text-white dark:hover:bg-green-600 dark:focus:ring-green-500"
										disabled={
											isLoading || !signInData.email || !signInData.password
										}
									>
										<Mail className="mr-2 h-4 w-4" />
										{loadingAction === "signin" ? "Signing in..." : "Sign in"}
									</Button>
								</form>
							</TabsContent>

							<TabsContent value="signup" className="space-y-5">
								<Button
									variant="outline"
									className="w-full bg-transparent touch-target dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-green-500"
									onClick={handleGoogleSignIn}
									disabled={isLoading}
								>
									<FcGoogle className="mr-2 h-4 w-4" />
									Sign up with Google
								</Button>

								<div className="relative">
									<div className="absolute inset-0 flex items-center">
										<Separator className="w-full dark:bg-gray-600" />
									</div>
									<div className="relative flex justify-center text-xs uppercase">
										<span className="bg-background px-2 text-muted-foreground dark:bg-gray-800 dark:text-gray-400">
											Or create with email
										</span>
									</div>
								</div>

								<form onSubmit={handleSignUpSubmit} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="signup-name" className="dark:text-gray-300">
											Full name
										</Label>
										<Input
											id="signup-name"
											name="name"
											type="text"
											placeholder="Enter your full name"
											value={signUpData.name}
											onChange={(event) =>
												setSignUpData((prev) => ({
													...prev,
													name: event.target.value,
												}))
											}
											className="touch-target dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-green-500"
											autoComplete="name"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="signup-email" className="dark:text-gray-300">
											Email
										</Label>
										<Input
											id="signup-email"
											name="email"
											type="email"
											placeholder="Enter your email"
											value={signUpData.email}
											onChange={(event) =>
												setSignUpData((prev) => ({
													...prev,
													email: event.target.value,
												}))
											}
											required
											className="touch-target dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-green-500"
											autoComplete="email"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="signup-password" className="dark:text-gray-300">
											Password
										</Label>
										<Input
											id="signup-password"
											name="password"
											type="password"
											placeholder="Create a password (min 8 characters)"
											value={signUpData.password}
											onChange={(event) =>
												setSignUpData((prev) => ({
													...prev,
													password: event.target.value,
												}))
											}
											required
											minLength={8}
											className="touch-target dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-green-500"
											autoComplete="new-password"
										/>
									</div>
									<Button
										type="submit"
										className="w-full touch-target dark:bg-green-700 dark:text-white dark:hover:bg-green-600 dark:focus:ring-green-500"
										disabled={
											isLoading ||
											!signUpData.email ||
											signUpData.password.length < 8
										}
									>
										<UserPlus className="mr-2 h-4 w-4" />
										{loadingAction === "signup"
											? "Creating account..."
											: "Create account"}
									</Button>
								</form>
							</TabsContent>
						</Tabs>
					</CardContent>

					<CardFooter>
						{activeTab === "signin" ? (
							<p className="text-center text-sm text-muted-foreground w-full dark:text-gray-400">
								Don&apos;t have an account?{" "}
								<button
									type="button"
									onClick={() => setActiveTab("signup")}
									className="text-green-600 hover:underline font-medium dark:text-green-400"
								>
									Create one
								</button>
							</p>
						) : (
							<p className="text-center text-sm text-muted-foreground w-full dark:text-gray-400">
								Already have an account?{" "}
								<button
									type="button"
									onClick={() => setActiveTab("signin")}
									className="text-green-600 hover:underline font-medium dark:text-green-400"
								>
									Sign in
								</button>
							</p>
						)}
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
