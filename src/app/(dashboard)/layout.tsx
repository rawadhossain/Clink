import Navbar01Page from "@/components/navbar-01/navbar-01";
import React from "react";
type Props = {
	children: React.ReactNode;
};
const layout = ({ children }: Props) => {
	return (
		<div>
			{/* <div className="sticky top-0">
				<Navbar01Page />
			</div> */}
			{children}
		</div>
	);
};

export default layout;
