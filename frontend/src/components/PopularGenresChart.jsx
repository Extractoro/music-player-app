import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getPopularGenres } from "../api/statistics.js";
import { toast } from "react-toastify";

const PopularGenresChart = () => {
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                type: "pie",
                height: 350,
                background: "#212124",
            },
            labels: [],
            theme: {
                mode: "dark",
                monochrome: {
                    enabled: true,
                    color: "#a766ff",
                    shadeTo: "light",
                    shadeIntensity: 0.75,
                },
            },
            tooltip: {
                theme: "dark",
            },
            title: {
                text: "Most Popular Genres",
                align: "center",
                margin: 20,
                style: {
                    fontSize: 15,
                },
            },
            dataLabels: {
                enabled: true,
                style: {
                    colors: ["#fff"],
                    fontSize: "16px",
                },
            },
        },
    });

    const loadData = async () => {
        try {
            const data = await getPopularGenres();
            const genres = data.data;

            const genreNames = genres.map((item) => item.genre);
            const genreCounts = genres.map((item) => item.genre_count);

            setChartData((prevState) => ({
                ...prevState,
                series: genreCounts,
                options: {
                    ...prevState.options,
                    labels: genreNames,
                },
            }));
        } catch (err) {
            toast.error(err.message || "An error occurred during getting data.", {
                theme: "dark",
            });
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div>
            <Chart
                options={chartData.options}
                series={chartData.series}
                type="pie"
                height={350}
            />
        </div>
    );
};

export default PopularGenresChart;
