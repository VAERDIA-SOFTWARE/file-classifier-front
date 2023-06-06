import logo from "./logo.svg";
import "./App.css";
import DirectoryPicker from "./DirectoryPicker";
import AppBarCustome from "./AppBarCustome";
import TableComponent from "./TableComponent";

function App() {
  return (
    <div className="App">
      <AppBarCustome></AppBarCustome>
      <TableComponent />
    </div>
  );
}

export default App;
