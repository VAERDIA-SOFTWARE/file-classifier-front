import { useQuery } from "@tanstack/react-query";
import axiosClient from "../axiosClient";

export const useGetFiles = ({
	categorie = null,
	societe = null,
	page = 1,
	perPage = null,
	query = null,
}) => {
	return useQuery(
		["files", page, perPage, query, categorie, societe],
		() =>
			axiosClient
				.get(
					`files?page=${page}&per_page=${perPage}&${
						query !== null ? `query=${query}&` : ""
					}${categorie !== null ? `categorie=${categorie}&` : ""}${
						societe !== null ? `societe=${societe}&` : ""
					}`
				)
				.then((res) => res.data),
		{}
	);
};

export const useGetCategories = () => {
	return useQuery(
		["categories"],
		() => axiosClient.get(`categories?`).then((res) => res.data),
		{}
	);
};

export const useGetSocietes = () => {
	return useQuery(
		["societes"],
		() => axiosClient.get(`societes?`).then((res) => res.data),
		{}
	);
};
