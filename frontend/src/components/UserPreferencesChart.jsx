import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";
import { getUserPreferences } from "../api/statistics.js";

const UserPreferencesChart = () => {
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
                text: "User Preferences (Groups vs Artists)",
                align: "center",
                margin: 20,
                style: {
                    fontSize: 15,
                },
            },
        },
    });

    const loadData = async () => {
        try {
            const data = await getUserPreferences();
            const preferences = data.data;

            const types = preferences.map((item) => item.performer_type);
            const percentages = preferences.map((item) => parseFloat(item.percentage));

            console.log("Types:", types);
            console.log("Percentages:", percentages);


            setChartData((prevData) => ({
                series: percentages,
                options: {
                    ...prevData.options,
                    labels: types,
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

export default UserPreferencesChart;
