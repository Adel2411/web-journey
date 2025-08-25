import { useState } from "react";
import { Native } from "./components/native";
import { Axios } from "./components/axios";
import { ReactQuery } from "./components/react-query";
import { AxiosImproved } from "./components/axios-improved";

type ComponentType = "native" | "axios" | "axios-improved" | "react-query";

export default function App() {
	const [activeComponent, setActiveComponent] =
		useState<ComponentType>("native");

	const renderComponent = () => {
		switch (activeComponent) {
			case "native":
				return <Native />;
			case "axios":
				return <Axios />;
			case "axios-improved":
				return <AxiosImproved />;
			case "react-query":
				return <ReactQuery />;
			default:
				return <Native />;
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<nav className="bg-white shadow-lg h-16 flex items-center">
				<button
					onClick={() => setActiveComponent("native")}
					className={`px-4 h-full transition-colors duration-200 cursor-pointer ${
						activeComponent === "native"
							? "bg-blue-500 text-white shadow-md"
							: "text-gray-600 hover:text-blue-500 hover:bg-blue-200"
					}`}
				>
					Native Fetch
				</button>
				<button
					onClick={() => setActiveComponent("axios")}
					className={`px-4 h-full transition-colors duration-200 cursor-pointer ${
						activeComponent === "axios"
							? "bg-green-500 text-white shadow-md"
							: "text-gray-600 hover:text-green-500 hover:bg-green-200"
					}`}
				>
					Axios
				</button>
				<button
					onClick={() => setActiveComponent("axios-improved")}
					className={`px-4 h-full transition-colors duration-200 cursor-pointer ${
						activeComponent === "axios-improved"
							? "bg-red-500 text-white shadow-md"
							: "text-gray-600 hover:text-red-500 hover:bg-red-200"
					}`}
				>
					Axios Improved
				</button>
				<button
					onClick={() => setActiveComponent("react-query")}
					className={`px-4 h-full transition-colors duration-200 cursor-pointer ${
						activeComponent === "react-query"
							? "bg-purple-500 text-white shadow-md"
							: "text-gray-600 hover:text-purple-500 hover:bg-purple-200"
					}`}
				>
					React Query
				</button>
			</nav>

			<main className="container mx-auto ">{renderComponent()}</main>
		</div>
	);
}
