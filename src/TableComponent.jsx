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
import {
	useGetFiles,
	useGetCategories,
	useGetSocietes,
} from "./service/app.service";
import baseURL from "./env";

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
	const [filteredData, setFilteredData] = useState([]);
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(5);
	// const [rowsPerPage, setRowsPerPage] = useState(5);
	const [filterCategorie, setFilterCategorie] = useState(null);
	// const [filterDate, setFilterDate] = useState("");
	// const [filterClient, setFilterClient] = useState("");
	const [filterSociete, setFilterSociete] = useState(null);
	const [searchQuery, setSearchQuery] = useState(null);
	const [query, setQuery] = useState(null);

	const [totalRows, setTotalRows] = useState(0);
	const [categorie, setCategorie] = useState("categorie");
	const [societe, setSociete] = useState("societe");

	const getFilesQuery = useGetFiles({
		categorie: filterCategorie,
		societe: filterSociete,
		page: page + 1,
		perPage: perPage,
		query: searchQuery,
	});
	const filesData = getFilesQuery?.data?.data;
	const filesQuery = getFilesQuery?.data;
	const getCategoriesQuery = useGetCategories();
	const categorieData = getCategoriesQuery?.data;
	const getSocietesQuery = useGetSocietes();
	const societeData = getSocietesQuery?.data;

	useEffect(() => {
		setTotalRows(filesQuery?.total_count);
	}, [filesQuery]);
	console.log(filesData);
	const exportExcel = async () => {
		const url = `${baseURL}/files/exportsheet?${
			filterSociete !== null ? `societe=${filterSociete}&` : ""
		}${filterCategorie !== null ? `categorie=${filterCategorie}&` : ""}${
			searchQuery !== null ? `query=${searchQuery}` : ""
		}`;
		fetch(url)
			.then((response) => response.blob())
			.then((blob) => {
				// Create a download link
				const url = window.URL.createObjectURL(new Blob([blob]));
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", "data.xlsx");
				document.body.appendChild(link);
				link.click();

				// Clean up the URL and link
				window.URL.revokeObjectURL(url);
				document.body.removeChild(link);
			})
			.catch((error) => {
				console.error("Error downloading Excel file:", error);
			});
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	console.log(page);
	const handleChangeRowsPerPage = (event) => {
		setPerPage(parseInt(event.target.value, 10));
	};

	// const [selectedCategorie, setSelectedCategorie] = useState("");

	const handleFilter = () => {
		if (categorie === "categorie") {
			setFilterCategorie(null);
		} else {
			setFilterCategorie(categorie);
		}
		if (societe === "societe") {
			setFilterSociete(null);
		} else {
			setFilterSociete(societe);
		}
		setSearchQuery(query);
		setPage(0);
	};

	// Extracting unique clients, categories, and societes from the data for the select dropdowns
	// const clientOptions = [...new Set(data.map((row) => row.name))];
	// const categorieOptions = [...new Set(data.map((row) => row.categorie))];
	// const societeOptions = [...new Set(data.map((row) => row.societe))];

	return (
		<div className="flex flex-col p-6 mt-2">
			<div className="flex justify-between mb-2">
				<div className="flex gap-5 mb-10">
					<TextField
						variant="outlined"
						size="small"
						label="Search"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<FormControl variant="outlined" size="small" className="mr-2">
						<Select
							value={categorie}
							onChange={(e) => setCategorie(e.target.value)}
							displayEmpty
							className="filter-select">
							<MenuItem key="categorie" value="categorie">
								Catégorie
							</MenuItem>
							{getCategoriesQuery?.isSuccess &&
								categorieData?.map(
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
							value={societe}
							onChange={(e) => setSociete(e.target.value)}
							displayEmpty
							className="filter-select">
							<MenuItem key="societe" value="societe">
								Societe
							</MenuItem>
							{getSocietesQuery?.isSuccess &&
								societeData?.map((societe) => (
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
							// onClick={fetchData}
						>
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
							<StyledTableCell>numéro de telephone</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{getFilesQuery?.isSuccess &&
							filesData.map((row, index) => (
								<TableRow key={index}>
									<StyledTableCells>{row.path}</StyledTableCells>
									<StyledTableCells>{row.date}</StyledTableCells>
									<StyledTableCells>{row.name}</StyledTableCells>
									<StyledTableCells>{row.adresse}</StyledTableCells>
									<StyledTableCells>{row.societe}</StyledTableCells>
									<StyledTableCells>{row.categorie}</StyledTableCells>
									<StyledTableCells>{row.phone_number}</StyledTableCells>
								</TableRow>
							))}
					</TableBody>
				</Table>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={totalRows}
					rowsPerPage={perPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</TableContainer>
		</div>
	);
};

export default TableComponent;
