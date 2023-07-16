import { useQuery } from "@tanstack/react-query";
import axiosClient from "../axiosClient";

export const useGetFiles = ({
  noExcel = false,
  categorie = null,
  societe = null,
  page = 1,
  perPage = null,
  query = null,
  startDate = null,
  endDate = null,
}) => {
  return useQuery(
		["files", page, perPage, query, categorie, societe, startDate, endDate],
		() =>
			axiosClient
				.get(
					`files?page=${page}&per_page=${perPage}&${
						query !== null ? `query=${query}&` : ""
					}${noExcel && `excel=1&`}${
						categorie !== null ? `categorie=${categorie}&` : ""
					}${societe !== null ? `societe=${societe}&` : ""}
         ${
						startDate !== null
							? ` ${`start_date=${startDate}&`}${`end_date=${endDate}`}`
							: ""
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
