import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<div>
			Landing page
			<Link href="/notes">
				<Button variant="destructive">Go to Notes</Button>
			</Link>
		</div>
	);
}
