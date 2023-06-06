import * as React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { styled } from "@mui/system";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import PostAddIcon from "@mui/icons-material/PostAdd";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { TextField } from "@mui/material";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	fontWeight: "bold",
	color: "white",
	textAlign: "center",
	backgroundColor: "#1976d2",
}));
const StyledTableCells = styled(TableCell)(({ theme }) => ({
	textAlign: "center",
}));

const CircleButton = styled(Button)(({ theme }) => ({
	borderRadius: "50%",
	width: "3rem",
	height: "3rem",
	minWidth: "unset",
	padding: 0,
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	backgroundColor: "#5fa3e7",
	alignSelf: "flex-end",
	marginRight: "2rem",
	marginBottom: "2rem",
}));

const TableComponent = () => {
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [filterCategorie, setFilterCategorie] = useState("");
	// const [filterDate, setFilterDate] = useState("");
	// const [filterClient, setFilterClient] = useState("");
	const [filterSociete, setFilterSociete] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		const response = await fetch("http://127.0.0.1:5000/files");
		const json = await response.json();
		setData(json);
		setFilteredData(json);
	};
	const exportExcel = async () => {
		const workbook = XLSX.utils.book_new();
		const worksheet = XLSX.utils.json_to_sheet(filteredData);
		XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
		const excelBuffer = XLSX.write(workbook, {
			type: "array",
			bookType: "xlsx",
		});
		const dataBlob = new Blob([excelBuffer], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});
		saveAs(dataBlob, "data.xlsx");
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// const [selectedCategorie, setSelectedCategorie] = useState("");

	const handleFilter = () => {
		const filtered = data.filter((row) => {
			const matchCategorie =
				filterCategorie === "" || row.categorie === filterCategorie;
			// const matchDate = filterDate ? row.date.includes(filterDate) : true;
			// const matchClient = filterClient
			//   ? row.name.toLowerCase().includes(filterClient.toLowerCase())
			//   : true;
			const matchSociete = filterSociete ? row.societe === filterSociete : true;
			const matchSearch = searchQuery
				? Object.values(row).some((value) =>
						value.toLowerCase().includes(searchQuery.toLowerCase())
				  )
				: true;
			return (
				matchCategorie &&
				// matchDate &&
				// matchClient &&
				matchSociete &&
				matchSearch
			);
		});
		setFilteredData(filtered);
		setPage(0);
	};

	// Extracting unique clients, categories, and societes from the data for the select dropdowns
	// const clientOptions = [...new Set(data.map((row) => row.name))];
	const categorieOptions = [...new Set(data.map((row) => row.categorie))];
	const societeOptions = [...new Set(data.map((row) => row.societe))];

	return (
		<div className="flex flex-col p-6 mt-2">
			<div className="flex justify-between mb-2">
				<div className="flex gap-5 mb-10">
					<TextField
						variant="outlined"
						size="small"
						label="Search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<FormControl variant="outlined" size="small" className="mr-2">
						<Select
							value={filterCategorie}
							onChange={(e) => setFilterCategorie(e.target.value)}
							displayEmpty
							className="filter-select">
							<MenuItem value="">Catégorie</MenuItem>
							{categorieOptions.map(
								(categorie) =>
									categorie && (
										<MenuItem key={categorie} value={categorie}>
											{categorie}
										</MenuItem>
									)
							)}
						</Select>
					</FormControl>

					<FormControl variant="outlined" size="small" className="mr-2">
						<Select
							value={filterSociete}
							onChange={(e) => setFilterSociete(e.target.value)}
							displayEmpty
							className="filter-select">
							<MenuItem value="">Societe</MenuItem>
							{societeOptions.map((societe) => (
								<MenuItem key={societe} value={societe}>
									{societe}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Button variant="contained" onClick={handleFilter}>
						Filter
					</Button>
				</div>
				<div className="flex gap-8">
					<div className="flex items-center">
						<CircleButton
							title="Fetch Data"
							variant="contained"
							onClick={fetchData}>
							<CloudSyncIcon />
						</CircleButton>
					</div>
					<div className="flex items-center">
						<CircleButton
							title="Export to Excel"
							variant="contained"
							onClick={exportExcel}
							style={{ backgroundColor: "#0D7813" }}>
							<PostAddIcon />
						</CircleButton>
					</div>
				</div>
			</div>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<StyledTableCell>Chemin</StyledTableCell>
							<StyledTableCell>Date Systeme</StyledTableCell>
							<StyledTableCell>Client</StyledTableCell>
							<StyledTableCell>Adresse</StyledTableCell>
							<StyledTableCell>Société</StyledTableCell>
							<StyledTableCell>Catégorie</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredData
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row, index) => (
								<TableRow key={index}>
									<StyledTableCells>{row.path}</StyledTableCells>
									<StyledTableCells>{row.date}</StyledTableCells>
									<StyledTableCells>{row.name}</StyledTableCells>
									<StyledTableCells>{row.adresse}</StyledTableCells>
									<StyledTableCells>{row.societe}</StyledTableCells>
									<StyledTableCells>{row.categorie}</StyledTableCells>
								</TableRow>
							))}
					</TableBody>
				</Table>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={filteredData.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</TableContainer>
		</div>
	);
};

export default TableComponent;
