import logo from "./logo_beaverrr.png";
import "./App.css";
import DirectoryPicker from "./DirectoryPicker";
import AppBarCustome from "./AppBarCustome";
import TableComponent from "./TableComponent";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

queryClient.setDefaultOptions({
	queries: {
		refetchOnWindowFocus: false,
		retry: false,
	},
	mutations: {
		onSuccess: () => {
			queryClient.invalidateQueries();
		},
	},
});

function App() {
	return (
		<div className="App">
			<QueryClientProvider client={queryClient}>
				<AppBarCustome></AppBarCustome>
				<TableComponent />
			</QueryClientProvider>
		</div>
	);
}

export default App;
