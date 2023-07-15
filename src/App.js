import logo from "./logo_beaverrr.png";
import "./App.css";
import DirectoryPicker from "./DirectoryPicker";
import AppBarCustome from "./AppBarCustome";
import TableComponent from "./TableComponent";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

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
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AppBarCustome></AppBarCustome>
          <Routes>
            <Route path="/" element={<TableComponent />} />
            {/* <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} /> */}
            <Route
              path="/history"
              element={<TableComponent noExcel={true} />}
            />
            {/* <Main progress={progress} setProgress={setProgress}></Main> */}
          </Routes>

          {/* <TableComponent /> */}
        </QueryClientProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
